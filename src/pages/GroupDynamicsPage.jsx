import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo, SHENG_DESCRIPTIONS, KE_DESCRIPTIONS } from '../engine/elements';
import { getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { getSpiritBetween, getSpiritByElement } from '../engine/wuShen';
import { calculateAge } from '../utils/dateUtils';
import { loadFriends } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './GroupDynamicsPage.module.css';

function parseDateParam(value) {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const year = +m[1], month = +m[2], day = +m[3];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

const ALL_ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'];

const GROUP_THEMES = {
  allSame: 'Every person in this constellation carries the same element. This is a field of deep resonance — an echo chamber in the truest sense. What one feels, all feel. The gift is effortless understanding. The risk is collective blind spots.',
  allSheng: 'The nourishing cycle flows unbroken through this group. Each person feeds the next — a living chain of elemental generosity. This constellation has a natural forward momentum, a sense of creative unfolding.',
  hasKe: 'This constellation holds both nourishment and tension. The Ke (tempering) dynamics bring necessary structure — without them, growth becomes shapeless. The friction you feel is not a problem to solve. It is the intelligence of the group.',
  balanced: 'This group holds a rare balance — multiple elements represented, with flows of both nourishment and gentle tempering. Like a garden with sun, rain, and season, there is a natural wholeness here.',
  missingElements: (missing) => `This constellation is missing the ${missing.join(' and ')} element${missing.length > 1 ? 's' : ''}. What is absent shapes the group as much as what is present. The missing element represents a quality the group must consciously cultivate — or find elsewhere.`,
};

// ─── Deeper layer: The Pattern ───────────────────────────────────────────────
const PATTERN_DEPTH = {
  allSame: {
    gift: 'Effortless recognition — you see each other clearly because you are made of the same material. There is almost no translation needed between you.',
    shadow: 'A field of one element has no internal mirror. Collective blind spots run deep: what one misses, all miss. The group cannot challenge itself from within.',
    practice: 'Deliberately seek out people with opposing elements. Your growth edges live in the qualities you do not carry — and this group cannot generate them alone.',
  },
  allSheng: {
    gift: 'Natural creative momentum flows through this constellation. Energy moves forward without resistance — one person\'s output becomes another\'s nourishment.',
    shadow: 'Without tempering, growth becomes excess. This field can over-expand, over-commit, over-produce before anything is fully completed or integrated.',
    practice: 'Build in deliberate pauses. Ask: what needs to be finished, pruned, or released before the next wave of creation begins?',
  },
  hasKe: {
    gift: 'Ke relationships hold the intelligence of structure. The friction here is real — and that is exactly where the most durable transformation lives.',
    shadow: 'When the tempering dynamic runs unconsciously, it can slide into control, subtle dominance, or long-held resentment on both sides.',
    practice: 'Name the ke relationships openly: "You tend to structure me. I tend to diffuse you." Making it explicit transforms friction into conscious collaboration.',
  },
  balanced: {
    gift: 'Multiple flows — nourishing and tempering together — create a self-regulating field. This balance is rare and takes time to build.',
    shadow: 'Equilibrium can be mistaken for stasis. A balanced field must still choose direction, or it simply maintains itself without moving toward anything.',
    practice: 'Use your natural balance as a foundation, not a destination. What does this stable field want to create, protect, or serve?',
  },
};

function getPatternDepth(relTypes) {
  if (Object.values(relTypes).every((_, i, a) => true) && relTypes.same && !relTypes.sheng_give && !relTypes.sheng_receive && !relTypes.ke_control && !relTypes.ke_controlled) return PATTERN_DEPTH.allSame;
  if (!relTypes.ke_control && !relTypes.ke_controlled) return PATTERN_DEPTH.allSheng;
  if (relTypes.ke_control || relTypes.ke_controlled) return PATTERN_DEPTH.hasKe;
  return PATTERN_DEPTH.balanced;
}

// ─── Deeper layer: Wu Shen group field ───────────────────────────────────────
const SPIRIT_FIELD_DEPTH = {
  'Shen': {
    quality: 'Consciousness & Presence',
    field: 'When the Heart-Mind governs most of the space between you, this group thinks and sees clearly together. Insight and genuine presence are available here. The shadow is over-illumination — a field that examines everything and allows nothing to mature quietly in the dark.',
  },
  'Hun': {
    quality: 'Vision & Possibility',
    field: 'The Ethereal Soul holds your connections in the direction of dreaming, planning, and creative imagining. The gift is collective vision. The shadow is drift — inspiring futures without the roots to reach them.',
  },
  'Po': {
    quality: 'Instinct & Body',
    field: 'When the Corporeal Soul governs the field between you, this group operates through physical presence, sensory attunement, and gut-level knowing. The shadow is reactivity: instinct without the pause of reflection.',
  },
  'Yi': {
    quality: 'Thought & Integration',
    field: 'The Intellect spirit in dominance means this group thinks carefully together — integrative, meaning-making, thorough. The shadow is over-deliberation: a field that maps every inch of the territory but forgets to walk it.',
  },
  'Zhi': {
    quality: 'Will & Endurance',
    field: 'When the Will governs most of the connections between you, this group can sustain what others abandon. Deep reserves of endurance live here. The shadow is rigidity — will that becomes stubbornness, persistence that closes the door on necessary change.',
  },
};

function getDominantSpiritInsight(pairs) {
  const counts = {};
  pairs.forEach(p => { counts[p.spirit.name] = (counts[p.spirit.name] || 0) + 1; });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return dominant ? SPIRIT_FIELD_DEPTH[dominant[0]] : null;
}

// ─── Deeper layer: Emotional Landscape ───────────────────────────────────────
function getEmotionalFieldInsight(presentElements) {
  const has = (e) => presentElements.includes(e);
  if (has('fire') && has('water'))
    return 'Fire and Water together create a field of intensity and depth. This constellation can swing between passionate engagement and quiet withdrawal. Under pressure, one polarity tends to dominate — the work is to hold both without choosing.';
  if (has('wood') && has('metal'))
    return 'Wood and Metal in the same field hold the tension of growth meeting structure. What wants to reach meets what wants to refine. This is the group\'s most generative creative force — as long as neither silences the other.';
  if (has('fire') && has('metal'))
    return 'Fire illuminates, Metal discerns. Together they create a rare combination: inspiration and critical clarity in the same field. Watch for Fire feeling judged and Metal feeling dismissed — both need the other to be whole.';
  if (has('wood') && has('earth'))
    return 'Wood reaches toward what could be; Earth asks what is actually needed right now. The tension between future and present is this group\'s most useful ongoing conversation — not a problem to resolve, but a rhythm to inhabit.';
  if (has('water') && has('earth'))
    return 'Water and Earth together bring depth and containment. Water fears being dammed; Earth fears being flooded. When both are honored, this becomes a field of sustained, quiet power — slow, deep, and lasting.';
  if (has('water') && has('fire'))
    return 'Where Water meets Fire, steam rises — rapid transformation lives in this field. The gift is alchemical change. The shadow is volatility: the same heat that transforms can also exhaust.';
  if (has('wood') && has('water'))
    return 'Water feeds Wood: this is a deeply nourishing emotional field, rich with creative potential and the courage to begin. The shadow is over-growth without harvest — always generating, rarely completing.';
  const balancedEmotions = presentElements.map(e => getElementInfo(e).emotion.balanced);
  return `This constellation holds ${balancedEmotions.join(', ')} as its living emotional resources — the qualities most available when the group is in its fullest expression.`;
}

function getEmotionalShadow(presentElements) {
  const absent = ALL_ELEMENTS.filter(e => !presentElements.includes(e));
  if (absent.length === 0) return 'With all five elements present, the full emotional spectrum is available. The work is integration — learning to move between joy, grief, fear, anger, and reflection without collapsing into any one of them.';
  const shadows = absent.map(e => getElementInfo(e).emotion.imbalanced);
  const names = absent.map(e => getElementInfo(e).name);
  return `The absent ${names.join(' and ')} element${names.length > 1 ? 's' : ''} point toward emotional territory this group may avoid or project outward: ${shadows.join(' and ')}. What we do not carry consciously, we tend to meet in others.`;
}

// ─── Deeper layer: Life Seasons ───────────────────────────────────────────────
const PHASE_WISDOM = {
  1: 'Phase 1 brings the energy of pure beginning — untested, curious, full of potential.',
  2: 'Phase 2 carries the drive to establish — to build foundations and prove capacity.',
  3: 'Phase 3 holds the hunger for expression and connection in full creative bloom.',
  4: 'Phase 4 is the consolidation phase — learning to choose depth over breadth.',
  5: 'Phase 5 sits at the center of life\'s arc, where questioning and reorientation begin.',
  6: 'Phase 6 brings the ripening of discernment — knowing what matters and what does not.',
  7: 'Phase 7 is a season of release and refinement — letting go of what is no longer essential.',
  8: 'Phase 8 carries the quality of deep integration — all of life\'s threads beginning to weave together.',
  9: 'Phase 9 holds the completion — wisdom embodied, presence without needing to prove.',
};

function getPhaseSpreadInsight(memberPhases) {
  const phases = memberPhases.map(m => m.phase.phase);
  const spread = Math.max(...phases) - Math.min(...phases);
  const min = Math.min(...phases);
  const max = Math.max(...phases);

  if (spread === 0)
    return 'You inhabit the same life season simultaneously — a rare convergence. There is effortless recognition here: you are asking the same questions, moving through the same passage, at the same time. The gift is synchrony. The risk is that no one holds the longer view.';
  if (spread <= 2)
    return 'Adjacent seasons. Like late summer meeting early autumn — distinct yet continuous. You can hear each other\'s questions because they are close variations on a shared theme. The wisdom flows easily in both directions.';
  if (spread >= 6)
    return `This constellation spans from Phase ${min} to Phase ${max} — an extraordinary range of life experience. Spring and winter in the same room. What the younger carries with freshness, the elder holds with earned depth. This is a field of full-spectrum wisdom, if it finds its common language.`;
  return `${spread} phases span this constellation. Each person stands at a genuinely different moment in the arc — asking different questions, carrying different wisdom. The younger brings what the elder has released; the elder holds what the younger is still approaching.`;
}

export default function GroupDynamicsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const allFriends = loadFriends();
  const [selectedIds, setSelectedIds] = useState(() => allFriends.map(f => f.id));

  if (!data) return null;

  const userEl = getElementInfo(data.element);

  // Optional date context from ?date=YYYY-MM-DD
  const targetDate = parseDateParam(searchParams.get('date'));
  const today = new Date();
  const isAtTarget = !!targetDate;
  const yearDiff = targetDate ? targetDate.year - today.getFullYear() : 0;
  const monthDiff = targetDate ? targetDate.month - (today.getMonth() + 1) : 0;
  const dayDiff = targetDate ? targetDate.day - today.getDate() : 0;
  const isPast = isAtTarget && (yearDiff < 0 || (yearDiff === 0 && monthDiff < 0) || (yearDiff === 0 && monthDiff === 0 && dayDiff < 0));
  const dateLabel = targetDate
    ? new Date(targetDate.year, targetDate.month - 1, targetDate.day).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    : null;
  const userPhaseAt = isAtTarget
    ? getLifePhase(Math.max(0, calculateAge(data.birthDate.year, data.birthDate.month, data.birthDate.day) + yearDiff), data.gender)
    : data.phase;

  const toggleFriend = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedFriends = allFriends.filter(f => selectedIds.includes(f.id));

  // Build the group: user + selected friends
  const members = [
    { id: 'user', name: 'You', element: data.element, birthYear: data.profile?.birthYear, gender: data.profile?.gender, isUser: true },
    ...selectedFriends.map(f => ({ ...f, isUser: false })),
  ];

  // All pairwise relationships
  const pairs = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const rel = getRelationship(members[i].element, members[j].element);
      const { spirit, reason } = getSpiritBetween(members[i].element, members[j].element);
      const spiritEl = getElementInfo(spirit.element);
      pairs.push({
        a: members[i],
        b: members[j],
        rel,
        spirit,
        spiritEl,
        reason,
      });
    }
  }

  // Element distribution
  const elementCounts = {};
  members.forEach(m => { elementCounts[m.element] = (elementCounts[m.element] || 0) + 1; });
  const presentElements = Object.keys(elementCounts);
  const missingElements = ALL_ELEMENTS.filter(e => !presentElements.includes(e));
  const missingInfo = missingElements.map(e => getElementInfo(e));

  // Relationship type counts
  const relTypes = {};
  pairs.forEach(p => { relTypes[p.rel.type] = (relTypes[p.rel.type] || 0) + 1; });

  // Determine group theme
  const getGroupTheme = () => {
    if (pairs.every(p => p.rel.type === 'same')) return GROUP_THEMES.allSame;
    if (pairs.every(p => p.rel.type.startsWith('sheng') || p.rel.type === 'same')) return GROUP_THEMES.allSheng;
    if (relTypes.ke_control || relTypes.ke_controlled) return GROUP_THEMES.hasKe;
    return GROUP_THEMES.balanced;
  };

  // Emotional landscape: collect all balanced/imbalanced emotions
  const emotionMap = {};
  members.forEach(m => {
    const el = getElementInfo(m.element);
    if (!emotionMap[m.element]) {
      emotionMap[m.element] = { balanced: el.emotion.balanced, imbalanced: el.emotion.imbalanced, hex: el.hex, chinese: el.chinese, names: [] };
    }
    emotionMap[m.element].names.push(m.name);
  });

  // Phase info for all members (recalculated for target date when present)
  const memberPhases = members.map(m => {
    if (m.isUser) {
      return { ...m, phase: userPhaseAt };
    }
    const age = calculateAge(m.birthYear, 6, 15) + yearDiff;
    const phase = getLifePhase(Math.max(0, age), m.gender);
    return { ...m, phase };
  });

  // Colors for illustration
  const memberColors = members.map(m => getElementInfo(m.element).hex);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(isAtTarget ? '/time' : '/relations')}>
        ← {isAtTarget ? 'Time' : 'Relations'}
      </button>

      <header className={styles.header}>
        <span className={styles.label}>
          {isAtTarget
            ? `${dateLabel} · ${isPast ? 'then' : yearDiff === 0 && monthDiff === 0 && dayDiff === 0 ? 'now' : 'ahead'}`
            : 'Group Constellation'}
        </span>
        <h1>The Field Between You</h1>
        <p className={styles.subtitle}>
          {members.length} {members.length === 1 ? 'person' : 'people'} · {presentElements.length} element{presentElements.length !== 1 ? 's' : ''}
        </p>
        {isAtTarget && (
          <button
            className={styles.dateClearBtn}
            onClick={() => navigate('/relations/group')}
          >
            View as now →
          </button>
        )}
      </header>

      <ConstellationIllustration members={members} memberColors={memberColors} pairs={pairs} />

      {/* Friend selector */}
      {allFriends.length > 0 && (
        <div className={styles.selector}>
          <span className={styles.selectorLabel}>Select who to include</span>
          <div className={styles.selectorGrid}>
            {allFriends.map(f => {
              const fEl = getElementInfo(f.element);
              const isSelected = selectedIds.includes(f.id);
              return (
                <button
                  key={f.id}
                  className={`${styles.selectorBtn} ${isSelected ? styles.selectorActive : ''}`}
                  onClick={() => toggleFriend(f.id)}
                  style={isSelected ? { borderColor: `${fEl.hex}60` } : {}}
                >
                  <span className={styles.selectorSymbol} style={{ color: isSelected ? fEl.hex : 'var(--text-muted)' }}>{fEl.chinese}</span>
                  <span className={styles.selectorName}>{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedFriends.length === 0 ? (
        <GlassCard>
          <p className={styles.emptyText}>Select at least one person above to see group dynamics.</p>
        </GlassCard>
      ) : (
        <div className={styles.cards}>
          {/* ─── Elemental Map ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Elemental Composition</span>
            <h2 className={styles.cardTitle}>Who Brings What</h2>
            <div className={styles.elementGrid}>
              {ALL_ELEMENTS.map(el => {
                const info = getElementInfo(el);
                const count = elementCounts[el] || 0;
                const names = members.filter(m => m.element === el).map(m => m.name);
                return (
                  <div key={el} className={`${styles.elementItem} ${count === 0 ? styles.elementAbsent : ''}`}>
                    <span className={styles.elementChinese} style={{ color: count > 0 ? info.hex : 'var(--text-muted)' }}>
                      {info.chinese}
                    </span>
                    <span className={styles.elementName} style={{ color: count > 0 ? info.hex : 'var(--text-muted)' }}>
                      {info.name}
                    </span>
                    {count > 0 ? (
                      <span className={styles.elementMembers}>{names.join(', ')}</span>
                    ) : (
                      <span className={styles.elementMissing}>absent</span>
                    )}
                  </div>
                );
              })}
            </div>

            {missingElements.length > 0 && (
              <p className={styles.bodyText}>
                {GROUP_THEMES.missingElements(missingInfo.map(e => e.name))}
              </p>
            )}
          </GlassCard>

          {/* ─── Group Theme ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>The Pattern</span>
            <h2 className={styles.cardTitle}>What Holds This Group Together</h2>
            <p className={styles.bodyText}>{getGroupTheme()}</p>

            <div className={styles.relSummary}>
              {relTypes.same > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{relTypes.same}</span>
                  <span className={styles.relSummaryType}>Resonance</span>
                  <span className={styles.relSummaryDesc}>Mirror connections</span>
                </div>
              )}
              {(relTypes.sheng_give || 0) + (relTypes.sheng_receive || 0) > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{(relTypes.sheng_give || 0) + (relTypes.sheng_receive || 0)}</span>
                  <span className={styles.relSummaryType}>Nourishing</span>
                  <span className={styles.relSummaryDesc}>Generative flows</span>
                </div>
              )}
              {(relTypes.ke_control || 0) + (relTypes.ke_controlled || 0) > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{(relTypes.ke_control || 0) + (relTypes.ke_controlled || 0)}</span>
                  <span className={styles.relSummaryType}>Tempering</span>
                  <span className={styles.relSummaryDesc}>Structuring tensions</span>
                </div>
              )}
            </div>

            {/* Deeper layer */}
            {(() => {
              const depth = getPatternDepth(relTypes);
              return (
                <div className={styles.deeperLayer}>
                  <div className={styles.deeperRow}>
                    <span className={styles.deeperLabel}>Gift</span>
                    <p className={styles.deeperText}>{depth.gift}</p>
                  </div>
                  <div className={styles.deeperRow}>
                    <span className={styles.deeperLabel}>Shadow</span>
                    <p className={styles.deeperText}>{depth.shadow}</p>
                  </div>
                  <div className={styles.deeperRow}>
                    <span className={styles.deeperLabel}>Practice</span>
                    <p className={styles.deeperText}>{depth.practice}</p>
                  </div>
                </div>
              );
            })()}
          </GlassCard>

          {/* ─── All Pairwise Dynamics ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Pairwise Dynamics</span>
            <h2 className={styles.cardTitle}>Every Connection</h2>

            {pairs.map((pair, idx) => {
              const aEl = getElementInfo(pair.a.element);
              const bEl = getElementInfo(pair.b.element);
              const cycleKey = `${pair.a.element}_${pair.b.element}`;
              const reverseKey = `${pair.b.element}_${pair.a.element}`;
              const metaphor = SHENG_DESCRIPTIONS[cycleKey] || SHENG_DESCRIPTIONS[reverseKey] || KE_DESCRIPTIONS[cycleKey] || KE_DESCRIPTIONS[reverseKey];
              return (
                <div key={idx} className={styles.pairItem}>
                  <div className={styles.pairHeader}>
                    <div className={styles.pairDots}>
                      <span className={styles.pairDot} style={{ background: aEl.hex }} />
                      <span className={styles.pairLine} />
                      <span className={styles.pairDot} style={{ background: bEl.hex }} />
                    </div>
                    <div className={styles.pairNames}>
                      <span>{pair.a.name} & {pair.b.name}</span>
                      <span className={styles.pairRelName}>{pair.rel.name}</span>
                    </div>
                  </div>
                  {metaphor && <p className={styles.pairMetaphor}>{metaphor}</p>}
                  <p className={styles.pairDesc}>{pair.rel.description}</p>
                </div>
              );
            })}
          </GlassCard>

          {/* ─── Spirits Between ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Wu Shen · Group Layer</span>
            <h2 className={styles.cardTitle}>Spirits Governing the Field</h2>
            <p className={styles.bodyText}>
              Between each pair of people, a spirit holds the relational space. In a group, these spirits form a constellation of their own — revealing which qualities are most alive in your shared field.
            </p>

            {pairs.map((pair, idx) => (
              <div key={idx} className={styles.spiritItem}>
                <div className={styles.spiritItemHeader}>
                  <span className={styles.spiritChinese} style={{ color: pair.spiritEl.hex }}>{pair.spirit.chinese}</span>
                  <div>
                    <span className={styles.spiritName} style={{ color: pair.spiritEl.hex }}>{pair.spirit.name}</span>
                    <span className={styles.spiritPairNames}>{pair.a.name} & {pair.b.name}</span>
                  </div>
                </div>
                <p className={styles.spiritTitle}>{pair.spirit.title}</p>
                <p className={styles.spiritReason}>{pair.reason}</p>
              </div>
            ))}

            {/* Deeper layer — dominant spirit in the field */}
            {(() => {
              const insight = getDominantSpiritInsight(pairs);
              if (!insight) return null;
              return (
                <div className={styles.deeperLayer}>
                  <span className={styles.deeperHeading}>The dominant spirit in this field</span>
                  <span className={styles.deeperQuality}>{insight.quality}</span>
                  <p className={styles.deeperText}>{insight.field}</p>
                </div>
              );
            })()}
          </GlassCard>

          {/* ─── Emotional Landscape ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Emotional Landscape</span>
            <h2 className={styles.cardTitle}>The Feeling Field</h2>
            <p className={styles.bodyText}>
              Each element carries its own emotional signature — a balanced expression and a shadow. In a group, these emotions weave together into a shared field that is greater than any single person.
            </p>

            <div className={styles.emotionGrid}>
              {Object.entries(emotionMap).map(([el, info]) => (
                <div key={el} className={styles.emotionItem}>
                  <span className={styles.emotionChinese} style={{ color: info.hex }}>{info.chinese}</span>
                  <div className={styles.emotionContent}>
                    <span className={styles.emotionNames}>{info.names.join(', ')}</span>
                    <span className={styles.emotionBalanced}>{info.balanced}</span>
                    <span className={styles.emotionShadow}>Shadow: {info.imbalanced}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Deeper layer — collective field insight */}
            <div className={styles.deeperLayer}>
              <div className={styles.deeperRow}>
                <span className={styles.deeperLabel}>Field</span>
                <p className={styles.deeperText}>{getEmotionalFieldInsight(presentElements)}</p>
              </div>
              <div className={styles.deeperRow}>
                <span className={styles.deeperLabel}>Absence</span>
                <p className={styles.deeperText}>{getEmotionalShadow(presentElements)}</p>
              </div>
            </div>
          </GlassCard>

          {/* ─── Life Seasons ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Life Seasons</span>
            <h2 className={styles.cardTitle}>Where Each Person Stands in Time</h2>

            <div className={styles.phaseList}>
              {memberPhases.map((m, idx) => {
                const phaseEl = getElementInfo(m.phase.element);
                return (
                  <div key={idx} className={styles.phaseItem}>
                    <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>{m.phase.phase}</span>
                    <div>
                      <span className={styles.phaseName}>{m.name}</span>
                      <h3 className={styles.phaseTitle}>{m.phase.title}</h3>
                      <span className={styles.phaseSeason}>
                        {phaseEl.chinese} {phaseEl.name} · {m.phase.season}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {(() => {
              const phases = memberPhases.map(m => m.phase.phase);
              const uniquePhases = [...new Set(phases)];
              const phaseElements = [...new Set(memberPhases.map(m => m.phase.element))];
              if (uniquePhases.length === 1) {
                return <p className={styles.phaseInsight}>Everyone stands in the same life season — a rare convergence. You are asking the same questions at the same time.</p>;
              }
              if (phaseElements.length === 1) {
                return <p className={styles.phaseInsight}>Though your phases differ, you all move through the same elemental season. The questions you carry are variations on a single theme.</p>;
              }
              const spread = Math.max(...phases) - Math.min(...phases);
              return <p className={styles.phaseInsight}>{spread} phases span this group — from the youngest season to the oldest. Each person brings the wisdom of their particular moment in time.</p>;
            })()}

            {/* Deeper layer — phase wisdom per person + spread insight */}
            <div className={styles.deeperLayer}>
              <span className={styles.deeperHeading}>What each season carries</span>
              {memberPhases.map((m, idx) => (
                <div key={idx} className={styles.deeperPhaseRow}>
                  <span className={styles.deeperPhaseName}>{m.name}</span>
                  <p className={styles.deeperText}>{PHASE_WISDOM[m.phase.phase]}</p>
                </div>
              ))}
              <div className={styles.deeperRow} style={{ marginTop: 'var(--space-sm)' }}>
                <span className={styles.deeperLabel}>Together</span>
                <p className={styles.deeperText}>{getPhaseSpreadInsight(memberPhases)}</p>
              </div>
            </div>
          </GlassCard>

          {/* ─── Group Reflection ─── */}
          <GlassCard>
            <div className={styles.finalReflection}>
              <span className={styles.cardLabel}>A closing thought</span>
              <p className={styles.finalText}>
                A group is not the sum of its parts — it is a field. The elements you carry, the spirits that govern your connections, the life seasons you each inhabit — these create something that exists only when you are together.
                What emerges in this particular constellation cannot emerge anywhere else. Pay attention to it.
              </p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function ConstellationIllustration({ members, memberColors, pairs }) {
  const count = members.length;
  const cx = 150, cy = 110;
  const radius = count <= 2 ? 45 : count === 3 ? 50 : 55;
  const circleR = count <= 2 ? 40 : count === 3 ? 35 : 30;

  // Position members in a circle (or line for 2)
  const positions = members.map((_, i) => {
    if (count === 1) return { x: cx, y: cy };
    if (count === 2) return { x: cx + (i === 0 ? -35 : 35), y: cy };
    const angle = (-90 + i * (360 / count)) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 300 220" className={styles.illustration}>
      <style>{`
        @keyframes grpBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes grpPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }
        @keyframes grpFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
      `}</style>

      <defs>
        {memberColors.map((color, i) => (
          <radialGradient key={`gg${i}`} id={`grpGrad${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="70%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Connection lines between all pairs */}
      {pairs.map((pair, idx) => {
        const ai = members.indexOf(pair.a);
        const bi = members.indexOf(pair.b);
        if (ai < 0 || bi < 0) return null;
        const isKe = pair.rel.type.includes('ke');
        return (
          <line key={`conn-${idx}`}
            x1={positions[ai].x} y1={positions[ai].y}
            x2={positions[bi].x} y2={positions[bi].y}
            style={{ stroke: isKe ? 'var(--line-subtle)' : 'var(--line-medium)' }}
            strokeWidth={isKe ? '0.5' : '0.8'}
            strokeDasharray={isKe ? '3 5' : '4 6'}
            style={{ animation: 'grpFlow 10s linear infinite' }}
          />
        );
      })}

      {/* Member circles */}
      {positions.map(({ x, y }, i) => (
        <g key={i} style={{ animation: `grpBreathe ${10 + i * 2}s ease-in-out infinite`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r={circleR} fill={`url(#grpGrad${i})`} />
          <circle cx={x} cy={y} r={circleR} fill="none" stroke={memberColors[i]} strokeWidth="0.9" opacity="0.6" />
          <circle cx={x} cy={y} r={circleR * 0.55} fill="none" stroke={memberColors[i]} strokeWidth="0.4" opacity="0.25" strokeDasharray="2 4" />
        </g>
      ))}

      {/* Spirit dots at midpoints of each pair */}
      {pairs.map((pair, idx) => {
        const ai = members.indexOf(pair.a);
        const bi = members.indexOf(pair.b);
        if (ai < 0 || bi < 0) return null;
        const mx = (positions[ai].x + positions[bi].x) / 2;
        const my = (positions[ai].y + positions[bi].y) / 2;
        return (
          <circle key={`sp-${idx}`} cx={mx} cy={my} r="3"
            fill={pair.spiritEl.hex} opacity="0.5"
            style={{ animation: `grpPulse ${6 + idx}s ease-in-out ${idx * 0.5}s infinite` }}
          />
        );
      })}

      {/* Center pulse */}
      {count > 2 && (
        <>
          <circle cx={cx} cy={cy} r="15" style={{ fill: 'var(--line-faint)', animation: 'grpPulse 7s ease-in-out infinite' }} />
          <circle cx={cx} cy={cy} r="2.5" style={{ fill: 'var(--text-illustration)' }} />
        </>
      )}

      {/* Labels */}
      {positions.map(({ x, y }, i) => {
        const el = getElementInfo(members[i].element);
        const labelOffset = circleR + 12;
        let ly = y, lx = x, anchor = 'middle';
        if (count === 2) {
          ly = y + circleR + 14;
        } else if (count >= 3) {
          const angle = (-90 + i * (360 / count)) * (Math.PI / 180);
          lx = cx + (radius + labelOffset) * Math.cos(angle);
          ly = cy + (radius + labelOffset) * Math.sin(angle);
          if (lx < cx - 10) anchor = 'end';
          else if (lx > cx + 10) anchor = 'start';
        }
        return (
          <text key={`lbl-${i}`} x={lx} y={ly}
            textAnchor={anchor} dominantBaseline="central"
            fill={el.hex} fontSize="7" fontFamily="var(--font-display)"
            fontStyle="italic" fontWeight="300" opacity="0.7">
            {members[i].name}
          </text>
        );
      })}
    </svg>
  );
}
