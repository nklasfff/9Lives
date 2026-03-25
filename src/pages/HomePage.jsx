import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getDayPillar } from '../engine/calendar';
import { getRelationship } from '../engine/cycles';
import { getDailySpirits } from '../engine/wuShen';
import { getCurrentOrgan, ORGAN_CLOCK } from '../engine/organClock';
import { getGreeting, formatDate } from '../utils/dateUtils';
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
    const spirits = data ? getDailySpirits(dayPillar.element, data.element) : [];
    const currentOrgan = getCurrentOrgan();
    return { now, dayPillar, dayElementInfo, relationship, spirits, currentOrgan, formatted: formatDate(now) };
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
              {today.dayElementInfo.name} {today.dayPillar.yinYang === 'yin' ? '(Yin)' : '(Yang)'}
            </span>
          </div>
          <p className={styles.dateText}>{today.formatted}</p>
          <p className={styles.pillarText}>
            {today.dayPillar.chineseLabel} {today.dayPillar.label}
          </p>
          <p className={styles.cardQuote}>{today.dayPillar.stemImage}</p>
          <p className={styles.branchCharacter}>{today.dayPillar.branchCharacter}</p>
          {today.relationship && (
            <div className={styles.relationship}>
              <span className={styles.relType}>{today.relationship.name}</span>
              <p className={styles.relDesc}>{today.relationship.description}</p>
            </div>
          )}
          <span className={styles.tapHint}>Explore any date →</span>
        </GlassCard>

        {today.currentOrgan && (() => {
          const organElementInfo = getElementInfo(today.currentOrgan.element);
          return (
            <GlassCard glowColor={`${organElementInfo.hex}15`} onClick={() => navigate('/time')} className={styles.tappable}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>Organ Clock</span>
                <span className={styles.cardAccent} style={{ color: organElementInfo.hex }}>
                  {today.currentOrgan.organ}
                </span>
              </div>
              <OrganClockVisualization currentOrgan={today.currentOrgan} />
              <p className={styles.cardQuote}>{today.currentOrgan.quality}</p>
              <p className={styles.cardBody}>{today.currentOrgan.guidance}</p>
              <span className={styles.tapHint}>Time Travel →</span>
            </GlassCard>
          );
        })()}

        <div className={styles.spiritsSection}>
          <h2 className={styles.sectionTitle}>The Five Spirits</h2>
          <p className={styles.sectionSubtitle}>Today's reflections for your inner landscape</p>
          <SpiritsIllustration />

          {today.spirits.map((spirit) => {
            const spiritElementInfo = getElementInfo(spirit.element);
            return (
              <GlassCard
                key={spirit.key}
                className={`${spirit.isActive ? styles.spiritActive : ''} ${styles.tappable}`}
                glowColor={spirit.isActive ? `${spiritElementInfo.hex}25` : undefined}
                onClick={() => navigate('/explore/spirits')}
              >
                <div className={styles.spiritHeader}>
                  <div>
                    <span className={styles.spiritName} style={{ color: spiritElementInfo.hex }}>
                      {spirit.name}
                    </span>
                    <span className={styles.spiritTitle}>{spirit.title}</span>
                  </div>
                  {spirit.isActive && (
                    <span className={styles.activeBadge} style={{ background: `${spiritElementInfo.hex}30`, color: spiritElementInfo.hex }}>
                      Active today
                    </span>
                  )}
                </div>
                <p className={styles.spiritReflection}>{spirit.todayReflection}</p>
                <span className={styles.tapHint}>Read more →</span>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SpiritsIllustration() {
  const spirits = [
    { color: '#c75a3a', char: '神' },
    { color: '#4a9e6e', char: '魂' },
    { color: '#a8b8c8', char: '魄' },
    { color: '#c9a84c', char: '意' },
    { color: '#3a6fa0', char: '志' },
  ];
  return (
    <svg viewBox="0 0 260 70" className={styles.spiritsIllustration}>
      <style>{`
        @keyframes spiritPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.55; } }
        .spirit-dot { animation: spiritPulse 5s ease-in-out infinite; }
      `}</style>
      {spirits.map(({ color, char }, i) => {
        const x = 30 + i * 50;
        const y = 32;
        return (
          <g key={i}>
            {i < 4 && (
              <line
                x1={x + 12} y1={y}
                x2={x + 38} y2={y}
                style={{ stroke: 'var(--line-subtle)' }}
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
            )}
            <circle cx={x} cy={y} r="14" fill="none" stroke={color} strokeWidth="0.7" opacity="0.35" />
            <circle cx={x} cy={y} r="5" fill={color} opacity="0.15" className="spirit-dot" style={{ animationDelay: `${i * 0.8}s` }} />
            <text
              x={x} y={y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize="9"
              fontWeight="300"
              opacity="0.6"
            >
              {char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function OrganClockVisualization({ currentOrgan }) {
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
        @keyframes segPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.55; } }
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

        return (
          <g key={i}>
            {/* Filled segment */}
            <path
              d={segmentPath(startDeg, endDeg)}
              fill={elInfo.hex}
              opacity={isActive ? 0.25 : 0.06}
              style={{ stroke: 'var(--clock-border)' }}
              strokeWidth="1"
              style={isActive ? { animation: 'segPulse 4s ease-in-out infinite' } : undefined}
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
