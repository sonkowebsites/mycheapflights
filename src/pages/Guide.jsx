import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, CreditCard, Plane, Bell, ChevronRight, Star, BookOpen } from 'lucide-react';
import styles from './Guide.module.css';

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Search for Flights',
    color: 'var(--accent-cyan)',
    summary: 'Enter your travel details and instantly compare hundreds of airlines',
    content: [
      {
        heading: 'Go to the Search Form',
        text: 'On the MyCheapFlights homepage, you\'ll find our powerful search form. It\'s the heart of the platform — designed to be fast and intuitive.',
      },
      {
        heading: 'Choose Your Trip Type',
        text: 'Select One Way, Round Trip, or Multi-City depending on your travel plans. Round trips often offer better value per leg.',
      },
      {
        heading: 'Enter Origin & Destination',
        text: 'Start typing a city name or airport code (e.g., "New York" or "JFK") and select from the dropdown. We support 10,000+ airports worldwide — including Entebbe (EBB), Uganda.',
      },
      {
        heading: 'Select Your Dates',
        text: 'Choose your departure date. For round trips, also pick a return date. Pro tip: Try ±3 days around your preferred date — flights mid-week are often cheaper.',
      },
      {
        heading: 'Set Passengers & Cabin Class',
        text: 'Specify the number of passengers (up to 9) and select Economy, Premium Economy, Business, or First Class. Prices update automatically.',
      },
      {
        heading: 'Click Search',
        text: 'Hit the "Search Flights" button and we\'ll scan 800+ sources in real time. Results typically appear in 1–3 seconds.',
      },
    ],
    tips: [
      'Enable price alerts before you search to catch deals automatically',
      'Being flexible with dates by even 1 day can save 20–40%',
      'Nearby airports (e.g., JFK vs EWR vs LGA for New York) can have price differences',
    ],
  },
  {
    number: '02',
    icon: CheckCircle2,
    title: 'Compare & Filter Results',
    color: 'var(--accent-blue)',
    summary: 'Use smart filters to find the perfect balance of price, comfort, and convenience',
    content: [
      {
        heading: 'Understanding the Results',
        text: 'Flights are displayed sorted by price (cheapest first) by default. Each card shows the airline, flight number, departure/arrival times, total duration, number of stops, and total price.',
      },
      {
        heading: 'Use the Filter Sidebar',
        text: 'On the left sidebar (or tap "Filters" on mobile), you can narrow results by: Maximum price (drag slider), Number of stops (nonstop, 1 stop, any), Specific airlines, and Departure time window.',
      },
      {
        heading: 'Change Sort Order',
        text: 'Use the sort chips to re-order by: Cheapest First, Shortest Flight, Fewest Stops, or Best Rated. Find the right balance for your priorities.',
      },
      {
        heading: 'Expand Flight Details',
        text: 'Click "View Details" on any flight to see: Full baggage allowance, Cabin amenities (Wi-Fi, meals, entertainment), CO₂ emissions, Airline rating, Refundability status, and Price breakdown.',
      },
      {
        heading: 'Check the Urgency Indicator',
        text: 'If a flight shows "Only X seats left!", that price may disappear soon. Act quickly if you see a great deal with limited availability.',
      },
    ],
    tips: [
      '"Nonstop" flights cost more but save hours — worth it for long-haul trips',
      'Refundable fares give peace of mind if your plans might change',
      'Business class deals sometimes appear cheaper than expected — always check!',
    ],
  },
  {
    number: '03',
    icon: Bell,
    title: 'Set a Price Alert (Optional)',
    color: 'var(--accent-violet)',
    summary: 'Let our AI watch prices 24/7 and notify you when fares drop to your target',
    content: [
      {
        heading: 'Why Set an Alert?',
        text: 'Flight prices change hundreds of times per day. Price alerts let you set a target price, and we\'ll monitor it round-the-clock and notify you the moment fares drop — so you don\'t have to keep checking.',
      },
      {
        heading: 'How to Set an Alert',
        text: 'Sign in to your account, then on the search results page, click the bell icon on any flight or use the "Set Price Alert" button. Enter your target price (or use our AI-suggested fair price).',
      },
      {
        heading: 'Receive Notifications',
        text: 'Choose to receive alerts via email, SMS, or push notifications. We\'ll also send weekly price trend summaries for your saved routes.',
      },
    ],
    tips: [
      'Set your alert price 15–20% below the current fare for realistic savings',
      'Enable push notifications on the MyCheapFlights app for instant alerts',
      'Alerts work best when set 6–8 weeks before your travel date',
    ],
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Select & Book Your Flight',
    color: 'var(--accent-green)',
    summary: 'Complete your booking securely through the airline or travel agency',
    content: [
      {
        heading: 'Select Your Flight',
        text: 'When you\'ve found the perfect flight, click "Select Flight". A confirmation modal will appear summarizing the flight details and total price.',
      },
      {
        heading: 'Proceed to Booking',
        text: 'Click "Book Now" and you\'ll be redirected to the airline\'s or travel agency\'s secure checkout page. MyCheapFlights does not process payments — all transactions happen directly with the provider.',
      },
      {
        heading: 'Fill in Passenger Details',
        text: 'You\'ll need: Full name (exactly as on passport/ID), Date of birth, Passport number and expiry (for international flights), Contact email and phone number.',
      },
      {
        heading: 'Choose Add-ons',
        text: 'You may be offered seat selection, extra baggage, travel insurance, and in-flight meals. Add what you need, but don\'t feel pressured — many add-ons can be added later.',
      },
      {
        heading: 'Complete Payment',
        text: 'Enter your payment details on the airline\'s secure checkout. Double-check the total before confirming. You\'ll receive a booking confirmation email with your e-ticket and booking reference.',
      },
    ],
    tips: [
      'Always double-check your name spelling — it must match your travel document exactly',
      'Screenshot your booking confirmation immediately',
      'Add your booking reference to your account for easy access in the MyCheapFlights app',
      'Purchase travel insurance — it\'s usually worth it for international trips',
    ],
  },
  {
    number: '05',
    icon: Plane,
    title: 'Prepare for Your Trip',
    color: 'var(--accent-gold)',
    summary: 'Make sure everything is in order before your departure day',
    content: [
      {
        heading: 'Check-in Online',
        text: 'Most airlines open online check-in 24–48 hours before departure. Check in early to get your preferred seat and avoid long airport queues.',
      },
      {
        heading: 'Verify Entry Requirements',
        text: 'Check visa requirements for your destination. US citizens visiting Uganda need a tourist visa (available on arrival or e-visa). Ugandan citizens visiting the US need a B-2 visitor visa — apply well in advance.',
      },
      {
        heading: 'Arrive Early',
        text: 'For domestic flights: arrive 1.5–2 hours early. For international flights: arrive 3 hours early. Factor in traffic, parking, security queues, and gate distance.',
      },
      {
        heading: 'What to Bring',
        text: 'Valid passport (6 months validity beyond travel dates), printed/digital boarding pass, payment card used to purchase (some airlines check this), and any visas or travel documents.',
      },
    ],
    tips: [
      'Download the airline\'s app for real-time flight status updates',
      'Charge all devices before arriving at the airport',
      'Pack a carry-on with essentials in case checked luggage is delayed',
      'Arrive at the gate at least 45 minutes before departure — gates can close early!',
    ],
  },
];

