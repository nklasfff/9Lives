---
paths:
  - "src/engine/**"
  - "src/data/**"
---

# Engine Rules for 9Lives

## Data Sources
- Book (Danish, ~53k words): `/Users/Something/Downloads/1001 - hele hovedbog - 21.03.2026.docx`
- All app content in English, derived organically from the book's philosophy
- Wu Shen, Meridians, Calendar content already integrated from English source texts

## Engine Architecture
- Each engine file is self-contained with exports
- Data and calculation logic live together (no separate JSON files needed)
- All element/phase/spirit data includes Chinese characters
- Relationship calculations use Sheng (generating) and Ke (controlling) cycles
- Life phases: 7-year cycles for women, 8-year cycles for men
- Calendar: getDayPillar(date) works for ANY date past or future

## Key Functions
- getZodiacAnimal(birthYear) → animal, symbol (Chinese char), name, trait
- getElement(animal) → element string
- getElementInfo(element) → full correspondences object
- getLifePhase(age, gender) → phase with title, subtitle, description, element, season
- getDayPillar(date) → stem, branch, element, chineseLabel, stemImage, branchCharacter
- getRelationship(el1, el2) → type, name, description
- getCurrentOrgan() → current 2-hour organ period
- getDailySpirits(dayElement, userElement) → 5 spirits with today's reflection
