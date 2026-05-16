/**
 * MyCheapFlights – Backend API Server
 * USA–Uganda Science & Tech Bootcamp
 *
 * Run: node backend/server.js
 * Or:  npm run server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flights');
const userRoutes = require('./routes/users');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security middleware ──
app.use(helmet({
  contentSecurityPolicy: false, // Configured separately for PWA
  crossOriginEmbedderPolicy: false,
}));

// ── CORS ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ── Rate limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Too many search requests. Please slow down.' },
});

// ── Body parsing ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request logging ──
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(`${color}${req.method}\x1b[0m ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ── Routes ──
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/flights', searchLimiter, flightRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/alerts', apiLimiter, alertRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MyCheapFlights API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Serve static files in production ──
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log('\n\x1b[36m╔════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║   MyCheapFlights API Server            ║\x1b[0m');
  console.log('\x1b[36m║   USA–Uganda Science & Tech Bootcamp   ║\x1b[0m');
  console.log('\x1b[36m╚════════════════════════════════════════╝\x1b[0m');
  console.log(`\n✈  Server running on \x1b[32mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`🔒 Auth: \x1b[33mhttp://localhost:${PORT}/api/auth\x1b[0m`);
  console.log(`✈  Flights: \x1b[33mhttp://localhost:${PORT}/api/flights\x1b[0m`);
  console.log(`❤  Health: \x1b[33mhttp://localhost:${PORT}/api/health\x1b[0m\n`);
});

module.exports = app;
