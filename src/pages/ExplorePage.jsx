import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getDayPillar, getYearPillar } from '../engine/calendar';
import { getRelationship } from '../engine/cycles';
import { getCurrentOrgan } from '../engine/organClock';
import { getElementPractice, getPracticeForOrgan } from '../engine/practices';
import { getLifePhase, getAllPhases } from '../engine/lifePhase';
import { EXTRAORDINARY_MERIDIANS } from '../engine/meridians';
import { getSpiritByElement } from '../engine/wuShen';
import { getPhaseDeep } from '../engine/phaseDeep';
import { getTimelineGroupedByWeek } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

// ─── Helpers ────────────────────────────────────────────────────────────

// For her profile, which 2-3 vessels are most active (element-driven + phase-driven)
const ELEMENT_VESSELS = {
  wood:  [2, 5], // Du Mai (yang authority), Yang Wei Mai (evolution)
  fire:  [1, 4], // Ren Mai (bonding), Yin Wei Mai (meaning)
  earth: [1, 0], // Ren Mai (nourishment), Chong Mai (ancestry)
  metal: [3, 6], // Dai Mai (release), Yin Qiao Mai (receptivity)
  water: [0, 4], // Chong Mai (essence), Yin Wei Mai (meaning)
};
const PHASE_VESSEL = {
  1: 7, 2: 7, // Yang Qiao (visibility, becoming)
  3: 2,       // Du Mai (uprightness, identity)
  4: 1, 5: 1, // Ren Mai (bonding, holding)
  6: 5, 7: 5, // Yang Wei (evolution, release)
  8: 4,       // Yin Wei (meaning, essence)
  9: 0,       // Chong Mai (second spring, ancestral)
};
const VESSEL_REASON = {
  wood:  'Wood needs the upright spine — your direction depends on it.',
  fire:  'Fire seeks bonding — your heart asks to be held and to hold.',
  earth: 'Earth nourishes — your work is to receive as well as to give.',
  metal: 'Metal refines — your faculty is letting what is finished go.',
  water: 'Water carries essence — your line is older than you.',
};
const PHASE_REASON = {
  1: 'Becoming visible for the first time.',
  2: 'Becoming visible for the first time.',
  3: 'Standing upright in your own identity.',
  4: 'Holding what you have built — bonding deeply.',
  5: 'Holding what you have built — bonding deeply.',
  6: 'Releasing what is no longer essential — the work of evolution.',
  7: 'Releasing what is no longer essential — the work of evolution.',
  8: 'Listening for the meaning beneath your story.',
  9: 'Drawing on what was passed to you, and passing it on.',
};

function getActiveVessels(element, phase) {
  const elIdx = ELEMENT_VESSELS[element] || [0, 1];
  const phIdx = PHASE_VESSEL[phase] != null ? PHASE_VESSEL[phase] : 4;
  const indices = [...new Set([...elIdx, phIdx])].slice(0, 3);
  return indices.map((i) => ({
    ...EXTRAORDINARY_MERIDIANS[i],
    reason: VESSEL_REASON[element] + ' ' + PHASE_REASON[phase],
  }));
}

function getPhaseTimeline(birthYear, gender) {
  const cycleLength = gender === 'female' ? 7 : 8;
  const allPhases = getAllPhases(gender);
  return allPhases.map((p, i) => {
    const startAge = i * cycleLength;
    const endAge = i === 8 ? null : (i + 1) * cycleLength - 1;
    return {
      ...p,
      startAge,
      endAge,
      startYear: birthYear + startAge,
      endYear: endAge != null ? birthYear + endAge : null,
    };
  });
}

