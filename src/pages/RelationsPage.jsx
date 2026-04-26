import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getZodiacAnimal } from '../engine/zodiac';
import { getElement, getElementInfo } from '../engine/elements';
import { getRelationship } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { calculateAge } from '../utils/dateUtils';
import { loadFriends, saveFriends, loadConstellations, saveConstellations } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './RelationsPage.module.css';

export default function RelationsPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [friends, setFriends] = useState(() => loadFriends());
  const [constellations, setConstellations] = useState(() => loadConstellations());
  const [showForm, setShowForm] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [formData, setFormData] = useState({ name: '', year: 1990, gender: null, isPartner: false });

  useEffect(() => { saveFriends(friends); }, [friends]);
  useEffect(() => { saveConstellations(constellations); }, [constellations]);

  const saveConstellation = () => {
    if (!saveName.trim() || friends.length === 0) return;
    const entry = { id: Date.now().toString(), name: saveName.trim(), members: friends };
    setConstellations(prev => [...prev, entry]);
    setSaveName('');
    setShowSaveForm(false);
  };

  const loadConstellation = (entry) => {
    setFriends(entry.members);
  };

  const deleteConstellation = (id) => {
    setConstellations(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = () => setFriends([]);

  if (!data) return null;

  const userEl = getElementInfo(data.element);

  const addFriend = () => {
    if (!formData.name || !formData.gender) return;
    const zodiac = getZodiacAnimal(formData.year);
    const element = getElement(zodiac.animal);
    const age = calculateAge(formData.year, 6, 15);
    const phase = getLifePhase(age, formData.gender);
    // Only one partner at a time — clear flag from existing friends if a new partner is set
    const baseFriends = formData.isPartner ? friends.map(f => ({ ...f, isPartner: false })) : friends;
    const newFriend = {
      id: Date.now().toString(),
      name: formData.name,
      birthYear: formData.year,
      gender: formData.gender,
      isPartner: !!formData.isPartner,
      zodiacAnimal: zodiac.animal,
      zodiacSymbol: zodiac.symbol,
      zodiacName: zodiac.name,
      element,
      phase: phase.phase,
      phaseTitle: phase.title,
    };
    setFriends([...baseFriends, newFriend]);
    setFormData({ name: '', year: 1990, gender: null, isPartner: false });
    setShowForm(false);
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  // Compute per-friend insight: constitutional meeting + phase-season meeting + partner forskydning if applicable
  const friendInsights = friends.map((friend) => {
    const friendEl = getElementInfo(friend.element);
    const constitutionalRel = getRelationship(data.element, friend.element);
    const friendAge = Math.max(0, calculateAge(friend.birthYear, 6, 15));
    const friendPhase = getLifePhase(friendAge, friend.gender);
    const userPhaseEl = getElementInfo(data.phase.element);
    const friendPhaseEl = getElementInfo(friendPhase.element);
    const seasonRel = getRelationship(data.phase.element, friendPhase.element);
    const userCycle = data.gender === 'female' ? 7 : 8;
    const partnerCycle = friend.gender === 'female' ? 7 : 8;
    const cycleForskydning = friend.isPartner && userCycle !== partnerCycle
      ? `Your ${userCycle}-year cycles meet ${partnerCycle}-year cycles — a small difference that grows over the years, hitting precisely where the big choices ask to be made.`
      : null;
    return { friend, friendEl, friendAge, friendPhase, userPhaseEl, friendPhaseEl, constitutionalRel, seasonRel, cycleForskydning };
  });

  // Generational reading — when phases span 4+ steps (e.g. teen + adult + elder), surface the trinity
  const allPhases = [data.phase.phase, ...friendInsights.map(fi => fi.friendPhase.phase)];
  const phaseSpread = friends.length >= 2 ? Math.max(...allPhases) - Math.min(...allPhases) : 0;
  const isThreeGenerations = phaseSpread >= 4;

  // Group field quote varies by configuration (in the spirit of the source book)
  const groupFieldQuote = isThreeGenerations
    ? 'Three lives, three seasons of the same arc — what one is just beginning, another has already let go.'
    : friendInsights.some(fi => fi.friend.isPartner)
      ? 'Two rhythms in one home, and the others who orbit it. The whole field moves together — even when you cannot feel it.'
      : 'Several lives in the same field. Where one element flows into another, where two seasons meet — the whole shape of you, together.';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Relations</h1>
        <p className={styles.subtitle}>What happens when your season meets theirs</p>
      </header>

      <IkigaiIllustration userColor={userEl.hex} />

      <div className={styles.content}>
        {/* Saved constellations — compact chip bar (when populated) */}
        {constellations.length > 0 && (
          <div className={styles.constellationBar}>
            <span className={styles.constellationBarLabel}>Saved</span>
            <div className={styles.constellationChips}>
              {constellations.map(c => (
                <div key={c.id} className={styles.chip}>
                  <button className={styles.chipLoad} onClick={() => loadConstellation(c)}>
                    {c.name}
                  </button>
                  <button className={styles.chipDelete} onClick={() => deleteConstellation(c.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — invitation with the book's seed quote */}
        {friends.length === 0 && !showForm && (
          <GlassCard glowColor={`${userEl.hex}10`}>
            <p className={styles.seedQuote}>
              Three generations under one roof, and the feeling of speaking three different languages.
            </p>
            <p className={styles.seedBody}>
              When you see that what felt like personal conflict is two people in different seasons of the same life — a softness opens that goodwill alone cannot reach.
            </p>
            <button className={styles.addPersonBtnPrimary} onClick={() => setShowForm(true)}>
              + Add the first person
            </button>
          </GlassCard>
        )}

        {/* Friends list — compact cards, both meetings shown */}
        {friends.length > 0 && (
          <div className={styles.friendsList}>
            <div className={styles.friendsListHeader}>
              <h2 className={styles.sectionTitle}>Your field</h2>
              <div className={styles.friendsActions}>
                {!showSaveForm && (
                  <button className={styles.actionBtn} onClick={() => setShowSaveForm(true)}>Save</button>
                )}
                <button className={styles.actionBtn} onClick={clearAll}>Clear all</button>
              </div>
            </div>

            {showSaveForm && (
              <div className={styles.saveForm}>
                <input
                  className={styles.saveInput}
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="Name this constellation…"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && saveConstellation()}
                />
                <div className={styles.saveFormActions}>
                  <button className={styles.cancelBtn} onClick={() => { setShowSaveForm(false); setSaveName(''); }}>Cancel</button>
                  <button className={styles.addBtn} onClick={saveConstellation} disabled={!saveName.trim()}>Save</button>
                </div>
              </div>
            )}

            {friendInsights.map((fi) => (
              <GlassCard key={fi.friend.id} glowColor={`${fi.friendEl.hex}15`}>
                <div className={styles.friendHeader}>
                  <div className={styles.friendIdentity}>
                    <span className={styles.friendSymbol} style={{ color: fi.friendEl.hex }}>
                      {fi.friendEl.chinese}
                    </span>
                    <div>
                      <div className={styles.friendNameRow}>
                        <h3 className={styles.friendName}>{fi.friend.name}</h3>
                        {fi.friend.isPartner && (
                          <span className={styles.partnerBadge} style={{ borderColor: userEl.hex, color: userEl.hex }}>
                            partner
                          </span>
                        )}
                      </div>
                      <span className={styles.friendMeta}>
                        {fi.friendEl.name} · Phase {fi.friendPhase.phase} {fi.friendPhase.title} · age {fi.friendAge}
                      </span>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); removeFriend(fi.friend.id); }}>×</button>
                </div>

                {/* Two meetings: constitutional element + phase season */}
                <div className={styles.meetingRow}>
                  <span className={styles.meetingLabel}>Element</span>
                  <span className={styles.meetingPair}>
                    <span style={{ color: userEl.hex }}>{userEl.chinese}</span>
                    <span className={styles.meetingArrow}>{fi.constitutionalRel.quality === 'Mirror' ? '⟷' : '→'}</span>
                    <span style={{ color: fi.friendEl.hex }}>{fi.friendEl.chinese}</span>
                  </span>
                  <span className={styles.meetingName} style={{ color: fi.friendEl.hex }}>
                    {fi.constitutionalRel.name}
                  </span>
                </div>

                <div className={styles.meetingRow}>
                  <span className={styles.meetingLabel}>Season</span>
                  <span className={styles.meetingPair}>
                    <span style={{ color: fi.userPhaseEl.hex }}>{data.phase.season}</span>
                    <span className={styles.meetingArrow}>{fi.seasonRel.quality === 'Mirror' ? '⟷' : '→'}</span>
                    <span style={{ color: fi.friendPhaseEl.hex }}>{fi.friendPhase.season}</span>
                  </span>
                  <span className={styles.meetingName} style={{ color: fi.friendPhaseEl.hex }}>
                    {fi.seasonRel.name}
                  </span>
                </div>

                {fi.cycleForskydning && (
                  <p className={styles.partnerInsight}>{fi.cycleForskydning}</p>
                )}

                <button className={styles.exploreBtn} onClick={() => navigate(`/relations/${fi.friend.id}`)}>
                  Explore this connection →
                </button>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Group field — single CTA card, evocative quote varies by configuration */}
        {friends.length >= 2 && (
          <GlassCard
            glowColor={`${userEl.hex}12`}
            className={styles.groupCard}
            onClick={() => navigate('/relations/group')}
          >
            {isThreeGenerations && (
              <span className={styles.groupCardKicker}>Three generations meeting</span>
            )}
            <div className={styles.groupCardInner}>
              <div className={styles.groupDots}>
                <span className={styles.groupDotLarge} style={{ background: userEl.hex }} />
                {friends.slice(0, 3).map((f) => {
                  const fEl = getElementInfo(f.element);
                  return <span key={f.id} className={styles.groupDotLarge} style={{ background: fEl.hex }} />;
                })}
              </div>
              <div>
                <h3 className={styles.groupCardTitle}>The field of all {friends.length + 1}</h3>
                <p className={styles.groupCardBody}>{groupFieldQuote}</p>
              </div>
            </div>
            <span className={styles.tapHint}>See the whole field →</span>
          </GlassCard>
        )}

        {/* Add person — form expanded or button collapsed */}
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

            <button
              className={`${styles.partnerToggle} ${formData.isPartner ? styles.partnerToggleActive : ''}`}
              onClick={() => setFormData({ ...formData, isPartner: !formData.isPartner })}
              style={formData.isPartner ? { borderColor: userEl.hex, color: userEl.hex } : {}}
            >
              <span className={styles.partnerToggleCheck}>{formData.isPartner ? '●' : '○'}</span>
              This person is my partner
            </button>

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
        ) : friends.length > 0 ? (
          <button className={styles.addPersonBtn} onClick={() => setShowForm(true)}>
            + Add someone
          </button>
        ) : null}
      </div>

      <CyclesIllustration />
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
          <circle cx={x} cy={y} r={r} fill={`url(#ikGrad${i})`} />
          <circle cx={x} cy={y} r={r} fill="none" stroke={colors[i]} strokeWidth="0.8" opacity="0.35" />
          <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke={colors[i]} strokeWidth="0.4" opacity="0.15" strokeDasharray="2 3" />
        </g>
      ))}

      {/* Single breathing center dot */}
      <circle cx="130" cy="117" r="4" fill={userColor} opacity="0.6">
        <animate attributeName="r" values="3;8;3" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
      </circle>

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
      <circle cx="100" cy="90" r="70" fill="none" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.6" />

      {/* Sheng cycle — pentagon */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a1 = (-90 + i * 72) * (Math.PI / 180);
        const a2 = (-90 + ((i + 1) % 5) * 72) * (Math.PI / 180);
        const x1 = 100 + 65 * Math.cos(a1), y1 = 90 + 65 * Math.sin(a1);
        const x2 = 100 + 65 * Math.cos(a2), y2 = 90 + 65 * Math.sin(a2);
        return (
          <line key={`s-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={colors[i]} strokeWidth="0.6" opacity="0.35"
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
            style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="3 4" />
        );
      })}

      {/* Element points */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (-90 + i * 72) * (Math.PI / 180);
        const x = 100 + 65 * Math.cos(angle);
        const y = 90 + 65 * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill={`${colors[i]}15`} stroke={colors[i]} strokeWidth="0.7" opacity="0.6" />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
              fill={colors[i]} fontSize="7" fontWeight="300" opacity="0.7">
              {chars[i]}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx="100" cy="90" r="3"
        style={{ fill: 'var(--line-subtle)', animation: 'cyclePulse 6s ease-in-out infinite' }} />
    </svg>
  );
}
