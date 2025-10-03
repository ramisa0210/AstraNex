// src/utils/api.js
import axios from "axios";

// ---------- Backend base URL ----------
// .env examples:
//   Local:      VITE_API_BASE=http://localhost:8080
//   Production: VITE_API_BASE=https://astra-nex-backend.onrender.com
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Create axios instance for your backend
const API = axios.create({
  baseURL: API_BASE, // IMPORTANT: no trailing /api here
  timeout: 15000,
});

// Optional client-side NASA key (only used if you really want to call NASA directly from browser)
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "";
const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

// Helper: is client allowed to hit NASA directly?
const useClientNASA = Boolean(NASA_API_KEY);

// ==========================
// Auth Endpoints (if needed)
// ==========================
export const loginUser = (email, password) =>
  API.post("/api/auth/login", { email, password });

export const registerUser = (name, email, password) =>
  API.post("/api/auth/register", { name, email, password });

// ==========================
// Asteroids & Orbit
// ==========================

// Prefer backend (no CORS). If VITE_NASA_API_KEY exists, allow client fallback.
export async function fetchTodayAsteroids() {
  const today = new Date().toISOString().slice(0, 10);

  try {
    if (useClientNASA) {
      // Direct NASA (client)
      const res = await fetch(
        `${NASA_BASE_URL}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
      );
      if (!res.ok) throw new Error("NASA feed failed");
      const data = await res.json();
      return data?.near_earth_objects?.[today] || [];
    } else {
      // Go via backend
      const { data } = await API.get("/api/asteroids");
      return data?.near_earth_objects?.[today] || [];
    }
  } catch (err) {
    console.error("fetchTodayAsteroids error:", err);
    return [];
  }
}

// Get detailed orbit/elements
export async function fetchAsteroidDetails(id) {
  try {
    if (useClientNASA) {
      // NASA NEO details (different dataset vs sbdb)
      const res = await fetch(`${NASA_BASE_URL}/neo/${id}?api_key=${NASA_API_KEY}`);
      if (!res.ok) throw new Error("NASA details failed");
      return await res.json();
    } else {
      // Backend proxy to JPL SBDB
      const { data } = await API.get(`/api/orbit/${encodeURIComponent(id)}`);
      return data;
    }
  } catch (err) {
    console.error("fetchAsteroidDetails error:", err);
    return null;
  }
}

// If you want to always use backend for these:
export const getAsteroids = async () => {
  try {
    const { data } = await API.get("/api/asteroids");
    return data;
  } catch (err) {
    console.error("Error fetching asteroids from backend:", err);
    return null;
  }
};

export const getAsteroidOrbit = async (id) => {
  try {
    const { data } = await API.get(`/api/orbit/${encodeURIComponent(id)}`);
    return data;
  } catch (err) {
    console.error("Error fetching orbit data from backend:", err);
    return null;
  }
};

export default API;
