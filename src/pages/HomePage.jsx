import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getDayPillar } from '../engine/calendar';
import { getRelationship } from '../engine/cycles';
import { getCurrentOrgan, ORGAN_CLOCK } from '../engine/organClock';
import { getPracticeForOrgan } from '../engine/practices';
import { getLifePhase } from '../engine/lifePhase';
import { getGreeting, formatDate, calculateAge } from '../utils/dateUtils';
import { loadFriends } from '../utils/localStorage';
import LifeArcVisualization from '../components/hero/LifeArcVisualization';
import GlassCard from '../components/common/GlassCard';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();

  const today = useMemo(() => {
    const now = new Date();
    const dayPillar = getDayPillar(now);
    const dayElementInfo = getElementInfo(dayPillar.element);
    const relationship = data ? getRelationship(data.element, dayPillar.element) : null;
    const currentOrgan = getCurrentOrgan();
    const currentPractice = getPracticeForOrgan(currentOrgan.organ);
    return { now, dayPillar, dayElementInfo, relationship, currentOrgan, currentPractice, formatted: formatDate(now) };
  }, [data]);

  const friendsToday = useMemo(() => {
    if (!data) return [];
    return loadFriends().map((friend) => {
      const fAge = calculateAge(friend.birthYear, 6, 15);
      const fPhase = getLifePhase(Math.max(0, fAge), friend.gender);
      const fEl = getElementInfo(friend.element);
      const fPhaseEl = getElementInfo(fPhase.element);
      return { friend, phase: fPhase, el: fEl, phaseEl: fPhaseEl };
    });
  }, [data]);

  if (!data) return null;

  const elementInfo = getElementInfo(data.element);
  const phaseElementInfo = getElementInfo(data.phase.element);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.greeting}>{getGreeting()}</p>
        <h1 className={styles.elementName} style={{ color: elementInfo.hex }}>
          {elementInfo.chinese} {elementInfo.name}
        </h1>
      </header>

      <section className={styles.arcSection}>
        <LifeArcVisualization
          currentPhase={data.phase.phase}
          userElement={data.element}
        />
      </section>

      <section className={styles.cards}>
        <GlassCard glowColor={`${phaseElementInfo.hex}20`} onClick={() => navigate('/explore/phases')} className={styles.tappable}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Life Phase {data.phase.phase}</span>
            <span className={styles.cardAccent} style={{ color: phaseElementInfo.hex }}>
              {data.phase.season}
            </span>
          </div>
          <h3 className={styles.cardTitle}>{data.phase.title}</h3>
          <p className={styles.cardQuote}>{data.phase.subtitle}</p>
          <p className={styles.cardBody}>{data.phase.description}</p>
          <span className={styles.tapHint}>Explore all phases →</span>
        </GlassCard>

        <GlassCard glowColor={`${today.dayElementInfo.hex}20`} onClick={() => navigate('/time')} className={styles.tappable}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Today</span>
            <span className={styles.cardAccent} style={{ color: today.dayElementInfo.hex }}>
              {today.dayElementInfo.name} · {today.dayPillar.yinYang === 'yin' ? 'Yin' : 'Yang'}
            </span>
          </div>
          <p className={styles.todayMeta}>
            {today.formatted} · {today.dayPillar.chineseLabel} {today.dayPillar.label}
          </p>
          <p className={styles.cardQuote}>{today.dayPillar.stemImage}</p>
          {today.relationship && (
            <div className={styles.todayMeeting}>
              <span className={styles.todayMeetingPair}>
                <span style={{ color: elementInfo.hex }}>{elementInfo.chinese}</span>
                <span className={styles.todayMeetingArrow}>
                  {today.relationship.quality === 'Mirror' ? '⟷' : '→'}
                </span>
                <span style={{ color: today.dayElementInfo.hex }}>{today.dayElementInfo.chinese}</span>
              </span>
              <span className={styles.todayMeetingType} style={{ color: today.dayElementInfo.hex }}>
                {today.relationship.name}
              </span>
            </div>
          )}
          <span className={styles.tapHint}>Explore any date →</span>
        </GlassCard>

        {friendsToday.length > 0 && (
          <GlassCard glowColor={`${elementInfo.hex}10`} className={styles.peopleCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Your People Today</span>
              <span className={styles.cardAccent} style={{ color: elementInfo.hex }}>
                {friendsToday.length} in your field
              </span>
            </div>
            <p className={styles.peopleSubtitle}>
              Where your circle stands right now
            </p>
            <div className={styles.peopleStrip}>
              {friendsToday.map(({ friend, phase, el, phaseEl }) => {
                const possessive = friend.gender === 'female' ? 'her' : friend.gender === 'male' ? 'his' : 'their';
                return (
                  <button
                    key={friend.id}
                    className={styles.peopleMini}
                    onClick={() => navigate(`/relations/${friend.id}`)}
                    style={{ '--mini-accent': phaseEl.hex }}
                  >
                    <span className={styles.peopleMiniSymbol} style={{ color: el.hex }}>
                      {el.chinese}
                    </span>
                    <span className={styles.peopleMiniName}>{friend.name}</span>
                    <span className={styles.peopleMiniPhrase}>
                      is in {possessive}
                    </span>
                    <span className={styles.peopleMiniPhase} style={{ color: phaseEl.hex }}>
                      {phase.title}
                    </span>
                    <span className={styles.peopleMiniNum}>Phase {phase.phase}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        )}

        {today.currentOrgan && (() => {
          const organElementInfo = getElementInfo(today.currentOrgan.element);
          return (
            <GlassCard
              glowColor={`${organElementInfo.hex}15`}
              onClick={() => navigate(`/explore/organs/${today.currentOrgan.key}`)}
              className={styles.tappable}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>This hour · {today.currentOrgan.time}</span>
                <span className={styles.cardAccent} style={{ color: organElementInfo.hex }}>
                  {today.currentOrgan.organ}
                </span>
              </div>
              <OrganClockVisualization
                currentOrgan={today.currentOrgan}
                onSegmentClick={(key) => navigate(`/explore/organs/${key}`)}
              />
              <p className={styles.cardQuote}>{today.currentOrgan.quality}</p>

              {today.currentPractice && (
                <div className={styles.hourPractice}>
                  <div className={styles.hourPracticeRow}>
                    <span className={styles.hourPracticeLabel} style={{ color: organElementInfo.hex }}>移 Move</span>
                    <p className={styles.hourPracticeText}>{today.currentPractice.movement}</p>
                  </div>
                  <div className={styles.hourPracticeRow}>
                    <span className={styles.hourPracticeLabel} style={{ color: organElementInfo.hex }}>食 Nourish</span>
                    <p className={styles.hourPracticeText}>{today.currentPractice.dietary}</p>
                  </div>
                </div>
              )}

              <span className={styles.tapHint}>Read more →</span>
            </GlassCard>
          );
        })()}
      </section>
    </div>
  );
}

function OrganClockVisualization({ currentOrgan, onSegmentClick }) {
  const cx = 140, cy = 140, outerR = 125, innerR = 60;

  function arcPath(startDeg, endDeg, radius) {
    const s = (startDeg - 90) * (Math.PI / 180);
    const e = (endDeg - 90) * (Math.PI / 180);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  }

  function segmentPath(startDeg, endDeg) {
    const s = (startDeg - 90) * (Math.PI / 180);
    const e = (endDeg - 90) * (Math.PI / 180);
    const ox1 = cx + outerR * Math.cos(s), oy1 = cy + outerR * Math.sin(s);
    const ox2 = cx + outerR * Math.cos(e), oy2 = cy + outerR * Math.sin(e);
    const ix1 = cx + innerR * Math.cos(e), iy1 = cy + innerR * Math.sin(e);
    const ix2 = cx + innerR * Math.cos(s), iy2 = cy + innerR * Math.sin(s);
    return `M ${ox1} ${oy1} A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 0 0 ${ix2} ${iy2} Z`;
  }

  const activeElInfo = getElementInfo(currentOrgan.element);

  return (
    <svg viewBox="0 0 280 280" className={styles.organClock}>
      <style>{`
        @keyframes segPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.55; } }
        @keyframes segWave { 0%, 6%, 100% { opacity: 0.06; } 3% { opacity: 0.25; } }
      `}</style>

      {/* Segments */}
      {ORGAN_CLOCK.map((organ, i) => {
        const startDeg = i * 30;
        const endDeg = (i + 1) * 30;
        const midDeg = (startDeg + endDeg) / 2;
        const midAngle = (midDeg - 90) * (Math.PI / 180);
        const isActive = organ.organ === currentOrgan.organ;
        const elInfo = getElementInfo(organ.element);

        const labelR = (outerR + innerR) / 2;
        const labelX = cx + labelR * Math.cos(midAngle);
        const labelY = cy + labelR * Math.sin(midAngle);

        const timeR = outerR + 11;
        const timeX = cx + timeR * Math.cos(midAngle);
        const timeY = cy + timeR * Math.sin(midAngle);

        const handleSegmentClick = (e) => {
          if (!onSegmentClick) return;
          e.stopPropagation();
          onSegmentClick(organ.key);
        };

        return (
          <g
            key={i}
            onClick={handleSegmentClick}
            style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          >
            {/* Filled segment */}
            <path
              d={segmentPath(startDeg, endDeg)}
              fill={elInfo.hex}
              opacity={isActive ? 0.3 : 0.06}
              strokeWidth="1"
              style={{
                stroke: 'var(--clock-border)',
                animation: isActive
                  ? 'segPulse 4s ease-in-out infinite'
                  : `segWave 24s ease-in-out ${i * 2}s infinite`,
              }}
            />
            {/* Subtle border on outer edge */}
            <path
              d={segmentPath(startDeg, endDeg)}
              fill="none"
              style={{ stroke: isActive ? elInfo.hex : 'var(--line-faint)' }}
              strokeWidth="0.5"
              opacity={isActive ? 0.5 : 1}
            />

            {/* Organ name */}
            <text
              x={labelX} y={labelY - 3}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: isActive ? 'var(--text-illustration-bright)' : 'var(--text-illustration)' }}
              fontSize={isActive ? '7.5' : '6'}
              fontFamily="var(--font-display)"
              fontWeight="300"
              fontStyle="italic"
            >
              {organ.organ.length > 12 ? organ.organ.split(' ')[0] : organ.organ}
            </text>

            {/* Time on outer edge */}
            <text
              x={timeX} y={timeY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: 'var(--text-illustration-dim)' }}
              fontSize="4.5"
              fontFamily="var(--font-body)"
            >
              {organ.time.split('–')[0]}
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={innerR - 1} fill="var(--bg)" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" />

      {/* Center info */}
      <text
        x={cx} y={cy - 12}
        textAnchor="middle"
        style={{ fill: 'var(--text-illustration-bright)' }}
        fontSize="8"
        fontFamily="var(--font-display)"
        fontWeight="300"
        fontStyle="italic"
      >
        {currentOrgan.organ}
      </text>
      <text
        x={cx} y={cy + 4}
        textAnchor="middle"
        style={{ fill: 'var(--text-illustration)' }}
        fontSize="7"
        fontFamily="var(--font-body)"
      >
        {currentOrgan.time}
      </text>
      <text
        x={cx} y={cy + 18}
        textAnchor="middle"
        style={{ fill: 'var(--text-illustration-dim)' }}
        fontSize="5"
        fontFamily="var(--font-display)"
        fontStyle="italic"
      >
        active now
      </text>
    </svg>
  );
}

