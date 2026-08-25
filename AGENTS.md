# Base44 Dev Environment

## Stack
- **Frontend:** Vite + React (port 3000). `npm run dev` serves live source with HMR.
- **Backend:** Express (port 5000) using Prisma ORM against MySQL. Controllers fall back to in-memory mock data if the DB is unreachable, but MySQL is wired up so the full stack is real.
- **Database:** MySQL 8 (compose service `db`). Schema in `prisma/schema.prisma` (provider = mysql).

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- `deps` (one-shot) installs node_modules into a shared named volume.
- `migrate` (one-shot, after db healthy + deps) runs `prisma generate`, `prisma db push`, and `server/scripts/seed.js`.
- `api` runs `node --watch server/server.js` (live reload on backend edits).
- `web` runs `npm run dev` (Vite, live reload on frontend edits), exposed on host port 3000.

## Wiring notes
- Vite proxies `/api` to the backend. The proxy target is env-configurable via `VITE_API_PROXY_TARGET` (defaults to `http://localhost:5000` for local dev; set to `http://api:5000` in compose). Single-origin: only port 3000 is public.
- `vite.config.js` sets `allowedHosts: true` so the preview's external hostname is accepted.
- `DATABASE_URL` is set in `.env.base44-defaults` (mysql connection to the `db` service). `/run/base44/app.env` is loaded last so any real secret overrides it.

## Secrets
No external credentials are required to boot. JWT_SECRET and Flipkart affiliate IDs all have working defaults in code. If real Flipkart affiliate credentials are needed later, set `FLIPKART_AFFILIATE_ID` / `FLIPKART_AFFILIATE_TOKEN` via the platform secrets (delivered to `/run/base44/app.env`).

## Verify
- `curl -sf http://localhost:3000/` returns the Vite-served HTML.
- `curl -sf http://localhost:3000/api/health` returns healthy status.
- `curl -sf "http://localhost:3000/api/products"` returns the product catalog.
