# Coding conventions

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
- No `any`. Use `unknown` and narrow. No non-null `!` unless a comment explains why it is safe.
- Use the generated DTO types (`GymDto`, `BoulderDetailDto`…) — never redefine API shapes by hand.
- Type-only imports use `import type`.
- Path aliases: `@/` → `src/`, `@api` → `src/api/generated`.

## Naming

| Thing | Style | Example |
|---|---|---|
| Components / their files | PascalCase | `BoulderRow.tsx` |
| Hooks | `useX`, camelCase file | `useBoulders.ts` |
| Other modules | camelCase | `tokenStore.ts` |
| Route files | kebab-case | `gym-walls.tsx` |
| i18n keys | `namespace:section.key` camelCase | `boulders:list.empty` |
| Booleans | `is/has/can` | `isValid`, `hasFinish` |

Named exports everywhere, except route modules (default export for `lazy()`).

## Components

- Function components only; one exported component per file.
- Props typed with a `type XProps = {…}` next to the component.
- Keep components presentational; data comes from hooks at the route/feature level.
- Split a component when it exceeds ~150 lines or mixes data fetching with layout.
- No `useEffect` for derived data or data fetching. Effects only sync with external systems.
- Lists use stable ids as `key`, never the index.

## Forms (React 19 actions)

- `<form action={action}>` + `useActionState` for result/errors, `useFormStatus` for pending buttons.
- Validation lives in a pure function in `actions.ts` returning `{ fieldErrors, formError }`,
  with i18n keys as messages. The server is still the source of truth: map 400/409 responses to fields.
- Inputs have `<label>`, `name`, correct `type` and `autocomplete`; errors use `aria-describedby`.

## Styling

- Tailwind utilities that use **theme tokens only** (`bg-ground`, `text-ink`, `font-display`…).
  Arbitrary values (`[#123456]`, `[13px]`) are not allowed except for one-off geometry, with a comment.
- Repeated patterns become a `shared/ui` component, not a copied class string.
- Use `cn()` to merge conditional classes.
- See [design-system.md](design-system.md).

## i18n

- `useTranslation('namespace')`; one namespace per feature + `common`.
- Every key in `es` **and** `en`. Plurals with i18next `_one`/`_other`. Interpolation, not concatenation.
- Dates/numbers via `Intl` with the current language. Grades (6A+, 7B) are not translated.

## Errors

- API errors are `ResponseError`; map status codes to i18n messages in one helper (`shared/lib/apiError.ts`).
- Never `console.log` in committed code (`console.error` only inside the error boundary).
- Route-level `errorElement` + root `ErrorBoundary` with a retry action.

## Testing (Vitest + Testing Library)

- Test behaviour, not implementation: query by role/label text as a user would.
- Required: pure logic (grades, hold editor, validation, token refresh) and key components.
- Use `renderWithProviders` from `src/test/render.tsx`. Mock the API at the `fetch` level.

## Tooling

- Prettier formats; ESLint (typescript-eslint, react-hooks, jsx-a11y) catches bugs. Don't fight them.
- Husky pre-commit runs lint-staged (eslint --fix + prettier on staged files) and typecheck.
- Scripts: `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `generate:api`.

## Git

- Small commits, imperative messages ("Add boulder list row"). One concern per commit.
