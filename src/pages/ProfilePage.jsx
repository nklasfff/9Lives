import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getZodiacAnimal } from '../engine/zodiac';
import { getSpiritByElement } from '../engine/wuShen';
import { getShengParent, getShengChild, getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { ORGAN_CLOCK } from '../engine/organClock';
import { calculateAge } from '../utils/dateUtils';
import { loadConstellations, saveConstellations, loadFriends } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { getDerivedData, resetProfile, theme, toggleTheme } = useUser();
  const data = getDerivedData();
  const [constellations, setConstellations] = useState(() => loadConstellations());
  const [friends] = useState(() => loadFriends());

  const deleteConstellation = (id) => {
    const updated = constellations.filter(c => c.id !== id);
    setConstellations(updated);
    saveConstellations(updated);
  };

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

      {/* Your Constellation — the relational field around you */}
      <GlassCard
        glowColor={`${el.hex}10`}
        className={friends.length === 0 ? `${styles.fieldCard} ${styles.tappable}` : styles.fieldCard}
        onClick={friends.length === 0 ? () => navigate('/relations') : undefined}
      >
        <span className={styles.deepLabel}>Relations · Your Field</span>
        <h2 className={styles.deepTitle}>Your Constellation</h2>
        {friends.length > 0 && (
          <p className={styles.fieldSubtitle}>
            {friends.length} {friends.length === 1 ? 'person' : 'people'} in your field
          </p>
        )}

        <ConstellationIllustration friends={friends} userElement={data.element} />

        {friends.length === 0 ? (
          <>
            <p className={styles.fieldEmpty}>
              Add the people who shape your life — see how their elements move with yours.
            </p>
            <span className={styles.tapHint}>Add someone in Relations →</span>
          </>
        ) : (
          <div className={styles.fieldList}>
            {friends.slice(0, 6).map((friend) => {
              const fEl = getElementInfo(friend.element);
              const rel = getRelationship(data.element, friend.element);
              const fAge = calculateAge(friend.birthYear, 6, 15);
              const fPhase = getLifePhase(Math.max(0, fAge), friend.gender);
              return (
                <button
                  key={friend.id}
                  className={styles.fieldRow}
                  onClick={() => navigate(`/relations/${friend.id}`)}
                >
                  <span className={styles.fieldRowSymbol} style={{ color: fEl.hex }}>
                    {fEl.chinese}
                  </span>
                  <div className={styles.fieldRowText}>
                    <span className={styles.fieldRowName}>{friend.name}</span>
                    <span className={styles.fieldRowMeta}>
                      {fEl.name} · {rel.name} · {fPhase.title}
                    </span>
                  </div>
                  <span className={styles.fieldRowArrow}>→</span>
                </button>
              );
            })}
            {friends.length > 6 && (
              <button className={styles.fieldMore} onClick={() => navigate('/relations')}>
                + {friends.length - 6} more in Relations →
              </button>
            )}
          </div>
        )}
      </GlassCard>

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
            <div
              key={organ.organ}
              className={styles.organClockItem}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/explore/organs/${organ.key}`)}
            >
              <div className={styles.organClockHeader}>
                <span className={styles.organClockTime}>{organ.time}</span>
                <span className={styles.organClockName} style={{ color: el.hex }}>{organ.organ}</span>
              </div>
              <p className={styles.organClockQuality}>{organ.quality}</p>
              <p className={styles.organClockGuidance}>{organ.guidance}</p>
              <span className={styles.organClockTapHint} style={{ color: el.hex }}>Read more →</span>
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

      {/* Saved Constellations */}
      {constellations.length > 0 && (
        <GlassCard>
          <span className={styles.deepLabel}>Relations · Saved Groups</span>
          <h2 className={styles.deepTitle}>Your Constellations</h2>
          <div className={styles.constellationList}>
            {constellations.map(c => {
              const names = c.members.map(m => m.name).join(', ');
              const elements = c.members.map(m => getElementInfo(m.element));
              return (
                <div key={c.id} className={styles.constellationItem}>
                  <div className={styles.constellationDots}>
                    {elements.map((el, i) => (
                      <span key={i} className={styles.constellationDot} style={{ background: el.hex }} />
                    ))}
                  </div>
                  <div className={styles.constellationInfo}>
                    <span className={styles.constellationName}>{c.name}</span>
                    <span className={styles.constellationMembers}>{names}</span>
                  </div>
                  <button
                    className={styles.constellationDelete}
                    onClick={() => deleteConstellation(c.id)}
                  >×</button>
                </div>
              );
            })}
          </div>
          <button className={styles.tapHint} onClick={() => navigate('/relations')}>
            Go to Relations →
          </button>
        </GlassCard>
      )}

      <div className={styles.settingsRow}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          <span className={styles.themeIcon}>{theme === 'dark' ? '月' : '日'}</span>
          <span>{theme === 'dark' ? 'Night Mode' : 'Day Mode'}</span>
        </button>
        <button className={styles.resetBtn} onClick={resetProfile}>
          Reset Profile
        </button>
      </div>
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
  const cx = 100, cy = 100, orbit = 66;
  const elements = [
    { key: 'water', char: '水', color: '#3a6fa0' },
    { key: 'wood',  char: '木', color: '#4a9e6e' },
    { key: 'fire',  char: '火', color: '#c75a3a' },
    { key: 'earth', char: '土', color: '#c9a84c' },
    { key: 'metal', char: '金', color: '#a8b8c8' },
  ].map((el, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return { ...el, x: cx + orbit * Math.cos(a), y: cy + orbit * Math.sin(a) };
  });

  return (
    <svg viewBox="0 0 200 200" className={styles.illustration}>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={orbit} fill="none"
        style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.6" />

      {/* Pentagon sheng-cycle lines */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        const isFromUser = el.key === userElement;
        return (
          <line key={`c-${i}`} x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            style={{ stroke: isFromUser ? el.color : 'var(--line-subtle)' }}
            strokeWidth={isFromUser ? '1.2' : '0.5'}
            opacity={isFromUser ? '0.6' : '1'}>
            {isFromUser && (
              <animate attributeName="opacity" values="0.6;1;0.6"
                dur="4s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            )}
          </line>
        );
      })}

      {/* Element circles */}
      {elements.map((el) => {
        const isUser = el.key === userElement;
        return (
          <g key={el.key}>
            {/* Breathing glow for user element */}
            {isUser && (
              <circle cx={el.x} cy={el.y} r="16" fill={el.color} opacity="0.2">
                <animate attributeName="r" values="16;26;16" dur="4s" repeatCount="indefinite"
                  calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
                <animate attributeName="opacity" values="0.22;0;0.22" dur="4s" repeatCount="indefinite"
                  calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
              </circle>
            )}
            <circle cx={el.x} cy={el.y} r={isUser ? 17 : 14}
              fill={isUser ? `${el.color}20` : 'none'}
              stroke={el.color}
              strokeWidth={isUser ? '1.4' : '0.7'}
              opacity={isUser ? '0.9' : '0.35'} />
            <text x={el.x} y={el.y + 1} textAnchor="middle" dominantBaseline="central"
              fill={el.color} fontSize={isUser ? '13' : '9'} fontWeight={isUser ? '400' : '300'}
              opacity={isUser ? '1' : '0.5'}>
              {el.char}
            </text>
          </g>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" style={{ fill: 'var(--dot-illustration)' }}>
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
      </circle>
    </svg>
  );
}

function CorrespondenceIllustration({ element }) {
  const el = getElementInfo(element);
  const cx = 100, cy = 100;
  const items = [
    { label: el.season, angle: -90 },
    { label: el.organs.yin, angle: -18 },
    { label: el.taste, angle: 54 },
    { label: el.tissue, angle: 126 },
    { label: el.sense, angle: 198 },
  ];

  return (
    <svg viewBox="0 0 200 200" className={styles.illustration}>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r="72" fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" />

      {/* Radial lines — sequential SMIL */}
      {items.map((item, i) => {
        const a = item.angle * (Math.PI / 180);
        const x1 = cx + 22 * Math.cos(a);
        const y1 = cy + 22 * Math.sin(a);
        const x2 = cx + 58 * Math.cos(a);
        const y2 = cy + 58 * Math.sin(a);
        const tx = cx + 74 * Math.cos(a);
        const ty = cy + 74 * Math.sin(a);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={el.hex} strokeWidth="0.7" opacity="0.25">
              <animate attributeName="opacity" values="0.25;0.65;0.25"
                dur={`${7 + i}s`} begin={`${i * 0.9}s`} repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            </line>
            <circle cx={x2} cy={y2} r="2" fill={el.hex} opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.7;0.3"
                dur={`${7 + i}s`} begin={`${i * 0.9}s`} repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            </circle>
            <text x={tx} y={ty}
              textAnchor="middle" dominantBaseline="central"
              style={{ fill: 'var(--text-illustration)' }} fontSize="8.5"
              fontFamily="var(--font-display)" fontStyle="italic">
              {item.label}
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r="20" fill={`${el.hex}18`} stroke={el.hex} strokeWidth="0.8" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="5s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
      </circle>
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
        fill={el.hex} fontSize="14" fontWeight="300" opacity="0.9">
        {el.chinese}
      </text>
    </svg>
  );
}

function ConstellationIllustration({ friends, userElement }) {
  const userEl = getElementInfo(userElement);
  const cx = 120, cy = 110, orbit = 78;
  const visible = friends.slice(0, 6);
  const count = visible.length;

  const positions = visible.map((friend, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return {
      x: cx + orbit * Math.cos(angle),
      y: cy + orbit * Math.sin(angle),
      friend,
    };
  });

  return (
    <svg viewBox="0 0 240 220" className={styles.fieldIllustration}>
      <style>{`
        @keyframes fieldOrbDrift1 {
          0%, 100% { transform: translate(0, 1.5px); }
          50% { transform: translate(0, -1.5px); }
        }
        @keyframes fieldOrbDrift2 {
          0%, 100% { transform: translate(1.5px, 0); }
          50% { transform: translate(-1.5px, 0); }
        }
      `}</style>

      {/* Outer rings */}
      <circle cx={cx} cy={cy} r={orbit + 20} fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 5" />
      <circle cx={cx} cy={cy} r={orbit} fill="none"
        style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />

      {/* Empty-state ghost orbs (when no friends) */}
      {count === 0 && [0, 1, 2, 3].map((i) => {
        const angle = -Math.PI / 2 + (i * Math.PI / 2);
        const x = cx + orbit * Math.cos(angle);
        const y = cy + orbit * Math.sin(angle);
        return (
          <circle key={`ghost-${i}`} cx={x} cy={y} r="14" fill="none"
            style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="2 4" />
        );
      })}

      {/* Connection lines from user to each friend */}
      {positions.map(({ x, y, friend }) => {
        const fEl = getElementInfo(friend.element);
        return (
          <line key={`l-${friend.id}`} x1={cx} y1={cy} x2={x} y2={y}
            stroke={fEl.hex} strokeWidth="0.6" opacity="0.25" />
        );
      })}

      {/* User center: breathing glow + element symbol */}
      <circle cx={cx} cy={cy} r="28" fill={userEl.hex} opacity="0.22">
        <animate attributeName="r" values="26;34;26" dur="6s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0.22;0.05;0.22" dur="6s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
      </circle>
      <circle cx={cx} cy={cy} r="22" fill={`${userEl.hex}20`}
        stroke={userEl.hex} strokeWidth="1" opacity="0.85" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
        fill={userEl.hex} fontSize="18" fontWeight="300">
        {userEl.chinese}
      </text>

      {/* Friend orbs with subtle drift */}
      {positions.map(({ x, y, friend }, i) => {
        const fEl = getElementInfo(friend.element);
        const animName = i % 2 === 0 ? 'fieldOrbDrift1' : 'fieldOrbDrift2';
        return (
          <g key={`orb-${friend.id}`} style={{ animation: `${animName} ${10 + i * 1.5}s ease-in-out infinite` }}>
            <circle cx={x} cy={y} r="16" fill={`${fEl.hex}18`}
              stroke={fEl.hex} strokeWidth="0.8" opacity="0.7" />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
              fill={fEl.hex} fontSize="11" fontWeight="300" opacity="0.95">
              {fEl.chinese}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ShengCycleIllustration({ userElement }) {
  const elements = [
    { key: 'wood',  char: '木', color: '#4a9e6e' },
    { key: 'fire',  char: '火', color: '#c75a3a' },
    { key: 'earth', char: '土', color: '#c9a84c' },
    { key: 'metal', char: '金', color: '#a8b8c8' },
    { key: 'water', char: '水', color: '#3a6fa0' },
  ];

  return (
    <svg viewBox="0 0 260 56" className={styles.illustration}>
      {elements.map((el, i) => {
        const x = 30 + i * 50;
        const isUser = el.key === userElement;
        return (
          <g key={el.key}>
            {/* Arrow connector */}
            {i < 4 && (
              <line x1={x + (isUser ? 18 : 14)} y1="28" x2={x + 36} y2="28"
                stroke={isUser ? el.color : 'var(--line-subtle)'}
                strokeWidth={isUser ? '0.9' : '0.5'}
                strokeDasharray={isUser ? 'none' : '2 3'}
                opacity={isUser ? '0.55' : '1'}>
                {isUser && (
                  <animate attributeName="opacity" values="0.55;0.9;0.55"
                    dur="3.5s" repeatCount="indefinite"
                    calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
                )}
              </line>
            )}
            {/* Glow for active */}
            {isUser && (
              <circle cx={x} cy="28" r="17" fill={el.color} opacity="0.18">
                <animate attributeName="r" values="17;24;17" dur="4s" repeatCount="indefinite"
                  calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
                <animate attributeName="opacity" values="0.18;0;0.18" dur="4s" repeatCount="indefinite"
                  calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
              </circle>
            )}
            <circle cx={x} cy="28" r={isUser ? 16 : 12}
              fill={isUser ? `${el.color}20` : 'none'}
              stroke={el.color}
              strokeWidth={isUser ? '1.3' : '0.7'}
              opacity={isUser ? '0.9' : '0.4'} />
            <text x={x} y="29" textAnchor="middle" dominantBaseline="central"
              fill={el.color} fontSize={isUser ? '11' : '8'} fontWeight={isUser ? '400' : '300'}
              opacity={isUser ? '1' : '0.55'}>
              {el.char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
