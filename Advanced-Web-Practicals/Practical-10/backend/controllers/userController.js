const User = require('../models/User');
const { recordAudit } = require('../middleware/auditLogger');

/**
 * GET /api/users - List users (Admin/Manager)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { role, department, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id - Get user by ID (Admin/Manager)
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/:id/role - Update user role (Admin only)
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role specified' });
    }

    // Guard: Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot change your own administrative role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await recordAudit({
      action: 'USER_ROLE_UPDATED',
      req,
      targetResource: 'User',
      targetId: user._id.toString(),
      details: { newRole: role, affectedUser: user.email }
    });

    res.json({
      success: true,
      message: `User role changed to '${role}'`,
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/:id/status - Toggle activate/suspend user (Admin only)
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot suspend your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await recordAudit({
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      req,
      targetResource: 'User',
      targetId: user._id.toString(),
      details: { status: user.isActive }
    });

    res.json({
      success: true,
      message: `User account is now ${user.isActive ? 'Active' : 'Suspended'}`,
      user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/:id - Delete user account (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await recordAudit({
      action: 'USER_DELETED',
      req,
      targetResource: 'User',
      targetId: req.params.id,
      details: { email: user.email }
    });

    res.json({
      success: true,
      message: `User '${user.name}' successfully deleted`
    });
  } catch (err) {
    next(err);
  }
};
