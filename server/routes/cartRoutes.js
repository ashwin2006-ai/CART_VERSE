import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Cart CRUD
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:cartItemId', updateCartItem);
router.delete('/:cartItemId', removeFromCart);
router.delete('/', clearCart);

export default router;
