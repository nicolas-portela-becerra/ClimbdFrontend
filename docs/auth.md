# Authentication

The API (`openapi.yml`) uses Bearer JWT. `AuthResponse = { accessToken, refreshToken, user }`.
Endpoints: `/api/auth/login`, `/register`, `/refresh`, `/logout`, `/logout-all`, `/oauth/google`, `/oauth/apple`.

## Storage

| Token         | Where                                                     | Why                                               |
| ------------- | --------------------------------------------------------- | ------------------------------------------------- |
| access token  | module variable in `features/auth/tokenStore.ts` (memory) | not readable after reload / by persisted storage  |
| refresh token | `localStorage` (`climbd.refresh`)                         | keeps the user logged in when the PWA is reopened |
| user          | `AuthProvider` state (from `AuthResponse.user`)           | UI only, never trusted for permissions            |

Never put tokens in URLs, logs, query keys or error reports.

All session logic lives in `features/auth/session.ts` (`api/` can't import from `features/`, so `api/client.ts` receives its handlers through `registerAuthHandlers`). `AuthProvider` only mirrors session events into React state.

## Boot

1. App starts with `status: 'loading'` (splash).
2. If a refresh token exists → `POST /api/auth/refresh` → store new tokens + user → `authenticated`.
3. If the server **rejects** the token → clear storage → `anonymous`. If the server **can't be reached**, the saved token is kept and the user sees the login screen; reloading retries.
4. Guards redirect anonymous users to `/login?next=<path>`.

## Requests

`api/client.ts` creates one `Configuration` (`basePath: ''`) with middleware:

- **pre:** add `Authorization: Bearer <access>` when available.
- **post:** on `401` (except `/api/auth/*`, but `logout-all` is included) run a **single shared refresh** (concurrent 401s await the
  same promise), then retry the original request once. If the refresh is rejected → session expired. If the server is unreachable → the original 401 is returned and the session is kept.

## Logout

`POST /api/auth/logout`, then always: clear tokens and `queryClient.clear()`. `RequireAuth` sends the user to a plain `/login` (no `?next=`).
Multi-tab: a `storage` event removing `climbd.refresh` logs out the other tabs.

## Session expired

When a refresh is rejected mid-use: tokens are cleared, the user goes to `/login?next=<current path>` and the login screen shows the translated notice `auth:notices.sessionExpired`. After logging in they return to `next` (internal paths only); a normal login goes to `/gyms`.

## Register

`POST /api/auth/register` does not start a session (the returned tokens are discarded). The user goes to `/login` with the notice `auth:notices.accountCreated`.

OAuth (Google/Apple) is not implemented yet.

## Authorization in UI

`RequireRole role="ADMIN"` hides admin screens; the backend still enforces every permission.

## Authenticated images

Wall images (`/api/wall-images/{id}/data` and `/thumbnail`) return **binary** and require the Bearer
token, so `<img src>` cannot load them directly. `shared/ui/AuthImage`:

1. `useWallImageThumbnail(id)` (`api/queries/useWallImageBlob.ts`, TanStack Query, `staleTime: Infinity`)
   fetches through the authenticated client and returns a `Blob`.
2. A feature component passes that `blob` to `shared/ui/AuthImage` (shared never imports `api/`).
3. `AuthImage` renders a normal `<img>`, creating `URL.createObjectURL(blob)` and revoking it on unmount.
   Until the blob arrives the `<img>` has no source, so the parent's placeholder stays visible (also on failure).

This replaces the old app's base64 data URI approach (less memory, no conversion code).
If the backend later makes image GETs public, only `AuthImage` changes to a plain `<img>`.

## Login errors

The login endpoint answers **401** for wrong credentials and **423 (Locked)** for a deactivated account
(`loginErrorKey` in `features/auth/actions.ts`): 423 shows `auth:errors.notActivated`, 401 shows
`invalidCredentials`.

The notices above the login form (account created, session expired) disappear after 5 s or when Log in is
pressed, and a login error replaces them (one message at a time).
