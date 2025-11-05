const { v4: uuid } = require("uuid");
const {
  destinations,
  flights,
  hotels,
  experiences,
  offers,
} = require("../data/mockData");
const { matchesString, matchesPartial } = require("../utils/filters");

const bookings = [];

const getDestinations = (req, res) => {
  const { search, tag } = req.query;

  const results = destinations.filter((destination) => {
    const matchesSearch = search
      ? matchesPartial(destination.name, search) ||
        matchesPartial(destination.country, search) ||
        destination.tags.some((item) => matchesPartial(item, search))
      : true;
    const matchesTag = tag
      ? destination.tags.map((item) => item.toLowerCase()).includes(tag.toLowerCase())
      : true;
    return matchesSearch && matchesTag;
  });

  res.json({ results });
};

const getFlights = (req, res) => {
  const { from, to, date, maxPrice } = req.query;

  const results = flights.filter((flight) => {
    const matchesFrom = matchesString(flight.from, from);
    const matchesTo = matchesString(flight.to, to);
    const matchesDate = matchesString(flight.date, date);
    const matchesBudget = maxPrice ? Number(flight.price) <= Number(maxPrice) : true;
    return matchesFrom && matchesTo && matchesDate && matchesBudget;
  });

  res.json({ results });
};

const getHotels = (req, res) => {
  const { destinationId, minRating, maxPrice } = req.query;

  const results = hotels.filter((hotel) => {
    const matchesDestination = matchesString(hotel.destinationId, destinationId);
    const matchesRating = minRating ? Number(hotel.rating) >= Number(minRating) : true;
    const matchesPrice = maxPrice ? Number(hotel.pricePerNight) <= Number(maxPrice) : true;
    return matchesDestination && matchesRating && matchesPrice;
  });

  res.json({ results });
};

const getExperiences = (req, res) => {
  const { destinationId } = req.query;

  const results = experiences.filter((experience) =>
    matchesString(experience.destinationId, destinationId)
  );

  res.json({ results });
};

const getOffers = (_req, res) => {
  res.json({ results: offers });
};

const createBooking = (req, res) => {
  const {
    user,
    itinerary,
    payment,
  } = req.body || {};

  if (!user || !user.name || !user.email) {
    return res.status(400).json({ error: "Missing user details" });
  }

  if (!itinerary || !itinerary.type) {
    return res.status(400).json({ error: "Incomplete itinerary information" });
  }

  const booking = {
    id: uuid(),
    status: "confirmed",
    bookedAt: new Date().toISOString(),
    user,
    itinerary,
    payment: payment || { method: "pending", amount: 0, currency: "INR" },
  };

  bookings.push(booking);

  res.status(201).json({ booking });
};

const getBookingById = (req, res) => {
  const { bookingId } = req.params;
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  res.json({ booking });
};

module.exports = {
  getDestinations,
  getFlights,
  getHotels,
  getExperiences,
  getOffers,
  createBooking,
  getBookingById,
};
