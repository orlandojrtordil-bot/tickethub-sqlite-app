import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('tickethub.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      airline TEXT NOT NULL,
      flight_no TEXT NOT NULL,
      aircraft TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      depart TEXT NOT NULL,
      arrive TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      seats INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline);
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL,
      pnr TEXT NOT NULL,
      airline TEXT NOT NULL,
      flight_no TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      depart TEXT NOT NULL,
      arrive TEXT NOT NULL,
      duration TEXT NOT NULL,
      passengers INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Confirmed'
    );
  `);

  // Seed flights if table is empty
  const row = db.getFirstSync('SELECT COUNT(*) as count FROM flights;');
  if (row.count === 0) {
    // Insert 6 seed flights
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Delta Air Lines', 'DL 402', 'Boeing 767', 'JFK', 'LHR', '08:30', '20:45', '7h 15m', 640, 40]
    );
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['British Airways', 'BA 178', 'Airbus A350', 'JFK', 'LHR', '10:15', '22:30', '7h 15m', 685, 32]
    );
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Virgin Atlantic', 'VS 4', 'Boeing 787', 'JFK', 'LHR', '18:20', '06:40', '7h 20m', 610, 28]
    );
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['United Airlines', 'UA 940', 'Boeing 777', 'EWR', 'SFO', '11:05', '14:35', '6h 30m', 310, 20]
    );
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Air France', 'AF 7', 'Airbus A350', 'JFK', 'CDG', '13:20', '18:45', '5h 25m', 580, 25]
    );
    db.runSync(
      'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['Emirates', 'EK 202', 'Boeing 777', 'JFK', 'DXB', '01:15', '05:30', '4h 15m', 720, 30]
    );
  }
}

// Flight operations
export function getFlights(search = '', filter = 'All') {
  let query = 'SELECT * FROM flights WHERE 1=1';
  const params = [];

  if (search.trim()) {
    query += ' AND (airline LIKE ? OR flight_no LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (filter === 'Cheapest') {
    query += ' ORDER BY price ASC';
  } else if (filter === 'Fastest') {
    query += ' ORDER BY duration ASC';
  } else if (filter === 'Direct') {
    query += ' AND stops IS NOT NULL'; // simplified - no stops column in schema but keeping structure
  }

  return db.getAllSync(query, ...params);
}

export function addFlight(flight) {
  const result = db.runSync(
    'INSERT INTO flights (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, price, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      flight.airline,
      flight.flight_no,
      flight.aircraft,
      flight.origin,
      flight.destination,
      flight.depart,
      flight.arrive,
      flight.duration,
      flight.price,
      flight.seats,
    ]
  );
  return result;
}

export function deleteFlight(id) {
  return db.runSync('DELETE FROM flights WHERE id = ?', [id]);
}

export function updateSeats(id, delta) {
  return db.runSync('UPDATE flights SET seats = seats + ? WHERE id = ?', [delta, id]);
}

// Booking operations
export function addBooking(booking) {
  const result = db.runSync(
    'INSERT INTO bookings (reference, pnr, airline, flight_no, origin, destination, depart, arrive, duration, passengers, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      booking.reference,
      booking.pnr,
      booking.airline,
      booking.flightNumber,
      booking.origin,
      booking.destination,
      booking.departureTime,
      booking.arrivalTime,
      booking.duration,
      booking.passengerCount,
      booking.price,
      'Confirmed',
    ]
  );
  return result;
}

export function getBookings() {
  return db.getAllSync('SELECT * FROM bookings ORDER BY id DESC');
}

// Pilot/crew operations
export function getPilots() {
  return db.getAllSync('SELECT * FROM pilots');
}

export function addPilot(pilot) {
  return db.runSync(
    'INSERT INTO pilots (name, license, aircraftType, status) VALUES (?, ?, ?, ?)',
    [pilot.name, pilot.license, pilot.aircraftType, 'Active']
  );
}

export function deletePilot(id) {
  return db.runSync('DELETE FROM pilots WHERE id = ?', [id]);
}