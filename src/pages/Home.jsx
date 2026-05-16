import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, TrendingDown, Bell, ChevronRight, Star, Plane, Award } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { flightService } from '../services/flightService';
import styles from './Home.module.css';

// Animated background stars
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }));

  return (
    <div className={styles.starsLayer} aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className={styles.star}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated plane trail
function PlaneTrail() {
  return (
    <div className={styles.planeTrail} aria-hidden="true">
      <div className={styles.flyingPlane}>✈</div>
    </div>
  );
}

const STATS = [
  { value: '500M+', label: 'Flights Searched' },
  { value: '180+', label: 'Countries Covered' },
  { value: '800+', label: 'Airlines Compared' },
  { value: '$284', label: 'Average Savings' },
];

const FEATURES = [
  {
    icon: TrendingDown,
    title: 'Lowest Price Guarantee',
    desc: 'We scan all airlines, aggregators, and deals in real time so you always get the absolute best price.',
    color: 'var(--accent-cyan)',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'Search flights to 180+ countries, 10,000+ airports, and 800+ airlines worldwide.',
    color: 'var(--accent-blue)',
  },
  {
    icon: Bell,
    title: 'Price Drop Alerts',
    desc: 'Set your target price and get instant notifications when fares drop — never miss a deal.',
    color: 'var(--accent-violet)',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    desc: 'Your data is encrypted end-to-end. We never share your information with third parties.',
    color: 'var(--accent-green)',
  },
];

const DESTINATIONS = [
  {
    city: 'Entebbe', country: 'Uganda', image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=400&q=80',
    tag: 'USA-Uganda Bootcamp', price: 894
  },
  {
    city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
    tag: 'Hot Deal', price: 613
  },
  {
    city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    tag: 'Trending', price: 542
  },
  {
    city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
    tag: 'Weekend Deal', price: 387
  },
  {
    city: 'Nairobi', country: 'Kenya', image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=400&q=80',
    tag: 'African Explorer', price: 721
  },
  {
    city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
    tag: 'Most Popular', price: 289
  },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Frequent Traveler', rating: 5, text: 'MyCheapFlights saved me over $400 on my New York to London trip. The price alerts feature is a game changer!', avatar: '👩🏾' },
  { name: 'David O.', role: 'Tech Bootcamp Student', rating: 5, text: 'As a bootcamp participant flying between Uganda and the US, this platform has been incredibly helpful and easy to use!', avatar: '👨🏿' },
  { name: 'Emma R.', role: 'Business Traveler', rating: 5, text: 'The AI chatbot helped me choose the best flight class for my budget. Absolutely world-class service!', avatar: '👩🏼' },
];

export default function Home() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    flightService.getPopularRoutes().then(setPopularRoutes);
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero Section ── */}
      <section className={styles.hero} ref={heroRef}>
        <Stars />
        <PlaneTrail />

        {/* Gradient blobs */}
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />

        {/* Hero content */}
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Award size={14} />
            <span>Official USA–Uganda Science &amp; Tech Bootcamp Platform</span>
          </div>

          <h1 className={styles.heroTitle}>
            Fly Anywhere,<br />
            <span className="gradient-text">Pay Less.</span>
          </h1>

          <p className={styles.heroSub}>
            Search hundreds of airlines at once. Find the cheapest flights to anywhere on Earth — in seconds.
          </p>

          {/* Stats */}
          <div className={styles.statsRow}>
            {STATS.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search form */}
          <div className={styles.searchWrap}>
            <SearchForm />
          </div>
        </div>

        {/* Hero images strip */}
        <div className={styles.imageStrip} aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80" alt="Airplane wing" className={styles.stripImg} />
          <img src="https://images.unsplash.com/photo-1507812984078-917a274065be?w=600&q=80" alt="Airport terminal" className={styles.stripImg} />
          <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80" alt="Travel destinations" className={styles.stripImg} />
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ── Destination Cards ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-cyan"><Plane size={12} /> Popular Routes</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              Top Flight <span className="gradient-text">Destinations</span>
            </h2>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              Discover the world's most sought-after routes with unbeatable fares curated just for you.
            </p>
          </div>

          <div className={styles.destGrid}>
            {DESTINATIONS.map((dest, i) => (
              <Link
                key={dest.city}
                to={`/search?destCity=${dest.city}&destination=${dest.city}`}
                className={styles.destCard}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.destImgWrap}>
                  <img src={dest.image} alt={dest.city} className={styles.destImg} loading="lazy" />
                  <div className={styles.destOverlay} />
                </div>
                <div className={styles.destInfo}>
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{dest.tag}</span>
                  <h3 className={styles.destCity}>{dest.city}</h3>
                  <p className={styles.destCountry}>{dest.country}</p>
                  <p className={styles.destPrice}>From <strong>${dest.price}</strong></p>
                </div>
                <div className={styles.destArrow}><ChevronRight size={18} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`${styles.section} ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge badge-green"><Star size={12} /> Why MyCheapFlights</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              World-Class <span className="gradient-text">Travel Tech</span>
            </h2>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feat, i) => (
              <div key={feat.title} className={`${styles.featureCard} card`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.featureIcon} style={{ '--color': feat.color }}>
                  <feat.icon size={24} />
                </div>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">
              Book Your Flight in <span className="gradient-text">3 Steps</span>
            </h2>
          </div>

          <div className={styles.stepsRow}>
            {[
              { n: '01', title: 'Search', desc: 'Enter your origin, destination, and travel dates. We instantly scan 800+ airlines.' },
              { n: '02', title: 'Compare', desc: 'Browse results filtered by price, stops, duration, and airline rating.' },
              { n: '03', title: 'Book', desc: 'Select your flight and complete your secure booking in under 60 seconds.' },
            ].map((step, i) => (
              <div key={step.n} className={styles.step}>
                <div className={styles.stepNum}>{step.n}</div>
                {i < 2 && <div className={styles.stepLine} />}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.stepsCTA}>
            <Link to="/guide" className="btn-secondary">
              Full Booking Guide <ChevronRight size={16} />
            </Link>
            <Link to="/search" className="btn-primary">
              Start Searching <Plane size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={`${styles.section} ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">
              Loved by <span className="gradient-text">Travelers</span>
            </h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={`${styles.testimonialCard} card`}>
                <div className={styles.stars}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  ))}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialAvatar}>{t.avatar}</span>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaBlob} aria-hidden="true" />
            <h2 className={styles.ctaTitle}>Ready to save on your next flight?</h2>
            <p className={styles.ctaSubtitle}>Join millions of smart travelers who use MyCheapFlights every day.</p>
            <div className={styles.ctaBtns}>
              <Link to="/register" className="btn-primary">Create Free Account</Link>
              <Link to="/search" className="btn-secondary">Search Flights</Link>
            </div>
            <p className={styles.ctaNote}>✓ Free to use · ✓ No hidden fees · ✓ Secure booking</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerBrand}>MyCheapFlights ✈</p>
              <p className={styles.footerTagline}>The world's smartest flight search engine.</p>
              <p className={styles.footerBootcamp}>🇺🇸🤝🇺🇬 USA–Uganda Science &amp; Tech Bootcamp</p>
            </div>
            <div>
              <p className={styles.footerHeading}>Platform</p>
              <ul className={styles.footerLinks}>
                <li><Link to="/search">Search Flights</Link></li>
                <li><Link to="/deals">Flight Deals</Link></li>
                <li><Link to="/guide">Booking Guide</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className={styles.footerHeading}>Account</p>
              <ul className={styles.footerLinks}>
                <li><Link to="/register">Sign Up</Link></li>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/bookings">My Bookings</Link></li>
              </ul>
            </div>
            <div>
              <p className={styles.footerHeading}>Legal</p>
              <ul className={styles.footerLinks}>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2025 MyCheapFlights. All rights reserved.</p>
            <p className={styles.footerBuilt}>Built with ♥ for the USA–Uganda Science & Tech Bootcamp</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
