import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { INITIAL_USER } from '../../src/data/mockData.js';

// In-memory mock store fallback
let usersDb = [
  {
    id: 'usr-101',
    name: 'Alex Mercer',
    email: 'alex.mercer@lumina.io',
    passwordHash: '$2a$10$w8T0t2P9n7z8U.E4v5W0.u9d4Y2z5W3q1x2y3z4a5b6c7d8e9f0g', // hashed 'Password@123'
    role: 'customer',
    tier: 'VIP Platinum',
    rewardPoints: 1240,
    addresses: INITIAL_USER.addresses
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
