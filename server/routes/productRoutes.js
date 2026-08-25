import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventoryStock
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public Storefront Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Guarded Admin Routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateInventoryStock);

export default router;
