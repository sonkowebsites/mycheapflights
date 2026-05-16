/**
 * MyCheapFlights – Backend Flight Service
 * Integrates with Amadeus API (production) or generates rich mock data (demo)
 */

const AIRPORTS = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', lat: 33.9425, lng: -118.4081 },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073 },
  { code: 'DFW', name: 'Dallas Fort Worth International', city: 'Dallas', country: 'USA', lat: 32.8998, lng: -97.0403 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', lat: 33.6407, lng: -84.4277 },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.379 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', lat: 25.7959, lng: -80.2870 },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088 },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', lat: 42.3656, lng: -71.0096 },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', lat: 39.8561, lng: -104.6737 },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657 },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', lat: 35.7720, lng: 140.3929 },
  { code: 'EBB', name: 'Entebbe International Airport', city: 'Entebbe', country: 'Uganda', lat: 0.0424, lng: 32.4435 },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lng: 36.9275 },
  { code: 'ADD', name: 'Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lng: 38.7993 },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3086, lng: 4.7639 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622 },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lng: 100.7501 },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772 },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248 },
  { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lng: -46.4731 },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', lat: 25.2609, lng: 51.6138 },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', lat: 37.4602, lng: 126.4407 },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lng: 3.3214 },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', lat: 19.4363, lng: -99.0721 },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', lat: 48.3538, lng: 11.7861 },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', lat: 41.2753, lng: 28.7519 },
];

const AIRLINES = [
  { code: 'AA', name: 'American Airlines', alliance: 'Oneworld', rating: 4.1 },
  { code: 'DL', name: 'Delta Air Lines', alliance: 'SkyTeam', rating: 4.3 },
  { code: 'UA', name: 'United Airlines', alliance: 'Star Alliance', rating: 4.0 },
  { code: 'BA', name: 'British Airways', alliance: 'Oneworld', rating: 4.4 },
  { code: 'EK', name: 'Emirates', alliance: 'None', rating: 4.7 },
  { code: 'QR', name: 'Qatar Airways', alliance: 'Oneworld', rating: 4.8 },
  { code: 'SQ', name: 'Singapore Airlines', alliance: 'Star Alliance', rating: 4.9 },
  { code: 'ET', name: 'Ethiopian Airlines', alliance: 'Star Alliance', rating: 4.2 },
  { code: 'KQ', name: 'Kenya Airways', alliance: 'SkyTeam', rating: 3.9 },
  { code: 'AF', name: 'Air France', alliance: 'SkyTeam', rating: 4.3 },
  { code: 'LH', name: 'Lufthansa', alliance: 'Star Alliance', rating: 4.4 },
  { code: 'TK', name: 'Turkish Airlines', alliance: 'Star Alliance', rating: 4.3 },
];

const searchHistory = new Map();

