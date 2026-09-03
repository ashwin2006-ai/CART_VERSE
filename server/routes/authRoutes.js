import express from 'express';
import { registerCustomer, loginCustomer, adminLogin, getUserStats, getUsers, getAdminProfile, updateAdminProfile, updateAdminPassword, updateCustomerProfile } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin-login', adminLogin);
router.get('/stats', getUserStats);
router.get('/users', getUsers);
router.get('/admin/profile', protect, getAdminProfile);
router.put('/admin/profile', protect, adminOnly, updateAdminProfile);
router.post('/admin/password', protect, adminOnly, updateAdminPassword);
router.put('/profile', protect, updateCustomerProfile);

export default router;
