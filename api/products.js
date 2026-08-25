import { INITIAL_PRODUCTS } from '../src/data/mockData.js';

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
