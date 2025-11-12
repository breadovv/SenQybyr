const express = require('express');

const metrics = {
  startTime: Date.now(),
  requests: 0,
  errors: 0,
  durations: {
    count: 0,
    totalMs: 0,
    maxMs: 0,
  },
  byRoute: {},
};

function metricsMiddleware(req, res, next) {
  const start = Date.now();
  metrics.requests++;

  const routeKey = `${req.method} ${req.path}`;
  metrics.byRoute[routeKey] = metrics.byRoute[routeKey] || {
    requests: 0,
    errors: 0,
    durations: { count: 0, totalMs: 0, maxMs: 0 },
  };
  metrics.byRoute[routeKey].requests++;

  res.on('finish', () => {
    const dur = Date.now() - start;
    metrics.durations.count++;
    metrics.durations.totalMs += dur;
    metrics.durations.maxMs = Math.max(metrics.durations.maxMs, dur);
    metrics.byRoute[routeKey].durations.count++;
    metrics.byRoute[routeKey].durations.totalMs += dur;
    metrics.byRoute[routeKey].durations.maxMs = Math.max(
      metrics.byRoute[routeKey].durations.maxMs,
      dur
    );
  });

  // Attach metrics object for error handler to increment
  req.metrics = metrics;
  next();
}

const metricsRouter = express.Router();
metricsRouter.get('/', (req, res) => {
  const uptimeSec = (Date.now() - metrics.startTime) / 1000;
  const avgMs = metrics.durations.count
    ? metrics.durations.totalMs / metrics.durations.count
    : 0;
  res.json({
    uptimeSec,
    requests: metrics.requests,
    errors: metrics.errors,
    durations: { avgMs, maxMs: metrics.durations.maxMs },
    byRoute: metrics.byRoute,
    timestamp: Date.now(),
  });
});

module.exports = { metricsMiddleware, metricsRouter };