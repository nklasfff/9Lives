import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo, SHENG_DESCRIPTIONS, KE_DESCRIPTIONS } from '../engine/elements';
import { getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { getSpiritBetween, getSpiritByElement } from '../engine/wuShen';
import { calculateAge } from '../utils/dateUtils';
import { loadFriends } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './GroupDynamicsPage.module.css';

const ALL_ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'];

// Unique group dynamic texts
const GROUP_THEMES = {
  allSame: 'Every person in this constellation carries the same element. This is a field of deep resonance — an echo chamber in the truest sense. What one feels, all feel. The gift is effortless understanding. The risk is collective blind spots.',
  allSheng: 'The nourishing cycle flows unbroken through this group. Each person feeds the next — a living chain of elemental generosity. This constellation has a natural forward momentum, a sense of creative unfolding.',
  hasKe: 'This constellation holds both nourishment and tension. The Ke (tempering) dynamics bring necessary structure — without them, growth becomes shapeless. The friction you feel is not a problem to solve. It is the intelligence of the group.',
  balanced: 'This group holds a rare balance — multiple elements represented, with flows of both nourishment and gentle tempering. Like a garden with sun, rain, and season, there is a natural wholeness here.',
  missingElements: (missing) => `This constellation is missing the ${missing.join(' and ')} element${missing.length > 1 ? 's' : ''}. What is absent shapes the group as much as what is present. The missing element represents a quality the group must consciously cultivate — or find elsewhere.`,
};

export default function GroupDynamicsPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const allFriends = loadFriends();
  const [selectedIds, setSelectedIds] = useState(() => allFriends.map(f => f.id));

  if (!data) return null;

  const userEl = getElementInfo(data.element);

  const toggleFriend = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedFriends = allFriends.filter(f => selectedIds.includes(f.id));

  // Build the group: user + selected friends
  const members = [
    { id: 'user', name: 'You', element: data.element, birthYear: data.profile?.birthYear, gender: data.profile?.gender, isUser: true },
    ...selectedFriends.map(f => ({ ...f, isUser: false })),
  ];

  // All pairwise relationships
  const pairs = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const rel = getRelationship(members[i].element, members[j].element);
      const { spirit, reason } = getSpiritBetween(members[i].element, members[j].element);
      const spiritEl = getElementInfo(spirit.element);
      pairs.push({
        a: members[i],
        b: members[j],
        rel,
        spirit,
        spiritEl,
        reason,
      });
    }
  }

  // Element distribution
  const elementCounts = {};
  members.forEach(m => { elementCounts[m.element] = (elementCounts[m.element] || 0) + 1; });
  const presentElements = Object.keys(elementCounts);
  const missingElements = ALL_ELEMENTS.filter(e => !presentElements.includes(e));
  const missingInfo = missingElements.map(e => getElementInfo(e));

  // Relationship type counts
  const relTypes = {};
  pairs.forEach(p => { relTypes[p.rel.type] = (relTypes[p.rel.type] || 0) + 1; });

  // Determine group theme
  const getGroupTheme = () => {
    if (pairs.every(p => p.rel.type === 'same')) return GROUP_THEMES.allSame;
    if (pairs.every(p => p.rel.type.startsWith('sheng') || p.rel.type === 'same')) return GROUP_THEMES.allSheng;
    if (relTypes.ke_control || relTypes.ke_controlled) return GROUP_THEMES.hasKe;
    return GROUP_THEMES.balanced;
  };

  // Emotional landscape: collect all balanced/imbalanced emotions
  const emotionMap = {};
  members.forEach(m => {
    const el = getElementInfo(m.element);
    if (!emotionMap[m.element]) {
      emotionMap[m.element] = { balanced: el.emotion.balanced, imbalanced: el.emotion.imbalanced, hex: el.hex, chinese: el.chinese, names: [] };
    }
    emotionMap[m.element].names.push(m.name);
  });

  // Phase info for all members
  const memberPhases = members.map(m => {
    if (m.isUser) {
      return { ...m, phase: data.phase };
    }
    const age = calculateAge(m.birthYear, 6, 15);
    const phase = getLifePhase(Math.max(0, age), m.gender);
    return { ...m, phase };
  });

  // Colors for illustration
  const memberColors = members.map(m => getElementInfo(m.element).hex);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/relations')}>← Relations</button>

      <header className={styles.header}>
        <span className={styles.label}>Group Constellation</span>
        <h1>The Field Between You</h1>
        <p className={styles.subtitle}>
          {members.length} {members.length === 1 ? 'person' : 'people'} · {presentElements.length} element{presentElements.length !== 1 ? 's' : ''}
        </p>
      </header>

      <ConstellationIllustration members={members} memberColors={memberColors} pairs={pairs} />

      {/* Friend selector */}
      {allFriends.length > 0 && (
        <div className={styles.selector}>
          <span className={styles.selectorLabel}>Select who to include</span>
          <div className={styles.selectorGrid}>
            {allFriends.map(f => {
              const fEl = getElementInfo(f.element);
              const isSelected = selectedIds.includes(f.id);
              return (
                <button
                  key={f.id}
                  className={`${styles.selectorBtn} ${isSelected ? styles.selectorActive : ''}`}
                  onClick={() => toggleFriend(f.id)}
                  style={isSelected ? { borderColor: `${fEl.hex}60` } : {}}
                >
                  <span className={styles.selectorSymbol} style={{ color: isSelected ? fEl.hex : 'var(--text-muted)' }}>{fEl.chinese}</span>
                  <span className={styles.selectorName}>{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedFriends.length === 0 ? (
        <GlassCard>
          <p className={styles.emptyText}>Select at least one person above to see group dynamics.</p>
        </GlassCard>
      ) : (
        <div className={styles.cards}>
          {/* ─── Elemental Map ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Elemental Composition</span>
            <h2 className={styles.cardTitle}>Who Brings What</h2>
            <div className={styles.elementGrid}>
              {ALL_ELEMENTS.map(el => {
                const info = getElementInfo(el);
                const count = elementCounts[el] || 0;
                const names = members.filter(m => m.element === el).map(m => m.name);
                return (
                  <div key={el} className={`${styles.elementItem} ${count === 0 ? styles.elementAbsent : ''}`}>
                    <span className={styles.elementChinese} style={{ color: count > 0 ? info.hex : 'var(--text-muted)' }}>
                      {info.chinese}
                    </span>
                    <span className={styles.elementName} style={{ color: count > 0 ? info.hex : 'var(--text-muted)' }}>
                      {info.name}
                    </span>
                    {count > 0 ? (
                      <span className={styles.elementMembers}>{names.join(', ')}</span>
                    ) : (
                      <span className={styles.elementMissing}>absent</span>
                    )}
                  </div>
                );
              })}
            </div>

            {missingElements.length > 0 && (
              <p className={styles.bodyText}>
                {GROUP_THEMES.missingElements(missingInfo.map(e => e.name))}
              </p>
            )}
          </GlassCard>

          {/* ─── Group Theme ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>The Pattern</span>
            <h2 className={styles.cardTitle}>What Holds This Group Together</h2>
            <p className={styles.bodyText}>{getGroupTheme()}</p>

            <div className={styles.relSummary}>
              {relTypes.same > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{relTypes.same}</span>
                  <span className={styles.relSummaryType}>Resonance</span>
                  <span className={styles.relSummaryDesc}>Mirror connections</span>
                </div>
              )}
              {(relTypes.sheng_give || 0) + (relTypes.sheng_receive || 0) > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{(relTypes.sheng_give || 0) + (relTypes.sheng_receive || 0)}</span>
                  <span className={styles.relSummaryType}>Nourishing</span>
                  <span className={styles.relSummaryDesc}>Generative flows</span>
                </div>
              )}
              {(relTypes.ke_control || 0) + (relTypes.ke_controlled || 0) > 0 && (
                <div className={styles.relSummaryItem}>
                  <span className={styles.relSummaryCount}>{(relTypes.ke_control || 0) + (relTypes.ke_controlled || 0)}</span>
                  <span className={styles.relSummaryType}>Tempering</span>
                  <span className={styles.relSummaryDesc}>Structuring tensions</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ─── All Pairwise Dynamics ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Pairwise Dynamics</span>
            <h2 className={styles.cardTitle}>Every Connection</h2>

            {pairs.map((pair, idx) => {
              const aEl = getElementInfo(pair.a.element);
              const bEl = getElementInfo(pair.b.element);
              const cycleKey = `${pair.a.element}_${pair.b.element}`;
              const reverseKey = `${pair.b.element}_${pair.a.element}`;
              const metaphor = SHENG_DESCRIPTIONS[cycleKey] || SHENG_DESCRIPTIONS[reverseKey] || KE_DESCRIPTIONS[cycleKey] || KE_DESCRIPTIONS[reverseKey];
              return (
                <div key={idx} className={styles.pairItem}>
                  <div className={styles.pairHeader}>
                    <div className={styles.pairDots}>
                      <span className={styles.pairDot} style={{ background: aEl.hex }} />
                      <span className={styles.pairLine} />
                      <span className={styles.pairDot} style={{ background: bEl.hex }} />
                    </div>
                    <div className={styles.pairNames}>
                      <span>{pair.a.name} & {pair.b.name}</span>
                      <span className={styles.pairRelName}>{pair.rel.name}</span>
                    </div>
                  </div>
                  {metaphor && <p className={styles.pairMetaphor}>{metaphor}</p>}
                  <p className={styles.pairDesc}>{pair.rel.description}</p>
                </div>
              );
            })}
          </GlassCard>

          {/* ─── Spirits Between ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Wu Shen · Group Layer</span>
            <h2 className={styles.cardTitle}>Spirits Governing the Field</h2>
            <p className={styles.bodyText}>
              Between each pair of people, a spirit holds the relational space. In a group, these spirits form a constellation of their own — revealing which qualities are most alive in your shared field.
            </p>

            {pairs.map((pair, idx) => (
              <div key={idx} className={styles.spiritItem}>
                <div className={styles.spiritItemHeader}>
                  <span className={styles.spiritChinese} style={{ color: pair.spiritEl.hex }}>{pair.spirit.chinese}</span>
                  <div>
                    <span className={styles.spiritName} style={{ color: pair.spiritEl.hex }}>{pair.spirit.name}</span>
                    <span className={styles.spiritPairNames}>{pair.a.name} & {pair.b.name}</span>
                  </div>
                </div>
                <p className={styles.spiritTitle}>{pair.spirit.title}</p>
                <p className={styles.spiritReason}>{pair.reason}</p>
              </div>
            ))}
          </GlassCard>

          {/* ─── Emotional Landscape ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Emotional Landscape</span>
            <h2 className={styles.cardTitle}>The Feeling Field</h2>
            <p className={styles.bodyText}>
              Each element carries its own emotional signature — a balanced expression and a shadow. In a group, these emotions weave together into a shared field that is greater than any single person.
            </p>

            <div className={styles.emotionGrid}>
              {Object.entries(emotionMap).map(([el, info]) => (
                <div key={el} className={styles.emotionItem}>
                  <span className={styles.emotionChinese} style={{ color: info.hex }}>{info.chinese}</span>
                  <div className={styles.emotionContent}>
                    <span className={styles.emotionNames}>{info.names.join(', ')}</span>
                    <span className={styles.emotionBalanced}>{info.balanced}</span>
                    <span className={styles.emotionShadow}>Shadow: {info.imbalanced}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ─── Life Seasons ─── */}
          <GlassCard>
            <span className={styles.cardLabel}>Life Seasons</span>
            <h2 className={styles.cardTitle}>Where Each Person Stands in Time</h2>

            <div className={styles.phaseList}>
              {memberPhases.map((m, idx) => {
                const phaseEl = getElementInfo(m.phase.element);
                return (
                  <div key={idx} className={styles.phaseItem}>
                    <span className={styles.phaseNum} style={{ color: phaseEl.hex }}>{m.phase.phase}</span>
                    <div>
                      <span className={styles.phaseName}>{m.name}</span>
                      <h3 className={styles.phaseTitle}>{m.phase.title}</h3>
                      <span className={styles.phaseSeason}>
                        {phaseEl.chinese} {phaseEl.name} · {m.phase.season}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {(() => {
              const phases = memberPhases.map(m => m.phase.phase);
              const uniquePhases = [...new Set(phases)];
              const phaseElements = [...new Set(memberPhases.map(m => m.phase.element))];
              if (uniquePhases.length === 1) {
                return <p className={styles.phaseInsight}>Everyone stands in the same life season — a rare convergence. You are asking the same questions at the same time.</p>;
              }
              if (phaseElements.length === 1) {
                return <p className={styles.phaseInsight}>Though your phases differ, you all move through the same elemental season. The questions you carry are variations on a single theme.</p>;
              }
              const spread = Math.max(...phases) - Math.min(...phases);
              return <p className={styles.phaseInsight}>{spread} phases span this group — from the youngest season to the oldest. Each person brings the wisdom of their particular moment in time.</p>;
            })()}
          </GlassCard>

          {/* ─── Group Reflection ─── */}
          <GlassCard>
            <div className={styles.finalReflection}>
              <span className={styles.cardLabel}>A closing thought</span>
              <p className={styles.finalText}>
                A group is not the sum of its parts — it is a field. The elements you carry, the spirits that govern your connections, the life seasons you each inhabit — these create something that exists only when you are together.
                What emerges in this particular constellation cannot emerge anywhere else. Pay attention to it.
              </p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function ConstellationIllustration({ members, memberColors, pairs }) {
  const count = members.length;
  const cx = 150, cy = 110;
  const radius = count <= 2 ? 45 : count === 3 ? 50 : 55;
  const circleR = count <= 2 ? 40 : count === 3 ? 35 : 30;

  // Position members in a circle (or line for 2)
  const positions = members.map((_, i) => {
    if (count === 1) return { x: cx, y: cy };
    if (count === 2) return { x: cx + (i === 0 ? -35 : 35), y: cy };
    const angle = (-90 + i * (360 / count)) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 300 220" className={styles.illustration}>
      <style>{`
        @keyframes grpBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes grpPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }
        @keyframes grpFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
      `}</style>

      <defs>
        {memberColors.map((color, i) => (
          <radialGradient key={`gg${i}`} id={`grpGrad${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="70%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Connection lines between all pairs */}
      {pairs.map((pair, idx) => {
        const ai = members.indexOf(pair.a);
        const bi = members.indexOf(pair.b);
        if (ai < 0 || bi < 0) return null;
        const isKe = pair.rel.type.includes('ke');
        return (
          <line key={`conn-${idx}`}
            x1={positions[ai].x} y1={positions[ai].y}
            x2={positions[bi].x} y2={positions[bi].y}
            stroke={isKe ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)'}
            strokeWidth={isKe ? '0.5' : '0.8'}
            strokeDasharray={isKe ? '3 5' : '4 6'}
            style={{ animation: 'grpFlow 10s linear infinite' }}
          />
        );
      })}

      {/* Member circles */}
      {positions.map(({ x, y }, i) => (
        <g key={i} style={{ animation: `grpBreathe ${10 + i * 2}s ease-in-out infinite`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r={circleR} fill={`url(#grpGrad${i})`} />
          <circle cx={x} cy={y} r={circleR} fill="none" stroke={memberColors[i]} strokeWidth="0.9" opacity="0.6" />
          <circle cx={x} cy={y} r={circleR * 0.55} fill="none" stroke={memberColors[i]} strokeWidth="0.4" opacity="0.25" strokeDasharray="2 4" />
        </g>
      ))}

      {/* Spirit dots at midpoints of each pair */}
      {pairs.map((pair, idx) => {
        const ai = members.indexOf(pair.a);
        const bi = members.indexOf(pair.b);
        if (ai < 0 || bi < 0) return null;
        const mx = (positions[ai].x + positions[bi].x) / 2;
        const my = (positions[ai].y + positions[bi].y) / 2;
        return (
          <circle key={`sp-${idx}`} cx={mx} cy={my} r="3"
            fill={pair.spiritEl.hex} opacity="0.5"
            style={{ animation: `grpPulse ${6 + idx}s ease-in-out ${idx * 0.5}s infinite` }}
          />
        );
      })}

      {/* Center pulse */}
      {count > 2 && (
        <>
          <circle cx={cx} cy={cy} r="15" fill="rgba(255,255,255,0.04)"
            style={{ animation: 'grpPulse 7s ease-in-out infinite' }} />
          <circle cx={cx} cy={cy} r="2.5" fill="rgba(255,255,255,0.4)" />
        </>
      )}

      {/* Labels */}
      {positions.map(({ x, y }, i) => {
        const el = getElementInfo(members[i].element);
        const labelOffset = circleR + 12;
        let ly = y, lx = x, anchor = 'middle';
        if (count === 2) {
          ly = y + circleR + 14;
        } else if (count >= 3) {
          const angle = (-90 + i * (360 / count)) * (Math.PI / 180);
          lx = cx + (radius + labelOffset) * Math.cos(angle);
          ly = cy + (radius + labelOffset) * Math.sin(angle);
          if (lx < cx - 10) anchor = 'end';
          else if (lx > cx + 10) anchor = 'start';
        }
        return (
          <text key={`lbl-${i}`} x={lx} y={ly}
            textAnchor={anchor} dominantBaseline="central"
            fill={el.hex} fontSize="7" fontFamily="var(--font-display)"
            fontStyle="italic" fontWeight="300" opacity="0.7">
            {members[i].name}
          </text>
        );
      })}
    </svg>
  );
}
