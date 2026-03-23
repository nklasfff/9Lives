---
paths:
  - "src/**/*.jsx"
  - "src/**/*.css"
---

# Design Rules for 9Lives

## Visual Harmony
- Every screen must have 2 SVG illustrations that create breathing room between cards
- All illustrations must be animated with slow, subtle effects (breathing, pulsing, drifting)
- Illustrations must be clearly visible — opacity at least 0.3 for strokes, 0.2 for fills
- Cards are concise: max 2-3 sentences of body text

## Colors
- Element colors are ALWAYS used subtly (opacity 0.06-0.25 for fills, 0.3-0.5 for strokes)
- Never use raw element hex colors at full opacity in UI elements
- Glass card background: rgba(17, 29, 43, 0.65) — not transparent white
- Text hierarchy: --text-bright for headings, --text-primary for body, --text-muted for labels

## Typography
- Headings: Cormorant Garamond, weight 300
- Labels and season text: Cormorant Garamond, italic
- Body: Inter
- Chinese characters (NOT emoji) for zodiac animals and element symbols

## Consistency
- All screens must feel equally "weighted" — no screen heavier than others
- Use the same card patterns: cardHeader with label + accent, then content
- Deploy and verify on phone after every visual change
