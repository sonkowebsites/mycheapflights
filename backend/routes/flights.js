const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const flightService = require('../services/flightService');

// ─────────────────────────────────────────────────
// POST /api/flights/search
// ─────────────────────────────────────────────────
router.post('/search', optionalAuth, async (req, res) => {
  try {
    const {
      origin, destination, departDate, returnDate,
      passengers = 1, cabinClass = 'economy', tripType = 'roundtrip',
    } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }
    if (!departDate) {
      return res.status(400).json({ message: 'Departure date is required' });
    }
    if (new Date(departDate) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: 'Departure date cannot be in the past' });
    }

    const results = await flightService.searchFlights({
      origin, destination, departDate, returnDate,
      passengers: Math.min(9, Math.max(1, parseInt(passengers))),
      cabinClass, tripType,
    });

    // Optionally log search for authenticated users
    if (req.user) {
      flightService.logSearch(req.user.id, { origin, destination, departDate });
    }

    res.json({
      ...results,
      searchParams: { origin, destination, departDate, returnDate, passengers, cabinClass, tripType },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Flights] Search error:', err);
    res.status(500).json({ message: 'Flight search failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────
// GET /api/flights/popular-routes
// ─────────────────────────────────────────────────
router.get('/popular-routes', async (req, res) => {
  try {
    const routes = await flightService.getPopularRoutes();
    res.json({ routes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular routes' });
  }
});

// ─────────────────────────────────────────────────
// GET /api/flights/airports?q=search
// ─────────────────────────────────────────────────
router.get('/airports', (req, res) => {
  try {
    const { q = '' } = req.query;
    if (q.length < 2) return res.json({ airports: [] });

    const results = flightService.searchAirports(q);
    res.json({ airports: results });
  } catch (err) {
    res.status(500).json({ message: 'Airport search failed' });
  }
});

// ─────────────────────────────────────────────────
// GET /api/flights/:flightId
// ─────────────────────────────────────────────────
router.get('/:flightId', async (req, res) => {
  try {
    const details = await flightService.getFlightDetails(req.params.flightId);
    if (!details) return res.status(404).json({ message: 'Flight not found' });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flight details' });
  }
});

// ─────────────────────────────────────────────────
// POST /api/flights/price-check
// ─────────────────────────────────────────────────
router.post('/price-check', async (req, res) => {
  try {
    const { origin, destination, departDate } = req.body;
    const priceData = await flightService.getPriceTrend({ origin, destination, departDate });
    res.json(priceData);
  } catch (err) {
    res.status(500).json({ message: 'Price check failed' });
  }
});

module.exports = router;
