const REFLECTIONS_KEY = '9lives_reflections';
const JOURNAL_KEY = '9lives_journal';

// --- Reflections (interactive choices on PhaseDeepPage) ---

export function loadReflections() {
  try {
    const data = localStorage.getItem(REFLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReflection(phaseId, questionIndex, choiceIndex, choiceText) {
  const reflections = loadReflections();
  reflections.push({
    id: Date.now(),
    phaseId,
    questionIndex,
    choiceIndex,
    choiceText,
    date: new Date().toISOString(),
  });
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
  return reflections;
}

export function getReflectionsForPhase(phaseId) {
  return loadReflections().filter(r => r.phaseId === phaseId);
}

export function getLatestReflectionForQuestion(phaseId, questionIndex) {
  const all = loadReflections()
    .filter(r => r.phaseId === phaseId && r.questionIndex === questionIndex);
  return all.length > 0 ? all[all.length - 1] : null;
}

// --- Guided Journal ---

export function loadJournalEntries() {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(phaseId, step, prompt, text) {
  const entries = loadJournalEntries();
  entries.push({
    id: Date.now(),
    phaseId,
    step,
    prompt,
    text,
    date: new Date().toISOString(),
  });
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  return entries;
}

export function getJournalForPhase(phaseId) {
  return loadJournalEntries().filter(e => e.phaseId === phaseId);
}

// --- Timeline helpers ---

export function getTimeline() {
  const reflections = loadReflections().map(r => ({ ...r, type: 'reflection' }));
  const journal = loadJournalEntries().map(j => ({ ...j, type: 'journal' }));
  return [...reflections, ...journal].sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getTimelineGroupedByWeek() {
  const timeline = getTimeline();
  const groups = {};
  for (const entry of timeline) {
    const d = new Date(entry.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekOf, entries]) => ({ weekOf, entries }));
}
