import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { getDayPillar } from '../engine/calendar';
import { getElementInfo } from '../engine/elements';
import { getLifePhase } from '../engine/lifePhase';
import { getRelationship } from '../engine/cycles';
import { getCurrentOrgan, ORGAN_CLOCK } from '../engine/organClock';
import { loadFriends } from '../utils/localStorage';
import { calculateAge } from '../utils/dateUtils';
import GlassCard from '../components/common/GlassCard';
import styles from './TimePage.module.css';

export default function TimePage() {
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
    const pillar = getDayPillar(new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day));
    const pillarEl = getElementInfo(pillar.element);
    const rel = getRelationship(data.element, pillar.element);
    const yearDiff = selectedDate.year - today.getFullYear();
    const ageAtSelected = calculateAge(data.birthDate.year, data.birthDate.month, data.birthDate.day) + yearDiff;
    const phaseAtDate = getLifePhase(Math.max(0, ageAtSelected), data.gender);
    const isToday = selectedDate.year === today.getFullYear() &&
      selectedDate.month === today.getMonth() + 1 &&
      selectedDate.day === today.getDate();
    const currentOrgan = getCurrentOrgan();

    return { pillar, pillarEl, rel, ageAtSelected, phaseAtDate, isToday, yearDiff, currentOrgan };
  }, [data, selectedDate]);

  if (!data || !computed) return null;

  const phaseEl = getElementInfo(computed.phaseAtDate.element);
  const organEl = getElementInfo(computed.currentOrgan.element);

  const resetToday = () => {
    setSelectedDate({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Time Travel</h1>
        <p className={styles.subtitle}>Journey through the elemental landscape of any moment</p>
      </header>

      <SpiralIllustration />

      <div className={styles.content}>
        {/* Date picker */}
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

        {/* Day Pillar — slim */}
        <GlassCard glowColor={`${computed.pillarEl.hex}15`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Day Pillar</span>
            <span className={styles.cardAccent} style={{ color: computed.pillarEl.hex }}>
              {computed.pillarEl.name} ({computed.pillar.yinYang})
            </span>
          </div>
          <div className={styles.pillarDisplay}>
            <span className={styles.pillarChinese} style={{ color: computed.pillarEl.hex }}>
              {computed.pillar.chineseLabel}
            </span>
            <span className={styles.pillarName}>{computed.pillar.label}</span>
          </div>
          <p className={styles.pillarImage}>{computed.pillar.stemImage}</p>
          <div className={styles.relSection}>
            <span className={styles.relName}>{computed.rel.name}</span>
            <p className={styles.relDesc}>{computed.rel.description}</p>
          </div>
        </GlassCard>

        {/* Life Phase at date */}
        <GlassCard glowColor={`${phaseEl.hex}15`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>
              {computed.isToday ? 'Your current phase' :
                computed.yearDiff < 0 ? `${Math.abs(computed.yearDiff)} years ago` :
                  `In ${computed.yearDiff} years`}
            </span>
            <span className={styles.cardAccent} style={{ color: phaseEl.hex }}>
              Age {Math.max(0, computed.ageAtSelected)}
            </span>
          </div>
          <div className={styles.phaseDisplay}>
            <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>{computed.phaseAtDate.phase}</span>
            <div>
              <h3 className={styles.phaseTitle}>{computed.phaseAtDate.title}</h3>
              <span className={styles.phaseMeta}>
                {phaseEl.chinese} {phaseEl.name} · {computed.phaseAtDate.season}
              </span>
            </div>
          </div>
          <p className={styles.phaseQuote}>{computed.phaseAtDate.subtitle}</p>
        </GlassCard>

        {/* Active Organ — like Home, not full list */}
        {computed.isToday && (
          <GlassCard glowColor={`${organEl.hex}15`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Organ Clock — {computed.currentOrgan.time}</span>
              <span className={styles.cardAccent} style={{ color: organEl.hex }}>
                {computed.currentOrgan.organ}
              </span>
            </div>
            <p className={styles.phaseQuote}>{computed.currentOrgan.quality}</p>
            <p className={styles.bodyText}>{computed.currentOrgan.guidance}</p>
          </GlassCard>
        )}

        {/* Friends on this date */}
        {friends.length > 0 && (
          <GlassCard>
            <span className={styles.cardLabel}>Your people · {computed.isToday ? 'now' : selectedDate.year}</span>
            <div className={styles.friendPhases}>
              {friends.map((friend) => {
                const fAge = calculateAge(friend.birthYear, 6, 15) + computed.yearDiff;
                const fPhase = getLifePhase(Math.max(0, fAge), friend.gender);
                const fEl = getElementInfo(fPhase.element);
                return (
                  <div key={friend.id} className={styles.friendPhaseRow}>
                    <span className={styles.friendPhaseName}>{friend.name}</span>
                    <span className={styles.friendPhaseInfo} style={{ color: fEl.hex }}>
                      Phase {fPhase.phase} · {fPhase.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>

      <DailyCycleIllustration />

      {/* Deeper layer cards — concise */}
      <div className={styles.deeperCards}>
        <GlassCard>
          <span className={styles.deepLabel}>Gan Zhi · Calendar Layer</span>
          <h3 className={styles.deepTitle}>Temporal Signatures</h3>
          <p className={styles.bodyText}>
            Each day carries a unique energetic signature — a Heavenly Stem paired with an Earthly Branch. Knowing the day's quality is like knowing the tide before you swim.
          </p>
        </GlassCard>

        <GlassCard>
          <span className={styles.deepLabel}>Life Phases · Transition Layer</span>
          <h3 className={styles.deepTitle}>Phase Transitions</h3>
          <p className={styles.bodyText}>
            The moments between phases are thresholds. Use the date picker to find your next transition — see what element awaits and what season your life is entering.
          </p>
        </GlassCard>
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

      {/* Spiral rings */}
      {[0, 1, 2, 3, 4].map((ring) => {
        const r = 15 + ring * 16;
        return (
          <circle key={ring} cx="110" cy="90" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.6"
            strokeDasharray={ring % 2 === 0 ? 'none' : '2 3'}
          />
        );
      })}

      {/* Flowing energy */}
      <circle cx="110" cy="90" r="55" fill="none"
        stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"
        strokeDasharray="4 16"
        style={{ animation: 'spiralFlow 25s linear infinite' }}
      />
      <circle cx="110" cy="90" r="35" fill="none"
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"
        strokeDasharray="3 12"
        style={{ animation: 'spiralFlow 20s linear infinite reverse' }}
      />

      {/* 9 phase dots */}
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

      {/* Center */}
      <circle cx="110" cy="90" r="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <circle cx="110" cy="90" r="2" fill="rgba(255,255,255,0.35)" />

      {/* Past/Future */}
      <line x1="110" y1="165" x2="110" y2="12" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="1 4" />
      <text x="110" y="8" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="var(--font-display)" fontStyle="italic">future</text>
      <text x="110" y="175" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="var(--font-display)" fontStyle="italic">past</text>
    </svg>
  );
}

function DailyCycleIllustration() {
  const orgColors = ORGAN_CLOCK.map(o => getElementInfo(o.element).hex);
  return (
    <svg viewBox="0 0 200 200" className={styles.cycleIllustration}>
      <style>{`
        @keyframes segGlow {
          0%, 6% { opacity: 0.12; }
          8%, 14% { opacity: 0.45; }
          16%, 100% { opacity: 0.12; }
        }
      `}</style>

      {orgColors.map((color, i) => {
        const startA = (-90 + i * 30) * (Math.PI / 180);
        const endA = (-90 + (i + 1) * 30) * (Math.PI / 180);
        const r = 72, ir = 42;
        const ox1 = 100 + r * Math.cos(startA), oy1 = 100 + r * Math.sin(startA);
        const ox2 = 100 + r * Math.cos(endA), oy2 = 100 + r * Math.sin(endA);
        const ix1 = 100 + ir * Math.cos(endA), iy1 = 100 + ir * Math.sin(endA);
        const ix2 = 100 + ir * Math.cos(startA), iy2 = 100 + ir * Math.sin(startA);
        return (
          <path key={i}
            d={`M ${ox1} ${oy1} A ${r} ${r} 0 0 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${ir} ${ir} 0 0 0 ${ix2} ${iy2} Z`}
            fill={color} stroke="rgba(8,12,20,0.8)" strokeWidth="1.2"
            style={{ animation: `segGlow ${12 * 2.5}s ease-in-out ${i * 2.5}s infinite` }}
          />
        );
      })}

      <circle cx="100" cy="100" r={41} fill="var(--bg)" />
      <circle cx="100" cy="100" r="3" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}
