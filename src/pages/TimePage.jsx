import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayPillar } from '../engine/calendar';
import { getElementInfo } from '../engine/elements';
import { getLifePhase } from '../engine/lifePhase';
import { getRelationship } from '../engine/cycles';
import { getCurrentOrgan, getOrganByHour, ORGAN_CLOCK } from '../engine/organClock';
import { getDailySpirits, getSpiritBetween } from '../engine/wuShen';
import { loadFriends } from '../utils/localStorage';
import { calculateAge } from '../utils/dateUtils';
import GlassCard from '../components/common/GlassCard';
import styles from './TimePage.module.css';

export default function TimePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const today = new Date();
  const [expandedOrgan, setExpandedOrgan] = useState(false);
  const [expandedSpirit, setExpandedSpirit] = useState(null);

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
    const currentOrgan = getCurrentOrgan();

    // Wu Shen spirits for this day
    const spirits = getDailySpirits(pillar.element, data.element);
    const activeSpirit = spirits.find(s => s.isActive);
    const personalSpirit = spirits.find(s => s.isPersonal);

    // Spirit between user element and day element
    const spiritBetween = getSpiritBetween(data.element, pillar.element);

    // Day context text
    const isPast = yearDiff < 0 || (yearDiff === 0 && monthDiff < 0) || (yearDiff === 0 && monthDiff === 0 && dayDiff < 0);
    const isFuture = yearDiff > 0 || (yearDiff === 0 && monthDiff > 0) || (yearDiff === 0 && monthDiff === 0 && dayDiff > 0);

    return {
      pillar, pillarEl, userEl, rel, ageAtSelected, phaseAtDate,
      isToday, yearDiff, currentOrgan, spirits, activeSpirit,
      personalSpirit, spiritBetween, isPast, isFuture, dateObj,
    };
  }, [data, selectedDate]);

  if (!data || !computed) return null;

  const phaseEl = getElementInfo(computed.phaseAtDate.element);
  const organEl = getElementInfo(computed.currentOrgan.element);

  const resetToday = () => {
    setSelectedDate({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() });
  };

  // Format the selected date nicely
  const dateLabel = computed.dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

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
          {!computed.isToday && (
            <p className={styles.dateContext}>{dateLabel}</p>
          )}
        </GlassCard>

        {/* ─── Day Energy — the main synthesis card ─── */}
        <GlassCard glowColor={`${computed.pillarEl.hex}20`}>
          <div className={styles.dayEnergyHeader}>
            <span className={styles.dayEnergyChinese} style={{ color: computed.pillarEl.hex }}>
              {computed.pillarEl.chinese}
            </span>
            <div>
              <h2 className={styles.dayEnergyTitle}>
                {computed.isToday ? 'Today\'s Energy' : computed.isPast ? 'The Energy of That Day' : 'The Energy Ahead'}
              </h2>
              <span className={styles.dayEnergyElement} style={{ color: computed.pillarEl.hex }}>
                {computed.pillarEl.name} · {computed.pillar.yinYang === 'yang' ? 'Yang' : 'Yin'} · {computed.pillarEl.season}
              </span>
            </div>
          </div>

          <p className={styles.dayEnergyDesc}>{computed.pillar.stemImage}</p>

          <div className={styles.dayEnergyGrid}>
            <div className={styles.dayEnergyItem}>
              <span className={styles.dayEnergyLabel}>Emotion</span>
              <span className={styles.dayEnergyValue} style={{ color: computed.pillarEl.hex }}>
                {computed.pillarEl.emotion.balanced}
              </span>
            </div>
            <div className={styles.dayEnergyItem}>
              <span className={styles.dayEnergyLabel}>Organs</span>
              <span className={styles.dayEnergyValue}>
                {computed.pillarEl.organs.yin} · {computed.pillarEl.organs.yang}
              </span>
            </div>
            <div className={styles.dayEnergyItem}>
              <span className={styles.dayEnergyLabel}>Sense</span>
              <span className={styles.dayEnergyValue}>{computed.pillarEl.sense}</span>
            </div>
            <div className={styles.dayEnergyItem}>
              <span className={styles.dayEnergyLabel}>Quality</span>
              <span className={styles.dayEnergyValue}>{computed.pillarEl.quality}</span>
            </div>
          </div>

          {/* Relationship between user and day */}
          <div className={styles.meetingSection}>
            <div className={styles.meetingElements}>
              <span className={styles.meetingEl} style={{ color: computed.userEl.hex }}>
                {computed.userEl.chinese} {computed.userEl.name}
              </span>
              <span className={styles.meetingArrow}>
                {computed.rel.quality === 'Mirror' ? '⟷' : '→'}
              </span>
              <span className={styles.meetingEl} style={{ color: computed.pillarEl.hex }}>
                {computed.pillarEl.chinese} {computed.pillarEl.name}
              </span>
            </div>
            <span className={styles.meetingType}>{computed.rel.name}</span>
            <p className={styles.meetingDesc}>{computed.rel.description}</p>
          </div>
        </GlassCard>

        {/* ─── Day Pillar ─── */}
        <GlassCard glowColor={`${computed.pillarEl.hex}15`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Day Pillar · 日柱</span>
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
          <p className={styles.branchCharacter}>{computed.pillar.branchCharacter}</p>
          {computed.pillar.branchSeason && (
            <span className={styles.branchSeason}>{computed.pillar.branchSeason}</span>
          )}
        </GlassCard>

        {/* ─── Active Spirit — Wu Shen for this day ─── */}
        {computed.activeSpirit && (
          <GlassCard glowColor={`${getElementInfo(computed.activeSpirit.element).hex}15`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>
                Spirit of the Day · {computed.activeSpirit.chinese}
              </span>
              <span className={styles.cardAccent} style={{ color: getElementInfo(computed.activeSpirit.element).hex }}>
                {computed.activeSpirit.name}
              </span>
            </div>
            <h3 className={styles.spiritTitle}>{computed.activeSpirit.title}</h3>
            <p className={styles.spiritDesc}>{computed.activeSpirit.description}</p>

            <div className={styles.reflectionBox}>
              <span className={styles.reflectionLabel}>A question for {computed.isToday ? 'today' : 'this day'}</span>
              <p className={styles.reflectionText}>{computed.activeSpirit.todayReflection}</p>
            </div>

            {computed.activeSpirit.key !== computed.personalSpirit?.key && computed.personalSpirit && (
              <div className={styles.spiritMeeting}>
                <span className={styles.spiritMeetingLabel}>
                  Your spirit ({computed.personalSpirit.chinese} {computed.personalSpirit.name}) meets {computed.activeSpirit.chinese} {computed.activeSpirit.name}
                </span>
                <p className={styles.spiritMeetingText}>{computed.spiritBetween.reason}</p>
              </div>
            )}
          </GlassCard>
        )}

        {/* ─── Life Phase at date ─── */}
        <GlassCard glowColor={`${phaseEl.hex}15`} onClick={() => navigate('/explore/phases')} className={styles.tappable}>
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
          <p className={styles.bodyText}>{computed.phaseAtDate.description}</p>
          <span className={styles.tapHint}>Explore all phases →</span>
        </GlassCard>

        {/* ─── Organ Clock — always visible ─── */}
        <GlassCard
          glowColor={computed.isToday ? `${organEl.hex}15` : undefined}
          onClick={() => setExpandedOrgan(!expandedOrgan)}
          className={styles.tappable}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>
              {computed.isToday ? `Organ Clock · ${computed.currentOrgan.time}` : 'Organ Clock · 時辰'}
            </span>
            {computed.isToday && (
              <span className={styles.cardAccent} style={{ color: organEl.hex }}>
                {computed.currentOrgan.organ}
              </span>
            )}
          </div>

          {computed.isToday ? (
            <>
              <p className={styles.phaseQuote}>{computed.currentOrgan.quality}</p>
              <p className={styles.bodyText}>{computed.currentOrgan.guidance}</p>
            </>
          ) : (
            <p className={styles.bodyText}>
              The organ clock maps the body's energy as it moves through twelve organs across the day. Each two-hour window carries its own quality.
            </p>
          )}

          {expandedOrgan && (
            <div className={styles.organList}>
              {ORGAN_CLOCK.map((organ) => {
                const oEl = getElementInfo(organ.element);
                const isNow = computed.isToday && organ.organ === computed.currentOrgan.organ;
                return (
                  <div key={organ.organ} className={`${styles.organItem} ${isNow ? styles.organActive : ''}`}>
                    <div className={styles.organItemHeader}>
                      <span className={styles.organTime}>{organ.time}</span>
                      <span className={styles.organName} style={{ color: isNow ? oEl.hex : oEl.hex + '88' }}>
                        {organ.organ}
                      </span>
                    </div>
                    <p className={styles.organQuality}>{organ.quality}</p>
                    {isNow && <p className={styles.organGuidance}>{organ.guidance}</p>}
                  </div>
                );
              })}
            </div>
          )}
          <span className={styles.tapHint}>{expandedOrgan ? 'Tap to collapse' : 'See all 12 organs →'}</span>
        </GlassCard>

        {/* ─── Element Imbalance awareness ─── */}
        <GlassCard glowColor={`${computed.pillarEl.hex}10`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Body & Balance · {computed.pillarEl.chinese}</span>
            <span className={styles.cardAccent} style={{ color: computed.pillarEl.hex }}>
              {computed.pillarEl.name} day
            </span>
          </div>
          <p className={styles.bodyText}>
            {computed.pillarEl.description}
          </p>
          <div className={styles.balanceGrid}>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Watch for</span>
              <span className={styles.balanceValue}>{computed.pillarEl.emotion.imbalanced}</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Taste</span>
              <span className={styles.balanceValue}>{computed.pillarEl.taste}</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Tissue</span>
              <span className={styles.balanceValue}>{computed.pillarEl.tissue}</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Sense</span>
              <span className={styles.balanceValue}>{computed.pillarEl.senseOrgan}</span>
            </div>
          </div>
          <p className={styles.imbalanceNote}>{computed.pillarEl.imbalancedDescription}</p>
        </GlassCard>

        {/* ─── Friends on this date ─── */}
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

      {/* ─── Deeper layer cards ─── */}
      <div className={styles.deeperCards}>
        <GlassCard>
          <span className={styles.deepLabel}>Gan Zhi · Calendar Layer</span>
          <h3 className={styles.deepTitle}>Temporal Signatures</h3>
          <p className={styles.bodyText}>
            Each day carries a unique energetic signature — a Heavenly Stem paired with an Earthly Branch.
          </p>
          <div className={styles.signatureDetail}>
            <div className={styles.signatureRow}>
              <span className={styles.signatureLabel}>Heavenly Stem</span>
              <span className={styles.signatureValue} style={{ color: computed.pillarEl.hex }}>
                {computed.pillar.stemChinese} {computed.pillar.stem}
              </span>
            </div>
            <p className={styles.signatureDesc}>{computed.pillar.stemImage}</p>
            <div className={styles.signatureRow}>
              <span className={styles.signatureLabel}>Earthly Branch</span>
              <span className={styles.signatureValue} style={{ color: computed.pillarEl.hex }}>
                {computed.pillar.branchChinese} {computed.pillar.branch}
              </span>
            </div>
            <p className={styles.signatureDesc}>{computed.pillar.branchCharacter}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <span className={styles.deepLabel}>Life Phases · Transition Layer</span>
          <h3 className={styles.deepTitle}>Phase Transitions</h3>
          {(() => {
            const cycleLength = data.gender === 'female' ? 7 : 8;
            const currentAge = calculateAge(data.birthDate.year, data.birthDate.month, data.birthDate.day);
            const currentPhaseIdx = Math.min(Math.floor(currentAge / cycleLength), 8);
            if (currentPhaseIdx >= 8) {
              return (
                <p className={styles.bodyText}>
                  You have entered the final season — Second Spring. No more transitions ahead, only deepening.
                </p>
              );
            }
            const nextTransitionAge = (currentPhaseIdx + 1) * cycleLength;
            const yearsUntil = nextTransitionAge - currentAge;
            const nextPhase = getLifePhase(nextTransitionAge, data.gender);
            const nextEl = getElementInfo(nextPhase.element);
            return (
              <>
                <div className={styles.transitionInfo}>
                  <span className={styles.transitionYears}>
                    {yearsUntil <= 1 ? 'This year' : `In ~${yearsUntil} years`}
                  </span>
                  <span className={styles.transitionArrow}>→</span>
                  <span className={styles.transitionPhase} style={{ color: nextEl.hex }}>
                    Phase {nextPhase.phase} · {nextPhase.title}
                  </span>
                </div>
                <p className={styles.transitionSeason}>
                  From {computed.phaseAtDate.season} into {nextPhase.season} — {nextEl.chinese} {nextEl.name}
                </p>
                <p className={styles.transitionQuote}>{nextPhase.subtitle}</p>
              </>
            );
          })()}
        </GlassCard>

        {/* Five Spirits overview for this day */}
        <GlassCard>
          <span className={styles.deepLabel}>Wu Shen · Five Spirits</span>
          <h3 className={styles.deepTitle}>The Spirits on This Day</h3>
          <div className={styles.spiritsGrid}>
            {computed.spirits.map((spirit) => {
              const sEl = getElementInfo(spirit.element);
              const isExpanded = expandedSpirit === spirit.key;
              return (
                <div
                  key={spirit.key}
                  className={`${styles.spiritItem} ${spirit.isActive ? styles.spiritActive : ''} ${spirit.isPersonal ? styles.spiritPersonal : ''}`}
                  onClick={() => setExpandedSpirit(isExpanded ? null : spirit.key)}
                >
                  <div className={styles.spiritItemHeader}>
                    <span className={styles.spiritChinese} style={{ color: sEl.hex }}>{spirit.chinese}</span>
                    <div>
                      <span className={styles.spiritName}>{spirit.name}</span>
                      <span className={styles.spiritSubtitle}>{spirit.title}</span>
                    </div>
                    {spirit.isActive && <span className={styles.spiritBadge} style={{ background: sEl.hex }}>active</span>}
                    {spirit.isPersonal && !spirit.isActive && <span className={styles.spiritBadge} style={{ borderColor: sEl.hex, color: sEl.hex }}>yours</span>}
                  </div>
                  {isExpanded && (
                    <div className={styles.spiritExpanded}>
                      <p className={styles.spiritExpandedDesc}>{spirit.description}</p>
                      <div className={styles.reflectionBox}>
                        <span className={styles.reflectionLabel}>Reflection</span>
                        <p className={styles.reflectionText}>{spirit.todayReflection}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
            fill={color} style={{ stroke: 'var(--clock-border)' }} strokeWidth="1.2"
            style={{ animation: `segGlow ${12 * 2.5}s ease-in-out ${i * 2.5}s infinite` }}
          />
        );
      })}

      <circle cx="100" cy="100" r={41} fill="var(--bg)" />
      <circle cx="100" cy="100" r="3" style={{ fill: 'var(--dot-illustration)' }} />
    </svg>
  );
}
