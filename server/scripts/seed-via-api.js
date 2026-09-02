#!/usr/bin/env node

/**
 * CartVerse Database Seeding via API
 * 
 * This script populates the Supabase database using the Express API endpoints
 * instead of direct Prisma connection. This approach:
 * - Works around firewall/network issues
 * - Tests API endpoints during seeding
 * - Validates data flow end-to-end
 * 
 * Usage: node server/scripts/seed-via-api.js
 */

const API_BASE = 'http://localhost:5000/api';

// Sample data
const CATEGORIES = [
  { slug: 'mobiles', name: 'Mobiles', icon: 'Smartphone' },
  { slug: 'electronics', name: 'Electronics', icon: 'Laptop' },
  { slug: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { slug: 'footwear', name: 'Footwear', icon: 'Footprints' },
  { slug: 'beauty', name: 'Beauty', icon: 'Sparkles' },
  { slug: 'home', name: 'Home', icon: 'Home' },
  { slug: 'accessories', name: 'Accessories', icon: 'Watch' },
];

const PRODUCTS = [
  {
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
    category: 'mobiles',
    price: 89999,
    originalPrice: 109999,
    discount: 18,
    stock: 50,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    description: 'Galaxy S24 Ultra with titanium build, 200MP camera, and built-in S Pen. The most capable Galaxy ever.',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Titanium Gray', hex: '#71717a' },
      { name: 'Titanium Black', hex: '#18181b' },
    ],
    sizes: ['256GB', '512GB'],
    specs: { RAM: '12GB', Storage: '256GB', Display: '6.8" Dynamic AMOLED 2X', OS: 'Android 14' },
  },
  {
    name: 'Apple iPhone 15 Pro Max (256GB)',
    category: 'mobiles',
    price: 134900,
    originalPrice: 159900,
    discount: 15,
    stock: 30,
    featured: true,
    bestSeller: true,
    isNew: true,
    dealOfTheDay: true,
    description: 'A17 Pro chip with titanium design. 48MP camera system with 5x optical zoom.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Natural Titanium', hex: '#c4b99a' },
      { name: 'Black Titanium', hex: '#2c2c2c' },
    ],
    sizes: ['256GB', '512GB', '1TB'],
    specs: { Chip: 'A17 Pro', Display: '6.7" Super Retina XDR', Battery: 'Up to 29 hrs video' },
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    category: 'electronics',
    price: 199999,
    originalPrice: 229999,
    discount: 13,
    stock: 15,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    description: 'MacBook Pro with M3 Pro chip for professional creators and developers.',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Space Black', hex: '#1a1a1a' },
      { name: 'Silver', hex: '#c0c0c0' },
    ],
    sizes: ['512GB', '1TB'],
    specs: { RAM: '18GB', Storage: '512GB', Display: '14.2" Liquid Retina XDR' },
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'accessories',
    price: 29999,
    originalPrice: 34999,
    discount: 14,
    stock: 67,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    description: 'Premium noise-cancelling headphones with 30-hour battery life and premium sound.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Silver', hex: '#c0c0c0' },
    ],
    sizes: ['One Size'],
    specs: { Driver: '40mm', Frequency: '4Hz-40kHz', Battery: '30 hours' },
  },
  {
    name: 'Apple iPad Air (256GB)',
    category: 'electronics',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    stock: 22,
    featured: false,
    bestSeller: false,
    isNew: false,
    dealOfTheDay: false,
    description: 'iPad Air with M1 chip and stunning 10.9-inch Liquid Retina display.',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Space Gray', hex: '#505050' },
      { name: 'Silver', hex: '#c0c0c0' },
    ],
    sizes: ['256GB', '512GB'],
    specs: { Chip: 'Apple M1', RAM: '8GB', Display: '10.9" Liquid Retina' },
  },
  {
    name: 'Apple AirPods Pro (2nd generation)',
    category: 'accessories',
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    stock: 89,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    images: [
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['One Size'],
    specs: { Driver: 'Custom Audio', Battery: '6 hours', Charging: 'USB-C' },
  },
];

// Helper: API request
async function apiCall(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${json.message || response.statusText}`);
    }
    
    return json;
  } catch (error) {
    throw new Error(`${method} ${endpoint}: ${error.message}`);
  }
}

// Main seeding function
async function main() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  🌱 CartVerse Database Seeding via API            ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  try {
    // 1. Seed Categories
    console.log('📂 Seeding categories...');
    let categoryCount = 0;
    for (const cat of CATEGORIES) {
      try {
        const result = await apiCall('POST', '/categories', cat);
        console.log(`   ✓ ${cat.name}`);
        categoryCount++;
      } catch (error) {
        console.log(`   ✗ ${cat.name}: ${error.message}`);
      }
    }
    console.log(`   → ${categoryCount}/${CATEGORIES.length} categories created\n`);
    
    // 2. Seed Products
    console.log('📦 Seeding products...');
    let productCount = 0;
    for (const prod of PRODUCTS) {
      try {
        const result = await apiCall('POST', '/products', prod);
        console.log(`   ✓ ${prod.name.substring(0, 50)}...`);
        productCount++;
      } catch (error) {
        console.log(`   ✗ ${prod.name.substring(0, 50)}...: ${error.message}`);
      }
    }
    console.log(`   → ${productCount}/${PRODUCTS.length} products created\n`);
    
    // 3. Verify
    console.log('✓ Verifying seeded data...');
    const categoriesCheck = await apiCall('GET', '/categories');
    const productsCheck = await apiCall('GET', '/products');
    
    console.log(`   ✓ Categories: ${categoriesCheck.data?.length || 0} total`);
    console.log(`   ✓ Products: ${productsCheck.total || 0} total\n`);
    
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  ✅ Seeding Complete!                             ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Summary:');
    console.log(`   • Categories created: ${categoryCount}`);
    console.log(`   • Products created: ${productCount}`);
    console.log(`   • Total products in DB: ${productsCheck.total || 0}`);
    console.log('\n✨ Your CartVerse database is now populated!\n');
    
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    process.exit(1);
  }
}

// Run
main().catch(console.error);
