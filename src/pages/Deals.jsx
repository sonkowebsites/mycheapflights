import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Clock, Zap, Globe, Star, Bell, ChevronRight, Flame } from 'lucide-react';
import styles from './Deals.module.css';

const DEAL_CATEGORIES = [
  { id: 'all', label: 'All Deals' },
  { id: 'flash', label: '⚡ Flash Sales' },
  { id: 'international', label: '🌍 International' },
  { id: 'domestic', label: '🇺🇸 US Domestic' },
  { id: 'africa', label: '🌍 Africa Routes' },
];

const DEALS = [
  {
    id: 1, category: 'flash',
    from: 'New York', fromCode: 'JFK',
    to: 'London', toCode: 'LHR',
    airline: 'British Airways', price: 387, originalPrice: 642,
    savings: 255, savingsPct: 40,
    validUntil: '2025-08-15', departDate: '2025-09-12',
    stops: 0, duration: '7h 15m', cabinClass: 'economy',
    tag: 'Flash Sale', tagColor: 'var(--accent-coral)',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80',
  },
  {
    id: 2, category: 'africa',
    from: 'New York', fromCode: 'JFK',
    to: 'Entebbe', toCode: 'EBB',
    airline: 'Ethiopian Airlines', price: 849, originalPrice: 1230,
    savings: 381, savingsPct: 31,
    validUntil: '2025-08-20', departDate: '2025-10-01',
    stops: 1, duration: '18h 45m', cabinClass: 'economy',
    tag: 'Bootcamp Special', tagColor: 'var(--accent-violet)',
    image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=500&q=80',
  },
  {
    id: 3, category: 'international',
    from: 'Los Angeles', fromCode: 'LAX',
    to: 'Tokyo', toCode: 'NRT',
    airline: 'Japan Airlines', price: 498, originalPrice: 820,
    savings: 322, savingsPct: 39,
    validUntil: '2025-08-25', departDate: '2025-11-05',
    stops: 0, duration: '11h 30m', cabinClass: 'economy',
    tag: 'Hot Deal', tagColor: 'var(--accent-gold)',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80',
  },
  {
    id: 4, category: 'domestic',
    from: 'Chicago', fromCode: 'ORD',
    to: 'Miami', toCode: 'MIA',
    airline: 'Delta Air Lines', price: 89, originalPrice: 189,
    savings: 100, savingsPct: 53,
    validUntil: '2025-08-10', departDate: '2025-09-20',
    stops: 0, duration: '2h 50m', cabinClass: 'economy',
    tag: 'Flash Sale', tagColor: 'var(--accent-coral)',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&q=80',
  },
  {
    id: 5, category: 'international',
    from: 'Atlanta', fromCode: 'ATL',
    to: 'Dubai', toCode: 'DXB',
    airline: 'Emirates', price: 579, originalPrice: 980,
    savings: 401, savingsPct: 41,
    validUntil: '2025-09-01', departDate: '2025-10-15',
    stops: 0, duration: '13h 20m', cabinClass: 'economy',
    tag: 'Limited Seats', tagColor: 'var(--accent-coral)',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80',
  },
  {
    id: 6, category: 'africa',
    from: 'Washington DC', fromCode: 'IAD',
    to: 'Nairobi', toCode: 'NBO',
    airline: 'Kenya Airways', price: 698, originalPrice: 1050,
    savings: 352, savingsPct: 34,
    validUntil: '2025-08-30', departDate: '2025-10-08',
    stops: 1, duration: '17h 20m', cabinClass: 'economy',
    tag: 'Weekend Escape', tagColor: 'var(--accent-green)',
    image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=500&q=80',
  },
  {
    id: 7, category: 'domestic',
    from: 'San Francisco', fromCode: 'SFO',
    to: 'New York', toCode: 'JFK',
    airline: 'United Airlines', price: 119, originalPrice: 287,
    savings: 168, savingsPct: 59,
    validUntil: '2025-08-12', departDate: '2025-09-14',
    stops: 0, duration: '5h 20m', cabinClass: 'economy',
    tag: 'Flash Sale', tagColor: 'var(--accent-coral)',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80',
  },
  {
    id: 8, category: 'international',
    from: 'New York', fromCode: 'JFK',
    to: 'Singapore', toCode: 'SIN',
    airline: 'Singapore Airlines', price: 720, originalPrice: 1280,
    savings: 560, savingsPct: 44,
    validUntil: '2025-09-05', departDate: '2025-11-20',
    stops: 0, duration: '18h 45m', cabinClass: 'economy',
    tag: 'Best Rated Airline', tagColor: 'var(--accent-cyan)',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&q=80',
  },
];

