// src/lib/axios.ts
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://cabin-booking-backend.onrender.com", // <-- Make sure this is correct
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the appropriate token
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("nxtwave_token");
    const adminToken = localStorage.getItem("nxtwave_admin_token");

    // Prioritize Admin Token if Admin is logged in
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
