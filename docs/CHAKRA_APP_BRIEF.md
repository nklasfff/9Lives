# Chakra + Astrology App — Handoff Brief

This document captures everything needed to build a new chakra + astrology app by reusing architecture and design language from the 9Lives app. It is written to be pasted as the first prompt in a new Claude Code session working in a fresh repo.

---

## 1. What the App Is

A personal inner-landscape app that combines **two systems**:

1. **The 7-chakra developmental cycle** — 7-year life phases from 0–49, then a second spiral where unresolved childhood chakra work is revisited in adulthood. Based on Anodea Judith's framework (Eastern Body, Western Mind).
2. **Western astrology** — natal chart from birth date, time, and place; transits and progressions show what is moving in a person's life right now.

The two systems cross-pollinate: chakras say **what** energy center is active in your life phase (universal, time-based); astrology says **who** you are (unique natal signature). Together they give personalized, time-sensitive guidance.

**No TCM elements in this app.** Keep it focused on chakras + astrology. TCM could be a separate later layer, but not now.

**Target audience:** Women and men interested in somatic, psychological, and spiritual development. Think "Co-Star but slower, deeper, less sarcastic."

---

## 2. Design Language (reuse from 9Lives, exactly)

- **Dark cosmos base** — background `#080c14`, glassmorphism cards (`rgba(17, 29, 43, 0.65)`)
- **Fonts:** Cormorant Garamond (headings, weight 300, often italic) + Inter (body)
- **Chakra colors used SUBTLY** — never garish, always at low opacity (0.1–0.3) for glow, slightly brighter for accents:
  - Root (Muladhara): `#c13a3a` (deep red)
  - Sacral (Svadhisthana): `#d97b3c` (orange)
  - Solar Plexus (Manipura): `#d9b24a` (yellow gold)
  - Heart (Anahata): `#4a9e6e` (green)
  - Throat (Vishuddha): `#3a8fc7` (sky blue)
  - Third Eye (Ajna): `#5a4a9e` (indigo)
  - Crown (Sahasrara): `#9e6ec7` (violet)
- **Sanskrit names + symbols** — use Devanagari characters (मूलाधार, स्वाधिष्ठान, etc.) the same way 9Lives uses Chinese characters
- **Every screen has 2 animated SVG illustrations** for breathing room between cards
- **Cards are concise** — max 2–3 sentences. Space > text.
- **All app text in English** (content will be written by user + Claude together)

Copy the full design system directly from 9Lives via these files (see section 6).

---

## 3. Tech Stack (identical to 9Lives)

- **React 19** + **Vite 8** + **React Router 7** (HashRouter, for GitHub Pages deploy)
- **CSS Modules** + **CSS custom properties** (no UI library)
- **localStorage** for persistence (no backend)
- **Deploy:** GitHub Pages via `gh-pages` package

---

## 4. Architecture (reuse patterns from 9Lives)

```
src/
├── engine/              ← calculation engine (NEW — chakra + astro specific)
├── pages/               ← one page per nav tab + detail pages
├── components/
│   ├── layout/          ← AppShell, BottomNav
│   ├── common/          ← GlassCard, GrainOverlay, GlowOrb (COPY from 9Lives)
│   └── hero/            ← LifeArcVisualization equivalent (NEW for chakras)
├── context/
│   └── UserContext.jsx  ← extended for astrology (birth time + location)
├── utils/               ← localStorage, dateUtils, reflectionStore (COPY)
└── styles/              ← theme.css, global.css, animations.css (COPY)
```

---

## 5. Navigation (5 bottom tabs + sub-pages)

```
/home               → HomePage: current chakra phase, today's astro snapshot, daily reflection
/explore            → ExplorePage: layered exploration hub (like 9Lives)
  /explore/chakras          → all 7 chakras overview
  /explore/chakras/:id      → deep-dive page for one chakra
  /explore/natal            → your natal chart view
  /explore/planets          → all planets + their meanings
  /explore/signs            → all 12 zodiac signs
  /explore/houses           → 12 astrological houses
  /explore/journal          → guided journal (directly from 9Lives)
  /explore/timeline         → reflections timeline (directly from 9Lives)
/relations          → add people; see chakra + synastry compatibility
  /relations/:id            → deep dive on one person
/time               → Time Travel: transits for any date, moon phases
/profile            → full personal profile: natal chart summary, chakra phase, settings
```

---

## 6. Files to Copy DIRECTLY from 9Lives Repo

These are content-neutral and work as-is (or with tiny tweaks). Copy these files into your new project with the same paths:

### Styles (copy as-is, then adjust chakra colors in theme.css)
- `src/styles/theme.css` — update `--element-*` variables to become `--chakra-root`, `--chakra-sacral`, etc.
- `src/styles/global.css`
- `src/styles/animations.css`

