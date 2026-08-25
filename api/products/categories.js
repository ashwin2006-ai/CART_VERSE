import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../../src/data/mockData.js';

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
    // Map initial categories with product counts
    const categoriesWithCounts = INITIAL_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.id,
      icon: cat.icon,
      count: cat.count || INITIAL_PRODUCTS.filter((p) => p.category === cat.id).length,
    }));

    return res.status(200).json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
}
