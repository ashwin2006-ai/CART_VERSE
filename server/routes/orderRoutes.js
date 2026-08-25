import express from 'express';
import {
  createOrder,
  getOrderTracking,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer Checkout & Tracking Routes
router.post('/checkout', createOrder);
router.get('/track/:id', getOrderTracking);

// Guarded Admin Orders Pipeline
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatusAdmin);

export default router;
