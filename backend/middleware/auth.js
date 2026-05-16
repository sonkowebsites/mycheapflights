const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mycheapflights-super-secret-jwt-2025-bootcamp';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * Generate a JWT token for a user
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * Middleware to verify JWT and attach user to req
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No authentication token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    }
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
}

/**
 * Optional auth middleware — attaches user if token present, but doesn't require it
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // ignore invalid token for optional routes
    }
  }
  next();
}

module.exports = { generateToken, authenticate, optionalAuth };
