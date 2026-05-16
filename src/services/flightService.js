// Flight Search Service
// Integrates with multiple flight APIs (Amadeus, Skyscanner, etc.)
// Falls back to mock data for demo purposes

const API_BASE = '/api';

// Major airports data
export const AIRPORTS = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
  { code: 'DFW', name: 'Dallas Fort Worth International', city: 'Dallas', country: 'USA' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'EBB', name: 'Entebbe International Airport', city: 'Entebbe', country: 'Uganda' },
  { code: 'JRO', name: 'Kilimanjaro International Airport', city: 'Arusha', country: 'Tanzania' },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },
  { code: 'ADD', name: 'Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { code: 'GRU', name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
];

// Airlines data
export const AIRLINES = [
  { code: 'AA', name: 'American Airlines', logo: '🇺🇸' },
  { code: 'DL', name: 'Delta Air Lines', logo: '🔵' },
  { code: 'UA', name: 'United Airlines', logo: '✈️' },
  { code: 'SW', name: 'Southwest Airlines', logo: '🌈' },
  { code: 'BA', name: 'British Airways', logo: '🇬🇧' },
  { code: 'EK', name: 'Emirates', logo: '🇦🇪' },
  { code: 'QR', name: 'Qatar Airways', logo: '🇶🇦' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '🇸🇬' },
  { code: 'ET', name: 'Ethiopian Airlines', logo: '🇪🇹' },
  { code: 'KQ', name: 'Kenya Airways', logo: '🇰🇪' },
  { code: 'AF', name: 'Air France', logo: '🇫🇷' },
  { code: 'LH', name: 'Lufthansa', logo: '🇩🇪' },
  { code: 'TK', name: 'Turkish Airlines', logo: '🇹🇷' },
];

function generateMockFlights(params) {
  const { origin, destination, departDate, returnDate, passengers, cabinClass } = params;
  const airlines = AIRLINES.slice(0, 8);
  const classMultiplier = { economy: 1, business: 2.8, first: 5.2 }[cabinClass] || 1;
  const passCount = parseInt(passengers) || 1;

  const basePrice = Math.floor(Math.random() * 400 + 200);
  const flights = [];

  airlines.forEach((airline, i) => {
    const price = Math.floor((basePrice + i * 47 + Math.random() * 130) * classMultiplier * passCount);
    const departHour = Math.floor(Math.random() * 20 + 4);
    const durationHours = Math.floor(Math.random() * 8 + 2);
    const stops = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;

    flights.push({
      id: `FL-${Date.now()}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      logo: airline.logo,
      flightNumber: `${airline.code}${Math.floor(Math.random() * 900 + 100)}`,
      origin,
      destination,
      departTime: `${String(departHour).padStart(2, '0')}:${Math.random() > 0.5 ? '30' : '00'}`,
      arrivalTime: `${String((departHour + durationHours) % 24).padStart(2, '0')}:${Math.random() > 0.5 ? '45' : '15'}`,
      duration: `${durationHours}h ${Math.floor(Math.random() * 50 + 10)}m`,
      stops,
      stopCity: stops > 0 ? ['LHR', 'DXB', 'AMS', 'IST'][Math.floor(Math.random() * 4)] : null,
      price,
      pricePerPerson: Math.floor(price / passCount),
      currency: 'USD',
      cabinClass,
      seatsLeft: Math.floor(Math.random() * 8 + 1),
      baggage: cabinClass === 'economy' ? '23kg included' : '2x32kg included',
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      amenities: cabinClass !== 'economy'
        ? ['Wi-Fi', 'Meal', 'Entertainment', 'Lie-flat seat']
        : ['Entertainment', 'Snacks'],
      refundable: Math.random() > 0.5,
      departDate,
      returnDate,
      co2: Math.floor(Math.random() * 200 + 150),
    });
  });

  return flights.sort((a, b) => a.price - b.price);
}

export const flightService = {
  async searchFlights(params) {
    try {
      const res = await fetch(`${API_BASE}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fall through to mock data
    }
    // Simulate API delay + return mock data
    await new Promise(r => setTimeout(r, 1800));
    return {
      flights: generateMockFlights(params),
      searchId: `SRCH-${Date.now()}`,
      totalResults: 8,
      source: 'demo'
    };
  },

  async getFlightDetails(flightId) {
    await new Promise(r => setTimeout(r, 500));
    return { flightId, status: 'available', details: 'Mock detail data' };
  },

  async getPopularRoutes() {
    return [
      { from: 'New York', to: 'London', price: 387, from_code: 'JFK', to_code: 'LHR', image: 'london' },
      { from: 'Los Angeles', to: 'Tokyo', price: 542, from_code: 'LAX', to_code: 'NRT', image: 'tokyo' },
      { from: 'New York', to: 'Entebbe', price: 894, from_code: 'JFK', to_code: 'EBB', image: 'uganda' },
      { from: 'Atlanta', to: 'Nairobi', price: 721, from_code: 'ATL', to_code: 'NBO', image: 'nairobi' },
      { from: 'Chicago', to: 'Dubai', price: 613, from_code: 'ORD', to_code: 'DXB', image: 'dubai' },
      { from: 'Miami', to: 'São Paulo', price: 289, from_code: 'MIA', to_code: 'GRU', image: 'saopaulo' },
    ];
  },

  async getFlightAlerts(email) {
    return { success: true, message: 'Alert created successfully' };
  },

  filterFlights(flights, filters) {
    let result = [...flights];
    if (filters.maxPrice) result = result.filter(f => f.price <= filters.maxPrice);
    if (filters.stops !== undefined) result = result.filter(f => f.stops <= filters.stops);
    if (filters.airlines?.length) result = result.filter(f => filters.airlines.includes(f.airlineCode));
    if (filters.departTime) {
      const [start, end] = filters.departTime;
      result = result.filter(f => {
        const h = parseInt(f.departTime.split(':')[0]);
        return h >= start && h <= end;
      });
    }
    result.sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      if (filters.sortBy === 'duration') return a.duration.localeCompare(b.duration);
      if (filters.sortBy === 'stops') return a.stops - b.stops;
      if (filters.sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return a.price - b.price;
    });
    return result;
  }
};

export default flightService;
