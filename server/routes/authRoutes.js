import express from 'express';
import { registerCustomer, loginCustomer, adminLogin, getUserStats, getUsers, getAdminProfile, updateAdminProfile, updateAdminPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin-login', adminLogin);
router.get('/stats', getUserStats);
router.get('/users', getUsers);
router.get('/admin/profile', getAdminProfile);
router.put('/admin/profile', updateAdminProfile);
router.post('/admin/password', updateAdminPassword);

export default router;
