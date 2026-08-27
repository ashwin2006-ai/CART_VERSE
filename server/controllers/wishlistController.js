import prisma from '../config/prisma.js';

/**
 * Get user's wishlist items
 * GET /api/wishlist
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: { select: { name: true, slug: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map products for frontend
    const items = wishlistItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      originalPrice: item.product.originalPrice || item.product.price,
      discount: item.product.discount || 0,
      rating: item.product.rating || 4.5,
      reviewCount: item.product.reviewCount || 0,
      stock: item.product.stock,
      featured: item.product.featured,
      bestSeller: item.product.bestSeller,
      image: Array.isArray(item.product.images) 
        ? item.product.images[0] 
        : (() => {
            try { return JSON.parse(item.product.images || '[]')[0]; } catch { return null; }
          })(),
      category: item.product.category?.slug || 'general',
      addedAt: item.createdAt
    }));

    return res.json({
      success: true,
      items,
      count: items.length
    });
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch wishlist', error: error.message });
  }
};

/**
 * Add item to wishlist
 * POST /api/wishlist
 * Body: { productId }
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: { select: { name: true, slug: true } } }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId
      },
      include: {
        product: {
          include: { category: { select: { name: true, slug: true } } }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      item: {
        id: wishlistItem.id,
        productId: wishlistItem.product.id,
        name: wishlistItem.product.name,
        price: wishlistItem.product.price
      }
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ success: false, message: 'Failed to add to wishlist', error: error.message });
  }
};

/**
 * Remove item from wishlist
 * DELETE /api/wishlist/:wishlistItemId
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { wishlistItemId } = req.params;

    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: { id: wishlistItemId, userId }
    });

    if (!wishlistItem) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    await prisma.wishlistItem.delete({ where: { id: wishlistItemId } });

    return res.json({
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove from wishlist', error: error.message });
  }
};

/**
 * Check if product is in wishlist
 * GET /api/wishlist/check/:productId
 */
export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: true, inWishlist: false });
    }

    const { productId } = req.params;

    const item = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    return res.json({
      success: true,
      inWishlist: !!item,
      wishlistItemId: item?.id
    });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return res.status(500).json({ success: false, message: 'Failed to check wishlist', error: error.message });
  }
};
