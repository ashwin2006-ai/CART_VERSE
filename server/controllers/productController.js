import prisma from '../config/prisma.js';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../../src/data/mockData.js';

// In-memory fallback if DB is unreachable
let productsDb = [...INITIAL_PRODUCTS];
let categoriesDb = [...INITIAL_CATEGORIES];

// Helper: map Prisma product to frontend shape
const mapProduct = (p) => {
  let images = [];
  try { images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'); } catch {}

  let category = 'general';
  if (p.category) category = p.category.slug || p.category.name?.toLowerCase() || 'general';

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category,
    categoryName: p.category?.name,
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discount: p.discount || 0,
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 0,
    stock: p.stock || 0,
    featured: p.featured || false,
    bestSeller: p.bestSeller || false,
    isNew: p.isNew !== undefined ? p.isNew : true,
    dealOfTheDay: p.dealOfTheDay || false,
    images: images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: p.description || '',
    colors: p.colors ? (Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors || '[]')) : [],
    sizes: p.sizes ? (Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]')) : [],
    specs: p.specs ? (typeof p.specs === 'object' ? p.specs : JSON.parse(p.specs || '{}')) : {},
    features: p.features ? (Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')) : [],
  };
};

export const getProducts = async (req, res) => {
  try {
    const {
      category, search, minPrice, maxPrice,
      minRating, inStock, sort,
      page = 1, limit = 100
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(500, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma where clause
    const where = {};

    if (category && category !== 'all') {
      where.category = {
        OR: [
          { slug: { equals: category } },
          { name: { contains: category } }
        ]
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } }
      ];
    }

    if (minPrice) where.price = { ...where.price, gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
    if (minRating) where.rating = { gte: Number(minRating) };
    if (inStock === 'true') where.stock = { gt: 0 };

    // Build orderBy
    let orderBy = { featured: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [results, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: { category: { select: { name: true, slug: true } } }
      }),
      prisma.product.count({ where })
    ]);

    return res.json({
      success: true,
      count: results.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: results.map(mapProduct)
    });
  } catch (error) {
    console.warn('MySQL unavailable, using mock data:', error.message);
    // Fallback to in-memory
    let results = [...productsDb];
    const { category, search, minPrice, maxPrice, minRating, inStock, sort } = req.query;
    if (category && category !== 'all') results = results.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    if (search) { const q = search.toLowerCase(); results = results.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)); }
    if (minPrice) results = results.filter(p => p.price >= Number(minPrice));
    if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
    if (minRating) results = results.filter(p => p.rating >= Number(minRating));
    if (inStock === 'true') results = results.filter(p => p.stock > 0);
    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const paginatedResults = results.slice(skip, skip + limit);
    return res.json({ success: true, count: paginatedResults.length, total: results.length, page, totalPages: Math.ceil(results.length / limit), data: paginatedResults });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { name: true, slug: true } }, reviews: { take: 10, orderBy: { createdAt: 'desc' } } }
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    return res.json({ success: true, data: mapProduct(product) });
  } catch (error) {
    const product = productsDb.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    return res.json({ success: true, data: product });
  }
};

/**
 * Search products by query
 * GET /api/products/search?q=laptop&page=1&limit=24
 */
