## Chosen direction

Direction **v2 — Refined Editorial Wellness**. Quiet hotel-spa energy: persistent sidebar shell, serif headings on Lora, soft white/blush surfaces with 1px lavender borders, Sir Hootington presented as a small framed quote portrait (not a cartoon overlay), generous whitespace, restrained motion.

## Design tokens (locked across every page)

Update `src/index.css` and `tailwind.config.ts` to install these as the new defaults — no hardcoded colors in components.

- Background: `#f8e8ee` (blush)
- Surface: `#ffffff` at 40–60% opacity over blush
- Surface-strong: `#e8c5d0` (rose)
- Accent: `#c9a0dc` (soft lavender)
- Primary: `#9b72cf` (lavender)
- Foreground: `#2a2530` / muted `#6b6470`
- Border: `#e8c5d0` and `#c9a0dc/30`
- Radius: cards `2rem`, pills `9999px`
- Shadow: barely-there `0 1px 2px hsl(280 30% 30% / 0.04)`, hover `0 8px 24px hsl(280 30% 30% / 0.08)`
- Motion: 200–400ms `ease-out`, subtle hover translate-y, breathing dot only

## Typography

Install via `@fontsource/lora` and `@fontsource/nunito-sans`, import in `src/main.tsx`, register in `tailwind.config.ts`:

- `font-serif` → Lora — all headings, hero, quotes, italic accents
- `font-sans` → Nunito Sans — body, UI, labels (uppercase tracked for eyebrows)

Remove the current gradient text on the wordmark and welcome heading.

## Shell redesign (applies to every dashboard view)

Replace the tab-button row in `src/pages/Dashboard.tsx` with a shadcn Sidebar shell:

```text
┌──────────┬──────────────────────────────────────┐
│ MindfulMe│ DAILY SANCTUARY                      │
│ ● Dash   │ Gentle morning, {name}.              │
│   Chat   │                  ┌──Sir Hootington──┐│
│   Journal│                  │ 🦉 "quote..."    ││
│   Mindful│                  └──────────────────┘│
│   MBTI   │ ┌─ Conversation ─┐ ┌─ Emotions ─┐   │
│   Emotions│ │                │ │ bars       │   │
│ ───────  │ └────────────────┘ └────────────┘   │
│   Themes │ ┌ Journal ┐ ┌ Practice ┐ ┌ Compass ┐│
│   Settings│└─────────┘ └──────────┘ └─────────┘│
│ ─ Emergency                                     │
│ [user pill]                                     │
└──────────┴──────────────────────────────────────┘
```

- New `src/components/AppSidebar.tsx` using `Sidebar`, `SidebarGroup`, `SidebarMenu`, `NavLink` active state pill (rose bg + lavender dot).
- New `src/components/layout/AppShell.tsx` wraps `SidebarProvider` + main area with header + outlet. Dashboard becomes a routed shell.
- Header shows eyebrow label + serif greeting + Sir Hootington quote card (uses existing `sir-hootington-sitting.png`).
- Remove `FloatingBubbles`, the 3 floating `BreathingOrb`s, the emoji row, the gradient backdrop, and the heavy glassmorphism wrapper. Keep one optional breathing dot in the Mindfulness section only.

## Per-section refresh (no logic changes)

Each section component gets a presentational pass only — same props, same data, same handlers.

- **ChatSection** — editorial chat surface: serif title "Mindful Conversation", session status pill, white message bubbles with rose tail for owl / lavender for user, pill input with circular send button, owl avatar small and quiet. Remove "standing" background image.
- **EmotionsSection** — "Emotional Flow" card: emoji + label + thin progress bar in lavender/accent, outline "Log Current Mood" CTA. Replace any saturated chart colors with token-based ones.
- **JournalSection** — "Daily Journal" serif italic header, entry cards as blush tiles with a 4px lavender left rule, muted timestamp.
- **MindfulnessSection** — "Practice" grid of square white tiles; single centered `BreathingOrb` recolored to lavender; tracked uppercase labels.
- **MbtiSection** — "Inner Compass" dark accent card (deep plum surface) with lavender glow, serif heading, uppercase CTA with arrow.
- **EmergencySection** — sober tone: serif heading, red kept only as a thin underline accent and a single primary call button; resource list as bordered rows.
- **PrivacySettings / ThemeSelector / OnboardingSection / ProfileSettings / Auth / NotFound** — same token + typography pass: serif headings, Nunito body, blush background, rounded-3xl cards, lavender primary buttons.
- **Landing** — restyle hero, features grid, and Sir Hootington section with the same tokens and typography so the marketing page matches the app.

## Sir Hootington integration

- Keep `sir-hootington-sitting.png` as the chat avatar and as the framed portrait in the dashboard header quote card.
- Drop the large standing illustration from in-app pages (still allowed on the Landing About section).
- Replace cartoon-styled wrappers with a circular rose-tinted frame, 1px lavender border.

## Implementation order

1. Tokens + fonts: `index.css`, `tailwind.config.ts`, `main.tsx` font imports, install `@fontsource/lora` and `@fontsource/nunito-sans`.
2. `AppSidebar` + `AppShell`, refactor `Dashboard.tsx` to use them; remove bubble/orb/emoji decor and gradient text.
3. Header greeting + Sir Hootington quote card component.
4. Section-by-section presentational pass (Chat → Emotions → Journal → Mindfulness → MBTI → Emergency → Privacy → Themes → Onboarding).
5. Apply same tokens/typography to Landing, Auth, ProfileSettings, NotFound.
6. Visual check via Playwright screenshot on `/` and each section.

## Out of scope

- No changes to data models, Supabase, edge functions, auth, PWA config, or business logic.
- No new features or removed features.
- No dark mode flip; current light blush remains default.