function CountdownTimer({ validUntil }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(validUntil) - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`);
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [validUntil]);

  return (
    <div className={styles.countdown}>
      <Clock size={12} />
      <span>{timeLeft}</span>
    </div>
  );
}

export default function Deals() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('savings');

  const filtered = DEALS
    .filter(d => activeCategory === 'all' || d.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'savings') return b.savingsPct - a.savingsPct;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>
            <Flame size={14} />
            <span>Live Flight Deals</span>
          </div>
          <h1 className={`section-title ${styles.heroTitle}`}>
            Today's Best <span className="gradient-text">Flight Deals</span>
          </h1>
          <p className={`section-subtitle ${styles.heroSub}`}>
            Hand-picked fares updated daily. Save up to 60% on flights worldwide. Don't miss out!
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>{DEALS.length}</strong> active deals
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <strong>Up to 59%</strong> off
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              Updated <strong>daily</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.categories}>
            {DEAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className={styles.sortWrap}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="savings">Biggest Savings</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>

        {/* Deals grid */}
        <div className={styles.dealsGrid}>
          {filtered.map((deal, i) => (
            <Link
              key={deal.id}
              to={`/search?origin=${deal.fromCode}&originCity=${deal.from}&destination=${deal.toCode}&destCity=${deal.to}`}
              className={styles.dealCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Image */}
              <div className={styles.dealImgWrap}>
                <img src={deal.image} alt={deal.to} className={styles.dealImg} loading="lazy" />
                <div className={styles.dealImgOverlay} />
                <div
                  className={styles.dealTag}
                  style={{ background: deal.tagColor }}
                >
                  {deal.tag}
                </div>
                <div className={styles.dealSavings}>
                  <TrendingDown size={12} />
                  Save {deal.savingsPct}%
                </div>
              </div>

              {/* Content */}
              <div className={styles.dealContent}>
                <div className={styles.dealRoute}>
                  <div>
                    <p className={styles.dealCity}>{deal.from}</p>
                    <p className={styles.dealCode}>{deal.fromCode}</p>
                  </div>
                  <div className={styles.dealArrow}>
                    <div className={styles.dealLine} />
                    <ChevronRight size={14} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className={styles.dealCity}>{deal.to}</p>
                    <p className={styles.dealCode}>{deal.toCode}</p>
                  </div>
                </div>

                <div className={styles.dealMeta}>
                  <span>{deal.airline}</span>
                  <span>·</span>
                  <span>{deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop`}</span>
                  <span>·</span>
                  <span>{deal.duration}</span>
                </div>

                <div className={styles.dealPriceRow}>
                  <div>
                    <div className={styles.dealOrigPrice}>${deal.originalPrice}</div>
                    <div className={styles.dealPrice}>${deal.price}</div>
                    <div className={styles.dealSave}>Save ${deal.savings}</div>
                  </div>
                  <CountdownTimer validUntil={deal.validUntil} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Alert CTA */}
        <div className={styles.alertCTA}>
          <div className={styles.alertCTAInner}>
            <div className={styles.alertIcon}><Bell size={28} /></div>
            <div>
              <h3 className={styles.alertTitle}>Never miss a deal again</h3>
              <p className={styles.alertText}>
                Set price alerts for your favorite routes and get notified the moment fares drop.
              </p>
            </div>
            <Link to="/register" className="btn-primary">
              Set Price Alerts <Bell size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
