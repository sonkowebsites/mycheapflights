import { useState } from 'react';
import { Clock, Users, Luggage, Star, Leaf, RefreshCw, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import styles from './FlightCard.module.css';

export default function FlightCard({ flight, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const stopLabel = flight.stops === 0 ? 'Nonstop' : flight.stops === 1 ? '1 Stop' : `${flight.stops} Stops`;
  const stopColor = flight.stops === 0 ? 'var(--accent-green)' : flight.stops === 1 ? 'var(--accent-gold)' : 'var(--accent-coral)';

  return (
    <div className={`${styles.card} card`}>
      {/* Cheap badge */}
      {flight.seatsLeft <= 3 && (
        <div className={styles.urgencyBadge}>
          <Zap size={12} />
          Only {flight.seatsLeft} seats left!
        </div>
      )}

      <div className={styles.main}>
        {/* Airline info */}
        <div className={styles.airline}>
          <div className={styles.airlineLogo}>{flight.logo}</div>
          <div>
            <p className={styles.airlineName}>{flight.airline}</p>
            <p className={styles.flightNum}>{flight.flightNumber}</p>
          </div>
        </div>

        {/* Route & time */}
        <div className={styles.route}>
          <div className={styles.timeBlock}>
            <p className={styles.time}>{flight.departTime}</p>
            <p className={styles.airport}>{flight.origin}</p>
          </div>

          <div className={styles.routeVisual}>
            <div className={styles.duration}>
              <Clock size={12} />
              {flight.duration}
            </div>
            <div className={styles.routeLine}>
              <div className={styles.dot} />
              <div className={styles.line} />
              {flight.stops > 0 && (
                <div className={styles.stopDot} title={flight.stopCity} />
              )}
              <div className={styles.line} />
              <div className={styles.dot} />
            </div>
            <p className={styles.stopLabel} style={{ color: stopColor }}>
              {stopLabel}
              {flight.stopCity && ` · via ${flight.stopCity}`}
            </p>
          </div>

          <div className={styles.timeBlock} style={{ textAlign: 'right' }}>
            <p className={styles.time}>{flight.arrivalTime}</p>
            <p className={styles.airport}>{flight.destination}</p>
          </div>
        </div>

        {/* Amenities preview */}
        <div className={styles.tags}>
          {flight.amenities.slice(0, 3).map(a => (
            <span key={a} className={`badge badge-cyan`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>{a}</span>
          ))}
          {flight.refundable && (
            <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
              <RefreshCw size={10} /> Refundable
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className={styles.priceSection}>
          <div className={styles.priceBlock}>
            <div className={styles.price}>${flight.price.toLocaleString()}</div>
            <div className={styles.priceNote}>
              {flight.pricePerPerson !== flight.price && `$${flight.pricePerPerson}/person · `}
              {flight.cabinClass.replace('_', ' ')}
            </div>
            <div className={styles.rating}>
              <Star size={12} fill="currentColor" />
              {flight.rating}
            </div>
          </div>
          <div className={styles.ctaCol}>
            <button className="btn-primary" onClick={() => onSelect(flight)}>
              Select Flight
            </button>
            <button
              className={styles.detailsBtn}
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Hide details' : 'View details'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={styles.details}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <Luggage size={15} />
              <div>
                <p className={styles.detailLabel}>Baggage</p>
                <p className={styles.detailVal}>{flight.baggage}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Users size={15} />
              <div>
                <p className={styles.detailLabel}>Cabin</p>
                <p className={styles.detailVal}>{flight.cabinClass.replace('_', ' ')}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Leaf size={15} />
              <div>
                <p className={styles.detailLabel}>CO₂ Emissions</p>
                <p className={styles.detailVal}>{flight.co2} kg</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Star size={15} />
              <div>
                <p className={styles.detailLabel}>Airline Rating</p>
                <p className={styles.detailVal}>{flight.rating} / 5.0</p>
              </div>
            </div>
          </div>

          <div className={styles.amenitiesAll}>
            <p className={styles.detailLabel} style={{ marginBottom: 8 }}>All Amenities</p>
            <div className={styles.amenityList}>
              {flight.amenities.map(a => (
                <span key={a} className="badge badge-cyan">{a}</span>
              ))}
            </div>
          </div>

          <div className={styles.priceBreakdown}>
            <p className={styles.detailLabel}>Price Breakdown</p>
            <div className={styles.priceRows}>
              <div className={styles.priceRow}>
                <span>Base fare × {Math.round(flight.price / flight.pricePerPerson)} passenger(s)</span>
                <span>${(flight.pricePerPerson * Math.round(flight.price / flight.pricePerPerson) * 0.82).toFixed(0)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Taxes & fees</span>
                <span>${(flight.price * 0.18).toFixed(0)}</span>
              </div>
              <div className={`${styles.priceRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${flight.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
