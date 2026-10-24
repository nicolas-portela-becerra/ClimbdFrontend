# Environments & deployment

## Topology

```
Internet ─► Cloudflare tunnel ─► frontend container (nginx :80)
                                   ├─ /        → static app (SPA fallback to index.html)
                                   └─ /api/    → proxy to backend:8080 (same compose network)
```

Same origin: no CORS, no API URL to configure, cookies/tokens scoped to one host.

## Configuration

- The API base path is always `''` (relative `/api/...`). No `VITE_API_URL`.
- Development: Vite dev server proxies `/api` → `http://localhost:8080` (`vite.config.ts` `server.proxy`).
- Any future public config uses `VITE_*` variables in `.env` / `.env.local` (git-ignored), typed in
  `src/vite-env.d.ts`. Never put secrets in `VITE_*` — they end up in the bundle.

## API client generation

`npm run generate:api` → `openapi-generator-cli generate -i openapi.yml -g typescript-fetch -o src/api/generated`.
Run after every `openapi.yml` change and commit the result. The Docker build may also regenerate it.

## Docker

- Multi-stage `Dockerfile`: `node:24-alpine` builds (`npm ci && npm run build`), `nginx:alpine` serves `dist/`.
- `docker-compose.yml` (parent folder) `frontend` service builds `./ClimbdFrontend`, port `8081:80`.

## nginx rules

- `try_files $uri $uri/ /index.html` (client-side routes).
- `/api/` → `proxy_pass http://backend:8080` with `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`.
- Cache: `/assets/*` (hashed) `public, max-age=31536000, immutable`;
  `index.html`, `sw.js`, `manifest.webmanifest` → `no-cache` (so PWA updates arrive).
- gzip on; security headers (`X-Content-Type-Options`, `Referrer-Policy`, CSP when stable).

## PWA

- `vite-plugin-pwa`: manifest (name, icons 192/512/maskable, `display: standalone`, theme colors),
  `registerType: 'prompt'` + in-app "Update available" toast.
- Installable requires HTTPS — provided by Cloudflare.
- Later (config only): precache app shell for offline start; runtime cache wall images of favourite gyms.
