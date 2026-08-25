// Mock product data embedded for Vercel serverless
const INITIAL_PRODUCTS = [
  {
    id: 'mob-1',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
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
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Galaxy S24 Ultra with titanium build, 200MP camera, and built-in S Pen.',
    features: ['200MP Camera with AI zoom', 'Built-in S Pen', 'Snapdragon 8 Gen 3', '5000mAh battery'],
    colors: [{ name: 'Titanium Gray', hex: '#71717a' }],
    sizes: ['256GB', '512GB'],
  },
  {
    id: 'mob-2',
    name: 'Apple iPhone 15 Pro Max (256GB) — Natural Titanium',
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
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A17 Pro chip with titanium design. 48MP camera system with 5x optical zoom.',
    features: ['A17 Pro Chip', '48MP Triple Camera', '5x Optical Zoom'],
  },
  {
    id: 'mob-3',
    name: 'Redmi Note 13 Pro+ 5G (12GB+256GB)',
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
  },
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort,
      page = 1,
      limit = 100,
    } = req.query;

    let results = [...INITIAL_PRODUCTS];

    // Filter by category
    if (category && category !== 'all') {
      results = results.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by price
    if (minPrice) {
      results = results.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      results = results.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by rating
    if (minRating) {
      results = results.filter((p) => p.rating >= Number(minRating));
    }

    // Filter by stock
    if (inStock === 'true') {
      results = results.filter((p) => p.stock > 0);
    }

    // Sort
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      // Default: featured first
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit) || 100));
    const skip = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(skip, skip + limitNum);

    return res.status(200).json({
      success: true,
      count: paginatedResults.length,
      total: results.length,
      page: pageNum,
      totalPages: Math.ceil(results.length / limitNum),
      data: paginatedResults,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
}
