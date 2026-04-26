// The Twelve Organs — poetic profiles in the same register as meridians.js and wuShen.js.
// Phase 1: Lungs is fully filled out. The other 11 carry a one-line essence so the
// listing page is meaningful; their deep pages render a "depth coming soon" state.

const ORGANS = {
  lung: {
    key: 'lung',
    name: 'Lungs',
    chinese: '肺',
    englishName: 'The Delicate Organ',
    element: 'metal',
    yinYang: 'yin',
    partner: 'largeIntestine',
    spirit: 'po',
    organClockTime: '03:00–05:00',
    emotion: { balanced: 'Acceptance', imbalanced: 'Grief' },
    domain: ['breath', 'boundary', 'release', 'instinct', 'dignity'],
    essence:
      'Where the body meets the world — the first organ to receive what is outside, and the first to release what is finished.',
    description:
      'The Lungs are where the body meets the world — the first organ to receive what is outside, and the first to release what is finished. They govern the rhythm of taking in and letting go that runs beneath every other rhythm of a life. Classical texts call them the Delicate Organ because they sit at the surface, exposed to whatever climate, season, or grief moves through; they draw in the pure Qi of the air and combine it with what nourishes you to make the energy of a life that can meet what arrives. They also house the Po — the embodied soul — and so they govern instinct, sensation, and the immediate intelligence of skin and breath. When the Lungs are well, you can be in the world without being eroded by it; you can take in what is offered and release what is over without ceremony. When they are tired, the world feels too close and not close enough at the same time, and a held breath becomes the shape of an entire life.',
    balanced:
      'A breath that is full and unhurried, moving all the way to the lower belly. Skin that meets weather without bracing against it. The capacity to grieve cleanly and be done. A quiet dignity that does not need to be defended. The ability to inhale what is offered and release what is over without negotiation.',
    blocked:
      'Shallow, guarded breathing that lives high in the chest. Skin that is reactive, dry, or armored. A grief that has become structural — not actively painful but always present. Holding on to relationships, roles, or possessions long after they have ended. The feeling of standing slightly behind glass, not quite arriving in your own life.',
    themes: [
      {
        title: 'Breath as Meeting Place',
        body: 'Every inhale is a small acceptance, every exhale a small release. When the Lungs are easy, breath moves all the way to the lower belly and the body trusts that the next breath will arrive. When they are guarded, breath stays high and shallow — the chest held, the shoulders quietly raised, the body braced against an arrival it has stopped expecting to be safe. A held chest is often a held breath that has been held for years; the body remembers what the mind has decided to forget. Releasing the chest is rarely about stretching. It is about allowing the breath that has been waiting.',
      },
      {
        title: 'The Skin Boundary',
        body: 'The Lungs govern the skin and the defensive Wei Qi that runs just beneath it — the boundary between self and world. A healthy boundary is porous enough to receive, firm enough to remain yourself. People with strong Lung Qi can be in difficult environments without absorbing them; they meet what is in the room without becoming it. When this boundary frays, the world feels invasive even when nothing is wrong. Skin becomes reactive, mood becomes weather-sensitive, and being around other people starts to cost more than it gives.',
      },
      {
        title: 'Grief That Has Found Its Way',
        body: 'Grief is the emotion of Metal, and the Lungs are where it lives in the body. Grief that is allowed to move through becomes refinement — a deepened capacity for what matters, and a quieter relationship to what does not. Grief that cannot be felt becomes weight in the chest, a held breath, a flatness that is not depression exactly but a dimming. Tears, when they finally come, are how the Lungs begin to breathe again. The body does not forget what was never grieved; it simply finds another shape to carry it in.',
      },
      {
        title: 'The Po — The Body That Knows',
        body: 'The Lungs house the Po, the soul that arrives with the first breath and dissolves with the last. The Po is precise, instinctive, and never lies — it knows before thought what is safe and what is not, what to draw close and what to set down. When honored, it gives extraordinary somatic intelligence: clear boundaries that need no explanation, a body that reads a room before words are spoken. When ignored long enough, the Po stops speaking, and you find yourself unable to tell the difference between what you want and what you are supposed to want.',
      },
      {
        title: 'Letting Go',
        body: 'Whatever the Large Intestine releases physically, the Lungs release at the level of breath, identity, and attachment. A finished relationship. A role you have outgrown. A version of yourself that no longer fits. The Lungs are the organ of completion, and life keeps presenting the same lesson — gently at first, then less gently — until completion actually happens. The hardest letting go is rarely of what was bad. It is of what was good and is now over.',
      },
      {
        title: 'Voice and Autumn',
        body: 'The voice rides on the breath. Lung Qi that is strong gives a voice that lands without effort; Lung Qi that is depleted gives a voice that is thin, that runs out before the sentence does, that hesitates before speaking at all. The capacity to say what is true is partly a Lung capacity. The Lungs grow stronger when met with autumn\'s qualities — cooler air, slower mornings, attention to what the year has been. They struggle in environments that never allow descent: endless brightness, chronic urgency, no permission to be quiet.',
      },
    ],
    lifeQuestions: [
      'What in your life has been finished for some time — and what would change if you allowed it to actually be over?',
      'Where does your breath go when you are afraid, and what is your body trying to keep from arriving?',
      'What grief has been waiting, quietly, for permission — not to be solved, but simply to be felt?',
    ],
  },

  largeIntestine: {
    key: 'largeIntestine',
    name: 'Large Intestine',
    chinese: '大腸',
    englishName: 'The Drainer',
    element: 'metal',
    yinYang: 'yang',
    partner: 'lung',
    spirit: 'po',
    organClockTime: '05:00–07:00',
    emotion: { balanced: 'Acceptance', imbalanced: 'Grief' },
    domain: ['release', 'completion', 'discernment'],
    essence:
      'Releases what is no longer needed — the organ of completion, of allowing the finished to actually be finished.',
  },

  stomach: {
    key: 'stomach',
    name: 'Stomach',
    chinese: '胃',
    englishName: 'The Receiver',
    element: 'earth',
    yinYang: 'yang',
    partner: 'spleen',
    spirit: 'yi',
    organClockTime: '07:00–09:00',
    emotion: { balanced: 'Care', imbalanced: 'Worry' },
    domain: ['reception', 'appetite', 'breaking down'],
    essence:
      'Receives and breaks down what arrives — the organ of appetite, hospitality, and the body\'s relationship to what is offered.',
  },

  spleen: {
    key: 'spleen',
    name: 'Spleen',
    chinese: '脾',
    englishName: 'The Granary',
    element: 'earth',
    yinYang: 'yin',
    partner: 'stomach',
    spirit: 'yi',
    organClockTime: '09:00–11:00',
    emotion: { balanced: 'Care', imbalanced: 'Worry' },
    domain: ['transformation', 'thought', 'nourishment'],
    essence:
      'Transforms food and experience into useable substance — the organ of nourishment, thought, and the capacity to digest a life.',
  },

  heart: {
    key: 'heart',
    name: 'Heart',
    chinese: '心',
    englishName: 'The Sovereign',
    element: 'fire',
    yinYang: 'yin',
    partner: 'smallIntestine',
    spirit: 'shen',
    organClockTime: '11:00–13:00',
    emotion: { balanced: 'Joy', imbalanced: 'Restlessness' },
    domain: ['consciousness', 'presence', 'joy', 'connection'],
    essence:
      'The dwelling of consciousness — the organ of joy, presence, and the inner light recognized in another\'s eyes.',
  },

  smallIntestine: {
    key: 'smallIntestine',
    name: 'Small Intestine',
    chinese: '小腸',
    englishName: 'The Sorter',
    element: 'fire',
    yinYang: 'yang',
    partner: 'heart',
    spirit: 'shen',
    organClockTime: '13:00–15:00',
    emotion: { balanced: 'Joy', imbalanced: 'Restlessness' },
    domain: ['discernment', 'sorting', 'clarity'],
    essence:
      'Separates the pure from the impure — the organ of discernment, of telling what to absorb from what to release.',
  },

  bladder: {
    key: 'bladder',
    name: 'Bladder',
    chinese: '膀胱',
    englishName: 'The Storage of Fluids',
    element: 'water',
    yinYang: 'yang',
    partner: 'kidney',
    spirit: 'zhi',
    organClockTime: '15:00–17:00',
    emotion: { balanced: 'Trust', imbalanced: 'Fear' },
    domain: ['release', 'flow', 'fear\'s passage'],
    essence:
      'Receives and clears the body\'s waters — the organ of fear\'s release and the willingness to let things pass through.',
  },

  kidney: {
    key: 'kidney',
    name: 'Kidneys',
    chinese: '腎',
    englishName: 'The Root',
    element: 'water',
    yinYang: 'yin',
    partner: 'bladder',
    spirit: 'zhi',
    organClockTime: '17:00–19:00',
    emotion: { balanced: 'Trust', imbalanced: 'Fear' },
    domain: ['Jing', 'will', 'inheritance', 'depth'],
    essence:
      'Stores Jing — your essential life force — and houses Will. The organ of depth, ancestral inheritance, and the long thread of a life.',
  },

  pericardium: {
    key: 'pericardium',
    name: 'Pericardium',
    chinese: '心包',
    englishName: 'The Heart\'s Protector',
    element: 'fire',
    yinYang: 'yin',
    partner: 'tripleHeater',
    spirit: 'shen',
    organClockTime: '19:00–21:00',
    emotion: { balanced: 'Warmth', imbalanced: 'Defended distance' },
    domain: ['intimacy', 'protection', 'closeness'],
    essence:
      'The membrane around the sovereign — the organ that mediates closeness and decides what is allowed near the heart.',
  },

  tripleHeater: {
    key: 'tripleHeater',
    name: 'Triple Heater',
    chinese: '三焦',
    englishName: 'The Coordinator',
    element: 'fire',
    yinYang: 'yang',
    partner: 'pericardium',
    spirit: 'shen',
    organClockTime: '21:00–23:00',
    emotion: { balanced: 'Warmth', imbalanced: 'Disconnection' },
    domain: ['communication', 'coordination', 'warmth between systems'],
    essence:
      'The connector between cavities and systems — the organ of relational warmth, communication, and overall coherence.',
  },

  gallbladder: {
    key: 'gallbladder',
    name: 'Gallbladder',
    chinese: '膽',
    englishName: 'The Decisive Official',
    element: 'wood',
    yinYang: 'yang',
    partner: 'liver',
    spirit: 'hun',
    organClockTime: '23:00–01:00',
    emotion: { balanced: 'Creativity', imbalanced: 'Anger' },
    domain: ['decision', 'courage', 'beginning'],
    essence:
      'Turns the Liver\'s plans into action — the organ of decision, courage, and the willingness to begin.',
  },

  liver: {
    key: 'liver',
    name: 'Liver',
    chinese: '肝',
    englishName: 'The General',
    element: 'wood',
    yinYang: 'yin',
    partner: 'gallbladder',
    spirit: 'hun',
    organClockTime: '01:00–03:00',
    emotion: { balanced: 'Creativity', imbalanced: 'Anger' },
    domain: ['vision', 'planning', 'flow', 'storage of blood'],
    essence:
      'Plans, directs, and stores the blood that sustains vision — the organ of strategy, courage, and the impulse to grow.',
  },
};

