/**
 * CartVerse Large Dataset Importer
 * 
 * Imports the cartverse_large_db CSV files into the MySQL e_commerce database.
 * Maps integer IDs from the CSV to UUID strings used by the Prisma schema.
 * 
 * Tables imported (in dependency order):
 *   categories -> products -> users -> reviews
 *   orders -> order_items
 *   cart_items -> wishlist_items -> coupons
 * 
 * Usage:
 *   node server/scripts/importLargeDb.js
 *   node server/scripts/importLargeDb.js --dry-run   (count rows only)
 *   node server/scripts/importLargeDb.js --table=products
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import mysql2 from 'mysql2/promise';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Config -------------------------------------------------------------------

const DB_DIR  = 'C:\\Users\\Ashwin\\Downloads\\cartverse_large_db';
const MYSQL   = {
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: 'Ashunila',
  database: 'e_commerce',
  multipleStatements: true,
};

const BATCH_SIZE = 500;   // rows per INSERT batch
const DRY_RUN    = process.argv.includes('--dry-run');
const ONLY_TABLE = (process.argv.find(a => a.startsWith('--table=')) || '').replace('--table=', '') || null;

// --- Helpers -----------------------------------------------------------------

/** Deterministic UUID from namespace + string value */
const UUID_NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
function makeUUID(table, id) {
  const data = `${table}:${id}`;
  return crypto.createHash('sha256').update(UUID_NS + data).digest('hex')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, '$1-$2-$3-$4-$5');
}

/** Stream-read a CSV file and call cb(rowArray) for each batch */
async function streamCSV(file, cb) {
  const fullPath = path.join(DB_DIR, file);
  if (!fs.existsSync(fullPath)) { console.warn(`  WARNING  File not found: ${fullPath}`); return 0; }
  const rl = readline.createInterface({ input: fs.createReadStream(fullPath), crlfDelay: Infinity });
  let count = 0;
  let batch = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    const row = parseCSVLine(line);
    batch.push(row);
    count++;
    if (batch.length >= BATCH_SIZE) {
      await cb(batch);
      batch = [];
    }
  }
  if (batch.length > 0) await cb(batch);
  return count;
}

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function now() { return new Date().toISOString().replace('T', ' ').slice(0, 23); }

