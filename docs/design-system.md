# Design system (Direction A · Stencil)

Reference: `mockups/a-stencil.html`. Gym & walls uses wall-photo carousel on top + boulder list below.

## Tokens

Defined once in `src/theme/tokens.css` as CSS variables, mapped into Tailwind with `@theme`.
Components use only these names.

| Token | Light | Dark | Use |
|---|---|---|---|
| `ground` | #e8e7e3 | #10110f | page background |
| `surface` | #f6f5f2 | #191a18 | cards, inputs bg |
| `raised` | #ffffff | #22231f | pressed/selected |
| `ink` | #141414 | #ecebe6 | text, borders |
| `muted` | #57554f | #a29f97 | secondary text |
| `line` | ink 14 % | ink 14 % | dividers |
| `accent` / `on-accent` | #0d6a4b / #fff | #3cbf86 / #06130d | primary actions |
| `accent-field` | #d6e7de | #15291f | tinted panels |
| `tape` / `on-tape` | ink / ground | ink / ground | grade tape |
| `start` `hand` `foot` `finish` | #16c25a #1fb8e6 #f4a10b #ee2f86 | same | hold roles (`HoldDto.color` 0..3) |

Fonts: `display` Big Shoulders Stencil (titles, grades), `cond` Barlow Semi Condensed (labels,
uppercase UI), `text` Barlow (body). Self-host them (no Google Fonts request) so they work offline.

## Theme

- `ThemeProvider`: `system | light | dark`, saved in `localStorage`, applied as `<html data-theme>`.
- `system` follows `prefers-color-scheme` live. Set `color-scheme` and `<meta name="theme-color">`.
- Photos are never themed; overlays on photos use fixed dark gradients.

## Shape & layout

- Hard edges: `border-radius: 0` (except hold rings). Borders 2px `ink` or `line`.
- Mobile-first at 390px; content max width ~560px centred on larger screens.
- Touch targets ≥ 44px. Respect safe areas (`env(safe-area-inset-*)`) for the tab bar.

## Motion

- Ease-out `cubic-bezier(.23,1,.32,1)`; 140–260 ms. Press feedback `scale(.97)`.
- Animate only `transform`/`opacity`. No animation on first paint of lists.
- `prefers-reduced-motion: reduce` → fades only, no scale/slide.

## Accessibility

- Contrast AA in both themes (check `muted` on `surface`).
- Visible focus ring (`outline 2px ink, offset 2px`), never removed.
- Icon-only buttons have `aria-label` (translated). Hold role is never colour-only:
  foot uses a dashed ring, legend has text.
- Images have meaningful `alt` or `alt=""` when decorative.
