const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// All project routes require authentication
router.use(verifyToken);

// Analytics: Manager and Admin only
router.get('/analytics/summary', authorizeRoles('admin', 'manager'), projectController.getProjectAnalytics);

// CRUD routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authorizeRoles('admin', 'manager'), projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', authorizeRoles('admin'), projectController.deleteProject);

module.exports = router;
