import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import prisma from '../config/prisma.js';

// Initialize admin account if it doesn't exist
const initializeAdmin = async () => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@cartverse.io' }
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      // Use a strong default admin password - should be changed on first login
      const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@2026!Secure';
      const passwordHash = await bcrypt.hash(defaultAdminPassword, salt);

      await prisma.user.create({
        data: {
          name: 'CartVerse Administrator',
          email: 'admin@cartverse.io',
          passwordHash,
          role: 'ADMIN',
          phone: '+91-1800-CARTVERSE',
          tier: 'Administrator',
          rewardPoints: 0
        }
      });
      console.log('✓ Default admin account created. Email: admin@cartverse.io');
    }
  } catch (error) {
    console.warn('Admin initialization check:', error.message);
  }
};

// Call initialization on startup
initializeAdmin();

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered. Please login or use a different email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        role: 'CUSTOMER',
        tier: 'Standard Member',
        rewardPoints: 100 // Welcome bonus
      }
    });

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to CartVerse.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        tier: newUser.tier,
        rewardPoints: newUser.rewardPoints,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { addresses: true }
    });

    // Verify user exists and is a customer (not admin)
    if (!user || user.role !== 'CUSTOMER') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        rewardPoints: user.rewardPoints,
        avatar: user.avatar,
        createdAt: user.createdAt,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Find admin user in database
    const admin = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Verify user exists and is an admin
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPERADMIN')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Access denied.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials. Access denied.'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    return res.json({
      success: true,
      message: 'Admin authentication verified successfully.',
      token,
      adminUser: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role === 'SUPERADMIN' ? 'Super Administrator' : 'Administrator',
        tier: admin.tier,
        avatar: admin.avatar,
        lastLogin: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Admin login failed. Please try again.'
    });
  }
};
export const getUserStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    // Get today's signups
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayUsers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: startOfDay }
      }
    });

    return res.json({
      success: true,
      totalUsers,
      todaySignups: todayUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics.',
      totalUsers: 0,
      todaySignups: 0
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', role = 'CUSTOMER' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const where = { role: role || 'CUSTOMER' };
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          tier: true,
          rewardPoints: true,
          createdAt: true,
          updatedAt: true,
          avatar: true,
          role: true,
          _count: { select: { orders: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        tier: u.tier || 'Standard Member',
        rewardPoints: u.rewardPoints || 0,
        joinedAt: u.createdAt,
        lastUpdated: u.updatedAt,
        avatar: u.avatar || null,
        orderCount: u._count?.orders || 0
      }))
    });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      data: []
    });
  }
};

// Admin Profile Management
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?.id; // From JWT middleware

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin ID required.'
      });
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tier: true,
        avatar: true,
        createdAt: true,
        _count: { select: { orders: true } }
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found.'
      });
    }

    return res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role === 'SUPERADMIN' ? 'Super Administrator' : 'Administrator',
        tier: admin.tier || 'Administrator',
        avatar: admin.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        createdAt: admin.createdAt,
        orderCount: admin._count?.orders || 0
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile.'
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    // Update admin in database
    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: {
        ...(name && { name: name.trim() }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tier: true,
        avatar: true,
        createdAt: true
      }
    });

    return res.json({
      success: true,
      message: 'Admin profile updated successfully.',
      data: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role === 'SUPERADMIN' ? 'Super Administrator' : 'Administrator',
        tier: updatedAdmin.tier,
        avatar: updatedAdmin.avatar,
        createdAt: updatedAdmin.createdAt
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update admin profile.'
    });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new passwords are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    // Get admin from database
    const admin = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await prisma.user.update({
      where: { id: adminId },
      data: { passwordHash: newPasswordHash }
    });

    return res.json({
      success: true,
      message: 'Admin password updated successfully.'
    });
  } catch (error) {
    console.error('Update admin password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update admin password.'
    });
  }
};
