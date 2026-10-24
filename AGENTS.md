# Climbd Frontend — rules for humans and agents

Climbd is a mobile-first web app + PWA for climbing gyms: browse gyms and walls, view boulders
drawn on the wall photo, log ascents and set new boulders. Visual direction: **mockups/a-stencil.html**
(Direction A · Stencil), with the Gym & walls screen using the photo-on-top + boulder-list composition.

Read before coding:

- [docs/architecture.md](docs/architecture.md) — stack, folder structure, layers, data flow
- [docs/conventions.md](docs/conventions.md) — naming, components, TypeScript, styling, i18n, tests
- [docs/auth.md](docs/auth.md) — JWT storage, refresh flow, protected routes, authenticated images
- [docs/design-system.md](docs/design-system.md) — tokens, light/dark, typography, motion, a11y
- [docs/deployment.md](docs/deployment.md) — env, Docker, nginx, Cloudflare tunnel, PWA

## Stack (decided)

React 19 · TypeScript (strict) · Vite · React Router (data/lazy routes) · TanStack Query ·
OpenAPI-generated client (`typescript-fetch`) · Tailwind CSS v4 (no MUI) · react-i18next (ES + EN) ·
React 19 form actions (no form library) · vite-plugin-pwa · Vitest + Testing Library ·
ESLint + Prettier + Husky/lint-staged. Error tracking: none yet (error boundary is ready for it).

## Non-negotiables

1. **Never edit `src/api/generated/`.** Regenerate it from `openapi.yml` (`npm run generate:api`).
2. **Server data lives in TanStack Query**, never copied into `useState`/Context. Global client state is
   only the auth session (React Context). The selected gym/wall lives in the **URL**.
3. **No user-visible string in code.** Every text goes through `t()`; keys exist in both `es` and `en`.
4. **No raw colors, fonts or px spacing in components.** Use design tokens (Tailwind theme / CSS vars).
   Everything must work in light and dark.
5. **Tokens:** access token in memory only; refresh token in `localStorage`. Never log tokens.
6. **API calls are same-origin `/api/...`.** No hard-coded hosts.
7. **Features don't import from other features.** Shared code goes to `src/shared/`.
8. **Accessible by default:** semantic elements, labels, 44px touch targets, visible focus,
   `prefers-reduced-motion` respected.
9. **Before finishing a task:** `npm run lint`, `npm run typecheck`, `npm test` pass; check the UI in
   both themes and both languages at 390px width.
