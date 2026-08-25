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
        categoryId: category.id,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discount: prod.discount,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        stock: prod.stock,
        featured: prod.featured || false,
        bestSeller: prod.bestSeller || false,
        isNew: prod.isNew || false,
        dealOfTheDay: prod.dealOfTheDay || false,
        images: prod.images,
        description: prod.description,
        features: prod.features || [],
        specs: prod.specs || {},
        colors: prod.colors || [],
        sizes: prod.sizes || []
      }
    });
  }

  // 4. Seed Coupons
  console.log('🎟️ Seeding discount coupons...');
  for (const coup of INITIAL_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: { discount: coup.discount, minSpend: coup.minSpend },
      create: {
        code: coup.code,
        type: coup.type === 'percent' ? 'PERCENT' : coup.type === 'fixed' ? 'FIXED' : 'SHIPPING',
        discount: coup.discount,
        minSpend: coup.minSpend,
        description: coup.description,
        active: coup.active
      }
    });
  }

  console.log('✅ CARTVERSE MySQL Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
