const express = require("express");
const {
  getDestinations,
  getFlights,
  getHotels,
  getExperiences,
  getOffers,
  createBooking,
  getBookingById,
} = require("../controllers/travelController");

const router = express.Router();

router.get("/destinations", getDestinations);
router.get("/flights", getFlights);
router.get("/hotels", getHotels);
router.get("/experiences", getExperiences);
router.get("/offers", getOffers);
router.post("/bookings", createBooking);
router.get("/bookings/:bookingId", getBookingById);

module.exports = router;
