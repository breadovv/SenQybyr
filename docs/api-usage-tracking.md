API Usage Tracking

Overview

- Provides endpoints to record interactions (views/likes), retrieve history, and fetch liked items.
- Mirrors existing index patterns: auth handling, pagination, sorting/filtering, and rate limiting.
- Includes monitoring for performance, usage, and error rates via `/api/metrics`.

Authentication

- Optional for reads; required for writes.
- Header: `Authorization: Bearer <token>`
- Identity extracted from token; if missing, reads default to anonymous scope.

Endpoints

- `POST /api/interactions`
  - Purpose: Record a view or like/unlike.
  - Body: `{ action: "view" | "like" | "unlike", item: { id: string, title?: string, metadata?: object } }`
  - Responses:
    - 200: `{ ok: true }`
    - 400: `{ error: "INVALID_ACTION" | "INVALID_ITEM" }`
    - 401: `{ error: "UNAUTHORIZED" }` when token missing/invalid
  - Rate limiting: 60 requests per minute per IP.

- `GET /api/history`
  - Purpose: Retrieve timestamped history (views).
  - Query: `?page=1&limit=20&sort=timestamp&order=desc&q=<text>`
  - Responses:
    - 200: `{ data: [ { id, item_id, user_id, timestamp, item: { id, title, metadata } } ], page, limit, total }`

- `GET /api/likes`
  - Purpose: Fetch liked items.
  - Query: `?page=1&limit=20&sort=liked_at&order=desc&q=<text>`
  - Responses:
    - 200: `{ data: [ { item_id, user_id, liked_at, item: { id, title, metadata } } ], page, limit, total }`

Database Schema

- `items`
  - `id TEXT PRIMARY KEY`
  - `title TEXT`
  - `metadata JSON`
  - `created_at INTEGER`

- `history`
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `user_id TEXT`
  - `item_id TEXT`
  - `timestamp INTEGER`

- `likes`
  - `user_id TEXT`
  - `item_id TEXT`
  - `liked_at INTEGER`
  - `PRIMARY KEY(user_id, item_id)`

Sorting and Filtering

- History: sortable by `timestamp`; filter by `q` to match item title (LIKE).
- Likes: sortable by `liked_at`; filter by `q` to match item title (LIKE).

Error Codes

- `INVALID_ACTION`: action must be `view`, `like`, or `unlike`.
- `INVALID_ITEM`: item payload is missing or malformed.
- `UNAUTHORIZED`: write endpoints require a valid token.
- `RATE_LIMITED`: too many requests; wait and retry.

Usage Examples

- Record a view:
  - `POST /api/interactions`
  - Body: `{ "action": "view", "item": { "id": "abc123", "title": "Sample", "metadata": { "category": "demo" } } }`

- Like an item:
  - `POST /api/interactions`
  - Body: `{ "action": "like", "item": { "id": "abc123" } }`

- Retrieve history:
  - `GET /api/history?page=1&limit=20&order=desc&q=Sam`

- Retrieve likes:
  - `GET /api/likes?page=1&limit=20&order=desc`

Monitoring

- `GET /api/metrics`
  - Returns uptime, request counts, error counts, average/max durations, and per-route stats.
  - Intended for dashboards and alerting.

Security and Privacy

- Scopes data by `user_id`; anonymous reads allowed when token absent.
- Stores minimal metadata; avoid sensitive PII in `items.metadata`.
- Supports token-based auth; integrate with your existing issuance and revocation.
  
Deployment Notes

- Requires Node.js 18+.
- Install dependencies: `npm install`
- Run server: `npm start` (serves static assets and API on the same port)