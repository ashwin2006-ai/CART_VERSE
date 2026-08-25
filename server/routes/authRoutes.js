import express from 'express';
import { registerCustomer, loginCustomer, adminLogin, getUserStats, getUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin-login', adminLogin);
router.get('/stats', getUserStats);
router.get('/users', getUsers);

export default router;