async function batchInsert(conn, table, columns, rows) {
  if (DRY_RUN || rows.length === 0) return;
  const placeholders = rows.map(() => `(${columns.map(() => '?').join(',')})`).join(',');
  const values = rows.flat();
  await conn.execute(
    `INSERT IGNORE INTO \`${table}\` (${columns.map(c => `\`${c}\``).join(',')}) VALUES ${placeholders}`,
    values
  );
}

// --- Importers ---------------------------------------------------------------

async function importCategories(conn) {
  console.log('\nImporting categories...');
  const idMap = {};
  const total = await streamCSV('categories.csv', async (batch) => {
    const rows = batch.map(([id, name, slug]) => {
      const uuid = makeUUID('cat', id);
      idMap[id] = uuid;
      return [uuid, slug, name, 'Tag', null, now()];
    });
    await batchInsert(conn, 'categories', ['id', 'slug', 'name', 'icon', 'description', 'createdAt'], rows);
  });
  console.log(`   OK ${total} categories`);
  return idMap;
}

async function importUsers(conn) {
  console.log('\nCollecting user IDs from all CSVs (no users.csv)...');
  // Gather all referenced user IDs from orders, reviews, cart_items, wishlist_items
  const userIds = new Set();
  const filesToScan = [
    { file: 'orders.csv',        col: 1 },
    { file: 'reviews.csv',       col: 1 },
    { file: 'cart_items.csv',    col: 1 },
    { file: 'wishlist_items.csv', col: 1 },
  ];
  for (const { file, col } of filesToScan) {
    await streamCSV(file, async (batch) => {
      for (const row of batch) if (row[col]) userIds.add(row[col]);
    });
  }
  console.log(`   Found ${userIds.size} unique user IDs - generating placeholder users...`);
  const idMap = {};
  const allIds = Array.from(userIds);
  // Insert in batches
  for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
    const slice = allIds.slice(i, i + BATCH_SIZE);
    const rows = slice.map((id) => {
      const uuid = makeUUID('usr', id);
      idMap[id] = uuid;
      return [
        uuid,
        `CartVerse User ${id}`,
        `user${id}@cartverse.local`,
        '$2b$10$placeholderHashForImportedUser123456789012',
        'CUSTOMER',
        null, null,
        'Silver',
        0,
        now(), now(),
      ];
    });
    await batchInsert(conn, 'users',
      ['id', 'name', 'email', 'passwordHash', 'role', 'phone', 'avatar', 'tier', 'rewardPoints', 'createdAt', 'updatedAt'],
      rows
    );
  }
  console.log(`   OK ${allIds.length} users inserted`);
  return idMap;
}

async function importProducts(conn, catMap) {
  console.log('\nImporting products...');
  const idMap = {};
  const fallbackCat = catMap[Object.keys(catMap)[0]];
  const total = await streamCSV('products.csv', async (batch) => {
    // CSV: id, name, category_id, brand_id, price, discount_percent, stock
    const rows = batch.map(([id, name, category_id, brand_id, price, discount_percent, stock]) => {
      const uuid    = makeUUID('prd', id);
      const catUUID = catMap[category_id] || fallbackCat;
      idMap[id] = uuid;
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}-${id}`;
      const discPct  = parseInt(discount_percent) || 0;
      const priceVal = parseFloat(price) || 0;
      const origPrice = priceVal > 0 ? (priceVal / (1 - discPct / 100)).toFixed(2) : priceVal;
      return [
        uuid, name, slug, catUUID,
        priceVal, origPrice, discPct,
        (4.0 + Math.random()).toFixed(1),
        0,
        parseInt(stock) || 0,
        0, 0, 1, 0,
        JSON.stringify([]),
        `${name} - a quality product.`,
        null, null, null, null,
        now(), now(),
      ];
    });
    await batchInsert(conn, 'products', [
      'id','name','slug','categoryId','price','originalPrice','discount',
      'rating','reviewCount','stock','featured','bestSeller','isNew','dealOfTheDay',
      'images','description','features','specs','colors','sizes','createdAt','updatedAt'
    ], rows);
  });
  console.log(`   OK ${total} products`);
  return idMap;
}

async function importProductImages(conn, prdMap) {
  console.log('\nImporting product images...');
  const imageMap = {};
  const total = await streamCSV('product_images.csv', async (batch) => {
    for (const [id, product_id, image_url] of batch) {
      if (!imageMap[product_id]) imageMap[product_id] = [];
      if (imageMap[product_id].length < 4) imageMap[product_id].push(image_url);
    }
  });
  if (!DRY_RUN) {
    let updated = 0;
    const entries = Object.entries(imageMap);
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const slice = entries.slice(i, i + BATCH_SIZE);
      await Promise.all(slice.map(([csvId, urls]) => {
        const uuid = prdMap[csvId];
        if (!uuid) return;
        updated++;
        return conn.execute('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(urls), uuid]);
      }));
    }
    console.log(`   OK updated images for ${updated} products (${total} image rows)`);
  } else {
    console.log(`   dry-run: ${total} image rows`);
  }
}

async function importReviews(conn, prdMap, usrMap) {
  console.log('\nImporting reviews...');
  const total = await streamCSV('reviews.csv', async (batch) => {
    // CSV: id, user_id, product_id, rating, review_text
    const rows = batch.map(([id, user_id, product_id, rating, review_text]) => {
      const prdUUID = prdMap[product_id];
      const usrUUID = usrMap[user_id] || null;
      if (!prdUUID) return null;
      return [
        makeUUID('rev', id),
        prdUUID,
        usrUUID,
        `User_${user_id}`,
        null,
        Math.min(5, Math.max(1, parseInt(rating) || 4)),
        review_text || 'Great product!',
        1,
        null,
        now(),
      ];
    }).filter(Boolean);
    await batchInsert(conn, 'reviews',
      ['id','productId','userId','userName','avatar','rating','comment','verified','adminReply','createdAt'],
      rows
    );
  });
  console.log(`   OK ${total} reviews`);
}