// Order following the organ clock — starting at 03:00 (Lung).
const CLOCK_ORDER = [
  'lung', 'largeIntestine', 'stomach', 'spleen',
  'heart', 'smallIntestine', 'bladder', 'kidney',
  'pericardium', 'tripleHeater', 'gallbladder', 'liver',
];

// Order grouped by element (Sheng cycle), then yin then yang.
const ELEMENT_GROUP_ORDER = [
  // Wood
  'liver', 'gallbladder',
  // Fire
  'heart', 'smallIntestine', 'pericardium', 'tripleHeater',
  // Earth
  'spleen', 'stomach',
  // Metal
  'lung', 'largeIntestine',
  // Water
  'kidney', 'bladder',
];

export function getOrgan(key) {
  return ORGANS[key];
}

export function getAllOrgans() {
  return CLOCK_ORDER.map((k) => ORGANS[k]);
}

export function getOrgansGroupedByElement() {
  const groups = { wood: [], fire: [], earth: [], metal: [], water: [] };
  ELEMENT_GROUP_ORDER.forEach((k) => {
    const o = ORGANS[k];
    groups[o.element].push(o);
  });
  return groups;
}

export function hasDepthContent(organ) {
  return Boolean(organ && organ.themes && organ.themes.length > 0);
}

export { ORGANS, CLOCK_ORDER, ELEMENT_GROUP_ORDER };
