import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Wishlist CRUD
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:wishlistItemId', removeFromWishlist);
router.get('/check/:productId', checkWishlist);

export default router;
