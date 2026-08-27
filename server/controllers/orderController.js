import prisma from '../config/prisma.js';
import { INITIAL_ORDERS } from '../../src/data/mockData.js';

let ordersDb = [...INITIAL_ORDERS];

// Helper to generate tracking data
const generateTrackingData = () => ({
  trackingNumber: 'AURA-' + Math.floor(100000000 + Math.random() * 900000000),
  carrier: 'Aura Express Air Cargo',
  estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

// Helper to build timeline
const buildTimeline = (statusStep) => [
  { step: 'Order Placed', time: 'Just Now', done: true },
  { step: 'Payment Verified & Confirmed', time: 'Just Now', done: statusStep >= 2 },
  { step: 'Packed & Dispatched from Warehouse', time: statusStep >= 3 ? 'Updated Today' : 'Pending', done: statusStep >= 3 },
  { step: 'In Transit with Express Courier', time: statusStep >= 4 ? 'Updated Today' : 'Pending', done: statusStep >= 4 },
  { step: 'Out for Delivery', time: statusStep >= 5 ? 'Updated Today' : 'Pending', done: statusStep >= 5 },
  { step: 'Delivered', time: statusStep >= 6 ? 'Updated Today' : 'Estimated in 3-4 days', done: statusStep >= 6 }
];

/**
 * Create order from cart
 * POST /api/orders
 * Body: { items, shippingAddress, paymentMethod, couponCode }
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Verify product stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
        priceAtPurchase: product.price
      });
    }

    // Handle coupon
    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      });

      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else if (coupon.discountType === 'fixed') {
          discountAmount = coupon.discountValue;
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // Create order in database
    const { trackingNumber, carrier, estimatedDelivery } = generateTrackingData();

    const order = await prisma.order.create({
      data: {
        userId,
        couponId: coupon?.id || null,
        trackingNumber,
        carrier,
        estimatedDelivery,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        subtotal,
        discount: discountAmount,
        total,
        status: 'Confirmed',
        statusStep: 2,
        timeline: JSON.stringify(buildTimeline(2)),
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true }
            }
          }
        }
      }
    });

    // Reduce product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    // Format response
    const orderResponse = {
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      statusStep: order.statusStep,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      items: order.items.map(oi => ({
        productId: oi.product.id,
        name: oi.product.name,
        quantity: oi.quantity,
        priceAtPurchase: oi.priceAtPurchase,
        color: oi.color,
        size: oi.size,
        image: Array.isArray(oi.product.images) 
          ? oi.product.images[0] 
          : (() => {
              try { return JSON.parse(oi.product.images || '[]')[0]; } catch { return null; }
            })()
      })),
      shippingAddress: JSON.parse(order.shippingAddress),
      paymentMethod: order.paymentMethod,
      totals: {
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total
      },
      timeline: JSON.parse(order.timeline)
    };

    // Also add to in-memory for mock data fallback
    ordersDb.unshift(orderResponse);

    return res.status(201).json({ success: true, order: orderResponse });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Fallback to mock data order creation
    const { items, shippingAddress, paymentMethod } = req.body;
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const { trackingNumber, carrier, estimatedDelivery } = generateTrackingData();

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Confirmed',
      statusStep: 2,
      estimatedDelivery,
      trackingNumber,
      carrier,
      items,
      shippingAddress,
      paymentMethod,
      timeline: buildTimeline(2)
    };

    ordersDb.unshift(newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      statusStep: order.statusStep,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      items: order.items.map(oi => ({
        productId: oi.product.id,
        name: oi.product.name,
        quantity: oi.quantity,
        priceAtPurchase: oi.priceAtPurchase,
        color: oi.color,
        size: oi.size,
        image: Array.isArray(oi.product.images) 
          ? oi.product.images[0] 
          : (() => {
              try { return JSON.parse(oi.product.images || '[]')[0]; } catch { return null; }
            })()
      })),
      totals: {
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total
      },
      timeline: JSON.parse(order.timeline)
    }));

    return res.json({
      success: true,
      orders: formattedOrders,
      count: formattedOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

/**
 * Get order tracking (by order ID or tracking number)
 * GET /api/orders/:id/track
 */
export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { trackingNumber: id }
        ]
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true }
            }
          }
        }
      }
    });

    if (!order) {
      // Fallback to mock data
      const mockOrder = ordersDb.find(o => o.id === id || o.trackingNumber === id);
      if (!mockOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order: mockOrder });
    }

    const orderResponse = {
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status,
      statusStep: order.statusStep,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      items: order.items.map(oi => ({
        productId: oi.product.id,
        name: oi.product.name,
        quantity: oi.quantity,
        priceAtPurchase: oi.priceAtPurchase,
        image: Array.isArray(oi.product.images) 
          ? oi.product.images[0] 
          : (() => {
              try { return JSON.parse(oi.product.images || '[]')[0]; } catch { return null; }
            })()
      })),
      totals: {
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total
      },
      timeline: JSON.parse(order.timeline)
    };

    return res.json({ success: true, order: orderResponse });
  } catch (error) {
    console.error('Error getting order tracking:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

/**
 * Admin: Get all orders
 * GET /api/admin/orders
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.json({ success: true, count: ordersDb.length, data: ordersDb });
  }
};

/**
 * Admin: Update order status
 * PUT /api/admin/orders/:orderId/status
 * Body: { status, statusStep }
 */
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, statusStep } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusStep,
        timeline: JSON.stringify(buildTimeline(statusStep))
      },
      include: { items: true }
    });

    return res.json({
      success: true,
      message: `Order updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    
    // Fallback to mock data
    const order = ordersDb.find(o => o.id === req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status;
    order.statusStep = req.body.statusStep;
    order.timeline = buildTimeline(req.body.statusStep);

    return res.json({ success: true, message: `Order updated to ${req.body.status}`, order });
  }
};
