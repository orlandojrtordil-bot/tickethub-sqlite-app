import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { addBooking, getBookings } from '../services/db';

const TripContext = createContext();

// The bookings table stores the flight data; these fields are display-only
// values the My Trips ticket card has always rendered (matching the mock).
const CITY_BY_CODE = { JFK: 'New York', LHR: 'London' };

const bookingToTrip = (row) => ({
  id: String(row.id),
  airline: row.airline,
  flight: row.flight_no,
  origin: row.origin,
  originCity: CITY_BY_CODE[row.origin] || row.origin,
  destination: row.destination,
  destinationCity: CITY_BY_CODE[row.destination] || row.destination,
  date: 'Thu, 24 Oct',
  time: row.depart,
  arrivalTime: row.arrive,
  duration: row.duration,
  class: 'Economy',
  price: row.total,
  passengers: row.passengers,
  status: row.status,
  pnr: row.pnr,
  seat: '14A',
  gate: 'B22',
  terminal: 'Term 4',
  arrivalTerminal: 'Terminal 3',
  passenger: 'Alex Morgan',
  baggage: '1 Pc (23kg)',
});

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // My Trips → Upcoming reads straight from the local bookings table.
  const loadTrips = useCallback(() => {
    try {
      setTrips(getBookings().map(bookingToTrip));
    } catch (error) {
      Alert.alert('Could not load trips', String(error?.message ?? error));
    }
  }, []);

  useEffect(() => {
    // Defer one tick so the mount load reads like an async load (the SQLite
    // read is synchronous) and never cascades a synchronous state update.
    const timer = setTimeout(loadTrips, 0);
    return () => clearTimeout(timer);
  }, [loadTrips]);

  // Called by CheckoutScreen's "Confirm Booking" — persists the booking
  // offline, then reloads so My Trips updates immediately.
  const addTrip = (trip) => {
    try {
      const pnr = 'TH' + Math.floor(1000 + Math.random() * 9000);
      addBooking({
        reference: trip.confirmation || undefined,
        pnr,
        airline: trip.airline,
        flight_no: trip.flight,
        origin: trip.origin,
        destination: trip.destination,
        depart: trip.time,
        arrive: trip.arrivalTime,
        duration: trip.duration,
        passengers: trip.passengers ?? 1,
        total: trip.price,
        status: 'Confirmed',
      });
      loadTrips();
      return { ...trip, status: 'Confirmed', pnr };
    } catch (error) {
      Alert.alert('Could not save booking', String(error?.message ?? error));
      return { ...trip, status: 'Confirmed' };
    }
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, selectedTrip, setSelectedTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  return useContext(TripContext);
}
