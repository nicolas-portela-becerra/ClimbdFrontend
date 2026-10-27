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
    │   ├── gym-walls.tsx                 # /gyms/:gymId    (title + list of the gym's walls)
    │   ├── wall-boulders.tsx             # /gyms/:gymId/walls/:wallId (wall photo + boulders of the wall)
    │   ├── users-activate.tsx            # /users/activate (ADMIN only: activate pending users)
    │   ├── profile.tsx                   # /me (theme, language, logout)
    │   └── not-found.tsx
    │
    ├── features/                 # domain modules
    │   ├── auth/
    │   │   ├── AuthProvider.tsx  # mirrors session events into state (status, user, endReason)
    │   │   ├── tokenStore.ts     # access token (memory) + refresh token (localStorage)
    │   │   ├── session.ts        # login/register/logout/refresh, boot, cross-tab sync, session events
    │   │   ├── useAuth.ts        # AuthContext + useAuth hook
    │   │   ├── components/       # LoginForm, RegisterForm (OAuthButtons: not implemented yet)
    │   │   └── actions.ts        # React 19 form actions + validation
    │   ├── gyms/
    │   │   ├── components/       # GymList, GymRow, GymLogo (whole logo + auto black/white background), GymHeader, ChangeGymButton,
    │   │                     # NewGymButton + CreateGymModal (local-state modal) + LogoPicker (sent untouched as base64)
    │   │   └── lastGym.ts        # empty, unused for now (`/` always redirects to /gyms)
    │   ├── walls/
    │   │   ├── components/       # WallList, WallRow, WallHeader (loads/validates the wall), WallHero,
    │   │   │                     # NewWallButton + UploadWallModal (local-state modal) + PhotoPicker (preview + rotate)
    │   │   ├── actions.ts        # upload form validation + error mapping
    │   │   └── photo.ts          # accepted types, 5 MB limit, rotatePhoto()
    │   ├── boulders/
    │   │   └── components/       # BoulderList, BoulderRow, GradeTape, BoulderHolds (photo + SVG rings),
    │   │                         # BoulderViewer (full-screen boulder over the wall photo)
    │   ├── users/
    │   │   └── components/       # UserList, UserRow (activate one user)
    │   └── boulder-editor/
    │       ├── components/       # NewBoulderButton, CreateBoulderModal (2 steps), EditorCanvas, RolePicker, DetailsForm
    │       ├── actions.ts        # details-form validation + save error mapping
    │       └── useHoldEditor.ts  # pure hold logic (tap/undo/clear/validateHolds) + the hook
    │
    ├── api/
    │   ├── generated/            # ⚠ generated, never edited
    │   ├── client.ts             # one Configuration: basePath "", auth + refresh middleware
    │   ├── queryClient.ts        # QueryClient defaults (staleTime, retry rules)
    │   ├── keys.ts               # query-key factory: qk.gyms.list(), qk.boulders.byWall(id)…
    │   └── queries/              # useGyms, useGym, useWallImages, useBouldersByWall, useBoulder,
    │                             # useCreateBoulder, useWallImage, useWallImageBlob …
    │
    ├── shared/
    │   ├── ui/                   # design-system primitives: Button, Tape, TextField, IconButton,
    │   │                         # TabBar, Sheet (draggable bottom sheet), Overlay (portal modal layer), ModalPanel/ModalHeader (full-screen modal page), ToastProvider (error pop-up),
    │   │                         # SelectField, TextAreaField, HoldRing, BlobImage, Spinner, EmptyState, ErrorState, AuthImage
    │   ├── hooks/                # usePrefersReducedMotion, useToast, useFieldError, useMediaQuery, useOnline…
    │   ├── lib/                  # pure helpers: format, storage, cn() (class merge), holds (roles), grades
    │   └── icons/index.tsx       # SVG icon components
    │
    ├── theme/
    │   ├── ThemeProvider.tsx     # system | light | dark, sets <html data-theme>
    │   ├── useTheme.ts           # ThemeContext + useTheme hook
    │   └── tokens.css            # CSS variables for both themes + Tailwind @theme mapping
    │
    ├── i18n/
    │   ├── index.ts              # i18next init + language detector (fallback es), setLanguage()
    │   ├── resources.ts          # imports every locale JSON, supported languages, default namespace
    │   ├── i18next.d.ts          # typed keys
    │   └── locales/
    │       ├── es/{common,auth,gyms,walls,boulders,editor}.json
    │       └── en/{common,auth,gyms,walls,boulders,editor}.json
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
- Public: `/login`, `/register`. Everything else is under `RequireAuth`.
- `AppLayout` (bottom tab bar) wraps `/gyms`, `/gyms/:gymId`, `/gyms/:gymId/walls/:wallId`, `/me` and the admin-only `/users/activate` (behind `RequireRole`; its lock tab shows only to ADMIN users). The boulder viewer and the create-boulder modal are full-screen overlays on top of the wall screen, so the tab bar is covered while they are open.
- `/` redirects to `/gyms`.
- A boulder opens over its wall screen through the query param `?boulder=ID` (`BoulderViewer`, built on `shared/ui/Overlay`: a portal layer that makes the page behind `inert` and stays mounted while it animates out). Opening pushes a history entry, picking another boulder from the sheet replaces it, and the back arrow goes back (or replaces the URL on a direct link).
- `<ScrollRestoration />` sits in the root route: back/forward restores the scroll position. In-app "back" arrows must call `navigate(-1)` (falling back to a link when there is no history) so they count as going back. Lists that should survive the trip back keep their query data longer (`gcTime`, see `useWallImages`).
- Pages are default exports loaded with `lazy`; the root route has a `hydrateFallbackElement` (centred `Spinner`) shown while the first page's code loads.
- **The URL is the state** for selection: gym, wall (`?wall=id`), boulder. Refresh, back button and
  shared links must always reproduce the same screen.
- Each route has an `errorElement` and a 404 route exists.

## State

| Kind        | Where                            | Examples                                                      |
| ----------- | -------------------------------- | ------------------------------------------------------------- |
| Server data | TanStack Query                   | gyms, walls, boulders, favourites (future, stored in backend) |
| Session     | `AuthProvider` (Context)         | user, status, login/logout                                    |
| Selection   | URL                              | gymId, wallId, boulderId                                      |
| Preferences | `localStorage` via small helpers | theme, language, last gym                                     |
| Local UI    | `useState` in the component      | sheet open, selected hold role                                |

No Redux/Zustand. Revisit only if real client-side state grows (e.g. offline queue).

## Data fetching

- Only `src/api/queries/*` call the generated client. Components call the hooks.
- Query keys come from `api/keys.ts`; never inline arrays.
- Mutations invalidate the minimum set of keys (`qk.boulders.byWall(wallId)`, …).
- Defaults: `staleTime` 60 s for lists, `retry` 1 and never on 401/403/404.
- Loading, empty and error states are always rendered (`shared/ui/EmptyState`, `ErrorState`).

## PWA

Installable now (manifest + basic service worker via `vite-plugin-pwa`, `registerType: 'autoUpdate'`: new versions apply silently on the next load).
Planned later, configuration-only: offline app shell, runtime caching of wall images for favourite gyms.
Never cache `/api/auth/*`.
