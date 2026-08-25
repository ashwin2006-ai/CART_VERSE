import { INITIAL_ORDERS } from '../../src/data/mockData.js';

let ordersDb = [...INITIAL_ORDERS];

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totals } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required.' });
    }

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Confirmed',
      statusStep: 2,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingNumber: 'AURA-' + Math.floor(100000000 + Math.random() * 900000000),
      carrier: 'Aura Express Air Cargo',
      items,
      shippingAddress,
      paymentMethod,
      totals,
      timeline: [
        { step: 'Order Placed', time: 'Just Now', done: true },
        { step: 'Payment Verified & Confirmed', time: 'Just Now', done: true },
        { step: 'Packed & Dispatched from Warehouse', time: 'Pending', done: false },
        { step: 'In Transit with Express Courier', time: 'Pending', done: false },
        { step: 'Out for Delivery', time: 'Pending', done: false },
        { step: 'Delivered', time: 'Estimated in 3-4 days', done: false }
      ]
    };

    ordersDb.unshift(newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const order = ordersDb.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order tracking ID not found.' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    return res.json({ success: true, count: ordersDb.length, data: ordersDb });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, statusStep } = req.body;
    const order = ordersDb.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.statusStep = statusStep;
    order.timeline = order.timeline.map((step, idx) => {
      if (idx + 1 <= statusStep) {
        return { ...step, done: true, time: step.time.includes('Pending') ? 'Updated Today' : step.time };
      }
      return step;
    });

    return res.json({ success: true, message: `Order updated to ${status}`, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
