// src/services/db.js  (Lab 05: Offline-first persistence with expo-sqlite)
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('tickethub.db');

// Seed data taken from the Figma frames (03_BookTrip) plus three extra flights.
const SEED_FLIGHTS = [
  ['Delta Air Lines', 'DL 402', 'Boeing 767', 'JFK', 'LHR', '08:30', '20:45', '7h 15m', 435, 640, 40],
  ['British Airways', 'BA 178', 'Airbus A350', 'JFK', 'LHR', '10:15', '22:30', '7h 15m', 435, 685, 32],
  ['Virgin Atlantic', 'VS 4', 'Boeing 787', 'JFK', 'LHR', '18:20', '06:40', '7h 20m', 440, 610, 28],
  ['United Airlines', 'UA 15', 'Boeing 777', 'JFK', 'LHR', '21:00', '09:10', '7h 10m', 430, 655, 36],
  ['Air France', 'AF 7', 'Airbus A350', 'JFK', 'LHR', '12:30', '00:50', '7h 20m', 440, 630, 30],
  ['Emirates', 'EK 202', 'Airbus A380', 'JFK', 'LHR', '06:45', '19:00', '7h 15m', 435, 720, 24],
];

// Safe ORDER BY options (never build ORDER BY from user text).
const ORDER = {
  default: 'depart ASC',
  cheapest: 'price ASC',
  fastest: 'duration_min ASC, price ASC',
};

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
      duration_min INTEGER NOT NULL,
      price REAL NOT NULL,
      seats INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline);
    CREATE INDEX IF NOT EXISTS idx_flights_flight_no ON flights(flight_no);

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

  // Auto-seed on first launch so the screen is never blank.
  const row = db.getFirstSync('SELECT COUNT(*) AS count FROM flights;');
  if (row.count === 0) {
    for (const f of SEED_FLIGHTS) {
      db.runSync(
        `INSERT INTO flights
          (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, duration_min, price, seats)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        f
      );
    }
  }
}

// READ + SQL search. mode: 'default' | 'cheapest' | 'fastest'
// extra filters are applied in SQL too (direct is not stored, so only morning here).
export function getFlights(search = '', mode = 'default', morningOnly = false) {
  const q = `%${search.trim()}%`;
  const order = ORDER[mode] || ORDER.default;
  const morning = morningOnly ? "AND depart < '12:00'" : '';
  return db.getAllSync(
    `SELECT * FROM flights
     WHERE (airline LIKE ? OR flight_no LIKE ?) ${morning}
     ORDER BY ${order};`,
    [q, q]
  );
}

// CREATE
export function addFlight({ airline, flightNo, aircraft = 'Boeing 787', origin = 'JFK', destination = 'LHR',
  depart = '09:00', arrive = '21:15', duration = '7h 15m', durationMin = 435, price, seats }) {
  return db.runSync(
    `INSERT INTO flights
      (airline, flight_no, aircraft, origin, destination, depart, arrive, duration, duration_min, price, seats)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [airline, flightNo, aircraft, origin, destination, depart, arrive, duration, durationMin, price, seats]
  );
}

// DELETE
export function deleteFlight(id) {
  return db.runSync('DELETE FROM flights WHERE id = ?;', [id]);
}

// UPDATE (bonus): change available seats, never below zero
export function updateSeats(id, delta) {
  return db.runSync('UPDATE flights SET seats = MAX(seats + ?, 0) WHERE id = ?;', [delta, id]);
}

// Bookings (so My Trips survives an app restart)
export function addBooking(b) {
  return db.runSync(
    `INSERT INTO bookings
      (reference, pnr, airline, flight_no, origin, destination, depart, arrive, duration, passengers, total, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [b.reference, b.pnr, b.airline, b.flightNo, b.origin, b.destination, b.depart, b.arrive,
     b.duration, b.passengers, b.total, b.status || 'Confirmed']
  );
}

export function getBookings() {
  return db.getAllSync('SELECT * FROM bookings ORDER BY id DESC;');
}