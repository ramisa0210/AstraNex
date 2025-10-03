const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/asteroid-dashboard';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", require("./routes/auth"));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Import and use the statistics route
const statsRoute = require('./routes/statsRoute');
app.use('/api/stats', statsRoute);

// NASA API Key from .env
const NASA_API_KEY = process.env.NASA_API_KEY;

// NEO Feed - today's asteroids
app.get("/api/asteroids", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch NASA NEO data" });
  }
});

// Orbital elements for a specific asteroid
app.get("/api/orbit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${id}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orbital data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));