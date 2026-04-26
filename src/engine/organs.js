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
    description:
      'The Gallbladder is the partner-yang of the Liver — and where the Liver makes plans, the Gallbladder makes decisions. Classical texts call it the Decisive Official because it is the organ that closes the gap between knowing and doing, between what is conceived and what is begun. It is also the organ of courage in the Chinese tradition: not the absence of fear, but the willingness to step across the threshold of a decision before all the evidence is in. The Gallbladder works most deeply at night, between 23:00 and 01:00, processing the day\'s choices and preparing the body for the regenerative work that follows. When the Gallbladder is well, you can hear what you actually want and act on it; when it is tired, the same person can know exactly what is needed and remain unable to begin.',
    balanced:
      'The capacity to decide without endless deliberation. The willingness to begin before all the evidence is in. A relationship to risk that is awake — neither reckless nor frozen. Sleep that descends easily around 23:00 and stays. The felt sense that your judgment is trustworthy, even when it is wrong, because at least it is yours.',
    blocked:
      'Decision paralysis — the same options reviewed again and again with no resolution. Wakefulness or restlessness around 23:00–01:00 when the Gallbladder is meant to be doing its quiet work. Indecisiveness that masquerades as thoroughness. A jaw that clenches at the threshold of choices. The reliance on others to decide for you so you can be relieved of the responsibility — and the resentment that follows.',
    themes: [
      {
        title: 'The Threshold of Decision',
        body: 'The Gallbladder lives at the threshold — the moment between knowing and doing. When it is healthy, the threshold is permeable: information becomes a decision, the decision becomes movement, the movement becomes life. When it is depleted, the threshold thickens, and you stand at it endlessly, gathering evidence for a choice that no amount of evidence will make for you. Decision, in the end, is not an outcome of analysis. It is a separate capacity, and the Gallbladder is its home.',
      },
      {
        title: 'Courage as a Body State',
        body: 'Classical Chinese medicine treats courage not as a trait but as a body state — and locates it in the Gallbladder. People with strong Gallbladder Qi can act in the face of uncertainty without the body collapsing in fear. People with depleted Gallbladder Qi may know perfectly well what they want and find their bodies unable to carry through. Courage, in this view, is not a quality you summon. It is a substance you have or do not have, and there are practices that build it.',
      },
      {
        title: 'The Night Hours of Choice',
        body: 'Between 23:00 and 01:00, the Gallbladder does its deepest work. The body sorts the day\'s decisions, releases what was inconsequential, and prepares the Liver to do its blood-storing work afterward. Waking consistently in these hours — wide-eyed, mind churning over choices made and unmade — is the Gallbladder asking you to settle something it cannot finish on its own. Going to sleep before 23:00 is one of the kindest things you can do for it.',
      },
      {
        title: 'Beginning vs. Planning',
        body: 'The Liver plans; the Gallbladder begins. A life that plans without beginning becomes paralysis dressed up as preparation. A life that begins without planning becomes chaos. The Gallbladder is what allows the plan to actually start — and a person whose Gallbladder is strong learns to recognize the moment when one more piece of information is no longer information but resistance.',
      },
      {
        title: 'Risk and Right-Sizing',
        body: 'Healthy Gallbladder is not recklessness. It is the capacity to take the right risk — the one that fits your life — without taking risks for the sake of feeling alive. When it is depleted in one direction, you become risk-averse and small; when it is depleted in another, you become risk-seeking and unstable. Both are the same exhaustion in different costumes, and both resolve when the Gallbladder is given the rest and food it needs.',
      },
      {
        title: 'Anger That Will Not Decide',
        body: 'Like the Liver, the Gallbladder is sensitive to anger — but its anger is the anger of indecision. The frustration of standing at a threshold and refusing to cross it. The irritability that builds in a person who knows what they need to do and will not do it. When the Gallbladder is finally permitted to choose, that anger usually disappears, because it was never about the world. It was about the threshold.',
      },
    ],
    lifeQuestions: [
      'What decision have you been making the same way every day by not making it — and what is the cost of letting it remain unmade?',
      'Where in your life have you been waiting for one more piece of information that would not actually change what you would choose?',
      'What did your body know it wanted to do before your thinking talked you out of it?',
    ],
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
    description:
      'Classical texts call the Liver the General because it makes the strategic plans that organize a life — direction, purpose, and the long arc of becoming. Its role is to ensure the smooth flow of Qi through the body and through the day, and when that flow is unobstructed, you feel decisive, creative, and at ease in your own movement. The Liver also stores Blood, which means it stores the substance of memory, soul-rootedness, and the capacity to dream into the future without losing the ground beneath you. It houses the Hun — the wandering soul that carries vision and night-dreaming — and so it governs the relationship between imagination and action. When the Liver is healthy, plans turn into work and frustration moves through; when it is constrained, the same energy that makes for creativity becomes anger that finds no clean expression and leaks sideways into irritability, headache, and a body that feels like it cannot move.',
    balanced:
      'A natural sense of direction that does not require constant deliberation. Creativity that translates into work and shape rather than only ideas. Anger that arises cleanly when something matters and resolves when the matter is addressed. Flexibility in body and decision — the willingness to bend without breaking. Eyes that see clearly, both into the world and into a future that is genuinely yours.',
    blocked:
      'Tension that lives in the temples, neck, and shoulders. A frustration that has no clean object — the world simply feels in the way. Plans that never become action, or actions that never become plans. Sleep that breaks around 01–03 with thoughts about what was unfinished. Eyes that strain, decisions that exhaust, and a body that feels stuck in a position it has been trying to leave for years.',
    themes: [
      {
        title: 'The General — Vision and Direction',
        body: 'The Liver is the strategist of the body — the organ that asks where this life is going and how to get there. When healthy, it gives a long view and the patience to work in pieces toward something only you can see. When depleted, the strategist still tries to plan but cannot land — the mind generates options endlessly, exhausting itself on a future it cannot quite reach. A General without ground does not stop strategizing; it simply stops being able to act.',
      },
      {
        title: 'Anger as Clean Force',
        body: 'Anger is the emotion of Wood, and the Liver is where it lives in the body. Clean anger arises when something is being violated; it identifies the violation, gives the energy to address it, and recedes when the matter is resolved. Frustrated anger — anger with no permission to be anger — becomes irritability, sideways comments, a body that grinds its jaw at night. The Liver does not punish you for being angry. It punishes you for swallowing it.',
      },
      {
        title: 'The Hun — Vision and Wandering',
        body: 'The Liver houses the Hun, the soul that travels — through dreams at night, through imagination by day, through reaching toward what is not yet. The Hun gives meaning to the future and connects you to the people and places that pull you forward. When the Liver Blood that anchors it is depleted, the Hun wanders without landing — into other people\'s stories, into restlessness, into the inability to commit. Strong Liver Blood is what allows imagination to become work.',
      },
      {
        title: 'Smooth Flow, Stuck Flow',
        body: 'Above all, the Liver governs the smooth flow of Qi — through your body, through your day, through your relationships. Smooth flow looks like ease in transitions, in conversation, in beginning and ending. Stuck flow looks like the small daily frictions that accumulate: tension headaches, muscle tightness across the upper back, sighing, a feeling of not quite being able to exhale. Wood needs to move, and a life that gives it nowhere to go becomes a body that cannot relax.',
      },
      {
        title: 'Storage of Blood, Storage of Self',
        body: 'The Liver stores Blood at night while you sleep — replenishing the substance that nourishes muscle, vision, menstrual cycles, and the rooted continuity of who you are. Without enough Liver Blood, sleep becomes restless, eyes dry, hair thins, and the felt sense of self becomes harder to access. Lying down at night when the Liver does its work is not optional rest. It is the body\'s repair of the self that will go out into tomorrow.',
      },
      {
        title: 'Spring in the Body',
        body: 'The Liver is the organ of spring — of the year\'s first impulse to grow. It strengthens with what spring offers: green, sour-bitter foods, movement that has direction, and a willingness to begin things you cannot yet see the end of. It struggles in environments that never permit growth — chronic stagnation, suppressed expression, lives that have to be kept small. Wood that cannot grow turns inward and burns.',
      },
    ],
    lifeQuestions: [
      'Where in your life is the Wood in you trying to grow against something that is not actually you — and what would change if you let it move freely?',
      'What anger have you been holding as irritation because it never seemed important enough to be anger — and what is it actually telling you?',
      'What vision is your Hun reaching for, even quietly, that you have not yet given yourself permission to live?',
    ],
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
