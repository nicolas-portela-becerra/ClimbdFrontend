# Climbd Frontend

Mobile-first web app and PWA for climbing gyms: browse gyms and walls, view boulders drawn on the wall photo, and set, edit and delete boulders.

The project is being developed as a personal project and portfolio piece, with a focus on frontend architecture, a typed API client generated from the backend contract, authenticated image handling, touch gestures and an accessible, themeable UI.

It is the client of [ClimbdBackend](https://github.com/nicolas-portela-becerra/ClimbdBackend).

## Features

### Authentication & Authorization

- User registration and login
- JWT access token kept in memory, refresh token in `localStorage`
- Automatic token refresh and session expiry handling
- Protected routes
- Admin screen to activate new users
- Google OAuth authentication **(TODO)**
- Apple OAuth authentication **(TODO)**

### Gyms & Walls

- Browse gyms with pagination
- Create gyms with a logo
- Browse the walls of a gym
- Upload walls with a photo (preview and rotation before uploading)
- Edit the name and photo of a wall, or delete it
- Authenticated images (thumbnails and full photos) loaded through the API client
- Gym search **(TODO)**

### Boulders

- List the boulders of a wall with grade, creator and description
- View a boulder: its holds are drawn over the wall photo, in a bottom sheet with the boulder list
- Create boulders by marking holds on the wall photo
- Hold roles: start, hand, foot and top, with the climbing rules enforced (1-2 starts and exactly 1 top)
- Select, move, resize and delete holds, with undo
- Edit and delete boulders (creator and administrator only)
- The open boulder lives in the URL (`?boulder=ID`), so it can be shared

### Photo interaction

- Pinch, drag, wheel and button zoom of the wall photo (1x to 4x)
- Gesture handling written from scratch, with no dependency

### Interface

- Light and dark themes
- Spanish and English
- Installable PWA with its own icons
- Accessible by default: semantic elements, labels, 44px touch targets, visible focus and `prefers-reduced-motion`

---

## Tech Stack

| Technology               | Purpose                               |
| ------------------------ | ------------------------------------- |
| React 19                 | UI library                            |
| TypeScript (strict)      | Programming language                  |
| Vite                     | Build tool and dev server             |
| React Router             | Routing (data and lazy routes)        |
| TanStack Query           | Server state, caching and pagination  |
| OpenAPI Generator        | Typed API client (`typescript-fetch`) |
| Tailwind CSS v4          | Styling with design tokens            |
| react-i18next            | Internationalization (ES + EN)        |
| React 19 form actions    | Forms, with no form library           |
| vite-plugin-pwa          | Installable PWA                       |
| Vitest + Testing Library | Unit and component tests              |
| ESLint, Prettier, Husky  | Code quality                          |
| Docker + nginx           | Containerized deployment              |

---

## Architecture

The code is organized by feature. Features don't import from each other: shared code goes to `src/shared/`, and routes compose the features.

```text
src/
├── api/            # generated client (never edited), client setup, TanStack Query hooks
├── app/            # providers, router
├── features/
│   ├── auth/
│   ├── gyms/
│   ├── walls/
│   ├── boulders/
│   ├── boulder-editor/
│   └── users/
├── routes/         # one file per screen
├── shared/         # UI components, hooks, icons, pure helpers
├── i18n/           # ES and EN texts
├── styles/ theme/  # design tokens, light and dark
├── pwa/
└── test/
```

Server data lives in TanStack Query. The only global client state is the auth session. The selected gym and wall live in the URL.

More details are in the [`docs`](./docs) folder:

- [Architecture](./docs/architecture.md)
- [Conventions](./docs/conventions.md)
- [Authentication](./docs/auth.md)
- [Design system](./docs/design-system.md)
- [Deployment](./docs/deployment.md)

---

## API

The frontend uses the OpenAPI contract of the backend, kept in [`openapi.yml`](./openapi.yml). The client in `src/api/generated` is generated from it and must never be edited by hand:

```bash
npm run generate:api
```

The generator needs Java installed. All calls are same-origin (`/api/...`), so there is no API URL to configure and no CORS.

---

## Running locally

Clone the repository:

```bash
git clone https://github.com/nicolas-portela-becerra/ClimbdFrontend.git
cd ClimbdFrontend
```

Install the dependencies:

```bash
npm install
```

Start the backend on port `8080`, then run the dev server:

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8080`.

### Scripts

| Script                 | Purpose                         |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Dev server                      |
| `npm run build`        | Type check and production build |
| `npm run lint`         | ESLint                          |
| `npm run typecheck`    | TypeScript check                |
| `npm test`             | Unit tests                      |
| `npm run format`       | Prettier                        |
| `npm run generate:api` | Regenerate the API client       |

---

## Deployment

The app is built into a Docker image: nginx serves the static files and proxies `/api/` to the backend in the same compose network. The image regenerates the API client from `openapi.yml` during the build.

See [Deployment](./docs/deployment.md) for the environment, Docker, nginx, Cloudflare tunnel and PWA details.

---

## Project Goals

The main goal of this project is to build a realistic frontend for a climbing application while exploring practices that are useful beyond a simple CRUD screen.

Some of the areas explored by the project include:

- Feature-based architecture with enforced boundaries
- API-first development with a generated, typed client
- JWT authentication with refresh and protected routes
- Authenticated image loading
- Server state with TanStack Query
- Touch gestures: pinch zoom, pan and dragging items on an image
- SVG drawing over photos
- Design tokens with light and dark themes
- Internationalization
- Accessibility
- Progressive Web App
- Containerization

---

## Project Status

This project is actively being developed.

Gym search, OAuth login, a logbook and offline mode are not built yet. Wall editing and deleting need endpoints that the backend does not provide yet.

Some parts of the application may therefore change as the project evolves.

---

## License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.

---

## Author

**Nicolas Portela Becerra**

GitHub: [@nicolas-portela-becerra](https://github.com/nicolas-portela-becerra)
