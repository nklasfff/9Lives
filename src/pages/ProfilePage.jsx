import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getZodiacAnimal } from '../engine/zodiac';
import { getSpiritByElement } from '../engine/wuShen';
import { getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { getDayPillar, getYearPillar } from '../engine/calendar';
import { calculateAge } from '../utils/dateUtils';
import { loadConstellations, saveConstellations, loadFriends } from '../utils/localStorage';
import { getTimelineGroupedByWeek } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import styles from './ProfilePage.module.css';

const YIN_ORGAN_CHARS = {
  water: '腎', wood: '肝', fire: '心', earth: '脾', metal: '肺',
};

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
  const yinOrganChar = YIN_ORGAN_CHARS[data.element];

  // Birth pillars — the year and day you were born, in the Gan Zhi system
  const birthDate = new Date(data.birthDate.year, data.birthDate.month - 1, data.birthDate.day);
  const yearPillar = getYearPillar(data.birthDate.year);
  const dayPillar = getDayPillar(birthDate);
  const yearStemEl = getElementInfo(yearPillar.stem.element);
  const yearBranchEl = getElementInfo(yearPillar.branch.element);
  const dayPillarEl = getElementInfo(dayPillar.element);

  // Trail — your reflections journal, grouped by week
  const trailWeeks = getTimelineGroupedByWeek();
  const totalReflections = trailWeeks.reduce((s, w) => s + w.entries.length, 0);

  return (
    <div className={styles.page}>
      {/* Header — hero identity */}
      <header className={styles.header}>
        <div className={styles.symbol} style={{ color: el.hex }}>
          {el.chinese}
        </div>
        <h1 style={{ color: el.hex }}>{el.name}</h1>
        <p className={styles.subtitle}>{el.quality}</p>
      </header>

      {/* Identity chart — five essential placements */}
      <GlassCard className={styles.chartCard}>
        <div className={styles.chartGrid}>
          <ChartRow label="Element" value={el.name} symbol={el.chinese} color={el.hex} />
          <ChartRow label="Spirit" value={spirit.name} symbol={spirit.chinese} color={el.hex} />
          <ChartRow label="Phase" value={`${data.phase.phase} — ${data.phase.title}`} color={phaseEl.hex} />
          <ChartRow label="Zodiac" value={zodiac.name} symbol={zodiac.symbol} />
          <ChartRow label="Cycle" value={data.gender === 'female' ? '7-year (Feminine)' : '8-year (Masculine)'} />
        </div>
      </GlassCard>

      <ElementWheelIllustration userElement={data.element} />

      {/* Birth pillars — year and day you were born, in Gan Zhi */}
      <GlassCard
        className={`${styles.pillarsCard} ${styles.tappable}`}
        glowColor={`${dayPillarEl.hex}10`}
        onClick={() => navigate('/explore/calendar')}
      >
        <span className={styles.deepLabel}>Your Birth in Gan Zhi</span>
        <h2 className={styles.deepTitle}>Year & Day Pillars</h2>

        <div className={styles.pillarsGrid}>
          <div className={styles.pillarBlock}>
            <span className={styles.pillarKicker}>Year · {data.birthDate.year}</span>
            <span className={styles.pillarChars} style={{ color: yearStemEl.hex }}>
              {yearPillar.stem.chinese}{yearPillar.branch.chinese}
            </span>
            <span className={styles.pillarName}>
              {yearPillar.stem.name}-{yearPillar.branch.name}
            </span>
            <span className={styles.pillarMeta}>
              <span style={{ color: yearStemEl.hex }}>
                {yearPillar.stem.yinYang === 'yang' ? 'Yang' : 'Yin'} {yearStemEl.name}
              </span>
              {' · '}
              <span style={{ color: yearBranchEl.hex }}>the {yearPillar.branch.animal}</span>
            </span>
          </div>

          <div className={styles.pillarBlock}>
            <span className={styles.pillarKicker}>
              Day · {data.birthDate.month}/{data.birthDate.day}
            </span>
            <span className={styles.pillarChars} style={{ color: dayPillarEl.hex }}>
              {dayPillar.chineseLabel}
            </span>
            <span className={styles.pillarName}>{dayPillar.label}</span>
            <span className={styles.pillarMeta} style={{ color: dayPillarEl.hex }}>
              {dayPillar.yinYang === 'yang' ? 'Yang' : 'Yin'} {dayPillarEl.name}
            </span>
          </div>
        </div>

        <p className={styles.pillarsLine}>{dayPillar.stemImage}</p>
        <span className={styles.tapHint}>Read the calendar →</span>
      </GlassCard>

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

      {/* Launchpad — go deeper into each layer of you */}
      <GlassCard className={styles.launchCard}>
        <span className={styles.deepLabel}>Go Deeper</span>
        <h2 className={styles.deepTitle}>About You</h2>
        <div className={styles.launchGrid}>
          <button
            className={styles.launchTile}
            style={{ '--tile-accent': el.hex }}
            onClick={() => navigate('/explore/element')}
          >
            <span className={styles.launchSymbol} style={{ color: el.hex }}>{el.chinese}</span>
            <span className={styles.launchLabel}>Your Element</span>
            <span className={styles.launchName}>{el.name}</span>
            <span className={styles.launchTag}>{el.quality}</span>
          </button>

          <button
            className={styles.launchTile}
            style={{ '--tile-accent': el.hex }}
            onClick={() => navigate('/explore/spirits')}
          >
            <span className={styles.launchSymbol} style={{ color: el.hex }}>{spirit.chinese}</span>
            <span className={styles.launchLabel}>Your Spirit</span>
            <span className={styles.launchName}>{spirit.name}</span>
            <span className={styles.launchTag}>{spirit.title}</span>
          </button>

          <button
            className={styles.launchTile}
            style={{ '--tile-accent': phaseEl.hex }}
            onClick={() => navigate('/explore/phases')}
          >
            <span className={styles.launchSymbol} style={{ color: phaseEl.hex }}>{data.phase.phase}</span>
            <span className={styles.launchLabel}>Your Phase</span>
            <span className={styles.launchName}>{data.phase.title}</span>
            <span className={styles.launchTag}>{data.phase.subtitle}</span>
          </button>

          <button
            className={styles.launchTile}
            style={{ '--tile-accent': el.hex }}
            onClick={() => navigate('/explore/organs')}
          >
            <span className={styles.launchSymbol} style={{ color: el.hex }}>{yinOrganChar}</span>
            <span className={styles.launchLabel}>Your Body</span>
            <span className={styles.launchName}>{el.organs.yin} &amp; {el.organs.yang}</span>
            <span className={styles.launchTag}>The twelve organ rhythms</span>
          </button>
        </div>
      </GlassCard>

      {/* Saved Constellations — your archive (only when populated) */}
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

      {/* Your trail — reflections gathered across the layers */}
      <GlassCard className={styles.trailCard} glowColor={`${el.hex}08`}>
        <span className={styles.deepLabel}>Your Reflections</span>
        <h2 className={styles.deepTitle}>Your Trail</h2>

        {totalReflections === 0 ? (
          <p className={styles.trailEmpty}>
            As you reflect on the questions inside each layer, your trail begins here.
          </p>
        ) : (
          <>
            <p className={styles.trailSummary}>
              {totalReflections} {totalReflections === 1 ? 'reflection' : 'reflections'}, week by week.
            </p>
            {trailWeeks.slice().reverse().map((week) => (
              <div key={week.weekOf} className={styles.trailWeek}>
                <h3 className={styles.trailWeekLabel}>
                  Week of {new Date(week.weekOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                {week.entries.slice().reverse().map((entry) => {
                  const route = trailRoute(entry);
                  const source = trailSource(entry);
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
          </>
        )}
      </GlassCard>

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

function trailRoute(entry) {
  if (entry.type === 'organ') return `/explore/organs/${entry.organKey}`;
  if (entry.type === 'reflection' || entry.type === 'journal') return `/explore/phases/${entry.phaseId}`;
  return null;
}

function trailSource(entry) {
  if (entry.type === 'organ') {
    return (entry.organKey || 'Organ').replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }
  if (entry.type === 'reflection' || entry.type === 'journal') return `Phase ${entry.phaseId}`;
  return '';
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

