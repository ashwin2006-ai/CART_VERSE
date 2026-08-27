import express from 'express';
import {
  validateCoupon,
  getActiveCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);
router.get('/', getActiveCoupons);

// Admin routes
router.post('/', protect, adminOnly, createCoupon);
router.put('/:couponId', protect, adminOnly, updateCoupon);
router.delete('/:couponId', protect, adminOnly, deleteCoupon);

export default router;
