import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkMysqlConnection } from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CartVerse Node.js/Express + MySQL (Prisma) Backend',
    version: '2.0.0',
    database: 'MySQL (Prisma ORM)'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Global 404 & Error Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Cartverse Node.js + MySQL (Prisma) Server active on http://localhost:${PORT}`);
  checkMysqlConnection();
});

// Prevent unhandled rejections from terminating the process
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
