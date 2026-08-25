import express from 'express';
import { registerCustomer, loginCustomer, adminLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin-login', adminLogin);

export default router;
