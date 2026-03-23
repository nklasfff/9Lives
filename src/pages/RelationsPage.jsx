import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getZodiacAnimal } from '../engine/zodiac';
import { getElement, getElementInfo } from '../engine/elements';
import { getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { calculateAge } from '../utils/dateUtils';
import { loadFriends, saveFriends } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './RelationsPage.module.css';

export default function RelationsPage() {
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [friends, setFriends] = useState(() => loadFriends());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', year: 1990, gender: null });

  useEffect(() => { saveFriends(friends); }, [friends]);

  if (!data) return null;

  const userEl = getElementInfo(data.element);

  const addFriend = () => {
    if (!formData.name || !formData.gender) return;
    const zodiac = getZodiacAnimal(formData.year);
    const element = getElement(zodiac.animal);
    const age = calculateAge(formData.year, 6, 15);
    const phase = getLifePhase(age, formData.gender);
    const newFriend = {
      id: Date.now().toString(),
      name: formData.name,
      birthYear: formData.year,
      gender: formData.gender,
      zodiacAnimal: zodiac.animal,
      zodiacSymbol: zodiac.symbol,
      zodiacName: zodiac.name,
      element,
      phase: phase.phase,
      phaseTitle: phase.title,
    };
    setFriends([...friends, newFriend]);
    setFormData({ name: '', year: 1990, gender: null });
    setShowForm(false);
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Relations</h1>
        <p className={styles.subtitle}>Elemental dynamics between lives</p>
      </header>

      <IkigaiIllustration userColor={userEl.hex} />

      {/* Introduction card */}
      <div className={styles.content}>
        <GlassCard>
          <p className={styles.introText}>
            Every relationship carries an elemental signature. When you add someone, their birth year reveals their element — and the dynamic between your elements tells a story of nourishment, challenge, or deep resonance.
          </p>
        </GlassCard>

        {/* Feature cards */}
        <div className={styles.featureCards}>
          <GlassCard className={styles.featureCard}>
            <span className={styles.featureIcon}>◯—◯</span>
            <h4 className={styles.featureTitle}>Elemental Dynamics</h4>
            <p className={styles.featureDesc}>See how your element interacts with theirs — nourishing, tempering, or mirroring</p>
          </GlassCard>
          <GlassCard className={styles.featureCard}>
            <span className={styles.featureIcon}>◯—◯—◯</span>
            <h4 className={styles.featureTitle}>Group Constellations</h4>
            <p className={styles.featureDesc}>Add your partner, mother, child, friend — see how the whole field moves together</p>
          </GlassCard>
        </div>

        {/* Your element summary */}
        <GlassCard glowColor={`${userEl.hex}10`}>
          <div className={styles.youCard}>
            <span className={styles.youSymbol} style={{ color: userEl.hex }}>{userEl.chinese}</span>
            <div>
              <span className={styles.youLabel}>You</span>
              <h3 className={styles.youElement} style={{ color: userEl.hex }}>{userEl.name}</h3>
              <span className={styles.youMeta}>Phase {data.phase.phase} · {data.phase.title} · {data.phase.season}</span>
            </div>
          </div>
        </GlassCard>

        {/* Friends list */}
        {friends.length > 0 && (
          <div className={styles.friendsList}>
            <h2 className={styles.sectionTitle}>Your People</h2>
            {friends.map((friend) => {
              const friendEl = getElementInfo(friend.element);
              const rel = getRelationship(data.element, friend.element);
              const friendPhaseInfo = getLifePhase(
                calculateAge(friend.birthYear, 6, 15),
                friend.gender
              );
              return (
                <GlassCard key={friend.id} glowColor={`${friendEl.hex}15`}>
                  <div className={styles.friendHeader}>
                    <div className={styles.friendIdentity}>
                      <span className={styles.friendSymbol} style={{ color: friendEl.hex }}>
                        {friendEl.chinese}
                      </span>
                      <div>
                        <h3 className={styles.friendName}>{friend.name}</h3>
                        <span className={styles.friendMeta}>
                          {friend.zodiacSymbol} {friend.zodiacName} · {friendEl.name} · Phase {friend.phase}
                        </span>
                      </div>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeFriend(friend.id)}>×</button>
                  </div>

                  <div className={styles.relationType}>
                    <div className={styles.relDots}>
                      <span className={styles.relDot} style={{ background: userEl.hex }} />
                      <span className={styles.relLine} />
                      <span className={styles.relDot} style={{ background: friendEl.hex }} />
                    </div>
                    <span className={styles.relName}>{rel.name}</span>
                  </div>
                  <p className={styles.relDesc}>{rel.description}</p>

                  <div className={styles.phaseComparison}>
                    <div className={styles.phaseItem}>
                      <span className={styles.phaseLabel}>You</span>
                      <span className={styles.phaseValue}>Phase {data.phase.phase} · {data.phase.title}</span>
                    </div>
                    <div className={styles.phaseItem}>
                      <span className={styles.phaseLabel}>{friend.name}</span>
                      <span className={styles.phaseValue}>Phase {friendPhaseInfo.phase} · {friendPhaseInfo.title}</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Add person */}
        {showForm ? (
          <GlassCard className={styles.formCard}>
            <h3 className={styles.formTitle}>Add someone</h3>
            <div className={styles.formField}>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Their name"
                autoFocus
              />
            </div>
            <div className={styles.formField}>
              <label>Birth Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: +e.target.value })}
              >
                {Array.from({ length: 107 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className={styles.genderRow}>
              <button
                className={`${styles.genderBtn} ${formData.gender === 'female' ? styles.genderActive : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                Feminine
              </button>
              <button
                className={`${styles.genderBtn} ${formData.gender === 'male' ? styles.genderActive : ''}`}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                Masculine
              </button>
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button
                className={styles.addBtn}
                onClick={addFriend}
                disabled={!formData.name || !formData.gender}
              >
                Add
              </button>
            </div>
          </GlassCard>
        ) : (
          <button className={styles.addPersonBtn} onClick={() => setShowForm(true)}>
            + Add someone
          </button>
        )}
      </div>

      <CyclesIllustration />

      {/* Deeper layer cards */}
      <div className={styles.deeperCards}>
        <GlassCard className={styles.deepCard}>
          <span className={styles.deepLabel}>Wu Shen · Relational Layer</span>
          <h3 className={styles.deepTitle}>Spirits Between You</h3>
          <p className={styles.deepBody}>
            When two elements meet, the spirit that governs their connection reveals the quality of the space between them. A Fire-Wood relationship is held by Hun — the dreaming, creative spirit. A Water-Earth meeting is held by Yi — the ground of shared thought and care.
          </p>
          <p className={styles.deepHint}>
            Add someone to discover which spirit governs the space between you.
          </p>
        </GlassCard>

        <GlassCard className={styles.deepCard}>
          <span className={styles.deepLabel}>Qi Jing Ba Mai · Relational Layer</span>
          <h3 className={styles.deepTitle}>The Relational Vessels</h3>
          <p className={styles.deepBody}>
            Three of the eight extraordinary meridians speak directly to how we bond, inherit, and hold what is unprocessed between us.
          </p>
          <div className={styles.vesselList}>
            <div className={styles.vesselItem}>
              <span className={styles.vesselChinese}>任脈</span>
              <div>
                <span className={styles.vesselName}>Ren Mai</span>
                <span className={styles.vesselRole}>Bonding & nourishment — can you receive care?</span>
              </div>
            </div>
            <div className={styles.vesselItem}>
              <span className={styles.vesselChinese}>衝脈</span>
              <div>
                <span className={styles.vesselName}>Chong Mai</span>
                <span className={styles.vesselRole}>Ancestral patterns — what is inherited between you?</span>
              </div>
            </div>
            <div className={styles.vesselItem}>
              <span className={styles.vesselChinese}>帶脈</span>
              <div>
                <span className={styles.vesselName}>Dai Mai</span>
                <span className={styles.vesselRole}>Unprocessed residue — what is held but not yet spoken?</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className={styles.deepCard}>
          <span className={styles.deepLabel}>Life Phases · Relational Layer</span>
          <h3 className={styles.deepTitle}>Phase Rhythms</h3>
          <p className={styles.deepBody}>
            Women move through 7-year cycles, men through 8-year cycles. This biological offset means partners, parents and children are almost never in the same life phase at the same time — creating both friction and growth.
          </p>
          <p className={styles.deepBody}>
            A woman at 42 enters the Harvest (Metal/Autumn). Her same-age partner is still in Responsibility (Earth/Late Summer). They are living different seasons simultaneously — and understanding this difference can transform how they meet each other.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function IkigaiIllustration({ userColor }) {
  // Four overlapping circles in ikigai pattern — you + up to 3 others
  const colors = [userColor || '#c75a3a', '#4a9e6e', '#3a6fa0', '#c9a84c'];
  const labels = ['You', 'Partner', 'Child', 'Friend'];
  const cx = 130, cy = 110, spread = 32, r = 42;

  // Four circle positions (top, right, bottom-right, left)
  const positions = [
    { x: cx, y: cy - spread * 0.6 },           // You (top center)
    { x: cx + spread * 0.9, y: cy + spread * 0.3 }, // Partner (right)
    { x: cx - spread * 0.9, y: cy + spread * 0.3 }, // Child (left)
    { x: cx, y: cy + spread * 0.9 },            // Friend (bottom)
  ];

  return (
    <svg viewBox="0 0 260 220" className={styles.heroIllustration}>
      <style>{`
        @keyframes ikigaiBreathe1 {
          0%, 100% { transform: translate(0, 2px); }
          50% { transform: translate(0, -2px); }
        }
        @keyframes ikigaiBreathe2 {
          0%, 100% { transform: translate(2px, 0); }
          50% { transform: translate(-2px, 0); }
        }
        @keyframes ikigaiBreathe3 {
          0%, 100% { transform: translate(-2px, 0); }
          50% { transform: translate(2px, 0); }
        }
        @keyframes ikigaiBreathe4 {
          0%, 100% { transform: translate(0, -2px); }
          50% { transform: translate(0, 2px); }
        }
        @keyframes centerGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
        @keyframes dotSequence {
          0%, 8% { opacity: 0; r: 1; }
          12%, 20% { opacity: 0.6; r: 3.5; }
          28%, 100% { opacity: 0; r: 1; }
        }
      `}</style>

      <defs>
        {colors.map((color, i) => (
          <radialGradient key={`rg${i}`} id={`ikGrad${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="70%" stopColor={color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* The four overlapping circles */}
      {positions.map(({ x, y }, i) => (
        <g key={i} style={{ animation: `ikigaiBreathe${i + 1} ${10 + i * 2}s ease-in-out infinite` }}>
          {/* Filled glow */}
          <circle cx={x} cy={y} r={r} fill={`url(#ikGrad${i})`} />
          {/* Outer ring */}
          <circle cx={x} cy={y} r={r} fill="none" stroke={colors[i]} strokeWidth="0.8" opacity="0.35" />
          {/* Inner ring */}
          <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke={colors[i]} strokeWidth="0.4" opacity="0.15" strokeDasharray="2 3" />
        </g>
      ))}

      {/* Sequenced intersection dots — each appears alone then fades */}
      {(() => {
        // All possible intersection zones with descriptions
        const zones = [
          // 2-circle pairwise intersections
          { circles: [0, 1], label: '2' },  // You + Partner
          { circles: [0, 2], label: '2' },  // You + Child
          { circles: [1, 3], label: '2' },  // Partner + Friend
          { circles: [2, 3], label: '2' },  // Child + Friend
          { circles: [0, 3], label: '2' },  // You + Friend
          // 3-circle intersections
          { circles: [0, 1, 3], label: '3' }, // You + Partner + Friend
          { circles: [0, 2, 3], label: '3' }, // You + Child + Friend
          { circles: [0, 1, 2], label: '3' }, // You + Partner + Child
          // 4-circle center
          { circles: [0, 1, 2, 3], label: '4' },
        ];
        const totalDuration = zones.length * 3; // 3 seconds per zone

        return zones.map((zone, idx) => {
          const mx = zone.circles.reduce((s, c) => s + positions[c].x, 0) / zone.circles.length;
          const my = zone.circles.reduce((s, c) => s + positions[c].y, 0) / zone.circles.length;
          const dotR = zone.label === '4' ? 4 : zone.label === '3' ? 3 : 2.5;
          const brightness = zone.label === '4' ? 0.7 : zone.label === '3' ? 0.5 : 0.4;

          return (
            <circle key={`seq-${idx}`} cx={mx} cy={my} r={dotR}
              fill={`rgba(255,255,255,${brightness})`}
              style={{
                animation: `dotSequence ${totalDuration}s ease-in-out ${idx * 3}s infinite`,
              }} />
          );
        });
      })()}

      {/* Labels */}
      {positions.map(({ x, y }, i) => {
        const labelY = i === 0 ? y - r - 6 : i === 3 ? y + r + 10 : y;
        const labelX = i === 1 ? x + r + 4 : i === 2 ? x - r - 4 : x;
        const anchor = i === 1 ? 'start' : i === 2 ? 'end' : 'middle';
        return (
          <text key={`lbl-${i}`}
            x={labelX} y={labelY}
            textAnchor={anchor}
            fill={colors[i]}
            fontSize="7"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fontWeight="300"
            opacity="0.6"
          >
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

function CyclesIllustration() {
  const colors = ['#4a9e6e', '#c75a3a', '#c9a84c', '#a8b8c8', '#3a6fa0'];
  const chars = ['木', '火', '土', '金', '水'];

  return (
    <svg viewBox="0 0 200 180" className={styles.cyclesIllustration}>
      <style>{`
        @keyframes cycleRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cyclePulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Outer ring */}
      <circle cx="100" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

      {/* Sheng cycle — pentagon */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a1 = (-90 + i * 72) * (Math.PI / 180);
        const a2 = (-90 + ((i + 1) % 5) * 72) * (Math.PI / 180);
        const x1 = 100 + 65 * Math.cos(a1), y1 = 90 + 65 * Math.sin(a1);
        const x2 = 100 + 65 * Math.cos(a2), y2 = 90 + 65 * Math.sin(a2);
        return (
          <line key={`s-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colors[i]} strokeWidth="0.5" opacity="0.25"
            style={{ animation: `cyclePulse ${7 + i}s ease-in-out ${i * 0.5}s infinite` }} />
        );
      })}

      {/* Ke cycle — star */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a1 = (-90 + i * 72) * (Math.PI / 180);
        const a2 = (-90 + ((i + 2) % 5) * 72) * (Math.PI / 180);
        const x1 = 100 + 65 * Math.cos(a1), y1 = 90 + 65 * Math.sin(a1);
        const x2 = 100 + 65 * Math.cos(a2), y2 = 90 + 65 * Math.sin(a2);
        return (
          <line key={`k-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="3 4" />
        );
      })}

      {/* Element points */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (-90 + i * 72) * (Math.PI / 180);
        const x = 100 + 65 * Math.cos(angle);
        const y = 90 + 65 * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill={`${colors[i]}10`} stroke={colors[i]} strokeWidth="0.6" opacity="0.5" />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
              fill={colors[i]} fontSize="7" fontWeight="300" opacity="0.7">
              {chars[i]}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx="100" cy="90" r="3" fill="rgba(255,255,255,0.15)"
        style={{ animation: 'cyclePulse 6s ease-in-out infinite' }} />
    </svg>
  );
}