### Common components (copy as-is)
- `src/components/common/GlassCard.jsx` + `GlassCard.module.css`
- `src/components/common/GrainOverlay.jsx` + CSS
- `src/components/common/GlowOrb.jsx` + CSS

### Layout (copy, then update nav tabs)
- `src/components/layout/AppShell.jsx` + CSS
- `src/components/layout/BottomNav.jsx` + CSS — keep structure, update icon SVGs if desired; keep 5 tabs (Home, Explore, Relations, Time, Profile)

### Utils (copy as-is, extend as needed)
- `src/utils/localStorage.js` — use as template; add new keys for natal chart, etc.
- `src/utils/dateUtils.js`
- `src/utils/reflectionStore.js` — journal + timeline logic, directly reusable

### Config files (copy as template)
- `package.json` — keep same dependencies, add `astronomia` (see section 8)
- `vite.config.js`
- `index.html` — update title + font imports stay the same

### Patterns to study (read but rewrite for chakras)
- `src/engine/elements.js` → becomes `src/engine/chakras.js`
- `src/engine/lifePhase.js` → becomes `src/engine/chakraPhase.js` (7-year cycles)
- `src/engine/phaseDeep.js` → becomes `src/engine/chakraDeep.js` (content per chakra)
- `src/pages/PhaseDeepPage.jsx` → becomes `src/pages/ChakraDeepPage.jsx` (near-identical structure)
- `src/components/hero/LifeArcVisualization.jsx` → becomes `ChakraLadderVisualization.jsx`
- `src/context/UserContext.jsx` → needs extension (see section 9)

---

## 7. What Needs to be Built NEW

### Engine files (new content, reuse pattern from 9Lives engine)

**`src/engine/chakras.js`** — the 7 chakras
```js
// Structure similar to 9Lives elements.js
CHAKRAS = {
  root: {
    name: 'Root',
    sanskrit: 'Muladhara',
    devanagari: 'मूलाधार',
    hex: '#c13a3a',
    element: 'earth',  // (Western elements, not TCM)
    location: 'base of spine',
    governs: 'safety, survival, trust, groundedness',
    balanced: 'steady, secure, present',
    imbalanced: 'anxious, ungrounded, fearful',
    planet: 'saturn',
    signs: ['capricorn', 'taurus'],
    // ...
  },
  sacral: { sanskrit: 'Svadhisthana', hex: '#d97b3c', ... },
  // solar, heart, throat, third_eye, crown
}
```

**`src/engine/chakraPhase.js`** — 7-year life cycles
```js
// 0-7: root (Phase 1, first spiral)
// 7-14: sacral (Phase 2)
// 14-21: solar plexus
// 21-28: heart
// 28-35: throat
// 35-42: third eye
// 42-49: crown
// 49+: second spiral begins — root revisited as adult work
getChakraPhase(age) → { phase, chakra, ageRange, spiral: 1|2 }
```

**`src/engine/chakraDeep.js`** — rich per-chakra content (structure matches 9Lives phaseDeep.js)
- transition, personal quote, body in balance, body imbalanced, emotion, childhood wounds, healing practices, exercises, diet, reflections, transition to next

**`src/engine/planets.js`** — 10 planets (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) with meanings, chakra correspondences

**`src/engine/zodiac.js`** — 12 signs with element (fire/earth/air/water — Western), modality, ruling planet, traits

**`src/engine/houses.js`** — 12 astrological houses with life areas

**`src/engine/natal.js`** — calculate natal chart from birth date + time + location
- Uses `astronomia` library (see section 8)
- Returns: planet positions (sign + house + degree), ascendant, midheaven, aspects

**`src/engine/transits.js`** — current planet positions vs. natal chart
- Returns: which planets are in which houses today, active aspects to natal planets

**`src/engine/moonCycle.js`** — current moon phase, sign, and what it means for the day

### New pages (structure reused from 9Lives, new content)

- **HomePage** — current chakra phase card, today's astro snapshot card, moon card, daily reflection (mirrors 9Lives HomePage layout)
- **ChakraDeepPage** — mirrors PhaseDeepPage structure exactly (transition, body, emotions, childhood wounds, healing practices, exercises, reflections)
- **NatalChartPage** — SVG circular chart with 12 houses + planets (NEW — no 9Lives equivalent)
- **PlanetsDetailPage, SignsDetailPage, HousesDetailPage** — mirror SpiritsDetailPage + DepthDetailPage pattern
- **RelationsPage** — mirrors 9Lives Relations, but uses synastry (chart comparison) + chakra resonance
- **TimePage** — mirrors 9Lives TimePage, but shows transits for any date + moon phase
- **JournalPage, TimelinePage** — copy directly from 9Lives (just-built features, fully reusable)

---

## 8. Libraries to Add

