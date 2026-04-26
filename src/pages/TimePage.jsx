import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayPillar, getYearPillar } from '../engine/calendar';
import { getElementInfo } from '../engine/elements';
import { getLifePhase } from '../engine/lifePhase';
import { getPhaseDeep } from '../engine/phaseDeep';
import { getRelationship } from '../engine/cycles';
import { loadFriends } from '../utils/localStorage';
import { calculateAge } from '../utils/dateUtils';
import GlassCard from '../components/common/GlassCard';
import styles from './TimePage.module.css';

function dateToParts(d) {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export default function TimePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });

  const friends = useMemo(() => loadFriends(), []);

  // Anchor dates for invitation chips (computed once relative to today)
  const anchors = useMemo(() => {
    if (!data) return null;
    const t = today;
    const bMonth = data.birthDate.month - 1;
    const bDay = data.birthDate.day;
    const thisYearBday = new Date(t.getFullYear(), bMonth, bDay);
    const lastBday = thisYearBday <= t
      ? thisYearBday
      : new Date(t.getFullYear() - 1, bMonth, bDay);
    const nextBday = thisYearBday > t
      ? thisYearBday
      : new Date(t.getFullYear() + 1, bMonth, bDay);

    return [
      { key: 'today', label: 'Today', date: t },
      { key: 'year-ago', label: 'A year ago', date: new Date(t.getFullYear() - 1, t.getMonth(), t.getDate()) },
      { key: 'five-ago', label: '5 years ago', date: new Date(t.getFullYear() - 5, t.getMonth(), t.getDate()) },
      { key: 'ten-ago', label: '10 years ago', date: new Date(t.getFullYear() - 10, t.getMonth(), t.getDate()) },
      { key: 'last-bday', label: 'Last birthday', date: lastBday },
      { key: 'next-bday', label: 'Next birthday', date: nextBday },
      { key: 'five-ahead', label: '5 years from now', date: new Date(t.getFullYear() + 5, t.getMonth(), t.getDate()) },
    ];
  }, [data]);

  const computed = useMemo(() => {
    if (!data) return null;
    const dateObj = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    const pillar = getDayPillar(dateObj);
    const pillarEl = getElementInfo(pillar.element);
    const userEl = getElementInfo(data.element);
    const rel = getRelationship(data.element, pillar.element);
    const yearDiff = selectedDate.year - today.getFullYear();
    const monthDiff = selectedDate.month - (today.getMonth() + 1);
    const dayDiff = selectedDate.day - today.getDate();
    const ageAtSelected = Math.max(0, calculateAge(data.birthDate.year, data.birthDate.month, data.birthDate.day) + yearDiff);
    const phaseAtDate = getLifePhase(ageAtSelected, data.gender);
    const isToday = selectedDate.year === today.getFullYear() &&
      selectedDate.month === today.getMonth() + 1 &&
      selectedDate.day === today.getDate();
    const isPast = yearDiff < 0 || (yearDiff === 0 && monthDiff < 0) || (yearDiff === 0 && monthDiff === 0 && dayDiff < 0);

    // Year pillar — the era/year energy of the selected year
    const yearPillar = getYearPillar(selectedDate.year);
    const yearEl = getElementInfo(yearPillar.stem.element);

    // Next phase transition from the SELECTED date's perspective
    const cycleLength = data.gender === 'female' ? 7 : 8;
    const currentPhaseIdx = phaseAtDate.phaseIndex;
    let transition = null;
    if (currentPhaseIdx < 8) {
      const nextTransitionAge = (currentPhaseIdx + 1) * cycleLength;
      const yearsUntil = nextTransitionAge - ageAtSelected;
      const nextPhase = getLifePhase(nextTransitionAge, data.gender);
      transition = { age: nextTransitionAge, yearsUntil, nextPhase };
    }

    // Menopause-wisdom line for this phase (deep book material)
    const phaseDeep = getPhaseDeep(phaseAtDate.phase);
    const wisdomLine = phaseDeep?.menopause?.wisdom || null;

    return {
      pillar, pillarEl, userEl, rel, ageAtSelected, phaseAtDate, isToday, yearDiff, isPast, dateObj,
      yearPillar, yearEl, transition, wisdomLine,
    };
  }, [data, selectedDate]);

  if (!data || !computed) return null;

  const phaseEl = getElementInfo(computed.phaseAtDate.element);

  const setFromDate = (d) => setSelectedDate(dateToParts(d));
  const isAnchorActive = (anchor) =>
    selectedDate.year === anchor.date.getFullYear() &&
    selectedDate.month === anchor.date.getMonth() + 1 &&
    selectedDate.day === anchor.date.getDate();

  const dateLabel = computed.dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const dayHeaderLabel = computed.isToday
    ? "Today's Energy"
    : computed.isPast
      ? 'The Energy of That Day'
      : 'The Energy Ahead';

  const arcMoment = computed.isToday
    ? 'now'
    : computed.isPast
      ? 'then'
      : 'ahead';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Time Travel</h1>
        <p className={styles.subtitle}>Read any day through the elemental landscape</p>
      </header>

      <SpiralIllustration />

      <div className={styles.content}>
        {/* Date invitation — chips first, selects as fallback */}
        <GlassCard>
          <span className={styles.cardLabel}>Travel to a moment</span>
          <div className={styles.chipsRow}>
            {anchors.map((a) => (
              <button
                key={a.key}
                className={`${styles.chip} ${isAnchorActive(a) ? styles.chipActive : ''}`}
                onClick={() => setFromDate(a.date)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className={styles.dateInputs}>
            <div className={styles.field}>
              <label>Year</label>
              <select value={selectedDate.year} onChange={(e) => setSelectedDate({ ...selectedDate, year: +e.target.value })}>
                {Array.from({ length: 111 }, (_, i) => 2030 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Month</label>
              <select value={selectedDate.month} onChange={(e) => setSelectedDate({ ...selectedDate, month: +e.target.value })}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'short' })}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Day</label>
              <select value={selectedDate.day} onChange={(e) => setSelectedDate({ ...selectedDate, day: +e.target.value })}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {/* The Day — stem and branch as the day's two voices */}
        <GlassCard glowColor={`${computed.pillarEl.hex}20`} onClick={() => navigate('/explore/element')} className={styles.tappable}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>{dayHeaderLabel}</span>
            <span className={styles.cardAccent} style={{ color: computed.pillarEl.hex }}>
              {computed.pillarEl.name} · {computed.pillar.yinYang === 'yang' ? 'Yang' : 'Yin'}
            </span>
          </div>
          <p className={styles.dayMeta}>
            {dateLabel} · {computed.pillar.chineseLabel} {computed.pillar.label}
          </p>
          <p className={styles.dayQuote}>{computed.pillar.stemImage}</p>
          <p className={styles.dayBranchQuote}>{computed.pillar.branchCharacter}</p>
          <div className={styles.dayMeeting}>
            <span className={styles.dayMeetingPair}>
              <span style={{ color: computed.userEl.hex }}>{computed.userEl.chinese}</span>
              <span className={styles.dayMeetingArrow}>
                {computed.rel.quality === 'Mirror' ? '⟷' : '→'}
              </span>
              <span style={{ color: computed.pillarEl.hex }}>{computed.pillarEl.chinese}</span>
            </span>
            <span className={styles.dayMeetingType} style={{ color: computed.pillarEl.hex }}>
              {computed.rel.name}
            </span>
          </div>
        </GlassCard>

        {/* The Year — era energy, the year-pillar's signature */}
        <GlassCard glowColor={`${computed.yearEl.hex}15`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>The year · {selectedDate.year}</span>
            <span className={styles.cardAccent} style={{ color: computed.yearEl.hex }}>
              {computed.yearEl.name} · {computed.yearPillar.stem.yinYang === 'yang' ? 'Yang' : 'Yin'}
            </span>
          </div>
          <p className={styles.dayMeta}>
            {computed.yearPillar.stem.chinese}{computed.yearPillar.branch.chinese} {computed.yearPillar.stem.name}-{computed.yearPillar.branch.name}
            {' · '}
            the {computed.yearPillar.branch.animal} year
          </p>
          <p className={styles.dayQuote}>{computed.yearPillar.stem.image}</p>
        </GlassCard>

        {/* The Arc — you and your circle on this date */}
        {(() => {
          const userEl = getElementInfo(data.element);
          const dateParam = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
          const groupHref = computed.isToday ? '/relations/group' : `/relations/group?date=${dateParam}`;
          return (
            <GlassCard glowColor={`${phaseEl.hex}15`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>Your arc · {arcMoment}</span>
                <span className={styles.cardAccent} style={{ color: phaseEl.hex }}>
                  Age {computed.ageAtSelected}
                </span>
              </div>

              <div className={styles.phaseDisplay}>
                <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>
                  {computed.phaseAtDate.phase}
                </span>
                <div>
                  <h3 className={styles.phaseTitle}>{computed.phaseAtDate.title}</h3>
                  <span className={styles.phaseMeta}>
                    {phaseEl.chinese} {phaseEl.name} · {computed.phaseAtDate.season}
                  </span>
                </div>
              </div>
              <p className={styles.phaseQuote}>{computed.phaseAtDate.subtitle}</p>

              {computed.transition && (
                <p className={styles.transitionLine}>
                  Next gateway at age {computed.transition.age} —
                  {' '}
                  <span style={{ color: getElementInfo(computed.transition.nextPhase.element).hex }}>
                    Phase {computed.transition.nextPhase.phase} · {computed.transition.nextPhase.title}
                  </span>
                </p>
              )}

              {computed.wisdomLine && (
                <p className={styles.wisdomLine}>{computed.wisdomLine}</p>
              )}

              {friends.length > 0 && (
                <>
                  <div className={styles.circleDivider}>
                    <span className={styles.circleDividerLabel}>
                      {friends.length} {friends.length === 1 ? 'person' : 'people'} in your circle
                    </span>
                  </div>
                  <div className={styles.peopleGrid}>
                    {friends.map((friend) => {
                      const fAgeAt = Math.max(0, calculateAge(friend.birthYear, 6, 15) + computed.yearDiff);
                      const fPhase = getLifePhase(fAgeAt, friend.gender);
                      const fEl = getElementInfo(friend.element);
                      const fPhaseEl = getElementInfo(fPhase.element);
                      return (
                        <button
                          key={friend.id}
                          className={styles.peopleMini}
                          onClick={() => navigate(`/relations/${friend.id}`)}
                          style={{ '--mini-accent': fPhaseEl.hex }}
                        >
                          <span className={styles.peopleMiniSymbol} style={{ color: fEl.hex }}>
                            {fEl.chinese}
                          </span>
                          <span className={styles.peopleMiniName}>{friend.name}</span>
                          <span className={styles.peopleMiniPhase} style={{ color: fPhaseEl.hex }}>
                            {fPhase.title}
                          </span>
                          <span className={styles.peopleMiniMeta}>
                            Phase {fPhase.phase} · age {fAgeAt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className={styles.peopleCircleBtn}
                    onClick={() => navigate(groupHref)}
                  >
                    See this date through your circle →
                  </button>
                </>
              )}
            </GlassCard>
          );
        })()}
      </div>
    </div>
  );
}

function SpiralIllustration() {
  const colors = ['#4a9e6e', '#4a9e6e', '#c75a3a', '#c9a84c', '#c9a84c', '#a8b8c8', '#a8b8c8', '#3a6fa0', '#4a9e6e'];
  return (
    <svg viewBox="0 0 220 180" className={styles.heroIllustration}>
      <style>{`
        @keyframes spiralFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -400; }
        }
        @keyframes phaseDotPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {[0, 1, 2, 3, 4].map((ring) => {
        const r = 15 + ring * 16;
        return (
          <circle key={ring} cx="110" cy="90" r={r}
            fill="none"
            style={{ stroke: 'var(--line-subtle)' }}
            strokeWidth="0.6"
            strokeDasharray={ring % 2 === 0 ? 'none' : '2 3'}
          />
        );
      })}

      <circle cx="110" cy="90" r="55" fill="none"
        strokeWidth="0.8"
        strokeDasharray="4 16"
        style={{ stroke: 'var(--line-medium)', animation: 'spiralFlow 25s linear infinite' }}
      />
      <circle cx="110" cy="90" r="35" fill="none"
        strokeWidth="0.6"
        strokeDasharray="3 12"
        style={{ stroke: 'var(--line-subtle)', animation: 'spiralFlow 20s linear infinite reverse' }}
      />

      {colors.map((color, i) => {
        const ring = 15 + (i / 8) * 64;
        const angle = (-90 + i * 40) * (Math.PI / 180);
        const x = 110 + ring * Math.cos(angle);
        const y = 90 + ring * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r="3.5" fill={color} opacity="0.4"
            style={{ animation: `phaseDotPulse ${5 + i * 0.5}s ease-in-out ${i * 0.6}s infinite` }}
          />
        );
      })}

      <circle cx="110" cy="90" r="5" style={{ fill: 'var(--line-faint)', stroke: 'var(--line-medium)' }} strokeWidth="0.5" />
      <circle cx="110" cy="90" r="2" style={{ fill: 'var(--line-strong)' }} />

      <line x1="110" y1="165" x2="110" y2="12" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 4" />
      <text x="110" y="8" textAnchor="middle" style={{ fill: 'var(--text-illustration-dim)' }} fontSize="7" fontFamily="var(--font-display)" fontStyle="italic">future</text>
      <text x="110" y="175" textAnchor="middle" style={{ fill: 'var(--text-illustration-dim)' }} fontSize="7" fontFamily="var(--font-display)" fontStyle="italic">past</text>
    </svg>
  );
}

