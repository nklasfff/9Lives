// Guided journal prompts — tailored to each element
// Each element has a set of themes the user can choose from,
// then body and time prompts that deepen the reflection.

const JOURNAL_PROMPTS = {
  wood: {
    intro: 'Wood holds direction, growth, and the force that pushes through obstacles. These questions invite you to notice where that energy lives in you right now.',
    themes: [
      { label: 'Direction', prompt: 'Where do you feel a sense of direction in your life right now — and where does it feel unclear?' },
      { label: 'Frustration', prompt: 'What is frustrating you lately — and what might that frustration be trying to move you toward?' },
      { label: 'Growth', prompt: 'What is growing in you right now, even if you cannot yet see the shape of it?' },
      { label: 'Flexibility', prompt: 'Where in your life are you bending easily — and where do you feel rigid?' },
      { label: 'Vision', prompt: 'If you could see five years ahead with perfect clarity, what would you want to be different?' },
    ],
    bodyPrompt: 'Close your eyes for a moment. Where do you feel this in your body — the tension, the movement, the reaching? Describe what you notice.',
    timePrompt: 'When was this different? Think back to a time when this theme felt lighter or heavier. What had changed?',
  },

  fire: {
    intro: 'Fire carries connection, joy, and the warmth that draws us toward each other. These questions invite you to notice where that flame burns in you right now.',
    themes: [
      { label: 'Connection', prompt: 'Who do you feel truly connected to right now — and where do you long for deeper connection?' },
      { label: 'Joy', prompt: 'When did you last feel pure, uncomplicated joy? What brought it?' },
      { label: 'Passion', prompt: 'What lights you up right now — and is there a passion you have dimmed that wants to return?' },
      { label: 'Vulnerability', prompt: 'Where are you allowing yourself to be seen — and where are you hiding?' },
      { label: 'Warmth', prompt: 'Who or what warms you from the inside? And who or what leaves you cold?' },
    ],
    bodyPrompt: 'Place your hand on your chest. What do you notice there — warmth, tightness, openness, restlessness? Let whatever is there speak.',
    timePrompt: 'When was this different? Think back to a time when connection or joy felt different in your life. What shifted?',
  },

  earth: {
    intro: 'Earth holds nourishment, stability, and the ground beneath your feet. These questions invite you to notice where your foundation stands right now.',
    themes: [
      { label: 'Nourishment', prompt: 'What truly nourishes you right now — not just keeps you busy, but genuinely fills you?' },
      { label: 'Stability', prompt: 'Where do you feel solid ground beneath you — and where does the ground feel uncertain?' },
      { label: 'Worry', prompt: 'What are your thoughts circling around? What would help them land?' },
      { label: 'Giving & Receiving', prompt: 'Are you giving more than you receive right now? Where is the balance?' },
      { label: 'Home', prompt: 'Where do you feel most at home — in a place, a person, a practice? And where do you feel displaced?' },
    ],
    bodyPrompt: 'Notice your belly, your centre. Does it feel full or empty, tight or soft? What does your body need from you right now?',
    timePrompt: 'When was this different? Think back to a time when your sense of stability or nourishment felt different. What was holding you then?',
  },

  metal: {
    intro: 'Metal carries clarity, discernment, and the courage to let go. These questions invite you to notice where that sharpness lives in you right now.',
    themes: [
      { label: 'Clarity', prompt: 'Where in your life do you see with striking clarity right now — and where is the fog thickest?' },
      { label: 'Letting Go', prompt: 'What are you holding onto that has already served its purpose? What would it feel like to set it down?' },
      { label: 'Value', prompt: 'What do you truly value — when you set aside what others expect you to value?' },
      { label: 'Grief', prompt: 'Is there a loss — recent or old — that you have not fully honoured? What does it need from you?' },
      { label: 'Boundaries', prompt: 'Where are your boundaries clear and strong — and where do they need tending?' },
    ],
    bodyPrompt: 'Notice your breath, your lungs, your skin. Is the breath deep or shallow? Does the skin feel open or guarded? Describe what you find.',
    timePrompt: 'When was this different? Think back to a time when clarity or letting go felt different. What had you not yet seen?',
  },

  water: {
    intro: 'Water holds depth, stillness, and the wisdom that lives beneath the surface. These questions invite you to notice where that quiet knowing lives in you right now.',
    themes: [
      { label: 'Stillness', prompt: 'When did you last allow yourself to be truly still — not resting to recover, but still for its own sake?' },
      { label: 'Fear', prompt: 'What are you afraid of right now? And is the fear protecting something precious, or keeping you from something needed?' },
      { label: 'Wisdom', prompt: 'What do you know in your bones that you have never been able to put into words?' },
      { label: 'Depth', prompt: 'Where in your life do you go deep — and where do you stay on the surface to avoid what is below?' },
      { label: 'Rest', prompt: 'Are you truly resting — or are you depleting something that needs replenishing?' },
    ],
    bodyPrompt: 'Notice your lower back, your kidneys, the base of your spine. Do you feel supported there, or tired? What does that part of you want to say?',
    timePrompt: 'When was this different? Think back to a time when rest or depth felt different in your life. What had you found — or lost?',
  },
};

export function getJournalPrompts(element) {
  return JOURNAL_PROMPTS[element] || JOURNAL_PROMPTS.water;
}

export function getJournalSummaryMessage(element, theme) {
  const messages = {
    wood: `Your reflection on "${theme}" is saved. Wood energy moves best when seen clearly. Return when you are ready to notice what has shifted.`,
    fire: `Your reflection on "${theme}" is saved. The heart remembers what the mind forgets. Return when the flame calls again.`,
    earth: `Your reflection on "${theme}" is saved. What is planted in awareness grows in its own time. Return when you are ready to tend it.`,
    metal: `Your reflection on "${theme}" is saved. Clarity arrives in layers. Return when you are ready to see the next one.`,
    water: `Your reflection on "${theme}" is saved. Depth cannot be rushed. Return when the still water calls you back.`,
  };
  return messages[element] || messages.water;
}
