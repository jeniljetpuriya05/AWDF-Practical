/**
 * Lightweight in-memory rate limiter middleware
 * Limits client requests per time window based on IP address
 */
const rateLimitMap = new Map();

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const maxRequests = options.max || 100; // max requests per window
  const message = options.message || 'Too many requests, please try again later.';

  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const clientRecord = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + windowMs };

    if (now > clientRecord.resetTime) {
      clientRecord.count = 1;
      clientRecord.resetTime = now + windowMs;
    } else {
      clientRecord.count += 1;
    }

    rateLimitMap.set(clientIp, clientRecord);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - clientRecord.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientRecord.resetTime / 1000));

    if (clientRecord.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: Math.ceil((clientRecord.resetTime - now) / 1000)
      });
    }

    next();
  };
};

module.exports = rateLimiter;
