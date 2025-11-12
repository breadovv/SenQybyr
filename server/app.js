const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const { initDB } = require('./db');
const { authOptional, authRequired } = require('./middleware/auth');
const { rateLimit } = require('./middleware/rateLimit');
const { metricsMiddleware, metricsRouter } = require('./monitoring');
const apiRouter = require('./routes/api');

const app = express();

// Core middleware
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(metricsMiddleware);

// Static files (optional, serve frontend)
app.use('/', express.static(path.join(__dirname, '..')));

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Metrics endpoint
app.use('/api/metrics', metricsRouter);

// Rate limiting (basic global limit for write-heavy endpoints)
app.use('/api/interactions', rateLimit({ windowMs: 60_000, max: 120 }));

// API routes
app.use('/api', authOptional, apiRouter);

// Error handler
app.use((err, req, res, next) => {
  req.metrics.errors++;
  console.error('API error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Bootstrap
const PORT = process.env.PORT || 8080;

initDB()
  .then(() => {
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Failed to initialize database:', e);
    process.exit(1);
  });