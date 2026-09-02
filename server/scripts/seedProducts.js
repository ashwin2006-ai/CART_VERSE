/**
 * CartVerse Product Seeder
 * Seeds the 42 products from mockData.js into MySQL via Prisma.
 * Uses INSERT IGNORE (upsert) so re-runs are safe.
 *
 * Usage:
 *   node server/scripts/seedProducts.js
 */

import prisma from '../config/prisma.js';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData.js';

async function main() {
  console.log('CartVerse Product Seeder');
  console.log('========================\n');

  // 1. Ensure categories exist
  console.log('Upserting categories...');
  const catMap = {};
  for (const cat of INITIAL_CATEGORIES) {
    if (cat.id === 'all') continue;
    const record = await prisma.category.upsert({
      where: { slug: cat.id },
      update: { name: cat.name, icon: cat.icon || 'Tag' },
      create: { slug: cat.id, name: cat.name, icon: cat.icon || 'Tag' }
    });
    catMap[cat.id] = record.id;
    console.log(`  ✓ Category: ${cat.name} (${cat.id})`);
  }

  // 2. Seed products
  console.log('\nUpserting products...');
  let inserted = 0;
  let skipped = 0;

  for (const prod of INITIAL_PRODUCTS) {
    const catId = catMap[prod.category];
    if (!catId) {
      console.warn(`  ⚠ Skipping "${prod.name}" — unknown category "${prod.category}"`);
      skipped++;
      continue;
    }

    const slug = `${prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}-${prod.id}`;

    try {
      await prisma.product.upsert({
        where: { slug },
        update: {
          name: prod.name,
          categoryId: catId,
          price: Number(prod.price) || 0,
          originalPrice: prod.originalPrice ? Number(prod.originalPrice) : null,
          discount: Number(prod.discount) || 0,
          stock: Number(prod.stock) || 0,
          rating: Number(prod.rating) || 4.5,
          reviewCount: Number(prod.reviewCount) || 0,
          featured: !!prod.featured,
          bestSeller: !!prod.bestSeller,
          isNew: prod.isNew !== undefined ? !!prod.isNew : true,
          dealOfTheDay: !!prod.dealOfTheDay,
          images: JSON.stringify(prod.images || []),
          description: prod.description || `${prod.name} — a quality product from CartVerse.`,
          features: prod.features ? JSON.stringify(prod.features) : null,
          specs: prod.specs ? JSON.stringify(prod.specs) : null,
          colors: prod.colors ? JSON.stringify(prod.colors) : null,
          sizes: prod.sizes ? JSON.stringify(prod.sizes) : null,
        },
        create: {
          id: prod.id.startsWith('prod-') || prod.id.startsWith('mob-') || prod.id.startsWith('ele-') ||
              prod.id.startsWith('fas-') || prod.id.startsWith('foo-') || prod.id.startsWith('bea-') ||
              prod.id.startsWith('hom-') || prod.id.startsWith('acc-')
            ? undefined  // let Prisma auto-generate UUID
            : undefined,
          name: prod.name,
          slug,
          categoryId: catId,
          price: Number(prod.price) || 0,
          originalPrice: prod.originalPrice ? Number(prod.originalPrice) : null,
          discount: Number(prod.discount) || 0,
          stock: Number(prod.stock) || 0,
          rating: Number(prod.rating) || 4.5,
          reviewCount: Number(prod.reviewCount) || 0,
          featured: !!prod.featured,
          bestSeller: !!prod.bestSeller,
          isNew: prod.isNew !== undefined ? !!prod.isNew : true,
          dealOfTheDay: !!prod.dealOfTheDay,
          images: JSON.stringify(prod.images || []),
          description: prod.description || `${prod.name} — a quality product from CartVerse.`,
          features: prod.features ? JSON.stringify(prod.features) : null,
          specs: prod.specs ? JSON.stringify(prod.specs) : null,
          colors: prod.colors ? JSON.stringify(prod.colors) : null,
          sizes: prod.sizes ? JSON.stringify(prod.sizes) : null,
        }
      });
      console.log(`  ✓ [${prod.category}] ${prod.name}`);
      inserted++;
    } catch (err) {
      console.warn(`  ✗ Failed: ${prod.name} — ${err.message}`);
      skipped++;
    }
  }

  // 3. Verify
  const total = await prisma.product.count();
  const catTotal = await prisma.category.count();

  console.log('\n=== Seed Summary ===');
  console.log(`Products seeded : ${inserted}`);
  console.log(`Products skipped: ${skipped}`);
  console.log(`Total in DB     : ${total}`);
  console.log(`Categories in DB: ${catTotal}`);
  console.log('\nSeed complete! ✅');
}

main()
  .catch(err => {
    console.error('\nSeed failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