export default function Guide() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className="badge badge-gold">
            <BookOpen size={12} /> Booking Guide
          </span>
          <h1 className={`section-title ${styles.heroTitle}`}>
            How to Book a Flight <span className="gradient-text">Step by Step</span>
          </h1>
          <p className={`section-subtitle ${styles.heroSub}`}>
            Everything you need to know — from searching to boarding. Follow this guide and fly smarter.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Progress steps */}
        <div className={styles.stepsNav}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              className={`${styles.stepNavBtn} ${activeStep === i ? styles.active : ''} ${i < activeStep ? styles.done : ''}`}
              onClick={() => setActiveStep(i)}
            >
              <div className={styles.stepNavNum} style={{ '--color': s.color }}>
                {i < activeStep ? <CheckCircle2 size={16} /> : s.number}
              </div>
              <span className={styles.stepNavLabel}>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className={styles.stepContent} key={activeStep}>
          <div className={styles.stepHeader}>
            <div className={styles.stepIconWrap} style={{ '--color': step.color }}>
              <step.icon size={28} />
            </div>
            <div>
              <p className={styles.stepNum}>{step.number}</p>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepSummary}>{step.summary}</p>
            </div>
          </div>

          <div className={styles.stepBody}>
            {/* Instructions */}
            <div className={styles.instructionsCol}>
              <h3 className={styles.colTitle}>Step-by-Step Instructions</h3>
              <div className={styles.instructionList}>
                {step.content.map((item, i) => (
                  <div key={i} className={styles.instruction}>
                    <div className={styles.instructionDot} style={{ '--color': step.color }}>
                      <span>{i + 1}</span>
                    </div>
                    <div>
                      <h4 className={styles.instructionHeading}>{item.heading}</h4>
                      <p className={styles.instructionText}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className={styles.tipsCol}>
              <div className={styles.tipsCard}>
                <div className={styles.tipsHeader}>
                  <Star size={16} />
                  <h3>Pro Tips</h3>
                </div>
                <ul className={styles.tipsList}>
                  {step.tips.map((tip, i) => (
                    <li key={i} className={styles.tip}>
                      <ChevronRight size={14} style={{ color: step.color, flexShrink: 0 }} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeStep === 0 && (
                <div className={styles.ctaMiniCard}>
                  <p className={styles.ctaMiniTitle}>Ready to search?</p>
                  <p className={styles.ctaMiniText}>Our form is pre-loaded and ready to go.</p>
                  <Link to="/" className="btn-primary" style={{ justifyContent: 'center' }}>
                    Search Flights Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className={styles.stepNav}>
            <button
              className="btn-secondary"
              onClick={() => setActiveStep(v => Math.max(0, v - 1))}
              disabled={activeStep === 0}
            >
              ← Previous Step
            </button>
            <div className={styles.stepDots}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${activeStep === i ? styles.activeDot : ''}`}
                  onClick={() => setActiveStep(i)}
                />
              ))}
            </div>
            {activeStep < STEPS.length - 1 ? (
              <button className="btn-primary" onClick={() => setActiveStep(v => v + 1)}>
                Next Step →
              </button>
            ) : (
              <Link to="/search" className="btn-primary">
                Start Booking <Plane size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* FAQ link */}
        <div className={styles.faqLink}>
          <p>Have more questions?</p>
          <Link to="/faq" className="btn-secondary">View Full FAQ <ChevronRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
