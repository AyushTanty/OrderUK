import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to verify JWT token
 */
export const verifyAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token'
    });
  }
};

/**
 * Middleware to verify user role
 */
export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(', ')} can access this resource`
      });
    }

    next();
  };
};

/**
 * Combined middleware to verify token and role
 */
export const authenticate = (allowedRoles = null) => {
  return (req, res, next) => {
    verifyAuthToken(req, res, () => {
      if (allowedRoles) {
        verifyRole(allowedRoles)(req, res, next);
      } else {
        next();
      }
    });
  };
};