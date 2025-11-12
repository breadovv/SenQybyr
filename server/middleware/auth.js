function parseAuth(req) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.substring('Bearer '.length).trim();
  return token || null;
}

// Simple token-based auth; in production, validate JWT or session.
function authOptional(req, res, next) {
  const token = parseAuth(req);
  // Mirror index pattern: allow anonymous but support user scoping when provided
  req.user = {
    id: req.headers['x-user-id'] || (token ? token : 'anonymous'),
    token: token,
    isAuthenticated: Boolean(token),
  };
  next();
}

function authRequired(req, res, next) {
  const token = parseAuth(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = {
    id: req.headers['x-user-id'] || token,
    token,
    isAuthenticated: true,
  };
  next();
}

module.exports = { authOptional, authRequired };