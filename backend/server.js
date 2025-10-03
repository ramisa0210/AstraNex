// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

// ---- Ensure fetch exists (Node 18+ usually OK; polyfill if missing) ----
(async () => {
  if (typeof fetch === "undefined") {
    global.fetch = (await import("node-fetch")).default;
  }
})();

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- CORS ----------
const DEFAULT_ORIGINS = [
  "https://astranex-frontend-qyrw.onrender.com",
  "http://localhost:5173"
];
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN
  ? [process.env.FRONTEND_ORIGIN, ...DEFAULT_ORIGINS]
  : DEFAULT_ORIGINS);

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("CORS blocked: " + origin));
  },
  credentials: true
}));

// ---------- Middleware ----------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// ---------- Health & Root ----------
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("🚀 AstraNex Backend is running!"));

// ---------- MongoDB (optional) ----------
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️  No MONGO_URI/MONGODB_URI provided. Continuing without DB.");
}

// ---------- NASA helpers ----------
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NEO_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const SBDB_URL = "https://ssd-api.jpl.nasa.gov/sbdb.api";

const fmt = (d) => new Date(d).toISOString().slice(0, 10);

// Fetch NEO feed for a date range (NASA allows up to 7 days per request)
async function fetchNeoFeed(startDate, endDate) {
  const url = `${NEO_FEED_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`NASA feed error ${r.status}`);
  return r.json();
}

// ---------- Routes: simple built-ins ----------

// GET /api/asteroids  -> today's NEO feed (array for today)
app.get("/api/asteroids", async (_req, res) => {
  try {
    const today = fmt(new Date());
    const data = await fetchNeoFeed(today, today);
    const list = data?.near_earth_objects?.[today] || [];
    res.json(list);
  } catch (err) {
    console.error("NEO fetch error:", err);
    res.status(500).json({ error: "Failed to fetch NASA NEO data" });
  }
});

// GET /api/orbit/:id -> orbital elements from JPL SBDB
app.get("/api/orbit/:id", async (req, res) => {
  try {
    const id = encodeURIComponent(req.params.id);
    const r = await fetch(`${SBDB_URL}?sstr=${id}`);
    if (!r.ok) throw new Error(`SBDB error ${r.status}`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("Orbit fetch error:", err);
    res.status(500).json({ error: "Failed to fetch orbital data" });
  }
});

// ---------- Routed modules ----------
app.use("/api/stats", require("./routes/statsRoute")(fetchNeoFeed, fmt, NASA_API_KEY));
app.use("/api/ai-buddy", require("./routes/aiBuddy")());

// ---------- Error handler ----------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Start ----------
app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
