import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getZodiacAnimal } from '../engine/zodiac';
import { getSpiritByElement } from '../engine/wuShen';
import { getShengParent, getShengChild } from '../engine/cycles';
import { ORGAN_CLOCK } from '../engine/organClock';
import GlassCard from '../components/common/GlassCard';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { getDerivedData, resetProfile } = useUser();
  const data = getDerivedData();

  if (!data) return null;

  const el = getElementInfo(data.element);
  const zodiac = getZodiacAnimal(data.birthDate.year);
  const phaseEl = getElementInfo(data.phase.element);
  const spirit = getSpiritByElement(data.element);
  const parentEl = getElementInfo(getShengParent(data.element));
  const childEl = getElementInfo(getShengChild(data.element));

  // Find organ clock entries for user's element
  const userOrgans = ORGAN_CLOCK.filter(o => o.element === data.element);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.symbol} style={{ color: el.hex }}>
          {el.chinese}
        </div>
        <h1 style={{ color: el.hex }}>{el.name}</h1>
        <p className={styles.subtitle}>{el.quality}</p>
      </header>

      {/* Overview Chart — all placements at a glance */}
      <GlassCard className={styles.chartCard}>
        <div className={styles.chartGrid}>
          <ChartRow label="Element" value={el.name} symbol={el.chinese} color={el.hex} />
          <ChartRow label="Spirit" value={spirit.name} symbol={spirit.chinese} color={el.hex} />
          <ChartRow label="Phase" value={`${data.phase.phase} — ${data.phase.title}`} symbol={data.phase.phase} color={phaseEl.hex} />
          <ChartRow label="Season" value={data.phase.season} />
          <ChartRow label="Zodiac" value={zodiac.name} symbol={zodiac.symbol} />
          <ChartRow label="Yin Organ" value={el.organs.yin} />
          <ChartRow label="Yang Organ" value={el.organs.yang} />
          <ChartRow label="Balanced" value={el.emotion.balanced} color={el.hex} />
          <ChartRow label="Imbalanced" value={el.emotion.imbalanced} />
          <ChartRow label="Taste" value={el.taste} />
          <ChartRow label="Sense" value={`${el.sense} (${el.senseOrgan})`} />
          <ChartRow label="Tissue" value={el.tissue} />
        </div>
      </GlassCard>

      <ElementWheelIllustration userElement={data.element} />

      {/* Deep dive: Your Element */}
      <GlassCard glowColor={`${el.hex}15`} onClick={() => navigate('/explore/element')} className={styles.tappable}>
        <span className={styles.deepLabel}>Element · Your Constitution</span>
        <h2 className={styles.deepTitle} style={{ color: el.hex }}>
          {el.chinese} {el.name}
        </h2>
        <p className={styles.deepBody}>{el.description}</p>

        <div className={styles.balanceSection}>
          <div className={styles.balanceCol}>
            <span className={styles.balanceLabel}>In Balance</span>
            <p className={styles.balanceText}>{el.emotion.balanced} — {el.quality}</p>
          </div>
          <div className={styles.balanceCol}>
            <span className={styles.balanceLabel}>Out of Balance</span>
            <p className={styles.balanceText}>{el.emotion.imbalanced} — {el.imbalancedDescription}</p>
          </div>
        </div>
        <span className={styles.tapHint}>Explore your element →</span>
      </GlassCard>

      {/* Deep dive: Your Spirit */}
      <GlassCard glowColor={`${el.hex}15`} onClick={() => navigate('/explore/spirits')} className={styles.tappable}>
        <span className={styles.deepLabel}>Wu Shen · Your Spirit</span>
        <div className={styles.spiritHeader}>
          <span className={styles.spiritSymbol} style={{ color: el.hex }}>{spirit.chinese}</span>
          <div>
            <h2 className={styles.deepTitle} style={{ color: el.hex }}>{spirit.name}</h2>
            <span className={styles.spiritTitle}>{spirit.title}</span>
          </div>
        </div>
        <p className={styles.deepBody}>{spirit.description}</p>

        <div className={styles.qualitiesGrid}>
          <div>
            <span className={styles.balanceLabel}>Balanced</span>
            {spirit.balancedQualities.slice(0, 3).map((q, i) => (
              <p key={i} className={styles.qualityItem}>· {q}</p>
            ))}
          </div>
          <div>
            <span className={styles.balanceLabel}>Imbalanced</span>
            {spirit.imbalancedSigns.slice(0, 3).map((q, i) => (
              <p key={i} className={styles.qualityItem}>· {q}</p>
            ))}
          </div>
        </div>
        <span className={styles.tapHint}>Explore all five spirits →</span>
      </GlassCard>

      <CorrespondenceIllustration element={data.element} />

      {/* Deep dive: Your Life Phase */}
      <GlassCard glowColor={`${phaseEl.hex}15`} onClick={() => navigate('/explore/phases')} className={styles.tappable}>
        <span className={styles.deepLabel}>Life Phase · Your Season</span>
        <div className={styles.phaseHeader}>
          <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>{data.phase.phase}</span>
          <div>
            <h2 className={styles.deepTitle}>{data.phase.title}</h2>
            <span className={styles.phaseMeta} style={{ color: phaseEl.hex }}>
              {phaseEl.chinese} {phaseEl.name} · {data.phase.season}
            </span>
          </div>
        </div>
        <p className={styles.phaseQuote}>{data.phase.subtitle}</p>
        <p className={styles.deepBody}>{data.phase.description}</p>
        {data.phase.keywords && (
          <p className={styles.keywords}>{data.phase.keywords}</p>
        )}
        <span className={styles.tapHint}>Explore all nine phases →</span>
      </GlassCard>

      {/* Deep dive: Your Zodiac */}
      <GlassCard>
        <span className={styles.deepLabel}>Chinese Zodiac · Your Animal</span>
        <div className={styles.zodiacHeader}>
          <span className={styles.zodiacSymbol}>{zodiac.symbol}</span>
          <div>
            <h2 className={styles.deepTitle}>{zodiac.name}</h2>
            <span className={styles.zodiacTrait}>{zodiac.trait}</span>
          </div>
        </div>
        <p className={styles.deepBody}>
          Born in the year of the {zodiac.name} ({data.birthDate.year}). Your zodiac animal determines your constitutional element — {el.chinese} {el.name} — which shapes your body, emotions, and path through the nine life phases.
        </p>
        <div className={styles.zodiacDetail}>
          <ChartRow label="Cycle" value={data.gender === 'female' ? '7-year (Feminine)' : '8-year (Masculine)'} />
          <ChartRow label="Age" value={data.age} />
          <ChartRow label="Direction" value={el.direction} />
          <ChartRow label="Color" value={el.elementColor} />
        </div>
      </GlassCard>

      {/* Deep dive: Your Organs */}
      <GlassCard>
        <span className={styles.deepLabel}>Organ System · Your Body</span>
        <h2 className={styles.deepTitle}>{el.organs.yin} & {el.organs.yang}</h2>
        <p className={styles.deepBody}>
          Your element governs the {el.organs.yin} (yin) and {el.organs.yang} (yang). Together they form a partnership — the {el.organs.yin} stores and nourishes, the {el.organs.yang} transforms and releases.
        </p>
        <div className={styles.organClockList}>
          {userOrgans.map((organ) => (
            <div key={organ.organ} className={styles.organClockItem}>
              <div className={styles.organClockHeader}>
                <span className={styles.organClockTime}>{organ.time}</span>
                <span className={styles.organClockName} style={{ color: el.hex }}>{organ.organ}</span>
              </div>
              <p className={styles.organClockQuality}>{organ.quality}</p>
              <p className={styles.organClockGuidance}>{organ.guidance}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <ShengCycleIllustration userElement={data.element} />

      {/* Deep dive: Nourishing Cycle */}
      <GlassCard>
        <span className={styles.deepLabel}>Sheng Cycle · Your Flow</span>
        <h2 className={styles.deepTitle}>Nourishment & Creation</h2>
        <div className={styles.cycleFlow}>
          <div className={styles.cycleItem}>
            <span className={styles.cycleSymbol} style={{ color: parentEl.hex }}>{parentEl.chinese}</span>
            <span className={styles.cycleName}>{parentEl.name}</span>
            <span className={styles.cycleRole}>nourishes you</span>
          </div>
          <span className={styles.cycleArrow}>→</span>
          <div className={styles.cycleItem}>
            <span className={styles.cycleSymbol} style={{ color: el.hex }}>{el.chinese}</span>
            <span className={styles.cycleName}>{el.name}</span>
            <span className={styles.cycleRole}>you</span>
          </div>
          <span className={styles.cycleArrow}>→</span>
          <div className={styles.cycleItem}>
            <span className={styles.cycleSymbol} style={{ color: childEl.hex }}>{childEl.chinese}</span>
            <span className={styles.cycleName}>{childEl.name}</span>
            <span className={styles.cycleRole}>you nourish</span>
          </div>
        </div>
      </GlassCard>

      <button className={styles.resetBtn} onClick={resetProfile}>
        Reset Profile
      </button>
    </div>
  );
}

function ChartRow({ label, value, symbol, color }) {
  return (
    <div className={styles.chartRow}>
      <span className={styles.chartLabel}>{label}</span>
      <span className={styles.chartValue} style={color ? { color } : {}}>
        {symbol && <span className={styles.chartSymbol}>{symbol}</span>}
        {value}
      </span>
    </div>
  );
}

function ElementWheelIllustration({ userElement }) {
  const elements = [
    { key: 'water', char: '水', color: '#3a6fa0', x: 100, y: 15 },
    { key: 'wood', char: '木', color: '#4a9e6e', x: 175, y: 50 },
    { key: 'fire', char: '火', color: '#c75a3a', x: 155, y: 115 },
    { key: 'earth', char: '土', color: '#c9a84c', x: 45, y: 115 },
    { key: 'metal', char: '金', color: '#a8b8c8', x: 25, y: 50 },
  ];

  return (
    <svg viewBox="0 0 200 140" className={styles.illustration}>
      <style>{`
        @keyframes wheelPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes activeGlow { 0%, 100% { r: 16; opacity: 0.15; } 50% { r: 20; opacity: 0.25; } }
      `}</style>

      {/* Connections */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        return (
          <line key={`c-${i}`} x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            stroke={el.key === userElement ? el.color : 'rgba(255,255,255,0.1)'}
            strokeWidth={el.key === userElement ? '1' : '0.5'}
            opacity={el.key === userElement ? '0.5' : '1'}
          />
        );
      })}

      {/* Elements */}
      {elements.map((el) => {
        const isUser = el.key === userElement;
        return (
          <g key={el.key}>
            {isUser && (
              <circle cx={el.x} cy={el.y} r="18" fill={el.color} opacity="0.15"
                style={{ animation: 'activeGlow 5s ease-in-out infinite' }} />
            )}
            <circle cx={el.x} cy={el.y} r="14" fill="none" stroke={el.color}
              strokeWidth={isUser ? '1.2' : '0.6'} opacity={isUser ? '0.7' : '0.3'} />
            <text x={el.x} y={el.y + 1} textAnchor="middle" dominantBaseline="central"
              fill={el.color} fontSize={isUser ? '11' : '8'} fontWeight="300"
              opacity={isUser ? '0.9' : '0.5'}>
              {el.char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CorrespondenceIllustration({ element }) {
  const el = getElementInfo(element);
  const items = [
    { label: el.season, angle: -90 },
    { label: el.organs.yin, angle: -18 },
    { label: el.taste, angle: 54 },
    { label: el.tissue, angle: 126 },
    { label: el.sense, angle: 198 },
  ];

  return (
    <svg viewBox="0 0 200 140" className={styles.illustration}>
      <style>{`
        @keyframes corrPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Radial lines */}
      {items.map((item, i) => {
        const a = item.angle * (Math.PI / 180);
        const x = 100 + 45 * Math.cos(a);
        const y = 70 + 45 * Math.sin(a);
        return (
          <g key={i}>
            <line x1="100" y1="70" x2={x} y2={y}
              stroke={el.hex} strokeWidth="0.5" opacity="0.2"
              style={{ animation: `corrPulse ${6 + i}s ease-in-out ${i * 0.8}s infinite` }} />
            <text x={100 + 58 * Math.cos(a)} y={70 + 58 * Math.sin(a)}
              textAnchor="middle" dominantBaseline="central"
              fill="rgba(255,255,255,0.45)" fontSize="6"
              fontFamily="var(--font-display)" fontStyle="italic">
              {item.label}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx="100" cy="70" r="18" fill="none" stroke={el.hex} strokeWidth="0.6" opacity="0.3" />
      <text x="100" y="71" textAnchor="middle" dominantBaseline="central"
        fill={el.hex} fontSize="12" fontWeight="300" opacity="0.7">
        {el.chinese}
      </text>
    </svg>
  );
}

function ShengCycleIllustration({ userElement }) {
  const elements = [
    { key: 'wood', char: '木', color: '#4a9e6e' },
    { key: 'fire', char: '火', color: '#c75a3a' },
    { key: 'earth', char: '土', color: '#c9a84c' },
    { key: 'metal', char: '金', color: '#a8b8c8' },
    { key: 'water', char: '水', color: '#3a6fa0' },
  ];

  return (
    <svg viewBox="0 0 260 50" className={styles.illustration}>
      <style>{`
        @keyframes flowPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
      `}</style>
      {elements.map((el, i) => {
        const x = 30 + i * 50;
        const isUser = el.key === userElement;
        return (
          <g key={el.key}>
            {i < 4 && (
              <line x1={x + 14} y1="25" x2={x + 36} y2="25"
                stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2 3" />
            )}
            <circle cx={x} cy="25" r={isUser ? '16' : '12'} fill="none"
              stroke={el.color} strokeWidth={isUser ? '1' : '0.6'}
              opacity={isUser ? '0.6' : '0.3'} />
            {isUser && (
              <circle cx={x} cy="25" r="16" fill={el.color} opacity="0.1"
                style={{ animation: 'flowPulse 5s ease-in-out infinite' }} />
            )}
            <text x={x} y="26" textAnchor="middle" dominantBaseline="central"
              fill={el.color} fontSize={isUser ? '10' : '7'} fontWeight="300"
              opacity={isUser ? '0.8' : '0.5'}>
              {el.char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
