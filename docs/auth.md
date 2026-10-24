# Authentication

The API (`openapi.yml`) uses Bearer JWT. `AuthResponse = { accessToken, refreshToken, user }`.
Endpoints: `/api/auth/login`, `/register`, `/refresh`, `/logout`, `/logout-all`, `/oauth/google`, `/oauth/apple`.

## Storage

| Token | Where | Why |
|---|---|---|
| access token | module variable in `features/auth/tokenStore.ts` (memory) | not readable after reload / by persisted storage |
| refresh token | `localStorage` (`climbd.refresh`) | keeps the user logged in when the PWA is reopened |
| user | `AuthProvider` state (from `AuthResponse.user`) | UI only, never trusted for permissions |

Never put tokens in URLs, logs, query keys or error reports.

## Boot

1. App starts with `status: 'loading'` (splash).
2. If a refresh token exists → `POST /api/auth/refresh` → store new tokens + user → `authenticated`.
3. Otherwise or on 401 → clear storage → `anonymous` → guards redirect to `/login?next=<path>`.

## Requests

`api/client.ts` creates one `Configuration` (`basePath: ''`) with middleware:

- **pre:** add `Authorization: Bearer <access>` when available.
- **post:** on `401` (except `/api/auth/*`) run a **single shared refresh** (concurrent 401s await the
  same promise), then retry the original request once. If refresh fails → logout.

## Logout

`POST /api/auth/logout`, then always: clear tokens, `queryClient.clear()`, navigate to `/login`.
Multi-tab: listen to `storage` events on `climbd.refresh` and log out other tabs.

## Authorization in UI

`RequireRole role="ADMIN"` hides admin screens; the backend still enforces every permission.

## Authenticated images

Wall images (`/api/wall-images/{id}/data` and `/thumbnail`) return **binary** and require the Bearer
token, so `<img src>` cannot load them directly. `shared/ui/AuthImage`:

1. `useWallImageBlob(url)` (TanStack Query, `staleTime: Infinity`) fetches through the authenticated
   client and returns a `Blob`.
2. The component creates `URL.createObjectURL(blob)` and revokes it on unmount/change.
3. Renders a normal `<img>` with `alt`, `width/height` (no layout shift) and a skeleton while loading.

This replaces the old app's base64 data URI approach (less memory, no conversion code).
If the backend later makes image GETs public, only `AuthImage` changes to a plain `<img>`.
