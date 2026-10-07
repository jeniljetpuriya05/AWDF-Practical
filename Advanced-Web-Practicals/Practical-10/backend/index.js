require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const auditRoutes = require('./routes/auditRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome & Documentation Route
app.get('/', (req, res) => {
  res.json({
    service: 'Practical 10: Enterprise REST API with RBAC & JWT Authentication',
    version: '1.0.0',
    status: 'online',
    roles: ['admin', 'manager', 'user'],
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refreshToken: 'POST /api/auth/refresh-token',
        profile: 'GET /api/auth/profile (Protected)',
        logout: 'POST /api/auth/logout (Protected)'
      },
      users: {
        listUsers: 'GET /api/users (Admin, Manager)',
        changeRole: 'PUT /api/users/:id/role (Admin)',
        toggleStatus: 'PATCH /api/users/:id/status (Admin)',
        deleteUser: 'DELETE /api/users/:id (Admin)'
      },
      projects: {
        listProjects: 'GET /api/projects (Authenticated)',
        createProject: 'POST /api/projects (Admin, Manager)',
        updateProject: 'PUT /api/projects/:id (Admin, Manager, Assignee)',
        deleteProject: 'DELETE /api/projects/:id (Admin)',
        analytics: 'GET /api/projects/analytics/summary (Admin, Manager)'
      },
      audit: {
        logs: 'GET /api/audit-logs (Admin)'
      }
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/audit-logs', auditRoutes);

// Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🛡️ [Practical-10] Enterprise RBAC Server running at http://localhost:${PORT}`);
    console.log(`📚 API documentation available at root: http://localhost:${PORT}/`);
  });
}

module.exports = app;
