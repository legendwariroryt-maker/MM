## Living background: nocturnal starfield

Replace the current static hero background with a real animated night sky that lives behind every section of the landing page (fixed, behind the scroll-scrubbed owl video). Three parallax layers:

1. **Deep field** — canvas-drawn stars (~250) with subtle twinkle (opacity + radius sine wave), very slow drift.
2. **Mid field** — larger stars + occasional shooting star that arcs across every ~8-12s.
3. **Foreground** — 2 soft glowing moons/orbs that drift slowly with a mouse-parallax offset, plus a slow-moving low-opacity nebula gradient (conic-gradient, `animate-spin` at 120s).

The starfield sits at `fixed inset-0 -z-20`, the owl video stays at `-z-10`, hero content on top. Fades gently to `background` at the bottom via a mask so lower sections keep readability.

Implementation: one lightweight `<StarfieldBackground />` component using `<canvas>` + `requestAnimationFrame` (no three.js — keeps bundle small; the "silk WebGL" option was not picked). Respects `prefers-reduced-motion` (freezes animation).

## Typography: Syne + Plus Jakarta Sans

- Install `@fontsource/syne` and `@fontsource/plus-jakarta-sans` via bun, import in `src/main.tsx`.
- Add `font-display: Syne` (headings) and `font-sans: Plus Jakarta Sans` (body) to `tailwind.config.ts`.
- Replace every `font-serif` on `Landing.tsx` with `font-display`. Headings get tight tracking (`tracking-[-0.02em]`) and Syne's geometric weight; the italic accent phrases (`Your mind matters.` / `We're here for you.`) switch to Syne italic weight 600.
- Body copy and eyebrows use Plus Jakarta Sans.

## Hand-drawn / sketchy UI accents

A cohesive whimsical layer that ties into Sir Hootington:

- **Trust badges** ("100% Private", "24/7 Available", "Completely Free"): replace the plain pill with a hand-drawn SVG rough-border wrapper (wobbly stroke, `stroke-dasharray` doodle underline on hover). Icons get a small sketched circle behind them.
- **Feature cards**: add a subtle inline SVG squiggle underline under each title, a rough hand-drawn corner flourish (top-right), and swap the solid gradient icon tile for a sketched circle outline + gradient fill with a slight rotation on hover (`hover:-rotate-3`).
- **Buttons** ("Begin Your Journey", "Start Your Journey"): keep the primary fill but add an animated sketched outline that draws itself on hover (`stroke-dasharray` + `stroke-dashoffset` transition), plus a tiny doodle star that pops next to the arrow on hover.
- **Section eyebrows** ("A Sanctuary for the Mind", etc.): flank with two small hand-drawn dashes/asterisks SVGs.
- **Star ratings & Sparkles**: swap lucide `Star` for a wobbly SVG star to match the sketch language.

All sketch SVGs are inline components in a new `src/components/landing/Sketch.tsx` (SquiggleUnderline, RoughPill, DoodleStar, CornerFlourish, DashFlank) so they're reusable and themed via `currentColor`.

## Color & dark-mode polish

Nocturnal palette leans on the existing tokens; add two CSS variables in `src/index.css`:
- `--star: 220 40% 96%` (light) / `220 30% 92%` (dark)
- `--nebula-a` / `--nebula-b` for the drifting conic gradient

Trust pills and cards bump to `bg-card/70 dark:bg-slate-900/50 backdrop-blur-xl` so the starfield reads through without hurting contrast.

## Files touched

- `src/components/landing/StarfieldBackground.tsx` (new) — canvas + orbs + nebula.
- `src/components/landing/Sketch.tsx` (new) — reusable sketchy SVGs.
- `src/pages/Landing.tsx` — mount starfield, swap `font-serif` → `font-display`, apply sketch accents to badges/cards/buttons/eyebrows, bump card opacity.
- `src/main.tsx` — font imports.
- `tailwind.config.ts` — add `display: ["Syne", ...]`, `sans: ["Plus Jakarta Sans", ...]`, star/nebula colors.
- `src/index.css` — new tokens.
- `package.json` — `@fontsource/syne`, `@fontsource/plus-jakarta-sans`.

## Out of scope

Not touching the owl video section (user liked it), Dashboard/app-shell typography, or any non-landing pages.