function ordinalDay(n) {
  if (n >= 11 && n <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function entryRoute(entry) {
  if (entry.type === 'organ') return `/explore/organs/${entry.organKey}`;
  if (entry.type === 'reflection' || entry.type === 'journal') return `/explore/phases/${entry.phaseId}`;
  return null;
}

function entrySource(entry) {
  if (entry.type === 'organ') {
    return (entry.organKey || 'Organ').replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }
  if (entry.type === 'reflection' || entry.type === 'journal') return `Phase ${entry.phaseId}`;
  return '';
}

// ─── Page ───────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();

  const view = useMemo(() => {
    if (!data) return null;
    const today = new Date();
    const userEl = getElementInfo(data.element);
    const phaseEl = getElementInfo(data.phase.element);

    // 1. Birth-pillar chart
    const yearPillar = getYearPillar(data.birthDate.year);
    const birthDate = new Date(data.birthDate.year, data.birthDate.month - 1, data.birthDate.day);
    const dayPillar = getDayPillar(birthDate);
    const dayPillarEl = getElementInfo(dayPillar.element);
    const yearStemEl = getElementInfo(yearPillar.stem.element);
    const yearBranchEl = getElementInfo(yearPillar.branch.element);

    // 2. Alignment now
    const todayPillar = getDayPillar(today);
    const todayEl = getElementInfo(todayPillar.element);
    const currentOrgan = getCurrentOrgan();
    const organEl = getElementInfo(currentOrgan.element);
    const alignment = [
      { fromLabel: 'You',   fromEl: userEl,  toLabel: 'Phase',  toEl: phaseEl,   rel: getRelationship(data.element, data.phase.element) },
      { fromLabel: 'Phase', fromEl: phaseEl, toLabel: 'Today',  toEl: todayEl,   rel: getRelationship(data.phase.element, todayPillar.element) },
      { fromLabel: 'Today', fromEl: todayEl, toLabel: 'Hour',   toEl: organEl,   rel: getRelationship(todayPillar.element, currentOrgan.element) },
    ];

    // 3. Life map
    const timeline = getPhaseTimeline(data.birthDate.year, data.gender);

    // 4. Active vessels for HER profile
    const activeVessels = getActiveVessels(data.element, data.phase.phase);

    // 5. Trail
    const trailWeeks = getTimelineGroupedByWeek();

    // 6. Practice for you now
    const elPractice = getElementPractice(data.element);
    const organPractice = getPracticeForOrgan(currentOrgan.organ);
    const phaseDeep = getPhaseDeep(data.phase.phase);
    // Rotate phase advice by day-of-year so it changes daily but is stable across reloads
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const phaseAdvice = phaseDeep && phaseDeep.advice && phaseDeep.advice.length > 0
      ? phaseDeep.advice[dayOfYear % phaseDeep.advice.length]
      : null;
    const practice = {
      element: elPractice,
      organ: organPractice,
      organName: currentOrgan.organ,
      organTime: currentOrgan.time,
      phaseAdvice,
    };

    const spirit = getSpiritByElement(data.element);

    return {
      userEl, phaseEl,
      yearPillar, yearStemEl, yearBranchEl,
      dayPillar, dayPillarEl,
      alignment, todayPillar, todayEl, currentOrgan, organEl,
      timeline, activeVessels, trailWeeks, practice, spirit,
    };
  }, [data]);

  if (!data || !view) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Explore</h1>
        <p className={styles.subtitle}>Readings the engine produces only here</p>
      </header>

      <div className={styles.content}>

        {/* ─── 1. Your chart ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your chart</h2>
          <p className={styles.sectionLead}>Two pillars from the day and the year you were born — the classical reading.</p>

          <GlassCard className={styles.pillarCard}>
            <div className={styles.pillarHead}>
              <span className={styles.pillarKicker}>Year of birth · {data.birthDate.year}</span>
              <span className={styles.pillarChinese} style={{ color: view.yearStemEl.hex }}>
                {view.yearPillar.stem.chinese}{view.yearPillar.branch.chinese}
              </span>
              <span className={styles.pillarLabel}>
                {view.yearPillar.stem.name}-{view.yearPillar.branch.name}
                {' · '}
                <span style={{ color: view.yearStemEl.hex }}>{view.yearPillar.stem.yinYang === 'yang' ? 'Yang' : 'Yin'} {view.yearStemEl.name}</span>
                {' · '}
                <span>the {view.yearPillar.branch.animal}</span>
              </span>
            </div>
            <p className={styles.pillarStem}>{view.yearPillar.stem.image}</p>
            <p className={styles.pillarBranch}>{view.yearPillar.branch.character}</p>
          </GlassCard>

          <GlassCard className={styles.pillarCard}>
            <div className={styles.pillarHead}>
              <span className={styles.pillarKicker}>
                Day of birth · {data.birthDate.month}/{data.birthDate.day}/{data.birthDate.year}
              </span>
              <span className={styles.pillarChinese} style={{ color: view.dayPillarEl.hex }}>
                {view.dayPillar.chineseLabel}
              </span>
              <span className={styles.pillarLabel}>
                {view.dayPillar.label}
                {' · '}
                <span style={{ color: view.dayPillarEl.hex }}>
                  {view.dayPillar.yinYang === 'yang' ? 'Yang' : 'Yin'} {view.dayPillarEl.name}
                </span>
              </span>
            </div>
            <p className={styles.pillarStem}>{view.dayPillar.stemImage}</p>
            <p className={styles.pillarBranch}>{view.dayPillar.branchCharacter}</p>
          </GlassCard>

          <GlassCard className={styles.pillarSummary}>
            <p className={styles.pillarSummaryText}>
              Your constitutional element is{' '}
              <span style={{ color: view.userEl.hex }}>{view.userEl.chinese} {view.userEl.name}</span>
              {' '}— inherited through your year-branch, the {data.zodiac.name}.
              {view.spirit && (
                <> Your inhabiting spirit is <span style={{ color: view.userEl.hex }}>{view.spirit.chinese} {view.spirit.name}</span>{' '}— {view.spirit.title.toLowerCase()}.</>
              )}
            </p>
          </GlassCard>
        </section>

        {/* ─── 2. Alignment now ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Alignment now</h2>
          <p className={styles.sectionLead}>Where the element forces meet at this moment.</p>

          <GlassCard>
            <div className={styles.alignmentRows}>
              <AlignRow label="You"   el={view.userEl} />
              <AlignRow label="Phase" el={view.phaseEl} relation={view.alignment[0].rel} />
              <AlignRow label="Today" el={view.todayEl} relation={view.alignment[1].rel} />
              <AlignRow label="Hour"  el={view.organEl} relation={view.alignment[2].rel} sub={view.currentOrgan.organ} />
            </div>
            <p className={styles.alignmentNote}>
              Three element relationships in active conversation right now — between who you are, where you stand in your life, what kind of day this is, and what your body is doing in this hour.
            </p>
          </GlassCard>
        </section>

        {/* ─── 3. Practice for you now ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Practice for you now</h2>
          <p className={styles.sectionLead}>Synthesised from your element, your phase, and the active organ.</p>

          {view.practice.organ && (
            <GlassCard>
              <span className={styles.practiceLabel}>This hour · {view.practice.organName}</span>
              <p className={styles.practiceMove}>移 {view.practice.organ.movement}</p>
              <p className={styles.practiceNourish}>食 {view.practice.organ.dietary}</p>
            </GlassCard>
          )}

          {view.practice.element && (
            <GlassCard glowColor={`${view.userEl.hex}10`}>
              <span className={styles.practiceLabel} style={{ color: view.userEl.hex }}>
                For your {view.userEl.name}
              </span>
              <p className={styles.practiceMove}>{view.practice.element.dietBody}</p>
            </GlassCard>
          )}

          {view.practice.phaseAdvice && (
            <GlassCard glowColor={`${view.phaseEl.hex}10`}>
              <span className={styles.practiceLabel} style={{ color: view.phaseEl.hex }}>
                For Phase {data.phase.phase} · {data.phase.title}
              </span>
              <h3 className={styles.practiceHeading}>{view.practice.phaseAdvice.title}</h3>
              <p className={styles.practiceBody}>{view.practice.phaseAdvice.body}</p>
            </GlassCard>
          )}
        </section>

        {/* ─── 4. Active vessels ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Active vessels</h2>
          <p className={styles.sectionLead}>
            Of the eight extraordinary meridians, these carry your most active currents now.
          </p>

          {view.activeVessels.map((m, i) => (
            <GlassCard
              key={i}
              className={styles.vesselCard}
              onClick={() => navigate('/explore/depths')}
            >
              <div className={styles.vesselHead}>
                <span className={styles.vesselChinese}>{m.chinese}</span>
                <div>
                  <h3 className={styles.vesselName}>{m.name}</h3>
                  <span className={styles.vesselEnglish}>{m.englishName}</span>
                </div>
              </div>
              <p className={styles.vesselEssence}>{m.essence}</p>
              <p className={styles.vesselReason}>{m.reason}</p>
            </GlassCard>
          ))}
        </section>

        {/* ─── 5. Your nine seasons ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your nine seasons</h2>
          <p className={styles.sectionLead}>The full arc of your life — past, present, ahead.</p>

          <div className={styles.timeline}>
            {view.timeline.map((p) => {
              const pEl = getElementInfo(p.element);
              const isPast    = data.age > (p.endAge ?? Infinity);
              const isCurrent = data.age >= p.startAge && (p.endAge == null || data.age <= p.endAge);
              const isFuture  = data.age < p.startAge;
              return (
                <button
                  key={p.phase}
                  className={`${styles.tlEntry} ${isCurrent ? styles.tlCurrent : ''} ${isPast ? styles.tlPast : ''} ${isFuture ? styles.tlFuture : ''}`}
                  style={{ '--tl-accent': pEl.hex }}
                  onClick={() => navigate(`/explore/phases/${p.phase}`)}
                >
                  <span className={styles.tlNum} style={{ color: pEl.hex }}>{p.phase}</span>
                  <div className={styles.tlText}>
                    <span className={styles.tlTitle}>{p.title}</span>
                    <span className={styles.tlMeta}>
                      ages {p.startAge}{p.endAge != null ? `–${p.endAge}` : '+'}
                      {' · '}
                      {p.startYear}{p.endYear != null ? `–${p.endYear}` : '+'}
                    </span>
                    <span className={styles.tlSeason} style={{ color: pEl.hex }}>
                      {pEl.chinese} {pEl.name} · {p.season}
                    </span>
                  </div>
                  {isCurrent && <span className={styles.tlBadge} style={{ color: pEl.hex, borderColor: pEl.hex }}>now</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── 6. Your trail ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your trail</h2>
          {view.trailWeeks.length === 0 ? (
            <GlassCard>
              <p className={styles.trailEmpty}>
                As you reflect on the questions inside each layer, your trail begins here.
              </p>
            </GlassCard>
          ) : (
            <p className={styles.sectionLead}>
              {view.trailWeeks.reduce((s, w) => s + w.entries.length, 0)} reflections, week by week.
            </p>
          )}

          {view.trailWeeks.slice().reverse().map((week) => (
            <div key={week.weekOf} className={styles.trailWeek}>
              <h3 className={styles.trailWeekLabel}>
                Week of {new Date(week.weekOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              {week.entries.slice().reverse().map((entry) => {
                const route = entryRoute(entry);
                const source = entrySource(entry);
                const question = entry.question || entry.prompt || '';
                const text = entry.text || entry.choiceText || '';
                const d = new Date(entry.date);
                return (
                  <button
                    key={entry.id}
                    className={styles.trailEntry}
                    onClick={() => route && navigate(route)}
                  >
                    <div className={styles.trailEntryHeader}>
                      <span className={styles.trailEntrySource}>{source}</span>
                      <span className={styles.trailEntryDate}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' })} {ordinalDay(d.getDate())}
                      </span>
                    </div>
                    {question && <p className={styles.trailEntryQuestion}>{question}</p>}
                    {text && <p className={styles.trailEntryText}>{text}</p>}
                  </button>
                );
              })}
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

// ─── Sub-component for alignment row ────────────────────────────────────

function AlignRow({ label, el, relation, sub }) {
  return (
    <div className={styles.alignRow}>
      <div className={styles.alignLeft}>
        <span className={styles.alignLabel}>{label}</span>
        {sub && <span className={styles.alignSub}>{sub}</span>}
      </div>
      <span className={styles.alignChinese} style={{ color: el.hex }}>{el.chinese}</span>
      <span className={styles.alignName} style={{ color: el.hex }}>{el.name}</span>
      {relation && (
        <span className={styles.alignRel}>
          <span className={styles.alignArrow}>{relation.quality === 'Mirror' ? '⟷' : '→'}</span>
          <span className={styles.alignRelName}>{relation.name}</span>
        </span>
      )}
    </div>
  );
}
