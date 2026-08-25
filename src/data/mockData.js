// Mock Catalog and Initial Seed Data for Cartverse (in INR ₹)

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Sparkles', count: 12 },
  { id: 'electronics', name: 'Audio & Tech', icon: 'Headphones', count: 3 },
  { id: 'fashion', name: 'Fashion & Apparel', icon: 'Shirt', count: 2 },
  { id: 'footwear', name: 'Footwear & Runners', icon: 'Footprints', count: 2 },
  { id: 'accessories', name: 'Luxury Accessories', icon: 'Watch', count: 3 },
  { id: 'home', name: 'Living & Espresso', icon: 'Coffee', count: 2 }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Cartverse SoundPro ANC Wireless Headphones',
    category: 'electronics',
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    rating: 4.9,
    reviewCount: 342,
    stock: 24,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    dealEndsInHours: 8,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in studio-grade acoustics with hybrid active noise cancellation, 45-hour battery life, ultra-plush memory foam earcups, and spatial audio with dynamic head tracking.',
    features: [
      'Active Noise Cancellation (ANC) with Transparency Mode',
      'Up to 45 Hours Playback with Fast USB-C Quick Charge (10m = 5hrs)',
      'Custom 40mm Beryllium Acoustic Drivers',
      'Bluetooth 5.3 with Multi-Point Device Pairing'
    ],
    colors: [
      { name: 'Midnight Black', hex: '#111827', inStock: true },
      { name: 'Platinum Silver', hex: '#e2e8f0', inStock: true },
      { name: 'Rose Gold', hex: '#fb7185', inStock: true }
    ],
    sizes: ['Standard'],
    specs: {
      'Battery Life': '45 Hours (ANC Off) / 38 Hours (ANC On)',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.3 & 3.5mm Aux',
      'Warranty': '2 Years Official Warranty'
    }
  },
  {
    id: 'prod-2',
    name: 'Chronos Titanium AMOLED Smartwatch Pro',
    category: 'accessories',
    price: 6499,
    originalPrice: 8999,
    discount: 28,
    rating: 4.8,
    reviewCount: 189,
    stock: 14,
    featured: true,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered from aerospace-grade titanium with an always-on Sapphire AMOLED display. Includes dual-frequency GPS, ECG cardiac sensor, sleep cycle analytics, and 14-day battery reserve.',
    features: [
      '1.43” Always-On Sapphire Crystal AMOLED Display',
      'ECG, SpO2 Blood Oxygen & Stress Monitoring Sensor',
      '5ATM Water Resistant (Swim proof up to 50m)',
      'Titanium Unibody with Quick-Release Strap'
    ],
    colors: [
      { name: 'Space Gray', hex: '#374151', inStock: true },
      { name: 'Titanium Silver', hex: '#94a3b8', inStock: true },
      { name: 'Champagne Gold', hex: '#d97706', inStock: false }
    ],
    sizes: ['42mm', '46mm'],
    specs: {
      'Display': '1.43-inch AMOLED 466x466 px',
      'Battery': 'Up to 14 Days on standard usage',
      'Compatibility': 'iOS & Android',
      'Water Rating': '5 ATM / 50 meters'
    }
  },
  {
    id: 'prod-3',
    name: 'Nebula Pro 4K Cinema Pocket Projector',
    category: 'electronics',
    price: 24999,
    originalPrice: 31999,
    discount: 22,
    rating: 4.7,
    reviewCount: 96,
    stock: 8,
    featured: false,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: true,
    dealEndsInHours: 5,
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Transform any room into an IMAX experience with 1200 ANSI Lumens, native 4K decoding, Dolby Audio soundbar built-in, auto keystone correction, and seamless streaming apps.',
    features: [
      '1200 ANSI Lumens with HDR10+ Cinema Decoding',
      'Instant Auto Focus & Intelligent Keystone Correction',
      'Built-in 20W Dolby Audio Quad Speakers',
      'Wi-Fi 6 & AirPlay / Chromecast Wireless Casting'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0f172a', inStock: true },
      { name: 'Frost White', hex: '#f8fafc', inStock: true }
    ],
    sizes: ['Standard'],
    specs: {
      'Resolution': '4K HDR10 Decoding',
      'Projection Size': '40” – 200” Inches',
      'Lamp Life': '30,000 Hours (LED Eco)',
      'Inputs': 'HDMI 2.1, USB-C, Optical Audio'
    }
  },
  {
    id: 'prod-4',
    name: 'Velocity Aero-X Carbon Running Sneakers',
    category: 'footwear',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.9,
    reviewCount: 420,
    stock: 35,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered for competitive runners and marathon enthusiasts. Features a full-length carbon fiber propulsion plate with responsive nitrogen-infused foam midsole for 85% energy return.',
    features: [
      'Full-Length 3K Carbon Fiber Flight Plate',
      'Nitrogen-Infused NitroFoam Max cushioning',
      'Breathable engineered micro-mesh upper',
      'All-terrain Continental rubber traction outsole'
    ],
    colors: [
      { name: 'Crimson Red', hex: '#dc2626', inStock: true },
      { name: 'Volt Neon', hex: '#84cc16', inStock: true },
      { name: 'Stealth Black', hex: '#18181b', inStock: true }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    specs: {
      'Weight': '198g (Size 9)',
      'Drop': '8mm Heel-to-Toe',
      'Arch Support': 'Neutral to Moderate',
      'Terrain': 'Road, Track & Marathon'
    }
  },
  {
    id: 'prod-5',
    name: 'Sirocco Merino Wool Minimalist Oversized Hoodie',
    category: 'fashion',
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    rating: 4.6,
    reviewCount: 154,
    stock: 22,
    featured: true,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from 100% sustainably sourced extra-fine Merino wool. Features a relaxed tailored drape, double-lined deep hood, discreet side-entry pockets, and ribbed temperature-regulating cuffs.',
    features: [
      '100% Natural Australian Extra-Fine Merino Wool (380 GSM)',
      'Natural thermoregulating, odor-resistant and anti-static',
      'Custom pre-shrunk finish for longevity',
      'Minimalist stitchless raw hem construction'
    ],
    colors: [
      { name: 'Charcoal Heather', hex: '#334155', inStock: true },
      { name: 'Desert Sand', hex: '#d6d3d1', inStock: true },
      { name: 'Sage Green', hex: '#4d7c0f', inStock: true }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: {
      'Material': '100% Merino Wool',
      'Fit': 'Contemporary Oversized',
      'Care': 'Machine wash cold delicate / dry flat',
      'Origin': 'Sustainably Crafted'
    }
  },
  {
    id: 'prod-6',
    name: 'Artisan Barista Pro Espresso Coffee Machine',
    category: 'home',
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    rating: 4.9,
    reviewCount: 278,
    stock: 11,
    featured: true,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: true,
    dealEndsInHours: 12,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cafe-quality espresso in the comfort of your kitchen. 15-Bar Italian precision pump with dual thermoblock heaters, integrated conical burr grinder, and commercial micro-foam steam wand.',
    features: [
      '15-Bar Italian High-Pressure Extractor with PID Temperature Control',
      'Integrated 30-Setting Hardened Steel Conical Burr Grinder',
      'Commercial-grade 360° Stainless Steel Micro-Foam Wand',
      'Pre-Infusion Function for Optimal Crema Extraction'
    ],
    colors: [
      { name: 'Brushed Stainless', hex: '#cbd5e1', inStock: true },
      { name: 'Matte Black', hex: '#1e293b', inStock: true }
    ],
    sizes: ['Standard'],
    specs: {
      'Water Tank': '2.0 Liters with Water Filter',
      'Pressure': '15 Bar Italian Pump',
      'Power': '1650 Watts Fast Heat-up',
      'Included': '58mm Portafilter, Tamper, Milk Jug, Cleaning Kit'
    }
  },
  {
    id: 'prod-7',
    name: 'Vanguard Cybernetic RGB Mechanical Keyboard',
    category: 'electronics',
    price: 3299,
    originalPrice: 4499,
    discount: 26,
    rating: 4.8,
    reviewCount: 312,
    stock: 19,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gasket-mounted mechanical keyboard with hot-swappable tactile switches, per-key RGB backlighting, custom CNC aluminum rotary knob, sound-dampening silicone foam, and tri-mode wireless.',
    features: [
      'Tri-Mode Connectivity: 2.4GHz Wireless, Bluetooth 5.2 & Type-C',
      'Hot-Swappable Gateron Pro Yellow pre-lubed switches',
      'Sound dampening Poron foam & polycarbonate positioning plate',
      '4000mAh battery providing up to 200 hours without RGB'
    ],
    colors: [
      { name: 'Retro Cyber', hex: '#6366f1', inStock: true },
      { name: 'Monochrome Stealth', hex: '#0f172a', inStock: true }
    ],
    sizes: ['75% Compact', '87% TKL'],
    specs: {
      'Layout': '75% (82 Keys + Rotary Dial)',
      'Keycaps': 'Double-Shot PBT Cherry Profile',
      'Polling Rate': '1000Hz (1ms ultra-low latency)',
      'Battery': '4000mAh Rechargeable'
    }
  },
  {
    id: 'prod-8',
    name: 'Atelier Handcrafted Leather Briefcase & Laptop Bag',
    category: 'accessories',
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    rating: 4.9,
    reviewCount: 145,
    stock: 7,
    featured: true,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted from vegetable-tanned full-grain leather. Houses up to a 16” laptop in a padded micro-suede sleeve with organizers for cables, notebooks, passport, and pens.',
    features: [
      '100% Certified Vegetable-Tanned Italian Full-Grain Leather',
      'Padded shock-absorbent sleeve fits up to 16” laptops',
      'YKK Excella heavy-duty antique brass zippers',
      'Detachable padded leather shoulder strap & luggage slip-through strap'
    ],
    colors: [
      { name: 'Cognac Brown', hex: '#78350f', inStock: true },
      { name: 'Midnight Navy', hex: '#1e3a8a', inStock: true },
      { name: 'Jet Black', hex: '#171717', inStock: true }
    ],
    sizes: ['14-16 Inch'],
    specs: {
      'Dimensions': '40cm x 30cm x 9cm',
      'Weight': '1.2 kg',
      'Lining': 'Water-resistant Japanese cotton twill'
    }
  },
  {
    id: 'prod-9',
    name: 'Quantum Ergonomic Mesh High-Back Office Chair',
    category: 'home',
    price: 9999,
    originalPrice: 13999,
    discount: 28,
    rating: 4.8,
    reviewCount: 204,
    stock: 15,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a8a37f7157?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered to support 12+ hours of seated focus. Features dynamic self-adjusting lumbar support, 4D multidirectional armrests, breathable high-elastic mesh, and 135° sync-tilt recline.',
    features: [
      'Self-adaptive lumbar support adapts to spine curvature in real time',
      '4D multidirectional armrests (Height, Angle, Depth & Width)',
      'Heavy-duty class 4 SGS certified explosion-proof gas lift',
      'Whisper-quiet PU smooth glide rollerblade casters'
    ],
    colors: [
      { name: 'Space Ash Gray', hex: '#475569', inStock: true },
      { name: 'Stealth Black', hex: '#0f172a', inStock: true }
    ],
    sizes: ['Standard Ergonomic'],
    specs: {
      'Weight Capacity': '150 kg',
      'Recline Range': '90° – 135° Multi-Lock',
      'Seat Height': '18” – 22” Adjustable',
      'Warranty': '3 Years Frame Warranty'
    }
  },
  {
    id: 'prod-10',
    name: 'Zenith 100% Pure Organic Linen Resort Shirt',
    category: 'fashion',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.7,
    reviewCount: 112,
    stock: 28,
    featured: false,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure French flax linen washed for supreme softness. Features a camp collar, breathable airy weave, natural mother-of-pearl buttons, and a relaxed breezy silhouette.',
    features: [
      '100% Certified French Flax Organic Linen',
      'Enzyme-washed for effortless softness from day one',
      'Classic Cuban camp collar with chest utility pocket',
      'Pre-shrunk and machine washable'
    ],
    colors: [
      { name: 'Crisp White', hex: '#ffffff', inStock: true },
      { name: 'Sky Azure', hex: '#38bdf8', inStock: true },
      { name: 'Olive Green', hex: '#65a30d', inStock: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': '100% Pure Flax Linen',
      'Fit': 'Relaxed Modern',
      'Care': 'Gentle machine wash cold'
    }
  },
  {
    id: 'prod-11',
    name: 'Solaris Smart Fitness & Health Tracker Ring',
    category: 'accessories',
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.8,
    reviewCount: 98,
    stock: 20,
    featured: true,
    bestSeller: false,
    isNew: true,
    dealOfTheDay: true,
    dealEndsInHours: 18,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Discreet 24/7 biometric tracking in a featherlight titanium ring. Tracks sleep stages, readiness scores, heart rate variability (HRV), and body temperature trends.',
    features: [
      'Featherlight Grade 5 Titanium exterior (weighs under 4 grams)',
      'Continuous Optical Heart Rate, HRV, SpO2 & Skin Temperature',
      'Up to 7 Days Battery Life on a 45-minute charge',
      '100M Water Resistant for swimming, sauna, and diving'
    ],
    colors: [
      { name: 'Matte Black', hex: '#18181b', inStock: true },
      { name: 'Polished Silver', hex: '#e2e8f0', inStock: true },
      { name: 'Rose Gold', hex: '#fda4af', inStock: true }
    ],
    sizes: ['Size 7', 'Size 8', 'Size 9', 'Size 10', 'Size 11'],
    specs: {
      'Weight': '3.2 grams',
      'Water Resistance': '100 Meters (10 ATM)',
      'Battery': '7 Days continuous',
      'App Subscription': '₹0 Forever Free'
    }
  },
  {
    id: 'prod-12',
    name: 'TerraGrip Waterproof All-Terrain Hiking Boots',
    category: 'footwear',
    price: 4199,
    originalPrice: 5499,
    discount: 23,
    rating: 4.9,
    reviewCount: 230,
    stock: 17,
    featured: false,
    bestSeller: true,
    isNew: false,
    dealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Built for high-altitude rugged trails and wet terrains. Features a breathable waterproof membrane, Vibram Megagrip lugged outsole, and TPU protective toe cap.',
    features: [
      '100% GORE-TEX Waterproof & Breathable Bootie Lining',
      'Vibram Megagrip Compound with 5mm Multidirectional Lugs',
      'Reinforced TPU rubber toe bumper & reinforced ankle support',
      'Ortholite dual-density anti-microbial footbed'
    ],
    colors: [
      { name: 'Earth Brown', hex: '#713f12', inStock: true },
      { name: 'Slate Gray', hex: '#475569', inStock: true }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    specs: {
      'Weight': '460g per boot',
      'Upper': 'Full-Grain Nubuck Leather & Ballistic Nylon',
      'Outsole': 'Vibram Megagrip'
    }
  }
];

export const INITIAL_REVIEWS = {
  'prod-1': [
    {
      id: 'rev-1',
      userName: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '12 Aug 2026',
      verified: true,
      comment: 'The active noise cancellation is unmatched. Deep bass and crystal-clear vocals. Truly studio grade!'
    },
    {
      id: 'rev-2',
      userName: 'Pooja Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '18 Aug 2026',
      verified: true,
      comment: 'Battery lasted almost an entire week of work calls and travel. Super fast delivery.'
    }
  ],
  'prod-4': [
    {
      id: 'rev-3',
      userName: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '20 Aug 2026',
      verified: true,
      comment: 'Shaved 45 seconds off my 10k time! Carbon propulsion plate gives amazing bounce.'
    }
  ]
};

export const INITIAL_COUPONS = [
  { code: 'WELCOME10', type: 'percent', discount: 10, minSpend: 0, description: '10% off your entire first purchase', active: true },
  { code: 'SAVE20', type: 'percent', discount: 20, minSpend: 2999, description: '20% off on orders above ₹2,999', active: true },
  { code: 'FREESHIP', type: 'shipping', discount: 100, minSpend: 999, description: 'Free Express Delivery on orders over ₹999', active: true },
  { code: 'FLAT500', type: 'fixed', discount: 500, minSpend: 3999, description: '₹500 instant deduction on orders above ₹3,999', active: true }
];

// Initial user with 0 reward points and clean start
export const INITIAL_USER = {
  name: 'Alex Mercer',
  email: 'alex.mercer@cartverse.io',
  phone: '+91 98765 43210',
  tier: 'Standard Member',
  rewardPoints: 0, // 0 reward points for fresh start
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home Address',
      fullName: 'Alex Mercer',
      phone: '+91 98765 43210',
      street: 'Flat 402, Lotus Grand Residences, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Work / Office',
      fullName: 'Alex Mercer',
      phone: '+91 98765 43210',
      street: 'Tower B, Tech Park Silicon Valley, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      country: 'India',
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS = [];

export const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Welcome to Cartverse 🎉', message: 'Browse curated collections with instant delivery across India.', time: 'Just now', unread: true },
  { id: 'notif-2', title: 'Special Coupon Available 🏷️', message: 'Use code SAVE20 for 20% off your orders above ₹2,999!', time: '1 hr ago', unread: true }
];
