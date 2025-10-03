// src/utils/api.js
import axios from "axios";

// -----------------------------
// Compute + normalize API base
// -----------------------------
const RAW_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// remove trailing slashes to avoid // in URLs
const BASE = RAW_BASE.replace(/\/+$/, "");

// Single axios instance for the backend
const API = axios.create({
  baseURL: BASE, // e.g. https://astra-nex-backend.onrender.com/api
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
  // withCredentials: true, // enable if you ever use cookies/sessions
});

// -----------------------------
// Auth Endpoints
// -----------------------------
export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });

export const registerUser = (name, email, password) =>
  API.post("/auth/register", { name, email, password });

// -----------------------------
// Backend Asteroid + Stats
// -----------------------------
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

export const getStatistics = async () => {
  try {
    const res = await API.get("/stats");
    return res.data;
  } catch (err) {
    console.error("Error fetching statistics from backend:", err);
    return {};
  }
};

// -----------------------------
// AI Buddy
// -----------------------------
export const askAIBuddy = async (question) => {
  try {
    const res = await API.post("/ai-buddy", { question });
    return res.data;
  } catch (err) {
    console.error("Error communicating with AI Buddy:", err);
    return { reply: "AI Buddy unavailable" };
  }
};

export default API;
