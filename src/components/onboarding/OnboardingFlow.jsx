import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getZodiacAnimal } from '../../engine/zodiac';
import { getElement, getElementInfo } from '../../engine/elements';
import { getLifePhase } from '../../engine/lifePhase';
import { calculateAge } from '../../utils/dateUtils';
import GrainOverlay from '../common/GrainOverlay';
import GlowOrb from '../common/GlowOrb';
import styles from './OnboardingFlow.module.css';

const STEPS = ['welcome', 'birthdate', 'zodiac', 'element', 'gender', 'phase', 'horizons', 'ready'];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [stepIndex, setStepIndex] = useState(0);
  const [birthDate, setBirthDate] = useState({ year: 1990, month: 1, day: 1 });
  const [gender, setGender] = useState(null);
  const [direction, setDirection] = useState('forward');

  const step = STEPS[stepIndex];
  const zodiac = getZodiacAnimal(birthDate.year);
  const element = getElement(zodiac.animal);
  const elementInfo = getElementInfo(element);
  const age = calculateAge(birthDate.year, birthDate.month, birthDate.day);
  const phase = gender ? getLifePhase(age, gender) : null;

  const next = () => {
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => {
    setDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const finish = () => {
    completeOnboarding(birthDate, gender);
    navigate('/home');
  };

  const animClass = direction === 'forward' ? 'animate-fade-up' : 'animate-fade-in';

  return (
    <div className={styles.overlay}>
      <GlowOrb color={elementInfo?.hex ? `${elementInfo.hex}33` : 'rgba(58,111,160,0.12)'} size={500} top="-150px" left="-100px" />
      <GrainOverlay />

      <div className={styles.progress}>
        {STEPS.map((_, i) => (
          <div key={i} className={`${styles.dot} ${i <= stepIndex ? styles.dotActive : ''}`}
            style={i <= stepIndex ? { background: elementInfo?.hex || 'var(--text-muted)' } : {}}
          />
        ))}
      </div>

      <div className={styles.content} key={step}>
        {step === 'welcome' && (
          <div className={animClass}>
            <WelcomeIllustration className={styles.welcomeIllustration} />
            <h1 className={styles.title}>9 Lives</h1>
            <p className={styles.subtitle}>Five elements. Nine phases. The people who shape your life — across any moment in time.</p>
            <p className={styles.body}>An ancient map for you, your circle, and the days you walk through.</p>
            <div className={styles.actions}>
              <button className={styles.btn} onClick={next}>Begin</button>
            </div>
          </div>
        )}

        {step === 'birthdate' && (
          <div className={animClass}>
            <h2 className={styles.title}>When were you born?</h2>
            <p className={styles.subtitle}>Your birth year reveals your zodiac animal and elemental nature</p>
            <div className={styles.dateInputs}>
              <div className={styles.field}>
                <label>Year</label>
                <select value={birthDate.year} onChange={(e) => setBirthDate({ ...birthDate, year: +e.target.value })}>
                  {Array.from({ length: 107 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Month</label>
                <select value={birthDate.month} onChange={(e) => setBirthDate({ ...birthDate, month: +e.target.value })}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Day</label>
                <select value={birthDate.day} onChange={(e) => setBirthDate({ ...birthDate, day: +e.target.value })}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'zodiac' && (
          <div className={animClass}>
            <div className={styles.revealSymbol} style={{ color: elementInfo.hex }}>{zodiac.symbol}</div>
            <h2 className={styles.title}>The {zodiac.name}</h2>
            <p className={styles.subtitle}>{zodiac.trait}</p>
            <p className={styles.body}>Born in the year of the {zodiac.name}, you carry its spirit and temperament through all your phases of life.</p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Reveal Your Element</button>
            </div>
          </div>
        )}

        {step === 'element' && (
          <div className={animClass}>
            <div className={styles.revealSymbol} style={{ color: elementInfo.hex }}>
              {elementInfo.chinese}
            </div>
            <h2 className={styles.title} style={{ color: elementInfo.hex }}>{elementInfo.name}</h2>
            <p className={styles.subtitle}>{elementInfo.quality}</p>
            <p className={styles.body}>{elementInfo.description}</p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'gender' && (
          <div className={animClass}>
            <h2 className={styles.title}>Your Life Cycle</h2>
            <p className={styles.subtitle}>In TCM, life unfolds in different rhythms</p>
            <p className={styles.body}>Women move through 7-year cycles, men through 8-year cycles. This shapes when each life phase begins and ends.</p>
            <div className={styles.genderButtons}>
              <button
                className={`${styles.genderBtn} ${gender === 'female' ? styles.genderActive : ''}`}
                onClick={() => setGender('female')}
                style={gender === 'female' ? { borderColor: elementInfo.hex } : {}}
              >
                <span className={styles.genderLabel}>Feminine</span>
                <span className={styles.genderDetail}>7-year cycles</span>
              </button>
              <button
                className={`${styles.genderBtn} ${gender === 'male' ? styles.genderActive : ''}`}
                onClick={() => setGender('male')}
                style={gender === 'male' ? { borderColor: elementInfo.hex } : {}}
              >
                <span className={styles.genderLabel}>Masculine</span>
                <span className={styles.genderDetail}>8-year cycles</span>
              </button>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next} disabled={!gender}>Continue</button>
            </div>
          </div>
        )}

        {step === 'phase' && phase && (
          <div className={animClass}>
            <div className={styles.phaseNumber} style={{ color: getElementInfo(phase.element).hex }}>
              {phase.phase}
            </div>
            <h2 className={styles.title}>{phase.title}</h2>
            <p className={styles.subtitle} style={{ color: getElementInfo(phase.element).hex }}>
              {phase.season} — {getElementInfo(phase.element).name} Phase
            </p>
            <p className={styles.quote}>{phase.subtitle}</p>
            <p className={styles.body}>{phase.description}</p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {step === 'horizons' && (
          <div className={animClass}>
            <HorizonsIllustration userColor={elementInfo.hex} className={styles.welcomeIllustration} />
            <h2 className={styles.title}>Your circle, across time</h2>
            <p className={styles.subtitle}>
              You are not the only point on this map.
            </p>
            <p className={styles.body}>
              Add the people who shape your life — your mother, your partner, your child, your friend — and see how their elements move with yours. Step into any moment, past or future, and read the same wisdom for that day.
            </p>
            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={back}>Back</button>
              <button className={styles.btn} onClick={next}>See Your Dashboard</button>
            </div>
          </div>
        )}

        {step === 'ready' && (
          <div className={animClass}>
            <h2 className={styles.title}>Your journey begins</h2>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Animal</span>
                <span>{zodiac.symbol} {zodiac.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Element</span>
                <span style={{ color: elementInfo.hex }}>{elementInfo.chinese} {elementInfo.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Life Phase</span>
                <span>{phase?.phase} — {phase?.title}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Season</span>
                <span>{phase?.season}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btn} onClick={finish}>Enter 9 Lives</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HorizonsIllustration({ userColor, className }) {
  // A small constellation (you + 3 satellites) drifting across a subtle vertical time axis,
  // with a horizontal "now" line. Suggests both Relations (the orbs) and Time (the axes).
  const u = userColor || '#7a9ab5';
  const friendColors = ['#4a9e6e', '#c9a84c', '#a8b8c8']; // wood, earth, metal
  const cx = 120, cy = 100, r = 55;

  // Three friend orbs at radial positions
  const friends = [0, 1, 2].map((i) => {
    const angle = (-90 + (i * 360) / 3 + 30) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), color: friendColors[i] };
  });

  return (
    <svg viewBox="0 0 240 200" className={className}>
      <style>{`
        @keyframes horizonOrbDrift1 { 0%, 100% { transform: translate(0, 1.5px); } 50% { transform: translate(0, -1.5px); } }
        @keyframes horizonOrbDrift2 { 0%, 100% { transform: translate(1.5px, 0); } 50% { transform: translate(-1.5px, 0); } }
        @keyframes horizonOrbDrift3 { 0%, 100% { transform: translate(-1px, 1px); } 50% { transform: translate(1px, -1px); } }
        @keyframes horizonNowPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
      `}</style>

      {/* Vertical time axis — past below, future above */}
      <line x1={cx} y1="10" x2={cx} y2="190" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 5" />
      <text x={cx} y="8" textAnchor="middle" style={{ fill: 'var(--text-illustration-dim)' }} fontSize="6.5" fontFamily="var(--font-display)" fontStyle="italic">future</text>
      <text x={cx} y="196" textAnchor="middle" style={{ fill: 'var(--text-illustration-dim)' }} fontSize="6.5" fontFamily="var(--font-display)" fontStyle="italic">past</text>

      {/* Horizontal now line */}
      <line x1="20" y1={cy} x2="220" y2={cy}
        style={{ stroke: 'var(--line-subtle)', animation: 'horizonNowPulse 6s ease-in-out infinite' }}
        strokeWidth="0.6" strokeDasharray="2 4" />
      <text x="220" y={cy - 4} textAnchor="end" style={{ fill: 'var(--text-illustration-dim)' }} fontSize="6.5" fontFamily="var(--font-display)" fontStyle="italic">now</text>

      {/* Outer constellation ring */}
      <circle cx={cx} cy={cy} r={r + 14} fill="none" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 5" />
      <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />

      {/* Connection lines from user to each friend */}
      {friends.map((f, i) => (
        <line key={`l-${i}`} x1={cx} y1={cy} x2={f.x} y2={f.y}
          stroke={f.color} strokeWidth="0.5" opacity="0.3" />
      ))}

      {/* User at center */}
      <circle cx={cx} cy={cy} r="20" fill={u} opacity="0.18">
        <animate attributeName="r" values="18;26;18" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0.18;0.04;0.18" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
      </circle>
      <circle cx={cx} cy={cy} r="14" fill={`${u}25`} stroke={u} strokeWidth="0.9" opacity="0.85" />
      <circle cx={cx} cy={cy} r="3" fill={u} opacity="0.7" />

      {/* Friend orbs with subtle drift */}
      {friends.map((f, i) => {
        const animName = ['horizonOrbDrift1', 'horizonOrbDrift2', 'horizonOrbDrift3'][i];
        return (
          <g key={`orb-${i}`} style={{ animation: `${animName} ${10 + i * 1.5}s ease-in-out infinite` }}>
            <circle cx={f.x} cy={f.y} r="11" fill={`${f.color}18`} stroke={f.color} strokeWidth="0.7" opacity="0.7" />
            <circle cx={f.x} cy={f.y} r="2" fill={f.color} opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

function WelcomeIllustration({ className }) {
  const colors = ['#4a9e6e', '#c75a3a', '#c9a84c', '#a8b8c8', '#3a6fa0'];
  const chars = ['木', '火', '土', '金', '水'];

  return (
    <svg viewBox="0 0 240 200" className={className}>
      <defs>
        {colors.map((color, i) => (
          <radialGradient key={`g${i}`} id={`elGlow${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Outer circle — the cycle of life */}
      <circle cx="120" cy="100" r="88" fill="none" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />

      {/* Five element points with glowing halos */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (-90 + i * 72) * (Math.PI / 180);
        const x = 120 + 88 * Math.cos(angle);
        const y = 100 + 88 * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="16" fill={`url(#elGlow${i})`} />
            <circle cx={x} cy={y} r="6" fill="none" stroke={colors[i]} strokeWidth="0.8" opacity="0.6" />
            <circle cx={x} cy={y} r="2.5" fill={colors[i]} opacity="0.35" />
            <text
              x={x} y={y + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors[i]}
              fontSize="5"
              fontWeight="300"
              opacity="0.7"
            >
              {chars[i]}
            </text>
          </g>
        );
      })}

      {/* Sheng cycle — pentagon connecting elements */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a1 = (-90 + i * 72) * (Math.PI / 180);
        const a2 = (-90 + ((i + 1) % 5) * 72) * (Math.PI / 180);
        return (
          <line key={`sh-${i}`}
            x1={120 + 88 * Math.cos(a1)} y1={100 + 88 * Math.sin(a1)}
            x2={120 + 88 * Math.cos(a2)} y2={100 + 88 * Math.sin(a2)}
            style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />
        );
      })}

      {/* Ke cycle — star pattern */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a1 = (-90 + i * 72) * (Math.PI / 180);
        const a2 = (-90 + ((i + 2) % 5) * 72) * (Math.PI / 180);
        return (
          <line key={`ke-${i}`}
            x1={120 + 88 * Math.cos(a1)} y1={100 + 88 * Math.sin(a1)}
            x2={120 + 88 * Math.cos(a2)} y2={100 + 88 * Math.sin(a2)}
            style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="3 4" />
        );
      })}

      {/* Middle ring — the 9 lives */}
      <circle cx="120" cy="100" r="55" fill="none" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="2 3" />

      {/* Nine life dots */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (-90 + i * 40) * (Math.PI / 180);
        const x = 120 + 55 * Math.cos(angle);
        const y = 100 + 55 * Math.sin(angle);
        return <circle key={`l-${i}`} cx={x} cy={y} r="2" style={{ fill: 'var(--dot-illustration)' }} />;
      })}

      {/* Inner ring */}
      <circle cx="120" cy="100" r="30" fill="none" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" />

      {/* Center — the self */}
      <circle cx="120" cy="100" r="8" fill="none" style={{ stroke: 'var(--line-medium)' }} strokeWidth="0.5" />
      <circle cx="120" cy="100" r="3" style={{ fill: 'var(--text-illustration-dim)' }} />

      {/* Vertical axis — heaven and earth */}
      <line x1="120" y1="5" x2="120" y2="195" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 4" />
    </svg>
  );
}
