import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Plane, ChevronDown, X, Filter } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import { flightService } from '../services/flightService';
import styles from './SearchResults.module.css';

const SORT_OPTIONS = [
  { value: 'price', label: 'Cheapest First' },
  { value: 'duration', label: 'Shortest Flight' },
  { value: 'stops', label: 'Fewest Stops' },
  { value: 'rating', label: 'Best Rated' },
];

function LoadingSkeleton() {
  return (
    <div className={styles.skeletonList}>
      {[1,2,3,4].map(i => (
        <div key={i} className={`${styles.skeletonCard} card`}>
          <div className={styles.skeletonRow}>
            <div className="skeleton" style={{width:48,height:48,borderRadius:8}} />
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <div className="skeleton" style={{width:'40%',height:14}} />
              <div className="skeleton" style={{width:'20%',height:10}} />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
              <div className="skeleton" style={{width:80,height:28}} />
              <div className="skeleton" style={{width:120,height:38,borderRadius:20}} />
            </div>
          </div>
          <div className={styles.skeletonRoute}>
            <div className="skeleton" style={{width:'15%',height:20}} />
            <div className="skeleton" style={{flex:1,height:2}} />
            <div className="skeleton" style={{width:'15%',height:20}} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filters, setFilters] = useState({
    maxPrice: 5000,
    stops: 2,
    airlines: [],
    departTime: [0, 24],
  });

  const params = {
    origin: searchParams.get('origin') || '',
    originCity: searchParams.get('originCity') || '',
    destination: searchParams.get('destination') || '',
    destCity: searchParams.get('destCity') || '',
    departDate: searchParams.get('departDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    passengers: searchParams.get('passengers') || 1,
    cabinClass: searchParams.get('cabinClass') || 'economy',
    tripType: searchParams.get('tripType') || 'roundtrip',
  };

  const search = useCallback(async () => {
    if (!params.origin && !params.originCity) return;
    setLoading(true);
    setError(null);
    setFlights([]);
    try {
      const data = await flightService.searchFlights(params);
      setFlights(data.flights || []);
      setFilteredFlights(data.flights || []);
      // Set default max price from results
      if (data.flights?.length) {
        const max = Math.max(...data.flights.map(f => f.price));
        setFilters(prev => ({ ...prev, maxPrice: max }));
      }
    } catch (e) {
      setError('Failed to load flights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    const result = flightService.filterFlights(flights, { ...filters, sortBy });
    setFilteredFlights(result);
  }, [flights, filters, sortBy]);

  const uniqueAirlines = [...new Set(flights.map(f => f.airlineCode))].map(code => ({
    code,
    name: flights.find(f => f.airlineCode === code)?.airline || code,
  }));

  const minPrice = flights.length ? Math.min(...flights.map(f => f.price)) : 0;
  const maxPrice = flights.length ? Math.max(...flights.map(f => f.price)) : 5000;

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* Search bar at top */}
      <div className={styles.searchBar}>
        <div className="container">
          <SearchForm compact initialValues={params} />
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* ── Filters sidebar ── */}
        <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}><Filter size={16} /> Filters</h3>
              <button className={styles.closeFilters} onClick={() => setShowFilters(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Sort */}
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Sort By</p>
              <div className={styles.sortBtns}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.sortBtn} ${sortBy === opt.value ? styles.active : ''}`}
                    onClick={() => setSortBy(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stops */}
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>Max Stops</p>
              <div className={styles.stopsBtns}>
                {[0, 1, 2].map(n => (
                  <button
                    key={n}
                    className={`${styles.stopBtn} ${filters.stops === n ? styles.active : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, stops: n }))}
                  >
                    {n === 0 ? 'Nonstop' : n === 1 ? '1 Stop' : 'Any'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className={styles.filterGroup}>
              <p className={styles.filterLabel}>
                Max Price: <strong>${filters.maxPrice.toLocaleString()}</strong>
              </p>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.maxPrice}
                onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
              </div>
            </div>

            {/* Airlines */}
            {uniqueAirlines.length > 0 && (
              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Airlines</p>
                <div className={styles.airlineCheckboxes}>
                  {uniqueAirlines.map(a => (
                    <label key={a.code} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filters.airlines.length === 0 || filters.airlines.includes(a.code)}
                        onChange={e => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              airlines: prev.airlines.filter(c => c !== a.code).length === uniqueAirlines.length - 1
                                ? [] : [...prev.airlines.filter(c => c !== a.code)]
                            }));
                          } else {
                            const all = uniqueAirlines.map(x => x.code);
                            setFilters(prev => ({
                              ...prev,
                              airlines: all.filter(c => c !== a.code)
                            }));
                          }
                        }}
                        className={styles.checkbox}
                      />
                      <span>{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              className={styles.resetBtn}
              onClick={() => setFilters({ maxPrice: maxPrice, stops: 2, airlines: [], departTime: [0, 24] })}
            >
              <RefreshCw size={14} /> Reset Filters
            </button>
          </div>
        </aside>

        {/* ── Results ── */}
        <main className={styles.results}>
          {/* Results header */}
          <div className={styles.resultsHeader}>
            <div className={styles.routeSummary}>
              <h1 className={styles.routeTitle}>
                {params.originCity || params.origin}
                <span className={styles.routeArrow}><Plane size={18} /></span>
                {params.destCity || params.destination}
              </h1>
              <p className={styles.routeMeta}>
                {params.departDate && `Departing ${params.departDate}`}
                {params.returnDate && ` · Returning ${params.returnDate}`}
                {' · '}{params.passengers} passenger(s) · {params.cabinClass.replace('_', ' ')}
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                className={`${styles.filterToggle} btn-secondary`}
                onClick={() => setShowFilters(v => !v)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <button className={styles.refreshBtn} onClick={search} disabled={loading}>
                <RefreshCw size={16} className={loading ? styles.spinning : ''} />
              </button>
            </div>
          </div>

          {/* Results count */}
          {!loading && flights.length > 0 && (
            <div className={styles.resultsMeta}>
              <p>
                Showing <strong>{filteredFlights.length}</strong> of <strong>{flights.length}</strong> flights
                {' '}— cheapest from <strong className={styles.priceHighlight}>${minPrice}</strong>
              </p>
              <div className={styles.sortBar}>
                <ArrowUpDown size={14} />
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`${styles.sortChip} ${sortBy === o.value ? styles.active : ''}`}
                    onClick={() => setSortBy(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.loadingAnim}>
                <div className={styles.loadingPlane}>✈</div>
                <div className={styles.loadingTrail} />
              </div>
              <p className={styles.loadingText}>Scanning 800+ airlines for the best deals...</p>
              <div className={styles.loadingSteps}>
                {['American Airlines', 'Delta', 'Emirates', 'Qatar Airways', 'Ethiopian Airlines'].map((a, i) => (
                  <div key={a} className={styles.loadingStep} style={{ animationDelay: `${i * 0.3}s` }}>
                    ✓ Checking {a}...
                  </div>
                ))}
              </div>
              <LoadingSkeleton />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className={styles.errorBox}>
              <p>{error}</p>
              <button className="btn-primary" onClick={search}>Try Again</button>
            </div>
          )}

          {/* No results */}
          {!loading && !error && flights.length > 0 && filteredFlights.length === 0 && (
            <div className={styles.noResults}>
              <p className={styles.noResultsIcon}>🔍</p>
              <h3>No flights match your filters</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button
                className="btn-primary"
                onClick={() => setFilters({ maxPrice: maxPrice, stops: 2, airlines: [], departTime: [0, 24] })}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Empty (no search yet) */}
          {!loading && !error && flights.length === 0 && !params.origin && !params.originCity && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✈️</div>
              <h2>Search for flights above</h2>
              <p>Enter your origin, destination, and dates to find the best deals.</p>
            </div>
          )}

          {/* Flight list */}
          {!loading && filteredFlights.length > 0 && (
            <div className={styles.flightList}>
              {filteredFlights.map((flight, i) => (
                <div key={flight.id} style={{ animationDelay: `${i * 0.06}s` }} className={styles.flightItem}>
                  <FlightCard flight={flight} onSelect={handleSelectFlight} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Booking modal ── */}
      {selectedFlight && (
        <div className={styles.modalOverlay} onClick={() => setSelectedFlight(null)}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirm Your Flight</h2>
              <button className={styles.modalClose} onClick={() => setSelectedFlight(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalFlight}>
                <div className={styles.modalAirline}>
                  <span style={{ fontSize: '2rem' }}>{selectedFlight.logo}</span>
                  <div>
                    <p className={styles.modalAirlineName}>{selectedFlight.airline}</p>
                    <p className={styles.modalFlightNum}>{selectedFlight.flightNumber}</p>
                  </div>
                </div>
                <div className={styles.modalRoute}>
                  <div>
                    <p className={styles.modalTime}>{selectedFlight.departTime}</p>
                    <p className={styles.modalCode}>{selectedFlight.origin}</p>
                  </div>
                  <div className={styles.modalRouteViz}>
                    <span className={styles.modalDuration}>{selectedFlight.duration}</span>
                    <div className={styles.modalLine} />
                    <span className={styles.modalStops}>
                      {selectedFlight.stops === 0 ? 'Nonstop' : `${selectedFlight.stops} stop`}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className={styles.modalTime}>{selectedFlight.arrivalTime}</p>
                    <p className={styles.modalCode}>{selectedFlight.destination}</p>
                  </div>
                </div>
                <div className={styles.modalPrice}>
                  <span className={styles.modalPriceLabel}>Total Price</span>
                  <span className={styles.modalPriceVal}>${selectedFlight.price.toLocaleString()}</span>
                </div>
              </div>

              <p className={styles.modalNote}>
                You will be redirected to <strong>{selectedFlight.airline}</strong>'s official booking page to complete your purchase securely.
              </p>

              <div className={styles.modalActions}>
                <button className="btn-secondary" onClick={() => setSelectedFlight(null)}>
                  Back to Results
                </button>
                <a
                  href={`https://www.google.com/flights?q=${selectedFlight.origin}+to+${selectedFlight.destination}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Book Now — ${selectedFlight.price.toLocaleString()}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
