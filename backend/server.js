// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// --------- CORS: allow your frontend + local dev ----------
const DEFAULT_ORIGINS = [
  "https://astranex-frontend-qyrw.onrender.com",
  "http://localhost:5173"
];
const ALLOWED_ORIGINS = process.env.FRONTEND_ORIGIN
  ? [process.env.FRONTEND_ORIGIN, ...DEFAULT_ORIGINS]
  : DEFAULT_ORIGINS;

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("CORS blocked: " + origin));
  },
  credentials: true
}));

// --------- Middleware ----------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// --------- Health / Root ----------
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("🚀 AstraNex Backend is running!"));

// --------- (Optional) MongoDB ----------
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️  No MONGO_URI/MONGODB_URI provided. Continuing without DB.");
}

// --------- NASA helpers ----------
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NEO_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const SBDB_URL = "https://ssd-api.jpl.nasa.gov/sbdb.api";
const fmt = (d) => new Date(d).toISOString().slice(0, 10);

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch ${r.status} - ${url}`);
  return r.json();
}

// --------- Routes (all inline, no extra files) ----------

// GET /api/asteroids → today’s NEO array
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

// GET /api/orbit/:id → orbital elements from JPL SBDB
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

// GET /api/stats → last 7 days aggregate
app.get("/api/stats", async (_req, res) => {
  try {
    const end = fmt(new Date());
    const start = fmt(Date.now() - 6 * 24 * 60 * 60 * 1000); // last 7 days
    const url = `${NEO_FEED_URL}?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`;
    const feed = await fetchJSON(url);

    let total = 0;
    let hazardous = 0;
    for (const d of Object.keys(feed?.near_earth_objects || {})) {
      const list = feed.near_earth_objects[d] || [];
      total += list.length;
      hazardous += list.filter(a => a.is_potentially_hazardous_asteroid).length;
    }

    res.json({
      range: { start, end },
      totalAsteroidsTracked: total,
      nearEarthThisMonth: total, // keep UI happy if it uses this label
      hazardousCount: hazardous
    });
  } catch (e) {
    console.error("Stats error:", e);
    res.status(500).json({ error: "Failed to compute statistics" });
  }
});

// POST /api/ai-buddy → simple echo (works without OpenAI key)
app.post("/api/ai-buddy", async (req, res) => {
  try {
    const { question = "" } = req.body || {};
    const key = process.env.OPENAI_API_KEY;

    if (!key) {
      return res.json({
        reply: `AI Buddy (demo): I received your question → "${question}"`
      });
    }

    // Live OpenAI call (optional)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a concise helper for asteroid facts." },
          { role: "user", content: question || "Say hello." }
        ],
        temperature: 0.4
      })
    });

    if (!r.ok) {
      console.warn("OpenAI error:", await r.text());
      return res.json({
        reply: `AI Buddy: couldn't reach AI service now. Echo → "${question}"`
      });
    }

    const data = await r.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a response right now.";
    res.json({ reply });
  } catch (e) {
    console.error("AI Buddy error:", e);
    res.status(500).json({ error: "AI Buddy failed" });
  }
});

// Fallbacks
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start
app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));
