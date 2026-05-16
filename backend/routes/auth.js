const express = require('express');
const router = express.Router();
const { generateToken, authenticate } = require('../middleware/auth');
const UserStore = require('../models/User');

// ─────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check for existing user
    if (email) {
      const existing = await UserStore.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }
    }
    if (phone) {
      const existing = await UserStore.findByPhone(phone);
      if (existing) {
        return res.status(409).json({ message: 'An account with this phone number already exists' });
      }
    }

    // Create user
    const user = await UserStore.create({ name: name.trim(), email, phone, password });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: UserStore.sanitize(user),
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Find user
    let user = email
      ? await UserStore.findByEmail(email)
      : await UserStore.findByPhone(phone);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    // Verify password
    const valid = await UserStore.verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    // Update last login
    await UserStore.update(user.id, { lastLoginAt: new Date().toISOString() });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      message: 'Login successful',
      token,
      user: UserStore.sanitize(user),
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────
// GET /api/auth/profile  (protected)
// ─────────────────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await UserStore.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: UserStore.sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ─────────────────────────────────────────────────
// PATCH /api/auth/profile  (protected)
// ─────────────────────────────────────────────────
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (avatar) updates.avatar = avatar;
    if (preferences) updates.preferences = preferences;

    const user = await UserStore.update(req.user.id, updates);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user: UserStore.sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ─────────────────────────────────────────────────
// POST /api/auth/change-password  (protected)
// ─────────────────────────────────────────────────
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await UserStore.findById(req.user.id);
    const valid = await UserStore.verifyPassword(user, currentPassword);
    if (!valid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(newPassword, 12);
    await UserStore.update(req.user.id, { password: hashed });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// ─────────────────────────────────────────────────
// GET /api/auth/google  (OAuth redirect — requires Passport.js in production)
// ─────────────────────────────────────────────────
router.get('/google', (req, res) => {
  // In production, configure Passport.js with Google OAuth2:
  // passport.authenticate('google', { scope: ['profile', 'email'] })
  //
  // For now, simulate a Google OAuth response for demo purposes.
  // In production replace this with actual Google OAuth flow.
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_error=google_not_configured`);
});

// ─────────────────────────────────────────────────
// POST /api/auth/google/token  (for frontend token exchange)
// ─────────────────────────────────────────────────
router.post('/google/token', async (req, res) => {
  try {
    const { googleToken } = req.body;
    if (!googleToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // In production: verify the Google ID token with Google's API
    // const { OAuth2Client } = require('google-auth-library');
    // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // const ticket = await client.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();

    // Simulated for demo
    const mockGoogleUser = {
      googleId: `google_${Date.now()}`,
      name: 'Google User',
      email: `user_${Date.now()}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=google`,
    };

    let user = await UserStore.findByGoogleId(mockGoogleUser.googleId);
    if (!user) {
      user = await UserStore.create({
        name: mockGoogleUser.name,
        email: mockGoogleUser.email,
        googleId: mockGoogleUser.googleId,
        avatar: mockGoogleUser.avatar,
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({ token, user: UserStore.sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// ─────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await UserStore.findByEmail(email);

    // Always return success to prevent email enumeration
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });

    // In production: send email with reset token
    // if (user) { await sendPasswordResetEmail(user, generateResetToken(user)); }
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request' });
  }
});

// ─────────────────────────────────────────────────
// POST /api/auth/delete-account  (protected)
// ─────────────────────────────────────────────────
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await UserStore.findById(req.user.id);

    if (user.password) {
      const valid = await UserStore.verifyPassword(user, password);
      if (!valid) return res.status(401).json({ message: 'Incorrect password' });
    }

    await UserStore.delete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
