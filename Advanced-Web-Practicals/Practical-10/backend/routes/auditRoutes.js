const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// All audit routes: Admin only
router.use(verifyToken, authorizeRoles('admin'));

/**
 * GET /api/audit-logs - View chronological security and action logs
 */
router.get('/', async (req, res, next) => {
  try {
    const { action, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (action) query.action = action;
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
