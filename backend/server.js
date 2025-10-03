// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// -------- CORS (allow your frontend + local dev) --------
const DEFAULT_ORIGINS = [
  "https://astranex-frontend-qyrw.onrender.com",
  "http://localhost:5173"
];
const ALLOWED_ORIGINS = process.env.FRONTEND_ORIGIN
  ? [process.env.FRONTEND_ORIGIN, ...DEFAULT_ORIGINS]
  : DEFAULT_ORIGINS;

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("CORS blocked: " + origin));
    },
    credentials: true
  })
);

// -------- Middleware --------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// -------- Health / Root --------
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("🚀 AstraNex Backend is running!"));

// -------- MongoDB (optional) --------
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️  No MONGO_URI/MONGODB_URI provided. Continuing without DB.");
}

// -------- NASA helpers --------
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NEO_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const SBDB_URL = "https://ssd-api.jpl.nasa.gov/sbdb.api";

const fmt = (d) => new Date(d).toISOString().slice(0, 10);

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch ${r.status} - ${url}`);
  return r.json();
}

// -------- Inline routes (simple ones) --------

// GET /api/asteroids -> today's NEO list (array)
app.get("/api/asteroids", async (_req, res) => {
  try {
    const today = fmt(new Date());
    const url = `${NEO_FEED_URL}?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`;
    const data = await fetchJSON(url);
    res.json(data?.near_earth_objects?.[today] || []);
  } catch (err) {
    console.error("NEO fetch error:", err);
    res.status(500).json({ error: "Failed to fetch NASA NEO data" });
  }
});

// GET /api/orbit/:id -> orbital elements from JPL SBDB
app.get("/api/orbit/:id", async (req, res) => {
  try {
    const id = encodeURIComponent(req.params.id);
    const data = await fetchJSON(`${SBDB_URL}?sstr=${id}`);
    res.json(data);
  } catch (err) {
    console.error("Orbit fetch error:", err);
    res.status(500).json({ error: "Failed to fetch orbital data" });
  }
});

// -------- Modular routes (export Router directly) --------
app.use("/api/stats", require("./routes/statsRoute"));   // GET /
app.use("/api/ai-buddy", require("./routes/aiBuddy"));   // POST /

// -------- 404 + Error handler --------
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// -------- Start --------
app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
