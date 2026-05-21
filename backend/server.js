require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-app-tan-seven-96.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route: redirect to frontend if configured, otherwise return a simple JSON message
app.get('/', (req, res) => {
  const clientUrl = process.env.CLIENT_ORIGIN;
  if (clientUrl) return res.redirect(clientUrl);
  return res.json({ message: 'API running. See /api/health' });
});

// 404
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
});
