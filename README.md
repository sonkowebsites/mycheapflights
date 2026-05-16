# ✈ MyCheapFlights
### World-Class Flight Search PWA
**USA–Uganda Science & Technology Bootcamp 2025**

> Built to demonstrate cutting-edge full-stack web development — a production-grade Progressive Web Application for searching the cheapest flights across all airlines worldwide.

---

## 🌍 Overview

MyCheapFlights is a complete, installable PWA that lets users search, compare, and book the cheapest flights across 800+ airlines in real time. It features an AI-powered chat assistant (SkyBot), dark/light/semi-transparent themes, price drop alerts, full authentication, and a beautiful animated UI.

**Live Demo:** [https://mycheapflights.app](https://mycheapflights.app) *(deploy to activate)*

---

## ✨ Features

### Frontend
- 🔍 **Real-time Flight Search** — 800+ airlines, 10,000+ airports
- 🌙 **Dark / Light / Semi-transparent themes** — system-preference aware
- 🤖 **SkyBot AI Assistant** — powered by Claude (Anthropic) for 24/7 travel help
- 💰 **Flight Deals Page** — curated deals with live countdown timers
- 📖 **Booking Guide** — step-by-step 5-stage interactive tutorial
- ❓ **FAQ Page** — searchable, categorized accordion FAQ
- 🔔 **Price Drop Alerts** — set target prices, get notified when fares drop
- 📱 **PWA** — installable, offline-capable, push notifications
- 🎨 **Stunning UI** — Syne + DM Sans + Space Mono fonts, animated stars, floating planes, glass morphism
- 📊 **Advanced Filters** — price range, stops, airlines, departure time, cabin class

### Authentication
- 📧 Sign up / login with **email**
- 📱 Sign up / login with **phone number**
- 🔵 **Continue with Google** (OAuth 2.0)
- 🔒 JWT token-based sessions (7-day expiry)
- Password visibility toggle, form validation, forgot password

### Backend API
- 🛡️ **Helmet.js** security headers
- 🚦 **Rate limiting** (per-route, configurable)
- 🔐 **JWT authentication** middleware
- ✈️ **Amadeus API** integration (with mock fallback)
- 👤 User management (CRUD, preferences)
- 🔔 Price alert management
- 📝 Search history logging

---

## 🗂️ Project Structure

```
mycheapflights/
├── public/
│   ├── index.html              # PWA entry point
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── icons/                  # App icons + favicon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive nav with theme toggle
│   │   ├── Navbar.module.css
│   │   ├── SearchForm.jsx      # Flight search form
│   │   ├── SearchForm.module.css
│   │   ├── FlightCard.jsx      # Individual flight result card
│   │   ├── FlightCard.module.css
│   │   ├── ChatBot.jsx         # AI SkyBot chat widget
│   │   └── ChatBot.module.css
│   ├── context/
│   │   ├── ThemeContext.jsx    # Dark/light theme state
│   │   └── AuthContext.jsx     # User auth state
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero
│   │   ├── Home.module.css
│   │   ├── SearchResults.jsx   # Flight results + filters
│   │   ├── SearchResults.module.css
│   │   ├── AuthPage.jsx        # Login + Register
│   │   ├── AuthPage.module.css
│   │   ├── Deals.jsx           # Flight deals page
│   │   ├── Deals.module.css
│   │   ├── FAQ.jsx             # FAQ accordion
│   │   ├── FAQ.module.css
│   │   ├── Guide.jsx           # Booking guide
│   │   └── Guide.module.css
│   ├── services/
│   │   └── flightService.js    # Frontend API service layer
│   ├── styles/
│   │   └── globals.css         # Design system tokens + animations
│   ├── App.jsx                 # Router + providers
│   └── main.jsx                # Entry point + SW registration
├── backend/
│   ├── server.js               # Express server
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   └── User.js             # User store (in-memory / MongoDB)
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── flights.js          # /api/flights/*
│   │   ├── users.js            # /api/users/*
│   │   └── alerts.js           # /api/alerts/*
│   └── services/
│       └── flightService.js    # Amadeus API + mock data
├── .env.example                # Environment variables template
├── package.json
└── vite.config.js              # Vite + PWA config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install Dependencies
```bash
cd mycheapflights
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Development (Frontend + Backend)
```bash
npm run dev:all
```

Or separately:
```bash
# Terminal 1 – Frontend (Vite on port 5173)
npm run dev

# Terminal 2 – Backend (Express on port 3001)
npm run server
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🏗️ Production Build

```bash
npm run build
NODE_ENV=production npm run server
```

The Express server serves the built files from `/dist`.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email/phone |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth required) |
| PATCH | `/api/auth/profile` | Update profile (auth required) |
| POST | `/api/auth/change-password` | Change password (auth required) |
| POST | `/api/auth/forgot-password` | Send reset link |
| GET | `/api/auth/google` | Google OAuth redirect |

### Flights
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/flights/search` | Search flights |
| GET | `/api/flights/popular-routes` | Get popular routes |
| GET | `/api/flights/airports?q=` | Airport autocomplete |
| POST | `/api/flights/price-check` | Price trend data |

### Users (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Current user |
| PATCH | `/api/users/preferences` | Update preferences |
| GET/POST | `/api/users/saved-searches` | Saved searches |
| GET | `/api/users/bookings` | Booking history |

### Alerts (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/alerts` | Create price alert |
| GET | `/api/alerts` | List alerts |
| DELETE | `/api/alerts/:id` | Delete alert |
| PATCH | `/api/alerts/:id/toggle` | Pause/resume alert |

---

## 🔑 Third-Party API Setup

### Amadeus (Real Flight Data)
1. Sign up at [developers.amadeus.com](https://developers.amadeus.com/)
2. Create an app and copy credentials
3. Add to `.env`:
   ```
   AMADEUS_CLIENT_ID=your_id
   AMADEUS_CLIENT_SECRET=your_secret
   ```

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
4. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### AI Chat (Anthropic)
The SkyBot AI chatbot calls the Anthropic API directly from the browser. The API key is handled automatically in the claude.ai environment. For standalone deployment, add your Anthropic API key handling to the backend proxy.

---

## 📱 PWA Installation

### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon (⊕) in the address bar
3. Click "Install"

### On Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### On Mobile (Android)
1. Open in Chrome
2. Tap the browser menu (⋮)
3. Select "Add to Home Screen" or "Install App"

---

## 🎨 Design System

### Fonts
- **Display / Headings:** Syne (800 weight) — bold, modern, geometric
- **Body:** DM Sans (300–500 weight) — clean, readable
- **Mono / Labels:** Space Mono — technical, data displays

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--accent-cyan` | `#00d4ff` | Primary CTA, links |
| `--accent-blue` | `#0066ff` | Gradient midpoint |
| `--accent-violet` | `#7b2fff` | Secondary accent |
| `--accent-green` | `#00ffaa` | Success, nonstop |
| `--accent-gold` | `#ffc947` | Savings, ratings |
| `--accent-coral` | `#ff6b6b` | Urgency, errors |

### Theme Variables
All colors, backgrounds, and borders use CSS custom properties that switch automatically between dark and light modes.

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```
Add environment variables in the Vercel dashboard.

### Railway (Full Stack)
1. Connect your GitHub repo to Railway
2. Add a service for the Node.js backend
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "backend/server.js"]
```

---

## 🤝 USA–Uganda Science & Tech Bootcamp

This project was built as part of the **USA–Uganda Science & Technology Bootcamp 2025**, a collaboration between American and Ugandan technologists to advance digital skills and innovation in East Africa.

**Key learning objectives demonstrated:**
- Progressive Web Application (PWA) development
- React.js with hooks, context, and lazy loading
- Node.js/Express REST API design
- JWT authentication and security best practices
- Third-party API integration (Amadeus, Google OAuth, Anthropic)
- CSS custom properties and design systems
- Responsive mobile-first design
- Git version control and project structure

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Built with ♥ for the USA–Uganda Science & Tech Bootcamp 2025*
*Powered by React, Node.js, Vite, and Claude AI*
