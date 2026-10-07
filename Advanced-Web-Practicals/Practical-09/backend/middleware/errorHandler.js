const multer = require('multer');

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found - ${req.method} ${req.originalUrl}`
  });
};

/**
 * Global Centralized Error Handler
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] [REQ:${req.id || 'N/A'}]`, err.message);

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Maximum allowed file size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded. Maximum is 5 files at a time.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: `Unexpected field in upload form: ${err.field}`
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    });
  }

  // Handle custom validation or mime-type errors
  if (err.message && err.message.startsWith('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // General internal server error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