async function importOrders(conn, usrMap) {
  console.log('\nImporting orders...');
  const idMap = {};
  const STATUSES = ['PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];
  const total = await streamCSV('orders.csv', async (batch) => {
    // CSV: id, user_id, total_amount, status
    const rows = batch.map(([id, user_id, total_amount, status]) => {
      const usrUUID = usrMap[user_id];
      if (!usrUUID) return null;
      const uuid    = makeUUID('ord', id);
      idMap[id] = uuid;
      const dbStatus = STATUSES.includes(status?.toUpperCase()) ? status.toUpperCase() : 'CONFIRMED';
      const total    = parseFloat(total_amount) || 0;
      const subtotal = (total * 0.9).toFixed(2);
      const tax      = (total * 0.05).toFixed(2);
      const shipping = (total * 0.05).toFixed(2);
      const orderNum = `CV${String(id).padStart(8, '0')}`;
      return [
        uuid, orderNum, usrUUID, dbStatus, 2,
        null, `TRK${String(id).padStart(10, '0')}`, 'CartVerse Logistics',
        subtotal, 0, shipping, tax, total,
        'UPI', 'Paid',
        JSON.stringify({ street: '123 Main St', city: 'Mumbai', state: 'MH', pincode: '400001', country: 'India' }),
        JSON.stringify([{ status: dbStatus, date: now(), description: 'Status updated' }]),
        0, null, null,
        now(), now(),
      ];
    }).filter(Boolean);
    await batchInsert(conn, 'orders', [
      'id','orderNumber','userId','status','statusStep',
      'estimatedDelivery','trackingNumber','carrier',
      'subtotal','discount','shippingFee','tax','total',
      'paymentMethod','paymentStatus',
      'shippingAddress','timeline',
      'returnRequested','returnReason','returnStatus',
      'createdAt','updatedAt'
    ], rows);
  });
  console.log(`   OK ${total} orders`);
  return idMap;
}

async function importOrderItems(conn, ordMap, prdMap) {
  console.log('\nImporting order items...');
  const total = await streamCSV('order_items.csv', async (batch) => {
    // CSV: id, order_id, product_id, quantity, unit_price
    const rows = batch.map(([id, order_id, product_id, quantity, unit_price]) => {
      const ordUUID = ordMap[order_id];
      const prdUUID = prdMap[product_id];
      if (!ordUUID || !prdUUID) return null;
      return [
        makeUUID('oi', id),
        ordUUID,
        prdUUID,
        `Product ${product_id}`,
        parseFloat(unit_price) || 0,
        parseInt(quantity) || 1,
        null, null, null,
      ];
    }).filter(Boolean);
    await batchInsert(conn, 'order_items',
      ['id','orderId','productId','name','price','quantity','color','size','image'],
      rows
    );
  });
  console.log(`   OK ${total} order items`);
}

async function importWishlistItems(conn, usrMap, prdMap) {
  console.log('\nImporting wishlist items...');
  const seen = new Set();
  const total = await streamCSV('wishlist_items.csv', async (batch) => {
    // CSV: id, user_id, product_id
    const rows = batch.map(([id, user_id, product_id]) => {
      const usrUUID = usrMap[user_id];
      const prdUUID = prdMap[product_id];
      if (!usrUUID || !prdUUID) return null;
      const key = `${usrUUID}:${prdUUID}`;
      if (seen.has(key)) return null;
      seen.add(key);
      return [makeUUID('wl', id), usrUUID, prdUUID, now()];
    }).filter(Boolean);
    await batchInsert(conn, 'wishlist_items',
      ['id','userId','productId','createdAt'],
      rows
    );
  });
  console.log(`   OK ${total} wishlist items`);
}

async function importCartItems(conn, usrMap, prdMap) {
  console.log('\nImporting cart items...');
  const seen = new Set();
  const total = await streamCSV('cart_items.csv', async (batch) => {
    // CSV: id, user_id, product_id, quantity
    const rows = batch.map(([id, user_id, product_id, quantity]) => {
      const usrUUID = usrMap[user_id];
      const prdUUID = prdMap[product_id];
      if (!usrUUID || !prdUUID) return null;
      const key = `${usrUUID}:${prdUUID}:null:null`;
      if (seen.has(key)) return null;
      seen.add(key);
      return [makeUUID('ci', id), usrUUID, prdUUID, parseInt(quantity) || 1, null, null, now()];
    }).filter(Boolean);
    await batchInsert(conn, 'cart_items',
      ['id','userId','productId','quantity','color','size','createdAt'],
      rows
    );
  });
  console.log(`   OK ${total} cart items`);
}

async function importCoupons(conn) {
  console.log('\nImporting coupons...');
  const TYPE_MAP = { PERCENT: 'PERCENT', FIXED: 'FIXED', SHIPPING: 'SHIPPING' };
  const total = await streamCSV('coupons.csv', async (batch) => {
    // CSV: id, code, discount_value, discount_type
    const rows = batch.map(([id, code, discount_value, discount_type]) => {
      const type = TYPE_MAP[discount_type?.toUpperCase()] || 'PERCENT';
      return [
        makeUUID('cpn', id),
        code,
        type,
        parseFloat(discount_value) || 10,
        0,
        `${discount_value}${type === 'PERCENT' ? '%' : 'Rs'} off on your order`,
        1,
        null,
        now(),
      ];
    });
    await batchInsert(conn, 'coupons',
      ['id','code','type','discount','minSpend','description','active','expiresAt','createdAt'],
      rows
    );
  });
  console.log(`   OK ${total} coupons`);
}

async function updateReviewCounts(conn) {
  if (DRY_RUN) return;
  console.log('\nUpdating product review counts and ratings...');
  await conn.execute(`
    UPDATE products p
    JOIN (
      SELECT productId, COUNT(*) as cnt, AVG(rating) as avg_rating
      FROM reviews GROUP BY productId
    ) r ON r.productId = p.id
    SET p.reviewCount = r.cnt,
        p.rating      = ROUND(r.avg_rating, 1)
  `);
  console.log('   OK done');
}

// --- Main --------------------------------------------------------------------

async function main() {
  console.log('CartVerse Large DB -> MySQL Importer');
  console.log('=====================================');
  if (DRY_RUN) console.log('DRY RUN - no data will be written\n');

  const conn = await mysql2.createConnection(MYSQL);
  console.log('Connected to MySQL e_commerce');

  if (!DRY_RUN) {
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await conn.execute('SET SESSION sql_mode = ""');
    await conn.execute('SET unique_checks = 0');
  }

  const t0 = Date.now();

  try {
    let catMap, usrMap, prdMap, ordMap;
    const skip = (name) => ONLY_TABLE && ONLY_TABLE !== name;

    catMap = skip('categories') ? {} : await importCategories(conn);
    usrMap = skip('users')      ? {} : await importUsers(conn);
    prdMap = skip('products')   ? {} : await importProducts(conn, catMap);

    if (!skip('product_images')) await importProductImages(conn, prdMap);
    if (!skip('reviews'))        await importReviews(conn, prdMap, usrMap);

    ordMap = skip('orders')     ? {} : await importOrders(conn, usrMap);
    if (!skip('order_items'))    await importOrderItems(conn, ordMap, prdMap);
    if (!skip('wishlist_items')) await importWishlistItems(conn, usrMap, prdMap);
    if (!skip('cart_items'))     await importCartItems(conn, usrMap, prdMap);
    if (!skip('coupons'))        await importCoupons(conn);

    await updateReviewCounts(conn);

  } finally {
    if (!DRY_RUN) {
      await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
      await conn.execute('SET unique_checks = 1');
    }
    await conn.end();
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nImport complete in ${elapsed}s`);
}

main().catch(err => { console.error('\nImport failed:', err.message); process.exit(1); });
