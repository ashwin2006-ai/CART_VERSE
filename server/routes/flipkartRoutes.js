import express from 'express';
import {
  searchFlipkartProducts,
  getFlipkartFeed,
  syncFlipkartCategory,
  getFlipkartConfig,
  updateFlipkartConfig
} from '../controllers/flipkartController.js';

const router = express.Router();

// Public Proxy Routes for Storefront Customers
// Customer -> Website -> Backend -> Flipkart API -> Backend -> MySQL Cache -> Website
router.get('/search', searchFlipkartProducts);
router.get('/feed', getFlipkartFeed);
router.get('/config', getFlipkartConfig);

// Admin Synchronization & Key Management
router.post('/sync', syncFlipkartCategory);
router.post('/config', updateFlipkartConfig);

export default router;
