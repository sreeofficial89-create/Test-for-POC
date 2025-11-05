## Travel Booking App

This repository contains a MakeMyTrip-inspired travel booking experience with a Node/Express backend and a React Native (Expo) mobile client.

### Project Structure
- `backend/` – Express API serving mock data for destinations, flights, hotels, offers, and bookings.
- `mobile/` – Expo-powered mobile app for browsing, searching, and booking travel options.

### Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI (installed automatically when running `npm run start` inside `mobile/`)

### Backend Setup
1. `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run start`
4. The API runs on `http://localhost:4000` and exposes the following endpoints:
   - `GET /api/destinations`
   - `GET /api/flights`
   - `GET /api/hotels`
   - `GET /api/experiences`
   - `GET /api/offers`
   - `POST /api/bookings`
   - `GET /api/bookings/:bookingId`

### Mobile App Setup
1. In a new terminal, `cd mobile`
2. Install dependencies: `npm install`
3. Ensure the backend server is running and accessible from your simulator/device. For physical devices, set the API URL to your machine IP:
   ```bash
   EXPO_PUBLIC_API_URL="http://<your-ip>:4000" npm run start
   ```
4. For local emulators you can usually rely on `http://localhost:4000` and simply run `npm run start`
5. Choose the desired platform (`a` for Android, `w` for web) from the Expo terminal prompt.

### Features
- Home screen with flight/hotel/experience search form, trending destinations, offers, and curated experiences.
- Flight results with live data from the backend mock API.
- Hotel results with contextual destination banners and optional experiences.
- Booking flow capturing traveller details and confirming reservations via backend.
- Confirmation screen summarising booking status and reference.

### Notes & Next Steps
- Data is currently mock/static; integrate with real providers or databases for production use.
- Extend the backend with authentication, payments, and persistent bookings storage.
- Add offline caching and richer filters (price sliders, airline/hotel chains) on the mobile app.
