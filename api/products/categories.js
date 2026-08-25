const INITIAL_CATEGORIES = [
  { id: 'all', name: 'For You', icon: 'Sparkles', count: 42 },
  { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', count: 7 },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', count: 8 },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 7 },
  { id: 'footwear', name: 'Footwear', icon: 'Footprints', count: 5 },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', count: 4 },
  { id: 'home', name: 'Home', icon: 'Home', count: 6 },
  { id: 'accessories', name: 'Accessories', icon: 'Watch', count: 5 },
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

  try {
    const categoriesWithCounts = INITIAL_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.id,
      icon: cat.icon,
      count: cat.count,
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
