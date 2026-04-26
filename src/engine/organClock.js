const ORGAN_CLOCK = [
  {
    key: 'lung',
    time: '03:00–05:00',
    startHour: 3,
    endHour: 5,
    organ: 'Lungs',
    element: 'metal',
    yinYang: 'yin',
    guidance: 'The breath deepens. Many wake at this hour if carrying unresolved grief. If you find yourself awake, breathe slowly and let the body release what it holds.',
    quality: 'Release & renewal',
  },
  {
    key: 'largeIntestine',
    time: '05:00–07:00',
    startHour: 5,
    endHour: 7,
    organ: 'Large Intestine',
    element: 'metal',
    yinYang: 'yang',
    guidance: 'The body\'s natural time for elimination. Rise gently, drink warm water. Let go of what is no longer needed — physically and mentally.',
    quality: 'Letting go',
  },
  {
    key: 'stomach',
    time: '07:00–09:00',
    startHour: 7,
    endHour: 9,
    organ: 'Stomach',
    element: 'earth',
    yinYang: 'yang',
    guidance: 'The best time to eat breakfast. The Stomach is at its strongest now — warm, nourishing food is received and transformed with ease.',
    quality: 'Receiving nourishment',
  },
  {
    key: 'spleen',
    time: '09:00–11:00',
    startHour: 9,
    endHour: 11,
    organ: 'Spleen',
    element: 'earth',
    yinYang: 'yin',
    guidance: 'Mental energy peaks. The Spleen gives sharpness to thought and concentration. Most people feel clearest here — use this window for focused, meaningful work.',
    quality: 'Clarity & focus',
  },
  {
    key: 'heart',
    time: '11:00–13:00',
    startHour: 11,
    endHour: 13,
    organ: 'Heart',
    element: 'fire',
    yinYang: 'yin',
    guidance: 'The Heart\'s time. Better for calm presence and connection than hard work. Share a meal, have a real conversation. Let Shen — your inner light — shine.',
    quality: 'Connection & presence',
  },
  {
    key: 'smallIntestine',
    time: '13:00–15:00',
    startHour: 13,
    endHour: 15,
    organ: 'Small Intestine',
    element: 'fire',
    yinYang: 'yang',
    guidance: 'The body sorts and discerns — what to absorb, what to release. A natural time for processing the morning\'s impressions. Light activity is better than heavy effort.',
    quality: 'Sorting & discerning',
  },
  {
    key: 'bladder',
    time: '15:00–17:00',
    startHour: 15,
    endHour: 17,
    organ: 'Bladder',
    element: 'water',
    yinYang: 'yang',
    guidance: 'Drink warm water and tea. The Bladder clears what the body no longer needs. A good time for gentle movement and stretching.',
    quality: 'Cleansing & flow',
  },
  {
    key: 'kidney',
    time: '17:00–19:00',
    startHour: 17,
    endHour: 19,
    organ: 'Kidneys',
    element: 'water',
    yinYang: 'yin',
    guidance: 'The Kidneys gather and restore. A light dinner is wise — let the body begin its evening descent. Fear or anxiety may surface here; meet it with stillness.',
    quality: 'Restoration & will',
  },
  {
    key: 'pericardium',
    time: '19:00–21:00',
    startHour: 19,
    endHour: 21,
    organ: 'Pericardium',
    element: 'fire',
    yinYang: 'yin',
    guidance: 'The heart\'s protector opens. Circulation works, warmth spreads. This is the time for closeness, gentle conversation, and winding down.',
    quality: 'Warmth & protection',
  },
  {
    key: 'tripleHeater',
    time: '21:00–23:00',
    startHour: 21,
    endHour: 23,
    organ: 'Triple Heater',
    element: 'fire',
    yinYang: 'yang',
    guidance: 'Hormones are regulated and balanced. The body prepares for deep repair. Bedtime around 22:00 supports this natural rhythm.',
    quality: 'Hormonal balance',
  },
  {
    key: 'gallbladder',
    time: '23:00–01:00',
    startHour: 23,
    endHour: 1,
    organ: 'Gallbladder',
    element: 'wood',
    yinYang: 'yang',
    guidance: 'Deep regeneration begins. The Gallbladder processes decisions and courage. Deep sleep is essential — being awake now depletes Wood energy and tomorrow\'s clarity.',
    quality: 'Regeneration & courage',
  },
  {
    key: 'liver',
    time: '01:00–03:00',
    startHour: 1,
    endHour: 3,
    organ: 'Liver',
    element: 'wood',
    yinYang: 'yin',
    guidance: 'The Liver cleanses blood and plans tomorrow. Deep sleep is crucial. Waking consistently at this hour may signal suppressed anger or frustration seeking release.',
    quality: 'Cleansing & vision',
  },
];

export function getCurrentOrgan() {
  const hour = new Date().getHours();
  return ORGAN_CLOCK.find(({ startHour, endHour }) => {
    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    }
    return hour >= startHour || hour < endHour;
  }) || ORGAN_CLOCK[0];
}

export function getOrganByHour(hour) {
  return ORGAN_CLOCK.find(({ startHour, endHour }) => {
    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    }
    return hour >= startHour || hour < endHour;
  }) || ORGAN_CLOCK[0];
}

export { ORGAN_CLOCK };
