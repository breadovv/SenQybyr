const express = require('express');
const router = express.Router();

const { upsertItem, addView, addLike, removeLike, getHistory, getLikes } = require('../db');
const { authRequired } = require('../middleware/auth');
const { parsePagination } = require('../middleware/pagination');

// Record interactions (views, likes/unlikes)
router.post('/interactions', authRequired, async (req, res, next) => {
  try {
    const { action, itemId, itemTitle, itemMetadata, unlike } = req.body || {};
    const userId = req.user.id;

    if (!itemId) return res.status(400).json({ error: 'itemId is required' });

    // Save item metadata reference (upsert)
    await upsertItem({ id: itemId, title: itemTitle, metadata: itemMetadata });

    if (action === 'view') {
      await addView({ userId, itemId });
      return res.status(201).json({ status: 'ok', action: 'view' });
    }
    if (action === 'like') {
      if (unlike) {
        await removeLike({ userId, itemId });
        return res.status(200).json({ status: 'ok', action: 'unlike' });
      }
      await addLike({ userId, itemId });
      return res.status(201).json({ status: 'ok', action: 'like' });
    }

    return res.status(400).json({ error: 'Invalid action. Use "view" or "like".' });
  } catch (e) {
    next(e);
  }
});

// Retrieve historical activity
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.query.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const pg = parsePagination(req, { page: 1, limit: 20, sort: 'timestamp', order: 'DESC' });
    const rows = await getHistory({ userId, ...pg });
    res.json({ data: rows, page: pg.page, limit: pg.limit });
  } catch (e) {
    next(e);
  }
});

// Fetch liked items
router.get('/likes', async (req, res, next) => {
  try {
    const userId = req.query.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const pg = parsePagination(req, { page: 1, limit: 20, sort: 'created_at', order: 'DESC' });
    const rows = await getLikes({ userId, ...pg });
    res.json({ data: rows, page: pg.page, limit: pg.limit });
  } catch (e) {
    next(e);
  }
});

module.exports = router;