import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../../src/data/mockData.js';

let productsDb = [...INITIAL_PRODUCTS];
let categoriesDb = [...INITIAL_CATEGORIES];

export const getProducts = async (req, res) => {
  try {
    let results = [...productsDb];
    const { category, search, minPrice, maxPrice, minRating, inStock, sort } = req.query;

    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (minPrice) results = results.filter(p => p.price >= Number(minPrice));
    if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
    if (minRating) results = results.filter(p => p.rating >= Number(minRating));
    if (inStock === 'true') results = results.filter(p => p.stock > 0);

    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = productsDb.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin CRUD
export const createProduct = async (req, res) => {
  try {
    const newProd = {
      id: 'prod-' + Date.now(),
      ...req.body,
      rating: 5.0,
      reviewCount: 0
    };
    productsDb.unshift(newProd);
    return res.status(201).json({ success: true, data: newProd });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const idx = productsDb.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    productsDb[idx] = { ...productsDb[idx], ...req.body };
    return res.json({ success: true, data: productsDb[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    productsDb = productsDb.filter(p => p.id !== req.params.id);
    return res.json({ success: true, message: 'Product deleted from catalog.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const prod = productsDb.find(p => p.id === req.params.id);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    prod.stock = Math.max(0, Number(stock));
    return res.json({ success: true, message: 'Stock updated', data: prod });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
