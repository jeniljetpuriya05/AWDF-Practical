const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { recordAudit } = require('../middleware/auditLogger');

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'p10-refresh-secret-jwt-key-2026';

// Helper to generate access and refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, adminSecret } = req.body;

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Role elevation safety check (only allow admin/manager if adminSecret matches or first user)
    let assignedRole = 'user';
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) {
      assignedRole = 'admin'; // First registered user is automatically Admin
    } else if (role && ['admin', 'manager'].includes(role)) {
      if (adminSecret === (process.env.ADMIN_INVITE_SECRET || 'master-secret-key')) {
        assignedRole = role;
      } else {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Invalid admin invite secret required to register as admin or manager'
        });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      department: department || 'Engineering'
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await recordAudit({
      action: 'USER_REGISTERED',
      req,
      targetResource: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, role: user.role }
    });

    res.status(201).json({
      success: true,
      message: 'Account successfully registered',
      accessToken,
      refreshToken,
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account suspended. Contact an administrator.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await recordAudit({
      action: 'USER_LOGIN',
      req: { ...req, user },
      targetResource: 'User',
      targetId: user._id.toString(),
      details: { email: user.email }
    });

    res.json({
      success: true,
      message: 'Authentication successful',
      accessToken,
      refreshToken,
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh-token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token revoked or invalid' });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
      await recordAudit({
        action: 'USER_LOGOUT',
        req,
        targetResource: 'User',
        targetId: req.user._id.toString()
      });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

/**
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (department) user.department = department;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    next(err);
  }
};
