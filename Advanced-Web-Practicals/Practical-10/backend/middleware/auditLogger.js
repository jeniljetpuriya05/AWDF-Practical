const AuditLog = require('../models/AuditLog');

/**
 * Log administrative or security action to database
 */
const recordAudit = async ({
  action,
  req,
  targetResource,
  targetId = null,
  details = {},
  status = 'SUCCESS'
}) => {
  try {
    const performedBy = req && req.user ? req.user._id : null;
    const performedByName = req && req.user ? `${req.user.name} (${req.user.email})` : 'System/Anonymous';
    const ipAddress = req ? (req.ip || req.connection?.remoteAddress || '127.0.0.1') : 'internal';

    await AuditLog.create({
      action,
      performedBy,
      performedByName,
      targetResource,
      targetId,
      details,
      ipAddress,
      status
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

module.exports = {
  recordAudit
};