// Calculate approximate flight duration in minutes based on rough distance
function estimateDuration(originCode, destCode) {
  const origin = AIRPORTS.find(a => a.code === originCode);
  const dest = AIRPORTS.find(a => a.code === destCode);
  if (!origin || !dest) return 480; // default 8h

  // Haversine formula
  const R = 6371;
  const dLat = (dest.lat - origin.lat) * Math.PI / 180;
  const dLon = (dest.lng - origin.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(origin.lat * Math.PI/180) * Math.cos(dest.lat * Math.PI/180) *
    Math.sin(dLon/2) ** 2;
  const distKm = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  // Approx 900 km/h + 30min boarding
  return Math.round(distKm / 900 * 60 + 30);
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function generateFlights(params) {
  const { origin, destination, departDate, passengers, cabinClass } = params;
  const classMultiplier = { economy: 1, premium_economy: 1.6, business: 2.8, first: 5.2 }[cabinClass] || 1;
  const passCount = parseInt(passengers) || 1;
  const baseDuration = estimateDuration(origin, destination);
  const distanceKm = baseDuration * 900 / 60;

  // Base price roughly proportional to distance
  const basePrice = Math.max(89, Math.round(distanceKm * 0.08 + 80 + Math.random() * 60));

  const stopCities = ['LHR', 'DXB', 'AMS', 'IST', 'ADD', 'CDG', 'FRA', 'DOH'];

  return AIRLINES.map((airline, i) => {
    const variance = (Math.random() * 0.4 - 0.1); // -10% to +30%
    const pricePerPerson = Math.round(basePrice * (1 + variance + i * 0.05) * classMultiplier);
    const totalPrice = pricePerPerson * passCount;

    const departHour = (5 + i * 2 + Math.floor(Math.random() * 2)) % 23;
    const stops = distanceKm < 2000 ? (i % 4 === 0 ? 1 : 0) : (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2);
    const extraTime = stops * (60 + Math.floor(Math.random() * 90));
    const totalMinutes = baseDuration + extraTime;
    const arrivalHour = (departHour + Math.floor(totalMinutes / 60)) % 24;
    const arrivalMin = totalMinutes % 60;

    const stopCity = stops > 0
      ? stopCities.filter(c => c !== origin && c !== destination)[Math.floor(Math.random() * 5)]
      : null;

    const amenities = cabinClass === 'economy'
      ? ['In-flight entertainment', 'USB charging', 'Snack service'].slice(0, 2 + (i % 2))
      : cabinClass === 'business'
        ? ['Lie-flat seat', 'Wi-Fi', 'Gourmet meals', 'Lounge access', 'Priority boarding']
        : ['Private suite', 'Fine dining', 'Premium Wi-Fi', 'Exclusive lounge', 'Chauffeur service', 'On-demand entertainment'];

    return {
      id: `${airline.code}-${Date.now()}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 899)}`,
      alliance: airline.alliance,
      origin,
      destination,
      departTime: `${String(departHour).padStart(2,'0')}:${i % 2 === 0 ? '00' : '30'}`,
      arrivalTime: `${String(arrivalHour).padStart(2,'0')}:${String(arrivalMin).padStart(2,'0')}`,
      duration: formatDuration(totalMinutes),
      durationMinutes: totalMinutes,
      stops,
      stopCity,
      stopDuration: stops > 0 ? `${1 + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 50) + 10}m layover` : null,
      price: totalPrice,
      pricePerPerson,
      currency: 'USD',
      cabinClass,
      seatsLeft: Math.floor(Math.random() * 9) + 1,
      baggage: cabinClass === 'economy'
        ? (i % 3 === 0 ? 'Carry-on only' : '1 checked bag (23kg)')
        : '2 checked bags (32kg each)',
      rating: airline.rating,
      amenities,
      refundable: i % 3 === 0,
      departDate,
      distanceKm: Math.round(distanceKm),
      co2Kg: Math.round(distanceKm * 0.09 * passCount),
      deepLink: `https://www.google.com/flights?q=${origin}+to+${destination}+on+${departDate}`,
    };
  }).sort((a, b) => a.price - b.price);
}

const flightService = {
  async searchFlights(params) {
    // Attempt real Amadeus API if credentials available
    if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
      try {
        return await this.searchAmadeus(params);
      } catch (err) {
        console.warn('[Flights] Amadeus API failed, falling back to mock:', err.message);
      }
    }

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const flights = generateFlights(params);

    return {
      flights,
      totalResults: flights.length,
      searchId: `MCF-${Date.now()}`,
      source: 'demo',
      currency: 'USD',
    };
  },

  async searchAmadeus(params) {
    const { origin, destination, departDate, returnDate, passengers, cabinClass } = params;

    // Get access token
    const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Failed to get Amadeus token');

    const cabinMap = { economy: 'ECONOMY', premium_economy: 'PREMIUM_ECONOMY', business: 'BUSINESS', first: 'FIRST' };

    const searchUrl = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
    searchUrl.searchParams.set('originLocationCode', origin);
    searchUrl.searchParams.set('destinationLocationCode', destination);
    searchUrl.searchParams.set('departureDate', departDate);
    if (returnDate) searchUrl.searchParams.set('returnDate', returnDate);
    searchUrl.searchParams.set('adults', passengers);
    searchUrl.searchParams.set('travelClass', cabinMap[cabinClass] || 'ECONOMY');
    searchUrl.searchParams.set('max', 10);
    searchUrl.searchParams.set('currencyCode', 'USD');

    const offersRes = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const offersData = await offersRes.json();

    if (!offersData.data) throw new Error('No flight data from Amadeus');

    // Map Amadeus format to our format
    const flights = offersData.data.map((offer, i) => {
      const itinerary = offer.itineraries[0];
      const firstSeg = itinerary.segments[0];
      const lastSeg = itinerary.segments[itinerary.segments.length - 1];
      const price = parseFloat(offer.price.grandTotal);

      return {
        id: offer.id,
        airline: firstSeg.carrierCode,
        airlineCode: firstSeg.carrierCode,
        flightNumber: `${firstSeg.carrierCode}${firstSeg.number}`,
        origin: firstSeg.departure.iataCode,
        destination: lastSeg.arrival.iataCode,
        departTime: firstSeg.departure.at.split('T')[1].slice(0, 5),
        arrivalTime: lastSeg.arrival.at.split('T')[1].slice(0, 5),
        duration: itinerary.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase(),
        stops: itinerary.segments.length - 1,
        stopCity: itinerary.segments.length > 1 ? itinerary.segments[0].arrival.iataCode : null,
        price: Math.round(price),
        pricePerPerson: Math.round(price / parseInt(passengers)),
        currency: 'USD',
        cabinClass,
        seatsLeft: offer.numberOfBookableSeats || 9,
        baggage: '1 checked bag included',
        rating: 4.0 + Math.random() * 0.8,
        amenities: ['In-flight entertainment'],
        refundable: false,
        departDate,
        source: 'amadeus',
      };
    });

    return { flights, totalResults: flights.length, searchId: `AMX-${Date.now()}`, source: 'amadeus', currency: 'USD' };
  },

  async getPopularRoutes() {
    return [
      { from: 'New York', to: 'London', from_code: 'JFK', to_code: 'LHR', price: 387, tag: 'Weekend Deal' },
      { from: 'Los Angeles', to: 'Tokyo', from_code: 'LAX', to_code: 'NRT', price: 542, tag: 'Trending' },
      { from: 'New York', to: 'Entebbe', from_code: 'JFK', to_code: 'EBB', price: 894, tag: 'Bootcamp Special' },
      { from: 'Atlanta', to: 'Nairobi', from_code: 'ATL', to_code: 'NBO', price: 721, tag: 'African Explorer' },
      { from: 'Chicago', to: 'Dubai', from_code: 'ORD', to_code: 'DXB', price: 613, tag: 'Hot Deal' },
      { from: 'Miami', to: 'São Paulo', from_code: 'MIA', to_code: 'GRU', price: 289, tag: 'Flash Sale' },
    ];
  },

  async getFlightDetails(flightId) {
    return {
      flightId,
      status: 'available',
      bookingWindow: '3h',
      lastUpdated: new Date().toISOString(),
    };
  },

  async getPriceTrend({ origin, destination, departDate }) {
    const base = 300 + Math.random() * 200;
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(departDate || Date.now());
      d.setDate(d.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        price: Math.round(base + Math.sin(i) * 60 + Math.random() * 40),
      };
    });

    return {
      trend: days,
      lowestPrice: Math.min(...days.map(d => d.price)),
      recommendation: 'Prices are expected to rise. Book now for the best deal.',
    };
  },

  searchAirports(query) {
    const q = query.toLowerCase();
    return AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 8);
  },

  logSearch(userId, params) {
    const history = searchHistory.get(userId) || [];
    history.unshift({ ...params, searchedAt: new Date().toISOString() });
    searchHistory.set(userId, history.slice(0, 50));
  },
};

module.exports = flightService;
