const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

let db;

function run(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function initDB() {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      // ignore if exists
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
      Promise.all([
        run(db, `CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY,
          title TEXT,
          metadata JSON,
          created_at INTEGER
        )`),
        run(db, `CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          action TEXT CHECK(action IN ('view')) NOT NULL,
          timestamp INTEGER NOT NULL,
          FOREIGN KEY(item_id) REFERENCES items(id)
        )`),
        run(db, `CREATE TABLE IF NOT EXISTS likes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          UNIQUE(user_id, item_id),
          FOREIGN KEY(item_id) REFERENCES items(id)
        )`),
        run(db, `CREATE INDEX IF NOT EXISTS idx_history_user_ts ON history(user_id, timestamp DESC)`),
        run(db, `CREATE INDEX IF NOT EXISTS idx_likes_user_ts ON likes(user_id, created_at DESC)`)
      ])
        .then(() => resolve())
        .catch(reject);
    });
  });
}

function upsertItem({ id, title, metadata }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO items (id, title, metadata, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, metadata=excluded.metadata'
    );
    stmt.run(id, title || null, JSON.stringify(metadata || {}), Date.now(), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addView({ userId, itemId }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO history (user_id, item_id, action, timestamp) VALUES (?, ?, ?, ?)'
    );
    stmt.run(userId, itemId, 'view', Date.now(), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function addLike({ userId, itemId }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO likes (user_id, item_id, created_at) VALUES (?, ?, ?) ON CONFLICT(user_id, item_id) DO NOTHING'
    );
    stmt.run(userId, itemId, Date.now(), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function removeLike({ userId, itemId }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('DELETE FROM likes WHERE user_id = ? AND item_id = ?');
    stmt.run(userId, itemId, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function getHistory({ userId, page = 1, limit = 20, sort = 'timestamp', order = 'DESC' }) {
  const offset = (Number(page) - 1) * Number(limit);
  const validSort = ['timestamp', 'item_id'];
  const validOrder = ['ASC', 'DESC'];
  const sortCol = validSort.includes(sort) ? sort : 'timestamp';
  const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
  const sql = `SELECT h.*, i.title, i.metadata FROM history h LEFT JOIN items i ON h.item_id = i.id WHERE h.user_id = ? ORDER BY ${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId, Number(limit), Number(offset)], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getLikes({ userId, page = 1, limit = 20, sort = 'created_at', order = 'DESC' }) {
  const offset = (Number(page) - 1) * Number(limit);
  const validSort = ['created_at', 'item_id'];
  const validOrder = ['ASC', 'DESC'];
  const sortCol = validSort.includes(sort) ? sort : 'created_at';
  const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
  const sql = `SELECT l.*, i.title, i.metadata FROM likes l LEFT JOIN items i ON l.item_id = i.id WHERE l.user_id = ? ORDER BY ${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId, Number(limit), Number(offset)], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  initDB,
  upsertItem,
  addView,
  addLike,
  removeLike,
  getHistory,
  getLikes,
};