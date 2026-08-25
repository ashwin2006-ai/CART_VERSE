const INITIAL_PRODUCTS = [
  {
    id: 'mob-1',
    name: 'Samsung Galaxy S24 Ultra 5G',
    category: 'mobiles',
    price: 89999,
    originalPrice: 109999,
    discount: 18,
    rating: 4.8,
    reviewCount: 5842,
    stock: 50,
    featured: true,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'mob-2',
    name: 'Apple iPhone 15 Pro Max',
    category: 'mobiles',
    price: 134900,
    originalPrice: 159900,
    discount: 15,
    rating: 4.9,
    reviewCount: 9210,
    stock: 30,
    featured: true,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'],
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

  try {
    const { id } = req.query;

    const product = INITIAL_PRODUCTS.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
}
