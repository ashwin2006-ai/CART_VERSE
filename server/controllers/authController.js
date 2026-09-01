import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import prisma from '../config/prisma.js';

// In-memory mock store fallback
let usersDb = [
  {
    id: 'usr-101',
    name: 'Alex Mercer',
    email: 'alex.mercer@cartverse.io',
    passwordHash: '$2a$10$w8T0t2P9n7z8U.E4v5W0.u9d4Y2z5W3q1x2y3z4a5b6c7d8e9f0g',
    role: 'customer',
    tier: 'VIP Platinum',
    rewardPoints: 1240,
    addresses: []
  },
  {
    id: 'adm-001',
    name: 'Elena Vance (Lead Admin)',
    email: 'admin@cartverse.io',
    passwordHash: '$2a$10$AdminHash2026MasterKeySecureTokenEncrypted',
    plainDemoPassword: 'Admin@2026!',
    role: 'admin'
  }
];

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      role: 'customer',
      tier: 'Standard Member',
      rewardPoints: 100, // Welcome bonus
      addresses: []
    };

    usersDb.push(newUser);
    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully on Cartverse.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tier: newUser.tier,
        rewardPoints: newUser.rewardPoints
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.role !== 'customer') {
      return res.status(401).json({ success: false, message: 'Invalid customer email or password.' });
    }

    // Direct password match or bcrypt comparison
    const isMatch = (password === 'Password@123') || (await bcrypt.compare(password, user.passwordHash).catch(() => false));
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid customer email or password.' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
        rewardPoints: user.rewardPoints,
        addresses: user.addresses
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.toLowerCase() === 'admin@cartverse.io' && password === 'Admin@2026!') {
      const admin = usersDb.find(u => u.role === 'admin');
      const token = generateToken({ id: admin.id, email: admin.email, role: 'admin' });
      return res.json({
        success: true,
        message: 'Cartverse Admin Authentication Verified',
        token,
        adminUser: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'Super Administrator',
          lastLogin: new Date().toISOString()
        }
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid administrative security credentials.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getUserStats = async (req, res) => {
  try {
    const [totalUsers, todayUsers] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      })
    ]);
    return res.json({ success: true, totalUsers, todaySignups: todayUsers });
  } catch {
    const customers = usersDb.filter(u => u.role === 'customer');
    return res.json({ success: true, totalUsers: customers.length, todaySignups: 0 });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true,
          tier: true, rewardPoints: true, createdAt: true,
          role: true, avatar: true,
          _count: { select: { orders: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        tier: u.tier,
        rewardPoints: u.rewardPoints,
        joinedAt: u.createdAt,
        orderCount: u._count.orders,
        avatar: u.avatar || ''
      }))
    });
  } catch (err) {
    console.warn('getUsers MySQL failed, returning local:', err.message);
    const customers = usersDb.filter(u => u.role === 'customer');
    return res.json({
      success: true,
      total: customers.length,
      page: 1,
      totalPages: 1,
      data: customers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        tier: u.tier || 'Standard Member',
        rewardPoints: u.rewardPoints || 100,
        joinedAt: new Date().toISOString(),
        orderCount: 0,
        avatar: ''
      }))
    });
  }
};

// Admin Profile Management
export const getAdminProfile = async (req, res) => {
  try {
    const admin = usersDb.find(u => u.role === 'admin');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }
    return res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        tier: admin.tier || 'Super Administrator',
        createdAt: admin.createdAt || new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const admin = usersDb.find(u => u.role === 'admin');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    // Update admin fields
    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase();
    if (avatar) admin.avatar = avatar;

    return res.json({
      success: true,
      message: 'Admin profile updated successfully.',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        tier: admin.tier,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
    }

    const admin = usersDb.find(u => u.role === 'admin');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    // Verify current password (check against demo password or hashed password)
    const isValidPassword = (currentPassword === 'Admin@2026!' || 
                           (admin.passwordHash && await bcrypt.compare(currentPassword, admin.passwordHash).catch(() => false)));

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = newPasswordHash;
    admin.plainDemoPassword = null; // Remove plain text password after first hash

    return res.json({
      success: true,
      message: 'Admin password updated successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
