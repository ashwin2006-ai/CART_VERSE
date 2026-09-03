/**
 * Supabase Server Authentication Helper
 * ════════════════════════════════════════════════════════════════
 * Handles server-side JWT verification and user authentication
 * using @supabase/server package
 */

const { createClient } = require('@supabase/server');

/**
 * Initialize Supabase server client
 * Used for server-side authentication and verification
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

/**
 * Verify JWT token and get user information
 * 
 * @param {string} token - JWT token from Authorization header
 * @returns {Promise<{user: object, error: null} | {user: null, error: object}>}
 */
const verifyToken = async (token) => {
  try {
    if (!token) {
      return {
        user: null,
        error: { message: 'No token provided' }
      };
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(cleanToken);

    if (error) {
      return {
        user: null,
        error: { message: error.message || 'Token verification failed' }
      };
    }

    return {
      user,
      error: null
    };
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return {
      user: null,
      error: { message: err.message || 'Unexpected verification error' }
    };
  }
};

/**
 * Express middleware to verify JWT tokens
 * Attaches user to request if token is valid
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });
    }

    const { user, error } = await verifyToken(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: error?.message || 'Token verification failed'
      });
    }

    // Attach user to request for use in route handlers
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Optional middleware - does not block if token is invalid
 * Attaches user to request if token is valid, otherwise continues
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const { user } = await verifyToken(token);
        
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      }
    }

    next();
  } catch (err) {
    console.error('⚠️  Optional auth middleware error:', err);
    // Continue regardless of error
    next();
  }
};

/**
 * Get user session from token
 * Returns user object if token is valid
 * 
 * @param {string} token - JWT token
 * @returns {Promise<object|null>}
 */
const getUserFromToken = async (token) => {
  const { user } = await verifyToken(token);
  return user || null;
};

/**
 * Refresh user session/token
 * (Note: Full refresh token flow would require additional Supabase setup)
 * 
 * @param {string} refreshToken - Refresh token from Supabase
 * @returns {Promise<object>}
 */
const refreshUserSession = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data.session
    };
  } catch (err) {
    console.error('❌ Session refresh error:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Sign out user (invalidate token)
 * 
 * @param {string} token - JWT token to sign out
 * @returns {Promise<object>}
 */
const signOutUser = async (token) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'User signed out successfully'
    };
  } catch (err) {
    console.error('❌ Sign out error:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Admin-only middleware
 * Verifies token and checks if user has admin role
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const { user, error } = await verifyToken(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if user has admin role
    const userRole = user.user_metadata?.role || user.role;
    
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (err) {
    console.error('❌ Admin middleware error:', err);
    res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

module.exports = {
  supabase,
  verifyToken,
  authMiddleware,
  optionalAuthMiddleware,
  getUserFromToken,
  refreshUserSession,
  signOutUser,
  adminMiddleware
};
