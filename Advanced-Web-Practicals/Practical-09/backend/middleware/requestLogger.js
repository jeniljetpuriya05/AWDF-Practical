const { v4: uuidv4 } = require('uuid');

/**
 * Custom request logger middleware
 * Attaches unique request ID and logs method, path, status, and duration
 */
const requestLogger = (req, res, next) => {
  req.id = uuidv4();
  const startTime = Date.now();

  // Log incoming request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [REQ:${req.id.slice(0, 8)}] ${req.method} ${req.originalUrl}`);

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 500 ? '❌' : res.statusCode >= 400 ? '⚠️' : '✅';
    console.log(
      `[${new Date().toISOString()}] [RES:${req.id.slice(0, 8)}] ${statusColor} ${res.statusCode} | ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
