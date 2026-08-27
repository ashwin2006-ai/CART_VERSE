import express from 'express';
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  markHelpful,
  adminReplyReview,
  getPendingReviews,
  verifyReview
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/products/:productId/reviews', getReviews);
router.post('/products/:productId/reviews/:reviewId/helpful', markHelpful);

// Authenticated routes (user)
router.post('/products/:productId/reviews', protect, addReview);
router.put('/products/:productId/reviews/:reviewId', protect, updateReview);
router.delete('/products/:productId/reviews/:reviewId', protect, deleteReview);

// Admin routes
router.get('/admin/reviews/pending', protect, adminOnly, getPendingReviews);
router.put('/admin/reviews/:reviewId/verify', protect, adminOnly, verifyReview);
router.post('/products/:productId/reviews/:reviewId/reply', protect, adminOnly, adminReplyReview);

export default router;
