const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [
  {
    id: uuidv4(),
    title: 'Learn Express.js',
    description: 'Study Express.js fundamentals and middleware patterns',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Build REST API',
    description: 'Create a complete CRUD REST API for task management',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Setup Development Environment',
    description: 'Install Node.js, npm, and VS Code extensions',
    status: 'completed',
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Validation middleware
const validateTask = (req, res, next) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Task title is required',
    });
  }
  next();
};

// ========================
// ROUTES
// ========================

// GET /api/tasks - Get all tasks (with optional filtering)
app.get('/api/tasks', (req, res) => {
  let result = [...tasks];

  // Filter by status
  if (req.query.status) {
    result = result.filter(t => t.status === req.query.status);
  }

  // Filter by priority
  if (req.query.priority) {
    result = result.filter(t => t.priority === req.query.priority);
  }

  // Search by title
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search)
    );
  }

  // Sort
  if (req.query.sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (req.query.sort === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/tasks/:id - Get a single task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }
  res.json({ success: true, data: task });
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', validateTask, (req, res) => {
  const { title, description, status, priority } = req.body;
  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || '',
    status: status || 'todo',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', validateTask, (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const { title, description, status, priority } = req.body;
  tasks[index] = {
    ...tasks[index],
    title: title?.trim() || tasks[index].title,
    description: description?.trim() ?? tasks[index].description,
    status: status || tasks[index].status,
    priority: priority || tasks[index].priority,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: tasks[index],
  });
});

// PATCH /api/tasks/:id/status - Update task status only
app.patch('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['todo', 'in-progress', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Task status updated',
    data: task,
  });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }
  const deleted = tasks.splice(index, 1);
  res.json({
    success: true,
    message: 'Task deleted successfully',
    data: deleted[0],
  });
});

// GET /api/tasks/stats/summary - Get task statistics
app.get('/api/stats/summary', (req, res) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    mediumPriority: tasks.filter(t => t.priority === 'medium').length,
    lowPriority: tasks.filter(t => t.priority === 'low').length,
  };
  res.json({ success: true, data: stats });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Task Manager API running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET    /api/tasks          - Get all tasks`);
  console.log(`   GET    /api/tasks/:id       - Get a task`);
  console.log(`   POST   /api/tasks          - Create a task`);
  console.log(`   PUT    /api/tasks/:id       - Update a task`);
  console.log(`   PATCH  /api/tasks/:id/status - Update task status`);
  console.log(`   DELETE /api/tasks/:id       - Delete a task`);
  console.log(`   GET    /api/stats/summary   - Get statistics`);
});
