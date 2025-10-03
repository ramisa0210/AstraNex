// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();

// Ensure global fetch for CommonJS (Node 18+ usually has it, but polyfill if missing)
(async () => {
  if (typeof fetch === "undefined") {
    global.fetch = (await import("node-fetch")).default; // node-fetch v2.x in deps
  }
})();

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- Middleware ----------
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://astranex-frontend-qyrw.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ---------- Health & Root ----------
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("🚀 AstraNex Backend is running!"));

// ---------- MongoDB Connection ----------
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn("⚠️  Missing MONGO_URI/MONGODB_URI env var. Skipping DB connect.");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ---------- Routes (guarded to prevent boot crash if files missing) ----------
try {
  app.use("/api/auth", require("./routes/auth"));
} catch (e) {
  console.warn("⚠️  /routes/auth not found or failed to load:", e.message);
}

try {
  app.use("/api/stats", require("./routes/statsRoute"));
} catch (e) {
  console.warn("⚠️  /routes/statsRoute not found or failed to load:", e.message);
}

// ---------- Test ----------
app.get("/api/test", (_req, res) => res.json({ message: "Backend is working!" }));

// ---------- External APIs ----------
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

// NEO Feed - today's asteroids
app.get("/api/asteroids", async (_req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("NEO fetch error:", err);
    res.status(500).json({ error: "Failed to fetch NASA NEO data" });
  }
});

// Orbital elements for a specific asteroid
app.get("/api/orbit/:id", async (req, res) => {
  try {
    const target = encodeURIComponent(req.params.id);
    const r = await fetch(`https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${target}`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("Orbit fetch error:", err);
    res.status(500).json({ error: "Failed to fetch orbital data" });
  }
});

// ---------- Error handler ----------
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- Start ----------
app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
