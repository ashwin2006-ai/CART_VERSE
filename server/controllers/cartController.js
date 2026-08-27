import prisma from '../config/prisma.js';

/**
 * Get user's cart items
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: { select: { name: true, slug: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map products for frontend
    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      originalPrice: item.product.originalPrice || item.product.price,
      discount: item.product.discount || 0,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      stock: item.product.stock,
      image: Array.isArray(item.product.images) 
        ? item.product.images[0] 
        : (() => {
            try { return JSON.parse(item.product.images || '[]')[0]; } catch { return null; }
          })(),
      category: item.product.category?.slug || 'general'
    }));

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
      const itemDiscount = (item.originalPrice - item.price) * item.quantity;
      return sum + itemDiscount;
    }, 0);

    return res.json({
      success: true,
      items,
      count: items.length,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      total: parseFloat((subtotal).toFixed(2))
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch cart', error: error.message });
  }
};

/**
 * Add item to cart or update quantity
 * POST /api/cart
 * Body: { productId, quantity, color, size }
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { productId, quantity = 1, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Verify product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: { select: { name: true, slug: true } } }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient stock. Available: ${product.stock}` 
      });
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        color: color || null,
        size: size || null
      }
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            include: { category: { select: { name: true, slug: true } } }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          color: color || null,
          size: size || null
        },
        include: {
          product: {
            include: { category: { select: { name: true, slug: true } } }
          }
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Item added to cart',
      item: {
        id: cartItem.id,
        productId: cartItem.product.id,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ success: false, message: 'Failed to add to cart', error: error.message });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/:cartItemId
 * Body: { quantity }
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Check stock
    const product = await prisma.product.findUnique({ where: { id: cartItem.productId } });
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient stock. Available: ${product.stock}` 
      });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });

    return res.json({
      success: true,
      message: 'Cart item updated',
      item: updated
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ success: false, message: 'Failed to update cart item', error: error.message });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:cartItemId
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { cartItemId } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove from cart', error: error.message });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await prisma.cartItem.deleteMany({ where: { userId } });

    return res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear cart', error: error.message });
  }
};
