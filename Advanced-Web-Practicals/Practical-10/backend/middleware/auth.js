const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'p10-super-secret-jwt-key-change-in-production';

/**
 * Verify JWT Access Token Middleware
 */
const verifyToken = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: No token provided. Include "Authorization: Bearer <token>"'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed: User belonging to this token no longer exists'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account Suspended: Contact an administrator to reactivate your access'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired: Please refresh your session using the refresh token',
        isExpired: true
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid Token: Authentication failed'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * @param  {...string} roles - Permitted user roles e.g. ('admin', 'manager')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User authentication required before role evaluation'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' lacks permission. Required role(s): [${roles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
  JWT_SECRET
};
