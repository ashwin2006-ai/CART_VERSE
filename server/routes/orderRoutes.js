import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderTracking,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer Routes (require authentication)
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id/track', getOrderTracking);

// Admin Routes
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.put('/:orderId/status', protect, adminOnly, updateOrderStatusAdmin);

// Backward compatibility
router.post('/checkout', protect, createOrder);

export default router;
