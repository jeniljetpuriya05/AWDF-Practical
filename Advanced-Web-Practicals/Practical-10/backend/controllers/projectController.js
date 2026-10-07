const Project = require('../models/Project');
const { recordAudit } = require('../middleware/auditLogger');

/**
 * GET /api/projects - List projects with role filtering & search
 */
exports.getProjects = async (req, res, next) => {
  try {
    const { status, priority, search, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const filter = {};

    // Standard users only see projects they created or are assigned to
    if (req.user.role === 'user') {
      filter.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('assignedTo', 'name email department')
        .populate('createdBy', 'name email role')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Project.countDocuments(filter)
    ]);

    res.json({
      success: true,
      projects,
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
 * GET /api/projects/:id - Get project by ID
 */
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name email role');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Role check for regular users
    if (req.user.role === 'user') {
      const isOwner = project.createdBy._id.toString() === req.user._id.toString();
      const isAssigned = project.assignedTo && project.assignedTo._id.toString() === req.user._id.toString();
      if (!isOwner && !isAssigned) {
        return res.status(403).json({ success: false, error: 'Forbidden: You do not have access to this project' });
      }
    }

    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/projects - Create project (Admin/Manager)
 */
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, status, priority, budget, deadline, assignedTo, tags } = req.body;

    const project = await Project.create({
      title,
      description,
      status: status || 'backlog',
      priority: priority || 'medium',
      budget: budget || 0,
      deadline: deadline || undefined,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      tags: tags || []
    });

    await recordAudit({
      action: 'PROJECT_CREATED',
      req,
      targetResource: 'Project',
      targetId: project._id.toString(),
      details: { title: project.title, priority: project.priority }
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/projects/:id - Update project
 * Admins & Managers can update all fields; standard users can update status if assigned
 */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check permissions
    if (req.user.role === 'user') {
      const isAssigned = project.assignedTo && project.assignedTo.toString() === req.user._id.toString();
      if (!isAssigned) {
        return res.status(403).json({ success: false, error: 'Forbidden: You cannot modify this project' });
      }

      // User can only modify status
      if (req.body.status) {
        project.status = req.body.status;
        await project.save();
        return res.json({ success: true, message: 'Project status updated', project });
      } else {
        return res.status(403).json({ success: false, error: 'Users may only update the project status' });
      }
    }

    // Admin & Manager can update everything
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    await recordAudit({
      action: 'PROJECT_UPDATED',
      req,
      targetResource: 'Project',
      targetId: updatedProject._id.toString(),
      details: { updatedFields: Object.keys(req.body) }
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:id - Delete project (Admin only)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await recordAudit({
      action: 'PROJECT_DELETED',
      req,
      targetResource: 'Project',
      targetId: req.params.id,
      details: { title: project.title }
    });

    res.json({
      success: true,
      message: `Project '${project.title}' successfully deleted`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/analytics/summary - Advanced MongoDB Aggregation Analytics
 */
exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const [statusStats, priorityStats, financialStats, totalCount] = await Promise.all([
      // Group by status
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Group by priority
      Project.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),

      // Financial statistics
      Project.aggregate([
        {
          $group: {
            _id: null,
            totalBudget: { $sum: '$budget' },
            avgBudget: { $avg: '$budget' },
            minBudget: { $min: '$budget' },
            maxBudget: { $max: '$budget' }
          }
        }
      ]),

      Project.countDocuments()
    ]);

    const completedCount = statusStats.find(s => s._id === 'completed')?.count || 0;
    const completionRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalProjects: totalCount,
        completionRate: `${completionRate}%`,
        byStatus: statusStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
        byPriority: priorityStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
        financials: financialStats[0] || { totalBudget: 0, avgBudget: 0, minBudget: 0, maxBudget: 0 }
      }
    });
  } catch (err) {
    next(err);
  }
};
