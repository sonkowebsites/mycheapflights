const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const UserStore = require('../models/User');

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: UserStore.sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// PATCH /api/users/preferences
router.patch('/preferences', authenticate, async (req, res) => {
  try {
    const { currency, notifications, theme } = req.body;
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = await UserStore.update(req.user.id, {
      preferences: {
        ...user.preferences,
        ...(currency && { currency }),
        ...(notifications && { notifications: { ...user.preferences.notifications, ...notifications } }),
        ...(theme && { theme }),
      },
    });

    res.json({ message: 'Preferences updated', preferences: updated.preferences });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

// POST /api/users/saved-searches
router.post('/saved-searches', authenticate, async (req, res) => {
  try {
    const { origin, destination, departDate, returnDate, passengers, cabinClass } = req.body;
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const search = {
      id: `srch_${Date.now()}`,
      origin, destination, departDate, returnDate,
      passengers, cabinClass,
      savedAt: new Date().toISOString(),
    };

    const updatedSearches = [search, ...(user.savedSearches || [])].slice(0, 20);
    await UserStore.update(req.user.id, { savedSearches: updatedSearches });

    res.status(201).json({ message: 'Search saved', search });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save search' });
  }
});

// GET /api/users/saved-searches
router.get('/saved-searches', authenticate, async (req, res) => {
  try {
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ savedSearches: user.savedSearches || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved searches' });
  }
});

// GET /api/users/bookings
router.get('/bookings', authenticate, async (req, res) => {
  try {
    const user = await UserStore.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bookings: user.bookingHistory || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

module.exports = router;
