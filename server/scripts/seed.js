import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USER
} from '../../src/data/mockData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CARTVERSE MySQL Database Seeding via Prisma...');

  // 1. Seed Categories
  console.log('🏷️ Seeding categories...');
  for (const cat of INITIAL_CATEGORIES) {
    if (cat.id === 'all') continue;
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: { name: cat.name, icon: cat.icon },
      create: {
        slug: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: `Curated collection for ${cat.name}`
      }
    });
  }

  // 2. Seed Admin User & Customer User
  console.log('👤 Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@2026!', salt);
  const customerPasswordHash = await bcrypt.hash('Password@123', salt);

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@cartverse.io' },
    update: { passwordHash: adminPasswordHash, role: 'ADMIN' },
    create: {
      name: 'Elena Vance (Lead Admin)',
      email: 'admin@cartverse.io',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      tier: 'Super Administrator'
    }
  });

  // Customer User
  const customer = await prisma.user.upsert({
    where: { email: INITIAL_USER.email },
    update: { passwordHash: customerPasswordHash },
    create: {
      name: INITIAL_USER.name,
      email: INITIAL_USER.email,
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: INITIAL_USER.phone,
      avatar: INITIAL_USER.avatar,
      tier: INITIAL_USER.tier,
      rewardPoints: INITIAL_USER.rewardPoints
    }
  });

  // 3. Seed Products
  console.log('📦 Seeding products catalog...');
  let productCount = 0;
  for (const prod of INITIAL_PRODUCTS) {
    const category = await prisma.category.findUnique({ where: { slug: prod.category } });
    if (!category) continue;

    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        price: prod.price,
        stock: prod.stock,
        rating: prod.rating,
        discount: prod.discount
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        categoryId: category.id,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discount: prod.discount,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        stock: prod.stock,
        featured: prod.featured || false,
        bestSeller: prod.bestSeller || false,
        isNew: prod.isNew !== undefined ? prod.isNew : true,
        dealOfTheDay: prod.dealOfTheDay || false,
        images: JSON.stringify(Array.isArray(prod.images) ? prod.images : [prod.images]),
        description: prod.description,
        features: prod.features ? JSON.stringify(prod.features) : null,
        specs: prod.specs ? JSON.stringify(prod.specs) : null,
        colors: prod.colors ? JSON.stringify(prod.colors) : null,
        sizes: prod.sizes ? JSON.stringify(prod.sizes) : null
      }
    });
    productCount++;
  }
  console.log(`✓ Seeded ${productCount} products`);

  // 4. Seed Coupons
  console.log('🎟️ Seeding discount coupons...');
  const coupons = [
    { code: 'SAVE10', discountType: 'percentage', discountValue: 10, maxDiscount: 500, description: '10% off on all orders' },
    { code: 'SAVE20', discountType: 'percentage', discountValue: 20, maxDiscount: 1000, description: '20% off on orders above ₹2000' },
    { code: 'FLAT100', discountType: 'fixed', discountValue: 100, description: '₹100 off on all orders' },
    { code: 'WELCOME', discountType: 'percentage', discountValue: 15, maxDiscount: 750, minCartValue: 1000, description: '15% welcome discount' },
    { code: 'SUMMER50', discountType: 'fixed', discountValue: 50, description: 'Summer special: ₹50 off' }
  ];

  let couponCount = 0;
  for (const coup of coupons) {
    try {
      await prisma.coupon.upsert({
        where: { code: coup.code },
        update: {},
        create: {
          code: coup.code,
          discountType: coup.discountType,
          discountValue: coup.discountValue,
          maxDiscount: coup.maxDiscount || null,
          minCartValue: coup.minCartValue || null,
          description: coup.description,
          isActive: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
        }
      });
      couponCount++;
    } catch (couponError) {
      console.warn(`⚠️ Warning: Could not seed coupon ${coup.code}. This may be expected if the database schema is not synced.`);
    }
  }
  console.log(`✓ Seeded ${couponCount}/${coupons.length} coupons`);

  console.log('✅ CARTVERSE MySQL Database Seeding Complete!');
  console.log('📊 Summary:');
  console.log(`   ✓ ${INITIAL_CATEGORIES.length - 1} categories`);
  console.log(`   ✓ 2 users (1 admin, 1 customer)`);
  console.log(`   ✓ ${productCount} products`);
  console.log(`   ✓ ${coupons.length} coupons`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
