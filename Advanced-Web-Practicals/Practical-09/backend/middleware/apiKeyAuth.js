/**
 * API Key authorization middleware
 * Validates 'x-api-key' header against server secret
 */
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY || 'awdf-secret-api-key-2026';

  // Allow public reading of files without API key, but protect upload/delete operations if configured
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing x-api-key header'
    });
  }

  if (apiKey !== expectedKey) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid API key provided'
    });
  }

  next();
};

module.exports = apiKeyAuth;
