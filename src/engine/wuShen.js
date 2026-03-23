const SPIRITS = {
  shen: {
    name: 'Shen',
    chinese: '神',
    title: 'The Sovereign Witness',
    element: 'fire',
    organ: 'Heart',
    domain: ['awareness', 'presence', 'clarity', 'relationship', 'identity'],
    description: 'Shen is the light that looks out through your eyes — the quality of genuine presence that others recognize before they can name it. When it rests securely in the Heart, you are able to think clearly, feel without being overwhelmed, and meet others without losing yourself. When it is disturbed, the mind becomes like a room where no one is quite at home: thoughts arrive and scatter, sleep becomes shallow, and joy fails to land.',
    balancedQualities: [
      'Clear, steady awareness',
      'Genuine joy and warmth toward others',
      'Ability to hold difficult feelings without collapsing',
      'A quality of inner coherence — knowing who you are',
    ],
    imbalancedSigns: [
      'Insomnia, racing thoughts at night',
      'Anxiety or a persistent low-grade restlessness',
      'Difficulty forming or sustaining deep connections',
      'A sense of being present in body but absent in spirit',
    ],
    reflections: [
      'When do you feel most fully yourself — not performing, not adapting, just present?',
      'What disturbs your sleep, and what does it tell you about what your mind cannot yet put down?',
      'Is there a difference between the joy you feel alone and the joy you feel with others? What does that gap reveal?',
      'Who in your life actually sees you — not what you do or provide, but who you are?',
      'Where in your body do you feel most awake and alive right now?',
      'When did you last feel genuine gladness, without effort or reason?',
      'What would change in your relationships if you trusted that your presence — not your usefulness — was enough?',
      'Is there anything you are carrying in your mind right now that doesn\'t belong to you?',
      'What does your face look like when no one is watching?',
    ],
  },
  hun: {
    name: 'Hun',
    chinese: '魂',
    title: 'The Wandering Dreamer',
    element: 'wood',
    organ: 'Liver',
    domain: ['vision', 'direction', 'creativity', 'dreaming', 'relational movement'],
    description: 'The Hun is the aspect of soul that travels — during sleep it moves through images and encounters, during waking it reaches forward into the future and outward toward others, carrying the force of your life\'s direction. It is what makes plans feel alive rather than merely strategic, and what allows you to truly move toward another person. When the Liver blood that anchors it is depleted, the Hun wanders without landing — into distraction, into other people\'s lives, into the restless seeking that never quite arrives.',
    balancedQualities: [
      'A sense of direction and meaningful purpose',
      'Creative impulse that translates into actual work',
      'Capacity to be genuinely moved by beauty, art, or another person',
      'Dreams that feel purposeful — whether literal or metaphorical',
    ],
    imbalancedSigns: [
      'A quality of chronic restlessness or the inability to commit',
      'Nightmares, disturbed sleep, or the feeling of "not quite here"',
      'Frustration and anger that lack a clear target or outlet',
      'Losing yourself in others — in their problems, their stories, their lives',
    ],
    reflections: [
      'What direction is your life pointing in right now — and does that direction feel chosen, or simply inherited?',
      'When you dream, what images return? What might they be asking of you?',
      'Is there a creative impulse in you that has been waiting longer than you can remember?',
      'Where in your life have you been reaching toward something outside yourself to feel whole?',
      'What would it mean to commit — fully, without the escape hatch — to something or someone?',
      'What vision of your life, however quiet, still stirs something when you allow yourself to look at it?',
      'Do you know the difference between inspiration and escape in yourself?',
      'Who in your life calls forth the best of you — not by demanding it, but simply by being present?',
      'What would you do with your creative life if you stopped waiting for permission?',
    ],
  },
  po: {
    name: 'Po',
    chinese: '魄',
    title: 'The Body\'s Own Knowing',
    element: 'metal',
    organ: 'Lungs',
    domain: ['instinct', 'breath', 'sensation', 'grief', 'embodied intelligence'],
    description: 'The Po is the soul that stays with the body — it arrives with the first breath at birth and dissolves with the last. It is not symbolic or visionary; it is immediate, animal, precise. Every loss you have undergone lives somewhere in the Po: not as story but as posture, as a held breath, as shoulders that have learned to brace. When it is honored — through breath, through sensation, through genuine grieving — the Po gives you extraordinary physical intelligence and the capacity to let go completely.',
    balancedQualities: [
      'Deep somatic intelligence — the body as a reliable source of information',
      'The ability to grieve what needs to be grieved and release what is finished',
      'Clear, instinctive boundaries that require no explanation',
      'Breath that is full, easy, and responsive to life\'s changing demands',
    ],
    imbalancedSigns: [
      'Unresolved grief that has become structural — tight chest, shallow breath',
      'The inability to release what is over: relationships, identities, possibilities',
      'A quality of emotional numbness or a feeling of being encased',
      'Physical hypersensitivity or disconnection from bodily sensation',
    ],
    reflections: [
      'What are you still carrying that you have never fully grieved?',
      'Where does your breath go when you are afraid or overwhelmed?',
      'What does your body know right now that your thinking mind is still arguing with?',
      'Is there something in your life that is finished but which you have not yet allowed to be over?',
      'When did you last feel genuinely, cleanly sad — and was there relief afterward?',
      'What would your posture look like if you set down everything you are holding that isn\'t yours?',
      'What boundary in your life exists in your body but not yet in your words?',
      'If your body could speak without your translation, what would it say about where you are right now?',
      'What has been waiting, quietly, to be released?',
    ],
  },
  yi: {
    name: 'Yi',
    chinese: '意',
    title: 'The Thinking Ground',
    element: 'earth',
    organ: 'Spleen',
    domain: ['thought', 'intention', 'memory', 'concentration', 'meaning-making'],
    description: 'Yi is the capacity to take a thought all the way through — to hold an intention long enough for it to become action, to digest experience so it becomes understanding rather than accumulation. Like the Spleen that houses it, it governs the transformation of what you take in. When Yi is strong, thinking is purposeful and the mind rests after working. When it becomes circular — turning the same matter over without resolution — it damages the Spleen and produces the particular exhaustion of a mind that will not stop but cannot move.',
    balancedQualities: [
      'Focused, purposeful thinking that leads somewhere',
      'Memory that is reliable and retrievable when needed',
      'The ability to learn — to truly absorb and integrate experience',
      'A mental quality of groundedness: thinking from a center, not spinning around one',
    ],
    imbalancedSigns: [
      'Overthinking, rumination, or a mental loop that has no exit',
      'Worry as a constant background condition',
      'Difficulty concentrating, poor memory, or mental fog',
      'Starting many things but struggling to complete them',
    ],
    reflections: [
      'What thought or worry have you been turning over for so long it has become a habit?',
      'When your mind is most clear — what conditions allow that?',
      'Is there something you know intellectually but have not yet digested emotionally?',
      'What would it feel like to think about something only once, then act?',
      'Are you learning right now, or simply accumulating information?',
      'What unfinished matter is taking up space in your mind that you have not yet committed to completing — or releasing?',
      'Where in your body do you feel the difference between a thought that is alive and one that is stuck?',
      'Is the thinking you do each day mostly in service of your life, or mostly in defense against it?',
      'What would you do today if you trusted your own judgment completely?',
    ],
  },
  zhi: {
    name: 'Zhi',
    chinese: '志',
    title: 'The Deep Will',
    element: 'water',
    organ: 'Kidneys',
    domain: ['will', 'purpose', 'courage', 'ancestral drive', 'destiny'],
    description: 'Zhi is not willpower in the ordinary sense — it is deeper: the orientation of your whole being toward what your life is for. Rooted in the Kidneys and in Jing — your ancestral essence — it carries the thread of both inheritance and destiny. When Zhi is strong, you can move through difficulty not because you are unafraid, but because something in you simply knows the direction. When it is depleted, fear moves from being a useful signal into becoming the lens through which all of life is filtered.',
    balancedQualities: [
      'A quiet, persistent sense of purpose that does not need constant reassurance',
      'The ability to face fear and continue — courage rooted in depth, not performance',
      'Trust in the unknown: allowing life to unfold without needing to control all of it',
      'The long view — acting now in service of what your life is genuinely for',
    ],
    imbalancedSigns: [
      'Chronic fear or anxiety disproportionate to actual circumstances',
      'A loss of direction or inability to access what you truly want',
      'Exhaustion that is bone-deep — depletion of basic drive and motivation',
      'Compulsive risk-taking or recklessness, as flight from underlying fear',
    ],
    reflections: [
      'What are you genuinely afraid of — not the surface fears, but the one underneath them?',
      'When have you acted in the face of fear, and what did that teach you?',
      'What is the thread that runs through everything your life has been pointing toward?',
      'Is there something in you that knows what you are here for, even when your thoughts contradict it?',
      'What would you do differently if you trusted that life was not fundamentally against you?',
      'What did the generation before you carry that has become yours to transform — not repeat?',
      'Where in your body do you feel your deepest yes — the one that does not need permission?',
      'What are you preserving your energy for? Is that what it is actually for?',
      'If you could give your Zhi a season, which season would it be right now — and what does that season need?',
      'What would it mean to live from your depth rather than from your defenses?',
    ],
  },
};

