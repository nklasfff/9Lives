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

// Role taxonomy from the book's "Dig i midten" — five petals plus a catch-all
const ROLES = [
  { id: 'partner',  label: 'Partner',  petal: 'partner'  },
  { id: 'mother',   label: 'Mother',   petal: 'parents'  },
  { id: 'father',   label: 'Father',   petal: 'parents'  },
  { id: 'child',    label: 'Child',    petal: 'children' },
  { id: 'sibling',  label: 'Sibling',  petal: 'siblings' },
  { id: 'friend',   label: 'Friend',   petal: 'friends'  },
  { id: 'other',    label: 'Other',    petal: 'friends'  },
];
const ROLE_ORDER = { partner: 0, mother: 1, father: 2, child: 3, sibling: 4, friend: 5, other: 6 };
const ROLE_BY_ID = Object.fromEntries(ROLES.map(r => [r.id, r]));

// Migration: existing friends saved before roles existed had `isPartner: bool`
function withRole(f) {
  if (f.relationship) return f;
  return { ...f, relationship: f.isPartner ? 'partner' : 'friend' };
}

// "To rytmer" — age-band insight from the book's couple-through-the-years chapter
function getTwoRhythmsInsight(userAge, partnerAge) {
  const lo = Math.min(userAge, partnerAge);
  const hi = Math.max(userAge, partnerAge);
  if (hi < 30) return 'Peak years for both of you. The rhythms have not yet pulled apart in any way you can feel — but they are already there, waiting under the surface.';
  if (hi < 38)  return 'One of you begins to feel something tighten in the body — a sense that time is asking a question. The other may not feel the pull yet. Neither of you is wrong.';
  if (hi < 44)  return 'One of you starts to simplify what once mattered; the other may be more ambitious than ever. You are moving in opposite directions for a while — and it is biological, not personal.';
  if (hi < 50)  return 'Clarity is cutting through one of you while the other is still some years from their own turn. The one who is through can offer the patience they once needed.';
  if (lo < 56)  return 'The daily logistics that held everything together begin to thin. The couples who have kept their own rituals through the busy years find a quiet they can return to.';
  return 'Both of you have crossed the great turn. There is a new ease here that only comes after the asymmetric years are spent.';
}

// "Slægten" — chain wording when the user is between parent + child
function getLineageText(parentName, childName) {
  return `You stand in the middle of a chain. What ${parentName} carried and gave you, you carry forward to ${childName}. Three lives, one line.`;
}

