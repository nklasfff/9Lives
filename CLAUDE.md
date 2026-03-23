# 9Lives — Project Guidelines

## What this is
A TCM (Traditional Chinese Medicine) life mapping app. React + Vite, deployed to GitHub Pages.

## Tech
- React 18 + Vite 8 + React Router (HashRouter)
- CSS Modules + CSS custom properties (no UI library)
- localStorage for persistence (no backend)
- Deploy: `npm run deploy` (gh-pages)

## Design Language
- Dark cosmos base (#080c14), glassmorphism cards
- Fonts: Cormorant Garamond (headings, weight 300) + Inter (body)
- Element colors used SUBTLY: Wood #4a9e6e, Fire #c75a3a, Earth #c9a84c, Metal #a8b8c8, Water #3a6fa0
- Chinese characters throughout — NOT emoji
- Every screen has 2 animated SVG illustrations for breathing room
- Cards are concise — max 2-3 sentences. Space > text.
- All app text in English

## Architecture
- `src/engine/` — TCM calculation engine (zodiac, elements, lifePhase, cycles, calendar, wuShen, meridians, organClock, monthlyCycle)
- `src/pages/` — One page per nav tab + detail pages under Explore
- `src/components/` — Layout (AppShell, BottomNav), common (GlassCard, GrainOverlay, GlowOrb), hero (LifeArc), onboarding
- `src/context/UserContext.jsx` — User state (profile, element, phase)
- `src/utils/` — localStorage, dateUtils

## Source Content
- Book (Danish): `/Users/Something/Downloads/1001 - hele hovedbog - 21.03.2026.docx`
- Design doc: `090909 - 9 Lives.docx` in project root
- Wu Shen, Meridians, Calendar texts were generated in English and integrated into engine files

## Deploy Workflow
1. Make changes
2. Verify with preview (no console errors)
3. `git add` + `git commit` + `git push origin main` + `npm run deploy`
4. User checks on phone at https://nklasfff.github.io/9Lives/

## Navigation Structure
- **Home** — Life Arc, Phase card, Today's Day Pillar, Organ Clock (visual), Five Spirits
- **Explore** — 6 layer cards (4 with detail pages: Element, Life Phase, Spirits, Depths)
- **Relations** — Ikigai illustration, add friends, elemental dynamics, deeper cards
- **Time** — Date picker, Day Pillar for any date, Life Phase at any age, organ clock
- **Profile** — Full element correspondences, zodiac, phase, reset

## Key Principles
- Harmony between screens — no screen heavier than others
- Illustrations create breathing room between cards
- Subtle element colors, never garish
- Build incrementally, deploy frequently
- Be honest about limitations and context capacity
- See `.claude/rules/` for detailed design and engine rules
