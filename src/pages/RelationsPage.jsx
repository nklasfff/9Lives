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

      <MergingCirclesIllustration userColor={userEl.hex} />

      <div className={styles.content}>
        {friends.length > 0 && (
          <div className={styles.friendsList}>
            {friends.map((friend) => {
              const friendEl = getElementInfo(friend.element);
              const rel = getRelationship(data.element, friend.element);
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
                </GlassCard>
              );
            })}
          </div>
        )}

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
    </div>
  );
}

function MergingCirclesIllustration({ userColor }) {
  return (
    <svg viewBox="0 0 240 120" className={styles.heroIllustration}>
      <style>{`
        @keyframes mergeLeft {
          0%, 100% { transform: translateX(8px); }
          50% { transform: translateX(-2px); }
        }
        @keyframes mergeRight {
          0%, 100% { transform: translateX(-8px); }
          50% { transform: translateX(2px); }
        }
        @keyframes vesicaAppear {
          0%, 20% { opacity: 0; }
          50% { opacity: 0.5; }
          80%, 100% { opacity: 0; }
        }
        @keyframes innerDotPulse {
          0%, 30% { opacity: 0; r: 2; }
          50% { opacity: 0.6; r: 3.5; }
          70%, 100% { opacity: 0; r: 2; }
        }
      `}</style>

      {/* Left circle — the user */}
      <g style={{ animation: 'mergeLeft 12s ease-in-out infinite' }}>
        <circle cx="95" cy="60" r="35" fill="none" stroke={userColor || '#c75a3a'} strokeWidth="0.8" opacity="0.4" />
        <circle cx="95" cy="60" r="20" fill="none" stroke={userColor || '#c75a3a'} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 3" />
      </g>

      {/* Right circle — the other */}
      <g style={{ animation: 'mergeRight 12s ease-in-out infinite' }}>
        <circle cx="145" cy="60" r="35" fill="none" stroke="#4a9e6e" strokeWidth="0.8" opacity="0.4" />
        <circle cx="145" cy="60" r="20" fill="none" stroke="#4a9e6e" strokeWidth="0.4" opacity="0.2" strokeDasharray="2 3" />
      </g>

      {/* Vesica piscis — the meeting place */}
      <ellipse cx="120" cy="60" rx="12" ry="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"
        style={{ animation: 'vesicaAppear 12s ease-in-out infinite' }} />

      {/* The new point that emerges */}
      <circle cx="120" cy="60" r="3" fill="rgba(255,255,255,0.3)"
        style={{ animation: 'innerDotPulse 12s ease-in-out infinite' }} />

      {/* Subtle connecting line */}
      <line x1="60" y1="60" x2="180" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 4" />
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
