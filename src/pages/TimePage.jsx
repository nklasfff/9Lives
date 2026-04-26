import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayPillar } from '../engine/calendar';
import { getElementInfo } from '../engine/elements';
import { getLifePhase } from '../engine/lifePhase';
import { getRelationship } from '../engine/cycles';
import { loadFriends } from '../utils/localStorage';
import { calculateAge } from '../utils/dateUtils';
import GlassCard from '../components/common/GlassCard';
import styles from './TimePage.module.css';

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
    const ageAtSelected = calculateAge(data.birthDate.year, data.birthDate.month, data.birthDate.day) + yearDiff;
    const phaseAtDate = getLifePhase(Math.max(0, ageAtSelected), data.gender);
    const isToday = selectedDate.year === today.getFullYear() &&
      selectedDate.month === today.getMonth() + 1 &&
      selectedDate.day === today.getDate();
    const isPast = yearDiff < 0 || (yearDiff === 0 && monthDiff < 0) || (yearDiff === 0 && monthDiff === 0 && dayDiff < 0);

    return { pillar, pillarEl, userEl, rel, ageAtSelected, phaseAtDate, isToday, yearDiff, isPast, dateObj };
  }, [data, selectedDate]);

  if (!data || !computed) return null;

  const phaseEl = getElementInfo(computed.phaseAtDate.element);

  const resetToday = () => {
    setSelectedDate({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() });
  };

  const dateLabel = computed.dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const dayHeaderLabel = computed.isToday
    ? "Today's Energy"
    : computed.isPast
      ? 'The Energy of That Day'
      : 'The Energy Ahead';

  const phaseHeaderContext = computed.isToday
    ? 'today'
    : computed.yearDiff < 0
      ? `${Math.abs(computed.yearDiff)} years ago`
      : `in ${computed.yearDiff} years`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Time Travel</h1>
        <p className={styles.subtitle}>Read any day through the elemental landscape</p>
      </header>

      <SpiralIllustration />

      <div className={styles.content}>
        {/* Date picker — choose the moment */}
        <GlassCard>
          <div className={styles.pickerHeader}>
            <span className={styles.cardLabel}>Choose a date</span>
            {!computed.isToday && (
              <button className={styles.todayBtn} onClick={resetToday}>Today</button>
            )}
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

        {/* Day Energy — what kind of day this is, and how it meets you */}
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

        {/* Your phase at this date */}
        <GlassCard glowColor={`${phaseEl.hex}15`} onClick={() => navigate('/explore/phases')} className={styles.tappable}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Your phase</span>
            <span className={styles.cardAccent} style={{ color: phaseEl.hex }}>
              {phaseHeaderContext}
            </span>
          </div>
          <div className={styles.phaseDisplay}>
            <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>{computed.phaseAtDate.phase}</span>
            <div>
              <h3 className={styles.phaseTitle}>{computed.phaseAtDate.title}</h3>
              <span className={styles.phaseMeta}>
                Age {Math.max(0, computed.ageAtSelected)} · {phaseEl.chinese} {phaseEl.name} · {computed.phaseAtDate.season}
              </span>
            </div>
          </div>
          <p className={styles.phaseQuote}>{computed.phaseAtDate.subtitle}</p>
        </GlassCard>

        {/* Your circle on this date — kryds-funktion */}
        {friends.length > 0 && (() => {
          const userEl = getElementInfo(data.element);
          const dateParam = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
          const groupHref = computed.isToday ? '/relations/group' : `/relations/group?date=${dateParam}`;
          const moment = computed.isToday ? 'now' : computed.isPast ? 'then' : 'ahead';
          return (
            <GlassCard glowColor={`${userEl.hex}10`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>Your circle · {moment}</span>
                <span className={styles.cardAccent} style={{ color: userEl.hex }}>
                  {friends.length} {friends.length === 1 ? 'person' : 'people'}
                </span>
              </div>
              <div className={styles.peopleGrid}>
                {friends.map((friend) => {
                  const fAgeAt = calculateAge(friend.birthYear, 6, 15) + computed.yearDiff;
                  const safeAge = Math.max(0, fAgeAt);
                  const fPhase = getLifePhase(safeAge, friend.gender);
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
                        Phase {fPhase.phase} · age {safeAge}
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

