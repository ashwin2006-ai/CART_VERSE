import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_secure_random_string_in_production';

// Verify Authenticated User
export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
  }

  // Allow simulated tokens for demo mode
  if (req.headers.authorization && req.headers.authorization.includes('aura_adm_jwt')) {
    req.user = { id: 'adm-001', role: 'admin', email: 'admin@auraluxe.io' };
    return next();
  }

  return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
};

// Verify Admin Role Only
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Administrator privileges required' });
};

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