export default function RelationsPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [friends, setFriends] = useState(() => loadFriends().map(withRole));
  const [constellations, setConstellations] = useState(() => loadConstellations());
  const [showForm, setShowForm] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [formData, setFormData] = useState({ name: '', year: 1990, gender: null, relationship: 'friend' });

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
    // Only one partner at a time — if a new partner is added, demote any existing partner to "other"
    const baseFriends = formData.relationship === 'partner'
      ? friends.map(f => f.relationship === 'partner' ? { ...f, relationship: 'other' } : f)
      : friends;
    const newFriend = {
      id: Date.now().toString(),
      name: formData.name,
      birthYear: formData.year,
      gender: formData.gender,
      relationship: formData.relationship,
      zodiacAnimal: zodiac.animal,
      zodiacSymbol: zodiac.symbol,
      zodiacName: zodiac.name,
      element,
      phase: phase.phase,
      phaseTitle: phase.title,
    };
    setFriends([...baseFriends, newFriend]);
    setFormData({ name: '', year: 1990, gender: null, relationship: 'friend' });
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
    const cycleForskydning = friend.relationship === 'partner' && userCycle !== partnerCycle
      ? `Your ${userCycle}-year cycles meet ${partnerCycle}-year cycles — a small difference that grows over the years, hitting precisely where the big choices ask to be made.`
      : null;
    return { friend, friendEl, friendAge, friendPhase, userPhaseEl, friendPhaseEl, constitutionalRel, seasonRel, cycleForskydning };
  });

  // Sort by role priority so the field reads naturally: partner → parents → children → siblings → friends
  const sortedInsights = [...friendInsights].sort(
    (a, b) => (ROLE_ORDER[a.friend.relationship] ?? 99) - (ROLE_ORDER[b.friend.relationship] ?? 99)
  );

  // Build the petals for the Flower hero — one petal per role group, aware of who is in it
  const petalGroups = [
    { id: 'partner',  label: 'Partner',  members: friendInsights.filter(fi => fi.friend.relationship === 'partner') },
    { id: 'parents',  label: 'Parents',  members: friendInsights.filter(fi => ['mother', 'father'].includes(fi.friend.relationship)) },
    { id: 'children', label: 'Children', members: friendInsights.filter(fi => fi.friend.relationship === 'child') },
    { id: 'siblings', label: 'Siblings', members: friendInsights.filter(fi => fi.friend.relationship === 'sibling') },
    { id: 'friends',  label: 'Friends',  members: friendInsights.filter(fi => ['friend', 'other'].includes(fi.friend.relationship)) },
  ];

  // Adaptive narrative flags — each card lights up only when the constellation actually has the shape
  const partnerInsight = friendInsights.find(fi => fi.friend.relationship === 'partner');
  const hasParent = friendInsights.some(fi => ['mother', 'father'].includes(fi.friend.relationship));
  const hasChild = friendInsights.some(fi => fi.friend.relationship === 'child');
  const friendCircle = friendInsights.filter(fi => fi.friend.relationship === 'friend');
  const hasGenerationsTrinity = hasParent && hasChild;

  // Generational spread — surface the trinity when phases span at least 4 steps
  const allPhases = [data.phase.phase, ...friendInsights.map(fi => fi.friendPhase.phase)];
  const phaseSpread = friends.length >= 2 ? Math.max(...allPhases) - Math.min(...allPhases) : 0;
  const isWideGenerationalSpread = phaseSpread >= 4;

  // Group field quote varies by configuration (in the spirit of the source book)
  const groupFieldQuote = hasGenerationsTrinity || isWideGenerationalSpread
    ? 'Three lives, three seasons of the same arc — what one is just beginning, another has already let go.'
    : partnerInsight
      ? 'Two rhythms in one home, and the others who orbit it. The whole field moves together — even when you cannot feel it.'
      : 'Several lives in the same field. Where one element flows into another, where two seasons meet — the whole shape of you, together.';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Relations</h1>
        <p className={styles.subtitle}>What happens when your season meets theirs</p>
      </header>

      <FlowerIllustration userColor={userEl.hex} petalGroups={petalGroups} />

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

            {sortedInsights.map((fi) => {
              const role = ROLE_BY_ID[fi.friend.relationship] || ROLE_BY_ID.friend;
              const showBadge = fi.friend.relationship && fi.friend.relationship !== 'friend';
              return (
              <GlassCard key={fi.friend.id} glowColor={`${fi.friendEl.hex}15`}>
                <div className={styles.friendHeader}>
                  <div className={styles.friendIdentity}>
                    <span className={styles.friendSymbol} style={{ color: fi.friendEl.hex }}>
                      {fi.friendEl.chinese}
                    </span>
                    <div>
                      <div className={styles.friendNameRow}>
                        <h3 className={styles.friendName}>{fi.friend.name}</h3>
                        {showBadge && (
                          <span className={styles.roleBadge} style={{ borderColor: `${fi.friendEl.hex}55`, color: fi.friendEl.hex }}>
                            {role.label.toLowerCase()}
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
              );
            })}
          </div>
        )}

        {/* ─── Adaptive narrative cards — only the ones your constellation actually has ─── */}

        {/* To rytmer — appears when there is a partner. The book's most distinctive insight. */}
        {partnerInsight && (
          <GlassCard glowColor={`${userEl.hex}10`}>
            <span className={styles.narrativeLabel}>To rytmer · The two-rhythm thread</span>
            <h3 className={styles.narrativeTitle}>Where you both stand right now</h3>
            <div className={styles.rhythmRow}>
              <div className={styles.rhythmSide}>
                <span className={styles.rhythmAge}>{data.age}</span>
                <span className={styles.rhythmCycle}>{data.gender === 'female' ? '7-year cycle' : '8-year cycle'}</span>
                <span className={styles.rhythmName}>You</span>
              </div>
              <span className={styles.rhythmBridge}>·</span>
              <div className={styles.rhythmSide}>
                <span className={styles.rhythmAge}>{partnerInsight.friendAge}</span>
                <span className={styles.rhythmCycle}>{partnerInsight.friend.gender === 'female' ? '7-year cycle' : '8-year cycle'}</span>
                <span className={styles.rhythmName}>{partnerInsight.friend.name}</span>
              </div>
            </div>
            <p className={styles.narrativeBody}>{getTwoRhythmsInsight(data.age, partnerInsight.friendAge)}</p>
          </GlassCard>
        )}

        {/* Slægten — appears only when both a parent and a child are in your field */}
        {hasGenerationsTrinity && (() => {
          const parent = friendInsights.find(fi => ['mother', 'father'].includes(fi.friend.relationship));
          const child = friendInsights.find(fi => fi.friend.relationship === 'child');
          return (
            <GlassCard glowColor={`${userEl.hex}10`}>
              <span className={styles.narrativeLabel}>Slægten · The chain through you</span>
              <h3 className={styles.narrativeTitle}>You in the middle</h3>
              <div className={styles.lineageRow}>
                <div className={styles.lineageNode}>
                  <span className={styles.lineageChinese} style={{ color: parent.friendEl.hex }}>{parent.friendEl.chinese}</span>
                  <span className={styles.lineageName}>{parent.friend.name}</span>
                </div>
                <span className={styles.lineageArrow}>→</span>
                <div className={styles.lineageNode}>
                  <span className={styles.lineageChinese} style={{ color: userEl.hex }}>{userEl.chinese}</span>
                  <span className={styles.lineageName}>You</span>
                </div>
                <span className={styles.lineageArrow}>→</span>
                <div className={styles.lineageNode}>
                  <span className={styles.lineageChinese} style={{ color: child.friendEl.hex }}>{child.friendEl.chinese}</span>
                  <span className={styles.lineageName}>{child.friend.name}</span>
                </div>
              </div>
              <p className={styles.narrativeBody}>{getLineageText(parent.friend.name, child.friend.name)}</p>
            </GlassCard>
          );
        })()}

        {/* Den valgte familie — appears when there are 2+ friends in the chosen-family sense */}
        {friendCircle.length >= 2 && (
          <GlassCard glowColor={`${userEl.hex}10`}>
            <span className={styles.narrativeLabel}>Den valgte familie · The chosen family</span>
            <h3 className={styles.narrativeTitle}>Friendships across phases</h3>
            <p className={styles.narrativeBody}>
              No biology to argue over — only the freedom to keep meeting each other as you both change. {friendCircle.length} friends in your field, each in their own season of the same arc.
            </p>
          </GlassCard>
        )}

        {/* Group field — single CTA card, evocative quote varies by configuration */}
        {friends.length >= 2 && (
          <GlassCard
            glowColor={`${userEl.hex}12`}
            className={styles.groupCard}
            onClick={() => navigate('/relations/group')}
          >
            {(hasGenerationsTrinity || isWideGenerationalSpread) && (
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

            <div className={styles.formField}>
              <label>Their place in your field</label>
              <div className={styles.roleGrid}>
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    className={`${styles.roleBtn} ${formData.relationship === r.id ? styles.roleBtnActive : ''}`}
                    onClick={() => setFormData({ ...formData, relationship: r.id })}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => { setShowForm(false); setFormData({ name: '', year: 1990, gender: null, relationship: 'friend' }); }}>Cancel</button>
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

      <RhythmsIllustration userColor={userEl.hex} userGender={data.gender} friendInsights={friendInsights} />
    </div>
  );
}

function FlowerIllustration({ userColor, petalGroups }) {
  // The book's flower diagram — DIG I MIDTEN. Five petals around the user, lit by who is in each one.
  const cx = 150, cy = 150;
  const petalDist = 60;     // distance from center to petal center
  const petalRx = 46;       // petal width
  const petalRy = 32;       // petal height (ellipse)

  // Five petals at 72° around, top petal pointing up. Order chosen so family-of-origin sits on top half.
  const layout = [
    { id: 'partner',  angle: -90  },   // top
    { id: 'parents',  angle: -18  },   // upper-right
    { id: 'children', angle:  54  },   // lower-right
    { id: 'siblings', angle: 126  },   // lower-left
    { id: 'friends',  angle: -162 },   // upper-left (i.e. 198°)
  ];

  // Map our role groups by id for fast lookup
  const groupById = Object.fromEntries(petalGroups.map(g => [g.id, g]));

  return (
    <svg viewBox="0 0 300 300" className={styles.heroIllustration}>
      <style>{`
        @keyframes flowerBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
        @keyframes flowerCenterPulse {
          0%, 100% { r: 4; opacity: 0.7; }
          50% { r: 7; opacity: 0.35; }
        }
        @keyframes flowerHalo {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.18; }
        }
      `}</style>

      <defs>
        {layout.map(({ id }) => {
          const group = groupById[id];
          const occupied = group && group.members.length > 0;
          const color = occupied ? group.members[0].friendEl.hex : '#888';
          return (
            <radialGradient key={`flGrad-${id}`} id={`flGrad-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor={color} stopOpacity={occupied ? 0.32 : 0.04} />
              <stop offset="60%" stopColor={color} stopOpacity={occupied ? 0.10 : 0.02} />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {/* Outer halo around the whole flower — gives it presence */}
      <circle cx={cx} cy={cy} r="118" fill="none"
        strokeWidth="0.6" strokeDasharray="1 6"
        style={{ stroke: 'var(--line-faint)', animation: 'flowerHalo 9s ease-in-out infinite' }} />

      {/* Petals */}
      {layout.map(({ id, angle }, i) => {
        const group = groupById[id];
        const occupied = group && group.members.length > 0;
        const count = group ? group.members.length : 0;
        const a = (angle * Math.PI) / 180;
        const px = cx + petalDist * Math.cos(a);
        const py = cy + petalDist * Math.sin(a);
        const color = occupied ? group.members[0].friendEl.hex : '#888';
        const labelDist = petalDist + petalRx + 12;
        const lx = cx + labelDist * Math.cos(a);
        const ly = cy + labelDist * Math.sin(a);
        const anchor = Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle';

        return (
          <g key={id}>
            {/* Outer wrapper: rotate the petal so its long axis points radially outward */}
            <g style={{
              transform: `rotate(${angle + 90}deg)`,
              transformOrigin: `${px}px ${py}px`,
            }}>
              {/* Inner wrapper: subtle breathing scale, separate from rotation */}
              <g style={{
                transformOrigin: `${px}px ${py}px`,
                animation: occupied ? `flowerBreathe ${10 + i * 1.4}s ease-in-out infinite` : 'none',
              }}>
                <ellipse cx={px} cy={py} rx={petalRx} ry={petalRy}
                  fill={`url(#flGrad-${id})`} />
                <ellipse cx={px} cy={py} rx={petalRx} ry={petalRy}
                  fill="none" stroke={color} strokeWidth="0.7"
                  opacity={occupied ? 0.55 : 0.18} />
                <ellipse cx={px} cy={py} rx={petalRx * 0.55} ry={petalRy * 0.55}
                  fill="none" stroke={color} strokeWidth="0.4"
                  opacity={occupied ? 0.25 : 0.08} strokeDasharray="2 3" />
              </g>
            </g>

            {/* Member dots inside each petal — one tiny dot per person, in their element color */}
            {occupied && group.members.map((m, mi) => {
              const offset = (mi - (count - 1) / 2) * 8;
              const ox = Math.cos(a + Math.PI / 2) * offset;
              const oy = Math.sin(a + Math.PI / 2) * offset;
              return (
                <circle key={`m-${id}-${mi}`}
                  cx={px + ox} cy={py + oy} r="2.2"
                  fill={m.friendEl.hex} opacity="0.85"
                />
              );
            })}

            {/* Petal label */}
            <text x={lx} y={ly}
              textAnchor={anchor} dominantBaseline="central"
              fontSize="8"
              fontFamily="var(--font-display)"
              fontStyle="italic"
              fontWeight="300"
              opacity={occupied ? 0.85 : 0.4}
              style={{ fill: occupied ? color : 'var(--text-muted)' }}
            >
              {group ? group.label : id}
              {count > 1 ? ` · ${count}` : ''}
            </text>
          </g>
        );
      })}

      {/* Center — you */}
      <circle cx={cx} cy={cy} r="14" fill={userColor} opacity="0.08" />
      <circle cx={cx} cy={cy} r="5" fill={userColor} opacity="0.7"
        style={{ animation: 'flowerCenterPulse 6s ease-in-out infinite' }} />
    </svg>
  );
}

function RhythmsIllustration({ userColor, userGender, friendInsights }) {
  // Concentric drifting tracks — the book's deepest insight: hver krop tikker i sin egen rytme.
  // Each ring is one rhythm; a small "ticker" sweeps it at the cycle's own pace.
  const cx = 110, cy = 110;
  const userCycle = userGender === 'female' ? 7 : 8;

  // User in the center, then up to 4 people as outward rings (so it stays calm)
  const rings = [
    { r: 28, label: `${userCycle}`, color: userColor, durSec: userCycle * 8 },
    ...friendInsights.slice(0, 4).map((fi, i) => ({
      r: 44 + i * 14,
      label: `${fi.friend.gender === 'female' ? 7 : 8}`,
      color: fi.friendEl.hex,
      durSec: (fi.friend.gender === 'female' ? 7 : 8) * 8,
      offset: i * 17,
    })),
  ];

  return (
    <svg viewBox="0 0 220 220" className={styles.cyclesIllustration}>
      <style>{`
        @keyframes rhythmTick { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rhythmBreathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.55; } }
      `}</style>

      {/* Concentric tracks — one per rhythm */}
      {rings.map((ring, i) => (
        <g key={`ring-${i}`}>
          <circle cx={cx} cy={cy} r={ring.r}
            fill="none" stroke={ring.color}
            strokeWidth="0.6" opacity="0.25"
            strokeDasharray={i === 0 ? 'none' : '2 5'}
          />
          {/* Ticker — small dot orbiting at the rhythm's own pace */}
          <g style={{
            transform: `rotate(${ring.offset || 0}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            animation: `rhythmTick ${ring.durSec}s linear infinite`,
          }}>
            <circle cx={cx + ring.r} cy={cy} r="2.4"
              fill={ring.color} opacity="0.75"
            />
          </g>
        </g>
      ))}

      {/* Center: you */}
      <circle cx={cx} cy={cy} r="8" fill={userColor} opacity="0.1" />
      <circle cx={cx} cy={cy} r="3" fill={userColor} opacity="0.7"
        style={{ animation: 'rhythmBreathe 6s ease-in-out infinite' }} />

      {/* Caption */}
      <text x={cx} y={cy + 100}
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="300"
        opacity="0.55"
        style={{ fill: 'var(--text-muted)' }}
      >
        Each life ticks in its own rhythm
      </text>
    </svg>
  );
}
