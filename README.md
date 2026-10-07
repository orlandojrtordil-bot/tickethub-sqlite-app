# TicketHub - SQLite-Enabled Travel App

## Description
TicketHub is a mobile travel application built with Expo SDK 57, React Navigation, and expo-sqlite for offline-first data persistence. All flight data, bookings, and passenger information are stored locally using SQLite, ensuring the app works in Airplane Mode and survives app restarts.

## Stack
- **Expo SDK**: 57.0.26
- **React**: 19.2.3
- **React Native**: 0.86.3
- **React Navigation**: bottom tabs (Home/Search/MyTrips/Profile) with native stack
- **Database**: expo-sqlite with parameterized queries (? placeholders)
- **UI**: Figma-matched design with Inter font, MaterialCommunityIcons
- **State Management**: TripContext API backed by SQLite

## Key Features (Lab 05)
- **Offline-first SQLite database** (`tickethub.db`) with flights and bookings tables
- **Search**: Search airline or flight # via `LIKE` queries on airline and flight_no
- **Add Flight**: Modal with airline, flight number, price, seats; validates required/numeric fields; INSERT via `runSync`
- **Delete Flight**: Trash icon per flight with `Alert.alert` confirmation; `DELETE FROM flights WHERE id = ?`
- **Update Seats**: `+/-` control using `UPDATE flights SET seats = seats + ?`
- **Unique References**: `TH-XXXXX` booking reference generated at checkout and stored with the booking
- **Bookings**: `addBooking()` saves reference, PNR, flight details, passenger name, seat, travel date
- **My Trips**: Reads from SQLite so bookings survive restart; shows name, seat, date, flight
- **Booking Confirmed**: Shows actual flight duration and stops from database (no hardcoded values)
- **Price Formatting**: `formatPeso()` displays ₱640, ₱685, ₱610 (whole numbers) and breakdown with two decimals

## How to Run
```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Or for Android
npx expo start --android
```

## Lab 05 Implementation
This lab adds an offline-first SQLite database (`expo-sqlite`) to the TicketHub app. Key changes:

1. **Database Service** (`src/services/db.js`): `initDatabase`, `getFlights(search, mode, morningOnly)`, `addFlight`, `deleteFlight`, `updateSeats`, `addBooking`, `getBookings`
2. **App Initialization** (`App.js`): Calls `initDatabase()` once at startup before the navigator renders
3. **BookTripScreen**: Uses `<FlatList>` with `getFlights(search, mode, morningOnly)`; Cheapest/Fastest chips map to ORDER BY modes, Morning adds `depart < '12:00'`; trash deletes; prices show with `formatPeso`
4. **Checkout & BookingConfirmed**: `TH-XXXXX` reference generated at checkout; `addBooking()` persists the booked flight's own airline/flight number; duration/stops shown from the booking record
5. **mockData.js**: Removed - no longer needed
6. **.gitignore**: Added `*.log` pattern
7. **README.md**: Documentation with stack, runtime, and author info

## Author
Orlando Jr C. Tordil, BSIT-3F