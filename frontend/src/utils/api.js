// src/utils/api.js
import axios from "axios";

// Backend URL (optional, if you have other backend routes)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ==========================
// Auth Endpoints (if needed)
// ==========================
export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });

export const registerUser = (name, email, password) =>
  API.post("/auth/register", { name, email, password });

// ==========================
// NASA API Endpoints
// ==========================
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

// Fetch today's asteroids feed
export async function fetchTodayAsteroids() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `${NASA_BASE_URL}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to fetch asteroids feed");
    const data = await response.json();
    return data.near_earth_objects[today] || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch details for a specific asteroid by its NASA ID
export async function fetchAsteroidDetails(id) {
  try {
    const response = await fetch(
      `${NASA_BASE_URL}/neo/${id}?api_key=${NASA_API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to fetch asteroid details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ==========================
// Optional: Backend Asteroids routes
// ==========================
export const getAsteroids = async () => {
  try {
    const res = await API.get("/asteroids");
    return res.data;
  } catch (err) {
    console.error("Error fetching asteroids from backend:", err);
    return [];
  }
};

export const getAsteroidOrbit = async (id) => {
  try {
    const res = await API.get(`/orbit/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching orbit data from backend:", err);
    return null;
  }
};

export default API;
