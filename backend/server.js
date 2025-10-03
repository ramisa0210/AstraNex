const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const fetch = require("node-fetch"); // make sure installed: npm i node-fetch

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send("🚀 AstraNex Backend is running!");
});

// Auth & Stats Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stats", require("./routes/statsRoute"));

// Test route
app.get("/api/test", (req, res) => res.json({ message: "Backend is working!" }));

// NASA API key
const NASA_API_KEY = process.env.NASA_API_KEY;

// NEO Feed - today's asteroids
app.get("/api/asteroids", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );
    res.json(await response.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch NASA NEO data" });
  }
});

// Orbital elements for a specific asteroid
app.get("/api/orbit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${id}`);
    res.json(await response.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orbital data" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
