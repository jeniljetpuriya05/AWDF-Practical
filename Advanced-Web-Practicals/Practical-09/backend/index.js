const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');
const fileRoutes = require('./routes/fileRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Global Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Logging & Rate Limiting Middleware
app.use(requestLogger);
app.use(rateLimiter({ windowMs: 60 * 1000, max: 120 })); // 120 requests/min

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsPath));

// API Root / Health Check
app.get('/', (req, res) => {
  res.json({
    project: 'Practical 09: Advanced Express File Management API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      uploadSingle: 'POST /api/files/upload',
      uploadMultiple: 'POST /api/files/upload-multiple',
      listFiles: 'GET /api/files',
      fileDetails: 'GET /api/files/:id',
      downloadFile: 'GET /api/files/:id/download',
      viewFile: 'GET /api/files/:id/view',
      deleteFile: 'DELETE /api/files/:id',
      storageStats: 'GET /api/files/stats'
    }
  });
});

// Mount Routes
app.use('/api/files', fileRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 [Practical-09] File Management Server running at http://localhost:${PORT}`);
    console.log(`📁 Static uploads folder: ${uploadsPath}`);
  });
}

module.exports = app;
