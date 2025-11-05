import axios from "axios";
import { API_URL } from "../constants/config";

export const http = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 8000,
});

export const fetchDestinations = async (params) => {
  const response = await http.get("/destinations", { params });
  return response.data.results ?? [];
};

export const fetchFlights = async (params) => {
  const response = await http.get("/flights", { params });
  return response.data.results ?? [];
};

export const fetchHotels = async (params) => {
  const response = await http.get("/hotels", { params });
  return response.data.results ?? [];
};

export const fetchExperiences = async (params) => {
  const response = await http.get("/experiences", { params });
  return response.data.results ?? [];
};

export const fetchOffers = async () => {
  const response = await http.get("/offers");
  return response.data.results ?? [];
};

export const createBooking = async (payload) => {
  const response = await http.post("/bookings", payload);
  return response.data.booking;
};