Essential:
- `astronomia` — Meeus-based astronomical calculations (planet positions, sidereal time)
  - Alternative: `swisseph` (more accurate but requires ephemeris files), or `circular-natal-horoscope-js`
- Timezone lookup: `tz-lookup` or `moment-timezone` (need to convert local birth time to UTC for chart calculation)

Consider:
- A geocoding API or offline city database for birth location (user needs to enter their birth city)

All other dependencies are identical to 9Lives (`react`, `react-dom`, `react-router-dom`, `vite`, `gh-pages`).

---

## 9. UserContext Changes

9Lives stores only birth date + gender. Astrology needs more:

```js
profile: {
  birthDate: { year, month, day },
  birthTime: { hour, minute },        // NEW — needed for ascendant/houses
  birthLocation: {                     // NEW — needed for accurate chart
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    timezone: string                   // e.g. 'Europe/Copenhagen'
  },
  gender: 'female' | 'male' | 'other',
  onboardedAt: ISO timestamp
}

// Derived data extends to include:
getDerivedData() returns {
  ...profile,
  age: number,
  chakraPhase: { phase, chakra, ageRange, spiral },
  natalChart: { sun, moon, ascendant, planets, houses, aspects },
  todayTransits: { ... }
}
```

**Onboarding flow is new** — needs 3 steps instead of 2:
1. Birth date
2. Birth time (with "I don't know the time" option → default to solar chart, no houses)
3. Birth location (with city search or manual lat/lng)

---

## 10. Key Principles (same as 9Lives)

- **Harmony between screens** — no screen heavier than others
- **Illustrations create breathing room** between cards
- **Subtle colors, never garish** — chakra colors at low opacity for glow, slightly brighter for accents
- **Build incrementally** — home + one chakra deep-dive first, then expand
- **Be honest about limitations** — especially about chart calculation accuracy
- **Content is poetic, not clinical** — psychological depth without jargon
- **User pace** — the app waits, doesn't push notifications or urgency

---

## 11. Reusable Features Already Built (copy from 9Lives)

These features exist in 9Lives right now and work well — **copy them directly** with minimal changes:

### Guided Journal (`src/pages/JournalPage.jsx`)
A 3-step guided reflection: user picks a theme tailored to their phase → describes how it feels in body → adds time perspective. Saved with timestamps. For the new app: rewrite prompts to be chakra-tailored instead of element-tailored. Infrastructure stays identical.

### Reflections Timeline (`src/pages/TimelinePage.jsx`)
Shows past journal entries grouped by week with poetic framing. Works as-is, just changes color accents to use chakra colors instead of element colors.

### Glass card + onboarding patterns
The GlassCard component and the onboarding multi-step flow both work as templates.

---

## 12. Suggested Build Order

1. **Foundation** — Copy styles, common components, layout, utils. Get a blank app shell running with 5 bottom tabs.
2. **Onboarding** — Three-step form for birth date, time, location. Store in UserContext.
3. **Chakra engine + one deep-dive page** — Write `chakras.js`, `chakraPhase.js`, content for ONE chakra (e.g. heart), build ChakraDeepPage. Prove the pattern works.
4. **Home page** — Show current chakra phase + placeholder astro data.
5. **Natal chart calculation** — Wire up astronomia library, compute natal chart on onboarding. Validate with a known birth chart.
6. **Natal chart visualization** — Circular SVG with 12 houses + planets.
7. **Rest of chakras** — Content for remaining 6 chakras.
8. **Today's transits + moon card** — Add to home page.
9. **Time travel page** — Transits for any date.
10. **Relations + synastry** — Compare two charts, show chakra resonance.
11. **Journal + timeline** — Copy from 9Lives, adjust prompts.
12. **Polish** — Illustrations, animations, copy refinement.

---

## 13. Things to Avoid

- Don't mix TCM elements into this app. Stick to chakras + Western astrology.
- Don't use emoji. Use Devanagari and astrological glyphs (☉ ☽ ♀ ♂ etc.).
- Don't try to calculate charts from scratch — use `astronomia` or similar. The math is brutal.
- Don't make onboarding longer than 3 steps. If user doesn't know birth time, let them skip — solar charts are still useful.
- Don't make the app feel like a quiz or assessment. The voice is reflective, not diagnostic.
- Don't over-style with chakra colors. They should whisper, not shout.

---

## 14. First Prompt to New Claude Session

When you start the new Claude Code session in the fresh repo, give it this brief and then start with:

> "Please read this brief, then read the files I've already copied over from 9Lives (styles, common components, layout, utils). Confirm you understand the design language and architecture before we start building. Then help me build the foundation: onboarding flow with birth date, time, and location."

---

*This brief was written while working on 9Lives. All reusable code lives there and can be referenced or copied.*
