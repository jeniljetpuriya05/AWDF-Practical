const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// All user routes require authentication
router.use(verifyToken);

// Read user accounts: Managers and Admins
router.get('/', authorizeRoles('admin', 'manager'), userController.getUsers);
router.get('/:id', authorizeRoles('admin', 'manager'), userController.getUserById);

// Modify user accounts: Admin only
router.put('/:id/role', authorizeRoles('admin'), userController.updateUserRole);
router.patch('/:id/status', authorizeRoles('admin'), userController.toggleUserStatus);
router.delete('/:id', authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
