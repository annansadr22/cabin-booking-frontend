// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://cabin-booking-backend.onrender.com",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor: Add token
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("nxtwave_token");
    const adminToken = localStorage.getItem("nxtwave_admin_token");

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle JWT expiry or unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens
      localStorage.removeItem("nxtwave_token");
      localStorage.removeItem("nxtwave_user");

      // Redirect based on role path
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/user/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