const SPIRIT_ORDER = ['shen', 'hun', 'po', 'yi', 'zhi'];

export function getDailySpirits(dayElement, userElement) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

  return SPIRIT_ORDER.map((key) => {
    const spirit = SPIRITS[key];
    const isActive = spirit.element === dayElement;
    const isPersonal = spirit.element === userElement;
    const reflectionIndex = (dayOfYear + SPIRIT_ORDER.indexOf(key)) % spirit.reflections.length;

    return {
      ...spirit,
      key,
      isActive,
      isPersonal,
      todayReflection: spirit.reflections[reflectionIndex],
    };
  });
}

export function getSpiritByElement(element) {
  return Object.values(SPIRITS).find(s => s.element === element);
}

// The spirit that mediates the space between two elements
// In Sheng: the child element's spirit (what is born between you)
// In Ke: the controlled element's spirit (what is being shaped)
// Same: that element's own spirit (a mirror)
const SHENG = ['wood', 'fire', 'earth', 'metal', 'water'];
export function getSpiritBetween(element1, element2) {
  if (element1 === element2) {
    return { spirit: getSpiritByElement(element1), reason: 'When two of the same element meet, their shared spirit deepens — like a mirror that reflects back what is most true.' };
  }
  const i1 = SHENG.indexOf(element1);
  const i2 = SHENG.indexOf(element2);
  // Sheng: element1 nourishes element2
  if ((i1 + 1) % 5 === i2) {
    return { spirit: getSpiritByElement(element2), reason: `${getElementName(element1)} nourishes ${getElementName(element2)} — the spirit of what is born between you governs this connection.` };
  }
  // Sheng: element2 nourishes element1
  if ((i2 + 1) % 5 === i1) {
    return { spirit: getSpiritByElement(element1), reason: `${getElementName(element2)} nourishes ${getElementName(element1)} — the spirit of what is received governs this connection.` };
  }
  // Ke: element1 controls element2
  const KE = ['wood', 'earth', 'water', 'fire', 'metal'];
  const k1 = KE.indexOf(element1);
  const k2 = KE.indexOf(element2);
  if ((k1 + 1) % 5 === k2) {
    return { spirit: getSpiritByElement(element2), reason: `${getElementName(element1)} tempers ${getElementName(element2)} — the spirit being shaped holds the key to this relationship.` };
  }
  // Ke: element2 controls element1
  if ((k2 + 1) % 5 === k1) {
    return { spirit: getSpiritByElement(element1), reason: `${getElementName(element2)} tempers ${getElementName(element1)} — the spirit being shaped holds the key to this relationship.` };
  }
  // Fallback
  return { spirit: getSpiritByElement(element1), reason: 'A complex elemental meeting — both spirits are active in this space.' };
}

function getElementName(el) {
  return el.charAt(0).toUpperCase() + el.slice(1);
}

export { SPIRITS, SPIRIT_ORDER };
