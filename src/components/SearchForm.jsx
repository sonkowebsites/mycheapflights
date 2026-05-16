import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeftRight, Users, ChevronDown, Calendar, MapPin, Plane } from 'lucide-react';
import { AIRPORTS } from '../services/flightService';
import styles from './SearchForm.module.css';

const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

function AirportInput({ value, onChange, placeholder, label, icon: Icon }) {
  const [query, setQuery] = useState(value?.city || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    const filtered = AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(q.toLowerCase()) ||
      a.code.toLowerCase().includes(q.toLowerCase()) ||
      a.name.toLowerCase().includes(q.toLowerCase()) ||
      a.country.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 7);
    setResults(filtered);
    setOpen(filtered.length > 0);
  };

  const select = (airport) => {
    setQuery(`${airport.city} (${airport.code})`);
    onChange(airport);
    setOpen(false);
    setResults([]);
  };

  return (
    <div className={styles.airportWrap} ref={wrapRef}>
      <label className={styles.inputLabel}>{label}</label>
      <div className={styles.inputGroup}>
        <Icon size={16} className={styles.inputIcon} />
        <input
          className={styles.airportInput}
          value={query}
          onChange={e => handleQuery(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      {open && (
        <div className={`${styles.dropdown} glass`}>
          {results.map(airport => (
            <button
              key={airport.code}
              className={styles.dropdownItem}
              onClick={() => select(airport)}
              type="button"
            >
              <span className={styles.airportCode}>{airport.code}</span>
              <div className={styles.airportInfo}>
                <span className={styles.airportCity}>{airport.city}</span>
                <span className={styles.airportName}>{airport.name}</span>
              </div>
              <span className={styles.airportCountry}>{airport.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchForm({ compact = false, initialValues = {} }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState(initialValues.tripType || 'roundtrip');
  const [origin, setOrigin] = useState(initialValues.origin || null);
  const [destination, setDestination] = useState(initialValues.destination || null);
  const [departDate, setDepartDate] = useState(initialValues.departDate || '');
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || '');
  const [passengers, setPassengers] = useState(initialValues.passengers || 1);
  const [cabinClass, setCabinClass] = useState(initialValues.cabinClass || 'economy');
  const [showPassengers, setShowPassengers] = useState(false);
  const [loading, setLoading] = useState(false);

  const swapRoutes = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    setLoading(true);
    const params = new URLSearchParams({
      origin: origin.code,
      originCity: origin.city,
      destination: destination.code,
      destCity: destination.city,
      departDate,
      returnDate,
      passengers,
      cabinClass,
      tripType,
    });
    setTimeout(() => {
      navigate(`/search?${params.toString()}`);
      setLoading(false);
    }, 300);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className={`${styles.form} ${compact ? styles.compact : ''} glass`} onSubmit={handleSubmit}>
      {/* Trip type tabs */}
      <div className={styles.tripTabs}>
        {['oneway', 'roundtrip', 'multicity'].map(type => (
          <button
            key={type}
            type="button"
            className={`${styles.tripTab} ${tripType === type ? styles.active : ''}`}
            onClick={() => setTripType(type)}
          >
            {type === 'oneway' ? 'One Way' : type === 'roundtrip' ? 'Round Trip' : 'Multi-City'}
          </button>
        ))}
      </div>

      <div className={styles.formBody}>
        {/* Origin & Destination */}
        <div className={styles.routeRow}>
          <AirportInput
            value={origin}
            onChange={setOrigin}
            placeholder="From where?"
            label="Origin"
            icon={MapPin}
          />
          <button
            type="button"
            className={styles.swapBtn}
            onClick={swapRoutes}
            title="Swap airports"
          >
            <ArrowLeftRight size={16} />
          </button>
          <AirportInput
            value={destination}
            onChange={setDestination}
            placeholder="Where to?"
            label="Destination"
            icon={Plane}
          />
        </div>

        {/* Dates */}
        <div className={styles.datesRow}>
          <div className={styles.dateGroup}>
            <label className={styles.inputLabel}>Depart Date</label>
            <div className={styles.inputGroup}>
              <Calendar size={16} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.dateInput}
                value={departDate}
                min={today}
                onChange={e => setDepartDate(e.target.value)}
                required
              />
            </div>
          </div>
          {tripType === 'roundtrip' && (
            <div className={styles.dateGroup}>
              <label className={styles.inputLabel}>Return Date</label>
              <div className={styles.inputGroup}>
                <Calendar size={16} className={styles.inputIcon} />
                <input
                  type="date"
                  className={styles.dateInput}
                  value={returnDate}
                  min={departDate || today}
                  onChange={e => setReturnDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Passengers & Class + Search */}
        <div className={styles.bottomRow}>
          <div className={styles.passengersWrap}>
            <button
              type="button"
              className={styles.passengersBtn}
              onClick={() => setShowPassengers(v => !v)}
            >
              <Users size={16} />
              <span>{passengers} {passengers === 1 ? 'Passenger' : 'Passengers'} · {CABIN_CLASSES.find(c => c.value === cabinClass)?.label}</span>
              <ChevronDown size={14} className={showPassengers ? styles.chevronUp : ''} />
            </button>
            {showPassengers && (
              <div className={`${styles.passengersDropdown} glass`}>
                <div className={styles.passengerRow}>
                  <div>
                    <p className={styles.passengerLabel}>Passengers</p>
                    <p className={styles.passengerSub}>Adults (12+)</p>
                  </div>
                  <div className={styles.counter}>
                    <button type="button" onClick={() => setPassengers(v => Math.max(1, v - 1))}>−</button>
                    <span>{passengers}</span>
                    <button type="button" onClick={() => setPassengers(v => Math.min(9, v + 1))}>+</button>
                  </div>
                </div>
                <div className={styles.cabinSection}>
                  <p className={styles.passengerLabel}>Cabin Class</p>
                  <div className={styles.cabinBtns}>
                    {CABIN_CLASSES.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        className={`${styles.cabinBtn} ${cabinClass === c.value ? styles.active : ''}`}
                        onClick={() => { setCabinClass(c.value); setShowPassengers(false); }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn-primary ${styles.searchBtn}`}
            disabled={loading || !origin || !destination}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <Search size={18} />
                Search Flights
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
