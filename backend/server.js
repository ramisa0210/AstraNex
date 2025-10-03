// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// --- middlewares (must be functions) ---
app.use(cors());           // ✅ pass function
app.use(express.json());   // ✅ pass function

// --- health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'astra-nex-backend' });
});

// --- routers (IMPORT THE ROUTER, DON'T CALL IT) ---
const statsRouter = require('./src/routes/stats');       // module.exports = router
const asteroidsRouter = require('./src/routes/asteroids');
const orbitRouter = require('./src/routes/orbit');
const aiRouter = require('./src/routes/ai');

// --- mount (DON'T CALL THEM) ---
app.use('/api/stats', statsRouter);          // ✅ router function
app.use('/api/asteroids', asteroidsRouter);
app.use('/api/orbit', orbitRouter);
app.use('/api/ai-buddy', aiRouter);

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// --- error handler (4 args for Express 5) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ astra-nex-backend running on port ${PORT}`);
});
