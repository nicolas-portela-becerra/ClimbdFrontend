# Architecture

## Layers

```
 routes (pages)  ──►  features (UI + hooks per domain)  ──►  shared (ui, lib, hooks)
                               │
                               ▼
                  api/queries (TanStack Query hooks)  ──►  api/client  ──►  api/generated
```

Imports only flow downwards/rightwards. `shared` never imports from `features` or `app`.
A feature never imports another feature; if two features need something, move it to `shared`.

## Folder structure

```
.
├── AGENTS.md                     # rules entry point
├── docs/                         # this documentation
├── mockups/                      # static design reference (not shipped)
├── openapi.yml                   # API contract (source for src/api/generated)
├── public/
│   ├── icons/                    # PWA icons (192, 512, maskable), favicon
│   └── robots.txt
├── Dockerfile                    # build → nginx
├── nginx.conf                    # SPA fallback + /api proxy + cache headers
├── vite.config.ts                # aliases, dev proxy, PWA plugin
└── src/
    ├── main.tsx                  # mounts <App/>, imports styles + i18n
    ├── app/                      # app shell: wiring only, no business logic
    │   ├── App.tsx               # providers + router
    │   ├── providers.tsx         # QueryClientProvider, AuthProvider, ThemeProvider
    │   ├── router.tsx            # route tree (lazy routes)
    │   ├── layouts/
    │   │   ├── AppLayout.tsx     # tab bar + <Outlet/> for logged-in area
    │   │   └── AuthLayout.tsx    # login / register shell
    │   ├── guards/
    │   │   ├── RequireAuth.tsx   # redirects to /login?next=…
    │   │   └── RequireRole.tsx   # ADMIN-only screens
    │   └── ErrorBoundary.tsx     # route + root error screens
    │
    ├── routes/                   # one file per URL, thin: read params, compose features
    │   ├── login.tsx
    │   ├── register.tsx
    │   ├── gyms.tsx                      # /gyms           (choose gym)
    │   ├── gym-walls.tsx                 # /gyms/:gymId    (wall photo + boulder list)
    │   ├── boulder-detail.tsx            # /boulders/:boulderId
    │   ├── boulder-create.tsx            # /gyms/:gymId/walls/:wallId/new
    │   ├── profile.tsx                   # /me (theme, language, logout)
    │   └── not-found.tsx
    │
    ├── features/                 # domain modules
    │   ├── auth/
    │   │   ├── AuthProvider.tsx  # session context (user, status, login, logout)
    │   │   ├── tokenStore.ts     # access token (memory) + refresh token (localStorage)
    │   │   ├── useAuth.ts
    │   │   ├── components/       # LoginForm, RegisterForm, OAuthButtons
    │   │   └── actions.ts        # React 19 form actions + validation
    │   ├── gyms/
    │   │   ├── components/       # GymList, GymHeader, ChangeGymButton
    │   │   └── lastGym.ts        # remembers last visited gym (localStorage)
    │   ├── walls/
    │   │   └── components/       # WallCarousel, WallPhoto
    │   ├── boulders/
    │   │   ├── components/       # BoulderList, BoulderRow, BoulderHolds (SVG rings), GradeTape
    │   │   └── grades.ts
    │   └── boulder-editor/
    │       ├── components/       # EditorCanvas, RolePicker
    │       └── useHoldEditor.ts  # pure state for tapping holds (undo/clear/validation)
    │
    ├── api/
    │   ├── generated/            # ⚠ generated, never edited
    │   ├── client.ts             # one Configuration: basePath "", auth + refresh middleware
    │   ├── queryClient.ts        # QueryClient defaults (staleTime, retry rules)
    │   ├── keys.ts               # query-key factory: qk.gyms.list(), qk.boulders.byWall(id)…
    │   └── queries/              # useGyms, useGym, useWallImages, useBoulders, useBoulder,
    │                             # useCreateBoulder, useWallImageBlob …
    │
    ├── shared/
    │   ├── ui/                   # design-system primitives: Button, Tape, TextField, IconButton,
    │   │                         # TabBar, Sheet, Spinner, EmptyState, ErrorState, AuthImage
    │   ├── hooks/                # useMediaQuery, usePrefersReducedMotion, useOnline…
    │   ├── lib/                  # pure helpers: format, storage, cn() (class merge)
    │   └── icons/                # SVG icon components
    │
    ├── theme/
    │   ├── ThemeProvider.tsx     # system | light | dark, sets <html data-theme>
    │   └── tokens.css            # CSS variables for both themes + Tailwind @theme mapping
    │
    ├── i18n/
    │   ├── index.ts              # i18next init + language detector (fallback es)
    │   ├── i18next.d.ts          # typed keys
    │   └── locales/
    │       ├── es/{common,auth,gyms,boulders,editor}.json
    │       └── en/{common,auth,gyms,boulders,editor}.json
    │
    ├── styles/
    │   └── index.css             # @import "tailwindcss"; tokens; base layer; fonts
    │
    ├── pwa/
    │   └── registerSW.ts         # update prompt ("New version available")
    │
    └── test/
        ├── setup.ts              # Testing Library + jest-dom
        └── render.tsx            # renderWithProviders (query client, i18n, router, auth)
```

Tests live next to the code they test: `BoulderRow.tsx` + `BoulderRow.test.tsx`.

## Routing

- React Router with `createBrowserRouter`; every route component is `lazy()` (code-splitting).
- Public: `/login`, `/register`. Everything else is under `RequireAuth` + `AppLayout`.
- `/` redirects to the last visited gym (`/gyms/:gymId`) or to `/gyms` if none.
- **The URL is the state** for selection: gym, wall (`?wall=id`), boulder. Refresh, back button and
  shared links must always reproduce the same screen.
- Each route has an `errorElement` and a 404 route exists.

## State

| Kind | Where | Examples |
|---|---|---|
| Server data | TanStack Query | gyms, walls, boulders, favourites (future, stored in backend) |
| Session | `AuthProvider` (Context) | user, status, login/logout |
| Selection | URL | gymId, wallId, boulderId |
| Preferences | `localStorage` via small helpers | theme, language, last gym |
| Local UI | `useState` in the component | sheet open, selected hold role |

No Redux/Zustand. Revisit only if real client-side state grows (e.g. offline queue).

## Data fetching

- Only `src/api/queries/*` call the generated client. Components call the hooks.
- Query keys come from `api/keys.ts`; never inline arrays.
- Mutations invalidate the minimum set of keys (`qk.boulders.byWall(wallId)`, …).
- Defaults: `staleTime` 60 s for lists, `retry` 1 and never on 401/403/404.
- Loading, empty and error states are always rendered (`shared/ui/EmptyState`, `ErrorState`).

## PWA

Installable now (manifest + basic service worker via `vite-plugin-pwa`, `registerType: 'prompt'`).
Planned later, configuration-only: offline app shell, runtime caching of wall images for favourite gyms.
Never cache `/api/auth/*`.
