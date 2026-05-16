const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// In-memory alert store (replace with DB in production)
const alerts = new Map();

// POST /api/alerts  — create price alert
router.post('/', authenticate, async (req, res) => {
  try {
    const { origin, destination, departDate, targetPrice, email } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination required' });
    }
    if (!targetPrice || isNaN(targetPrice)) {
      return res.status(400).json({ message: 'Valid target price required' });
    }

    const alert = {
      id: `alert_${Date.now()}`,
      userId: req.user.id,
      origin,
      destination,
      departDate,
      targetPrice: parseFloat(targetPrice),
      notifyEmail: email || null,
      active: true,
      triggeredCount: 0,
      createdAt: new Date().toISOString(),
      lastChecked: null,
    };

    const userAlerts = alerts.get(req.user.id) || [];
    userAlerts.push(alert);
    alerts.set(req.user.id, userAlerts);

    res.status(201).json({ message: 'Price alert created successfully', alert });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// GET /api/alerts  — get user's alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const userAlerts = alerts.get(req.user.id) || [];
    res.json({ alerts: userAlerts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// DELETE /api/alerts/:alertId
router.delete('/:alertId', authenticate, async (req, res) => {
  try {
    const userAlerts = alerts.get(req.user.id) || [];
    const filtered = userAlerts.filter(a => a.id !== req.params.alertId);
    alerts.set(req.user.id, filtered);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

// PATCH /api/alerts/:alertId/toggle
router.patch('/:alertId/toggle', authenticate, async (req, res) => {
  try {
    const userAlerts = alerts.get(req.user.id) || [];
    const alert = userAlerts.find(a => a.id === req.params.alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.active = !alert.active;
    alerts.set(req.user.id, userAlerts);
    res.json({ message: `Alert ${alert.active ? 'activated' : 'paused'}`, alert });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle alert' });
  }
});

module.exports = router;
