/**
 * Server-side Seed Data for CartVerse
 * Separated from frontend to prevent import path issues in production
 * Used by seed.js to populate Supabase PostgreSQL database
 */

export const SEED_CATEGORIES = [
  { slug: 'mobiles',     name: 'Mobiles',      icon: 'Smartphone' },
  { slug: 'electronics', name: 'Electronics',  icon: 'Laptop' },
  { slug: 'fashion',     name: 'Fashion',      icon: 'Shirt' },
  { slug: 'footwear',    name: 'Footwear',     icon: 'Footprints' },
  { slug: 'beauty',      name: 'Beauty',       icon: 'Sparkles' },
  { slug: 'home',        name: 'Home',         icon: 'Home' },
  { slug: 'accessories', name: 'Accessories',  icon: 'Watch' },
];

export const SEED_PRODUCTS = [
  // ── MOBILES ──────────────────────────────────────────────────────────
  {
    id: 'prod-1',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
    slug: 'samsung-galaxy-s24-ultra',
    category: 'mobiles',
    price: 89999,
    originalPrice: 109999,
    discount: 18,
    rating: 4.8,
    reviewCount: 5842,
    stock: 50,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'Galaxy S24 Ultra with titanium build, 200MP camera, and built-in S Pen. The most capable Galaxy ever.',
    features: JSON.stringify(['200MP Camera with AI zoom', 'Built-in S Pen', 'Snapdragon 8 Gen 3', '5000mAh battery']),
    colors: JSON.stringify([
      { name: 'Titanium Gray', hex: '#71717a', inStock: true },
      { name: 'Titanium Black', hex: '#18181b', inStock: true }
    ]),
    sizes: JSON.stringify(['256GB', '512GB']),
    specs: JSON.stringify({ RAM: '12GB', Storage: '256GB', Display: '6.8" Dynamic AMOLED 2X', OS: 'Android 14' })
  },
  {
    id: 'prod-2',
    name: 'Apple iPhone 15 Pro Max (256GB) — Natural Titanium',
    slug: 'apple-iphone-15-pro-max',
    category: 'mobiles',
    price: 134900,
    originalPrice: 159900,
    discount: 15,
    rating: 4.9,
    reviewCount: 9210,
    stock: 30,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'A17 Pro chip with titanium design. 48MP camera system with 5x optical zoom. USB 3 speeds.',
    features: JSON.stringify(['A17 Pro Chip', '48MP Triple Camera', '5x Optical Zoom', 'USB-C with USB 3 speeds']),
    colors: JSON.stringify([
      { name: 'Natural Titanium', hex: '#c4b99a', inStock: true },
      { name: 'Black Titanium', hex: '#2c2c2c', inStock: true }
    ]),
    sizes: JSON.stringify(['256GB', '512GB', '1TB']),
    specs: JSON.stringify({ Chip: 'A17 Pro', Display: '6.7" Super Retina XDR', Battery: 'Up to 29 hrs video', Camera: '48MP + 12MP + 12MP' })
  },
  {
    id: 'prod-3',
    name: 'Redmi Note 13 Pro+ 5G (12GB+256GB)',
    slug: 'redmi-note-13-pro-5g',
    category: 'mobiles',
    price: 29999,
    originalPrice: 36999,
    discount: 18,
    rating: 4.5,
    reviewCount: 12440,
    stock: 120,
    featured: false,
    bestSeller: true,
    isNew: true,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    ]),
    description: '200MP OIS camera, 120W HyperCharge, 1.5K OLED display — the Note series just got pro.',
    features: JSON.stringify(['200MP OIS Camera', '120W HyperCharge', '1.5K CurvedOLED Display', 'IP68 Water Resistant']),
    colors: JSON.stringify([
      { name: 'Aurora Purple', hex: '#7c3aed', inStock: true },
      { name: 'Midnight Black', hex: '#0f172a', inStock: true }
    ]),
    sizes: JSON.stringify(['256GB']),
    specs: JSON.stringify({ RAM: '12GB', Charging: '120W', Display: '6.67" 1.5K OLED 120Hz', Camera: '200MP + 8MP + 2MP' })
  },
  {
    id: 'prod-4',
    name: 'OnePlus 12 5G (16GB RAM + 512GB)',
    slug: 'oneplus-12-5g',
    category: 'mobiles',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    rating: 4.7,
    reviewCount: 4320,
    stock: 45,
    featured: false,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'Snapdragon 8 Gen 3, 100W SUPERVOOC, Hasselblad co-tuned triple camera.',
    features: JSON.stringify(['Snapdragon 8 Gen 3', '100W SUPERVOOC Charging', 'Hasselblad Triple Camera', '5400mAh Battery']),
    colors: JSON.stringify([
      { name: 'Flowy Emerald', hex: '#059669', inStock: true },
      { name: 'Silky Black', hex: '#111827', inStock: true }
    ]),
    sizes: JSON.stringify(['512GB']),
    specs: JSON.stringify({ RAM: '16GB', Display: '6.82" LTPO AMOLED 120Hz', Battery: '5400mAh', Charging: '100W' })
  },
  {
    id: 'prod-5',
    name: 'Google Pixel 8 Pro (512GB)',
    slug: 'google-pixel-8-pro',
    category: 'mobiles',
    price: 99999,
    originalPrice: 119999,
    discount: 16,
    rating: 4.8,
    reviewCount: 3210,
    stock: 25,
    featured: true,
    bestSeller: true,
    isNew: true,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'Google Tensor G4, Magic Eraser, Best Take, and more AI-powered features.',
    features: JSON.stringify(['Google Tensor G4', 'Advanced Magic Eraser', 'Best Take', 'Gemini AI']),
    colors: JSON.stringify([
      { name: 'Porcelain', hex: '#f5f5f5', inStock: true },
      { name: 'Obsidian', hex: '#1a1a1a', inStock: true }
    ]),
    sizes: JSON.stringify(['512GB']),
    specs: JSON.stringify({ RAM: '12GB', Display: '6.7" QHD+ OLED', Battery: '5050mAh', Processor: 'Tensor G4' })
  },

  // ── ELECTRONICS ──────────────────────────────────────────────────────
  {
    id: 'prod-10',
    name: 'MacBook Air M3 (512GB SSD)',
    slug: 'macbook-air-m3',
    category: 'electronics',
    price: 134999,
    originalPrice: 154999,
    discount: 12,
    rating: 4.9,
    reviewCount: 4521,
    stock: 15,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'M3 chip, 8-core GPU, 512GB SSD. Incredible performance and all-day battery.',
    features: JSON.stringify(['M3 Chip', '8GB Unified Memory', '512GB SSD', 'Up to 18 hours battery']),
    colors: JSON.stringify([
      { name: 'Silver', hex: '#e8e8e8', inStock: true },
      { name: 'Midnight', hex: '#1a1a1a', inStock: true }
    ]),
    sizes: JSON.stringify(['13-inch']),
    specs: JSON.stringify({ Processor: 'Apple M3', RAM: '8GB', Storage: '512GB SSD', Display: '13.6" Liquid Retina' })
  },
  {
    id: 'prod-11',
    name: 'Dell XPS 15 (NVIDIA RTX 4060)',
    slug: 'dell-xps-15',
    category: 'electronics',
    price: 189999,
    originalPrice: 219999,
    discount: 13,
    rating: 4.7,
    reviewCount: 2840,
    stock: 12,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1588872657840-18f45ea69f79?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'Intel Core i7, NVIDIA RTX 4060, 4K display. Perfect for creators.',
    features: JSON.stringify(['Intel Core i7-13700H', 'NVIDIA RTX 4060', '16GB RAM', '4K OLED Display']),
    colors: JSON.stringify([
      { name: 'Platinum Silver', hex: '#c0c0c0', inStock: true }
    ]),
    sizes: JSON.stringify(['15-inch']),
    specs: JSON.stringify({ Processor: 'Intel i7-13700H', GPU: 'RTX 4060', RAM: '16GB', Storage: '512GB SSD' })
  },
  {
    id: 'prod-12',
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    category: 'electronics',
    price: 34999,
    originalPrice: 39999,
    discount: 12,
    rating: 4.8,
    reviewCount: 8945,
    stock: 80,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'Industry-leading noise cancellation, 30-hour battery, premium sound quality.',
    features: JSON.stringify(['Active Noise Cancellation', '30 Hour Battery', 'Premium Sound', 'Bluetooth 5.3']),
    colors: JSON.stringify([
      { name: 'Black', hex: '#000000', inStock: true },
      { name: 'Silver', hex: '#c0c0c0', inStock: true }
    ]),
    sizes: JSON.stringify(['One Size']),
    specs: JSON.stringify({ Driver: '40mm', Frequency: '4Hz - 40kHz', Impedance: '12 Ohm', Weight: '250g' })
  },
  {
    id: 'prod-13',
    name: 'iPad Air M2 (256GB, Wi-Fi)',
    slug: 'ipad-air-m2',
    category: 'electronics',
    price: 59999,
    originalPrice: 69999,
    discount: 14,
    rating: 4.7,
    reviewCount: 5234,
    stock: 40,
    featured: false,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1518611505867-48a1635e6eca?auto=format&fit=crop&w=800&q=80',
    ]),
    description: 'M2 chip, 256GB storage, stunning 11-inch Liquid Retina display.',
    features: JSON.stringify(['M2 Chip', '256GB Storage', '11-inch Liquid Retina', 'Touch ID']),
    colors: JSON.stringify([
      { name: 'Space Gray', hex: '#5a5a5a', inStock: true },
      { name: 'Silver', hex: '#e8e8e8', inStock: true }
    ]),
    sizes: JSON.stringify(['64GB', '256GB']),
    specs: JSON.stringify({ Processor: 'Apple M2', RAM: '8GB', Storage: '256GB', Display: '11-inch Liquid Retina' })
  },
];

export const SEED_COUPONS = [
  { code: 'SAVE10', discountType: 'percentage', discountValue: 10, maxDiscount: 500, description: '10% off on all orders', minCartValue: 0 },
  { code: 'SAVE20', discountType: 'percentage', discountValue: 20, maxDiscount: 1000, description: '20% off on orders above ₹2000', minCartValue: 2000 },
  { code: 'FLAT100', discountType: 'fixed', discountValue: 100, maxDiscount: null, description: '₹100 off on all orders', minCartValue: 500 },
  { code: 'WELCOME', discountType: 'percentage', discountValue: 15, maxDiscount: 750, description: '15% welcome discount', minCartValue: 1000 },
  { code: 'SUMMER50', discountType: 'fixed', discountValue: 50, maxDiscount: null, description: 'Summer special: ₹50 off', minCartValue: 0 },
];

export const SEED_USER = {
  name: 'Alex Mercer',
  email: 'customer@cartverse.io',
  phone: '+91-9876543210',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  tier: 'VIP Platinum',
  rewardPoints: 2500
};