export const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 24 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(500, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [results, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { name: { contains: q } } }
          ]
        },
        include: { category: { select: { name: true, slug: true } } },
        skip,
        take: limitNum,
        orderBy: { featured: 'desc' }
      }),
      prisma.product.count({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { name: { contains: q } } }
          ]
        }
      })
    ]);

    return res.json({
      success: true,
      query: q,
      count: results.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: results.map(mapProduct)
    });
  } catch (error) {
    console.warn('Search failed, using mock data:', error.message);
    const q = (req.query.q || '').toLowerCase();
    let results = productsDb.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const skip = (page - 1) * limit;
    const paginatedResults = results.slice(skip, skip + limit);
    return res.json({
      success: true,
      query: q,
      count: paginatedResults.length,
      total: results.length,
      page,
      totalPages: Math.ceil(results.length / limit),
      data: paginatedResults
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    return res.json({
      success: true,
      data: cats.map(c => ({
        id: c.slug,
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'Tag',
        count: c._count.products
      }))
    });
  } catch (error) {
    console.warn('MySQL unavailable, using mock categories:', error.message);
    return res.json({ success: true, data: categoriesDb });
  }
};

// ─── Admin CRUD (Prisma-backed with in-memory fallback) ─────────────────────

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, discount, stock, description, images, featured, bestSeller, isNew, dealOfTheDay, colors, sizes, specs, features } = req.body;

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: { OR: [{ slug: category }, { name: { contains: category } }] }
    });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { slug: category || 'general', name: category || 'General', icon: 'Tag' }
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const newProd = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId: categoryRecord.id,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: Number(discount) || 0,
        stock: Number(stock) || 0,
        description: description || '',
        images: JSON.stringify(Array.isArray(images) ? images : [images].filter(Boolean)),
        featured: !!featured,
        bestSeller: !!bestSeller,
        isNew: isNew !== undefined ? !!isNew : true,
        dealOfTheDay: !!dealOfTheDay,
        rating: 5.0,
        reviewCount: 0,
        colors: colors ? JSON.stringify(colors) : null,
        sizes: sizes ? JSON.stringify(sizes) : null,
        specs: specs ? JSON.stringify(specs) : null,
        features: features ? JSON.stringify(features) : null,
      },
      include: { category: { select: { name: true, slug: true } } }
    });

    // Also add to in-memory fallback
    productsDb.unshift(mapProduct(newProd));

    return res.status(201).json({ success: true, data: mapProduct(newProd) });
  } catch (error) {
    console.warn('Prisma createProduct failed, falling back:', error.message);
    const newProd = { id: 'prod-' + Date.now(), ...req.body, rating: 5.0, reviewCount: 0 };
    productsDb.unshift(newProd);
    return res.status(201).json({ success: true, data: newProd });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, originalPrice, discount, stock, description, images, featured, bestSeller, isNew, dealOfTheDay, colors, sizes, specs, features } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (discount !== undefined) updateData.discount = Number(discount);
    if (stock !== undefined) updateData.stock = Math.max(0, Number(stock));
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = JSON.stringify(Array.isArray(images) ? images : [images].filter(Boolean));
    if (featured !== undefined) updateData.featured = !!featured;
    if (bestSeller !== undefined) updateData.bestSeller = !!bestSeller;
    if (isNew !== undefined) updateData.isNew = !!isNew;
    if (dealOfTheDay !== undefined) updateData.dealOfTheDay = !!dealOfTheDay;
    if (colors !== undefined) updateData.colors = JSON.stringify(colors);
    if (sizes !== undefined) updateData.sizes = JSON.stringify(sizes);
    if (specs !== undefined) updateData.specs = JSON.stringify(specs);
    if (features !== undefined) updateData.features = JSON.stringify(features);

    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { OR: [{ slug: category }, { name: { contains: category } }] }
      });
      if (categoryRecord) updateData.categoryId = categoryRecord.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: { select: { name: true, slug: true } } }
    });

    // Sync to in-memory
    const idx = productsDb.findIndex(p => p.id === id);
    if (idx > -1) productsDb[idx] = mapProduct(updated);

    return res.json({ success: true, data: mapProduct(updated) });
  } catch (error) {
    console.warn('Prisma updateProduct failed, falling back:', error.message);
    const idx = productsDb.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found.' });
    productsDb[idx] = { ...productsDb[idx], ...req.body };
    return res.json({ success: true, data: productsDb[idx] });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    productsDb = productsDb.filter(p => p.id !== req.params.id);
    return res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    console.warn('Prisma deleteProduct failed, falling back:', error.message);
    productsDb = productsDb.filter(p => p.id !== req.params.id);
    return res.json({ success: true, message: 'Product deleted from catalog.' });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: Math.max(0, Number(stock)) },
      include: { category: { select: { name: true, slug: true } } }
    });
    // Sync to in-memory
    const idx = productsDb.findIndex(p => p.id === req.params.id);
    if (idx > -1) productsDb[idx] = { ...productsDb[idx], stock: updated.stock };
    return res.json({ success: true, message: 'Stock updated', data: mapProduct(updated) });
  } catch (error) {
    console.warn('Prisma updateInventoryStock failed, falling back:', error.message);
    const prod = productsDb.find(p => p.id === req.params.id);
    if (!prod) return res.status(404).json({ success: false, message: 'Product not found.' });
    prod.stock = Math.max(0, Number(req.body.stock));
    return res.json({ success: true, message: 'Stock updated', data: prod });
  }
};
