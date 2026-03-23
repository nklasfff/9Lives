import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getPhaseDeep } from '../engine/phaseDeep';
import { getAllPhases } from '../engine/lifePhase';
import GlassCard from '../components/common/GlassCard';
import styles from './PhaseDeepPage.module.css';

function Expandable({ title, children, glowColor, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlassCard glowColor={glowColor} onClick={() => setOpen(!open)} className={styles.expandable}>
      <div className={styles.expandHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <span className={styles.expandIcon}>{open ? '−' : '+'}</span>
      </div>
      {open && <div className={styles.expandContent}>{children}</div>}
    </GlassCard>
  );
}

export default function PhaseDeepPage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const phaseNum = parseInt(phaseId);
  const deep = getPhaseDeep(phaseNum);

  if (!data || !deep) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/explore/phases')}>Back</button>
        <div className={styles.comingSoon}>
          <h2>Phase {phaseNum}</h2>
          <p>Deep content for this phase is coming soon.</p>
        </div>
      </div>
    );
  }

  const el = getElementInfo(deep.element);
  const isCurrentPhase = data.phase.phase === phaseNum;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore/phases')}>Back</button>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.phaseLabel}>Phase {phaseNum} · {deep.ageRange}</span>
        <h1 className={styles.title} style={{ color: el.hex }}>{deep.title}</h1>
        <p className={styles.subtitle}>{deep.subtitle}</p>
        {isCurrentPhase && (
          <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
            You are here
          </span>
        )}
      </header>

      <PhaseElementIllustration element={deep.element} />

      {/* Transition — always open (the hook) */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.transition.title}</h2>
        <p className={styles.body}>{deep.transition.body}</p>
        <p className={styles.body}>{deep.transition.detail}</p>
      </GlassCard>

      {/* Personal quote — always open */}
      <GlassCard glowColor={`${el.hex}12`}>
        <p className={styles.quoteIntro}>{deep.personal.title}</p>
        <blockquote className={styles.quote} style={{ borderColor: `${el.hex}40` }}>
          {deep.personal.quote}
        </blockquote>
        <p className={styles.quoteReflection}>{deep.personal.reflection}</p>
      </GlassCard>

      {/* Element info bar — always open (compact) */}
      <GlassCard className={styles.elementBar}>
        <div className={styles.elementGrid}>
          <ElementDetail label="Element" value={el.name} symbol={el.chinese} color={el.hex} />
          <ElementDetail label="Organs" value={`${el.organs.yin} & ${el.organs.yang}`} />
          <ElementDetail label="Sense" value={`${el.sense} (${el.senseOrgan})`} />
          <ElementDetail label="Tissue" value={el.tissue} />
          <ElementDetail label="Season" value={deep.season} />
          <ElementDetail label="Balanced" value={el.emotion.balanced} color={el.hex} />
          <ElementDetail label="Imbalanced" value={el.emotion.imbalanced} />
        </div>
      </GlassCard>

      <BreathIllustration color={el.hex} />

      {/* Collapsible sections */}
      <Expandable title={deep.bodyInBalance.title}>
        <p className={styles.body}>{deep.bodyInBalance.body}</p>
      </Expandable>

      <Expandable title={deep.bodyImbalanced.title}>
        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Physical signs</h3>
          {deep.bodyImbalanced.physical.map((item, i) => (
            <p key={i} className={styles.listItem}>· {item}</p>
          ))}
        </div>
        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Emotional signs</h3>
          {deep.bodyImbalanced.emotional.map((item, i) => (
            <p key={i} className={styles.listItem}>· {item}</p>
          ))}
        </div>
      </Expandable>

      <Expandable title={deep.emotion.title} glowColor={`${el.hex}10`}>
        <p className={styles.body}>{deep.emotion.body}</p>
        <p className={styles.body}>{deep.emotion.grief}</p>
        <p className={styles.bodyAccent}>{deep.emotion.gift}</p>
      </Expandable>

      {deep.menopause && (
        <Expandable title={deep.menopause.title}>
          <p className={styles.body}>{deep.menopause.body}</p>
          <p className={styles.body}>{deep.menopause.gift}</p>
          <p className={styles.bodyAccent}>{deep.menopause.wisdom}</p>
        </Expandable>
      )}

      <LeavesIllustration color={el.hex} />

      <ThemesIllustration color={el.hex} element={deep.element} />

      {/* Themes — each collapsible */}
      <h2 className={styles.themesTitle}>Themes in the {deep.title} Years</h2>
      {deep.themes.map((theme, i) => (
        <Expandable key={i} title={theme.title}>
          <p className={styles.body}>{theme.body}</p>
        </Expandable>
      ))}

      <OrganFlowIllustration color={el.hex} yinOrgan={el.organs.yin} yangOrgan={el.organs.yang} />

      <Expandable title="Guidance for This Phase">
        <div className={styles.adviceList}>
          {deep.advice.map((item, i) => (
            <div key={i} className={styles.adviceItem}>
              <h3 className={styles.adviceTitle}>{item.title}</h3>
              <p className={styles.adviceBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </Expandable>

      <Expandable title="Exercises">
        <div className={styles.exerciseList}>
          {deep.exercises.map((ex, i) => (
            <div key={i} className={styles.exerciseItem}>
              <span className={styles.exerciseNum}>{i + 1}</span>
              <div>
                <h3 className={styles.exerciseTitle}>{ex.title}</h3>
                <p className={styles.body}>{ex.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Expandable>

      <Expandable title={deep.diet.title}>
        <p className={styles.body}>{deep.diet.intro}</p>
        <div className={styles.dietList}>
          {deep.diet.foods.map((food, i) => (
            <div key={i} className={styles.dietItem}>
              <h3 className={styles.dietCategory}>{food.category}</h3>
              <p className={styles.body}>{food.items}</p>
            </div>
          ))}
        </div>
      </Expandable>

      <SeasonsIllustration color={el.hex} />

      <Expandable title={deep.seasons.title}>
        <div className={styles.seasonList}>
          {deep.seasons.entries.map((s, i) => (
            <div key={i} className={styles.seasonItem}>
              <span className={styles.seasonName} style={{ color: el.hex }}>{s.season}</span>
              <p className={styles.seasonBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </Expandable>

      <ReflectionIllustration color={el.hex} />

      {/* Reflections — always open (the closing) */}
      <GlassCard glowColor={`${el.hex}15`}>
        <h2 className={styles.sectionTitle}>Reflection</h2>
        <div className={styles.reflectionList}>
          {deep.reflections.map((r, i) => (
            <p key={i} className={styles.reflectionItem}>{r}</p>
          ))}
        </div>
        <p className={styles.reflectionNote}>You don't need to act on these yet. Just let the questions be there.</p>
      </GlassCard>

      <Expandable title={deep.transitionNext.title}>
        <p className={styles.body}>{deep.transitionNext.body}</p>
        <p className={styles.bodyAccent}>{deep.transitionNext.next}</p>
      </Expandable>

      {/* Back to top */}
      <button className={styles.topBtn} onClick={scrollToTop}>
        ↑ Back to top
      </button>
    </div>
  );
}

function ElementDetail({ label, value, symbol, color }) {
  return (
    <div className={styles.elDetail}>
      <span className={styles.elLabel}>{label}</span>
      <span className={styles.elValue} style={color ? { color } : {}}>
        {symbol && <span className={styles.elSymbol}>{symbol}</span>} {value}
      </span>
    </div>
  );
}

/* === Illustrations === */

function PhaseElementIllustration({ element }) {
  const el = getElementInfo(element);
  return (
    <svg viewBox="0 0 200 150" className={styles.heroIllustration}>
      <style>{`
        @keyframes phaseBreathe { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.3; } }
        @keyframes phaseRing { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.45; } }
      `}</style>
      <circle cx="100" cy="75" r="55" fill={el.hex} opacity="0.08"
        style={{ animation: 'phaseBreathe 10s ease-in-out infinite' }} />
      <circle cx="100" cy="75" r="42" fill="none" stroke={el.hex} strokeWidth="0.8" opacity="0.4"
        style={{ animation: 'phaseRing 8s ease-in-out infinite' }} />
      <circle cx="100" cy="75" r="55" fill="none" stroke={el.hex} strokeWidth="0.4" opacity="0.2" strokeDasharray="3 5" />
      <text x="100" y="80" textAnchor="middle" dominantBaseline="central"
        fill={el.hex} fontSize="32" fontWeight="300" opacity="0.75">
        {el.chinese}
      </text>
    </svg>
  );
}

function BreathIllustration({ color }) {
  return (
    <svg viewBox="0 0 220 50" className={styles.illustration}>
      <style>{`@keyframes breathDot { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.7; } }`}</style>
      <path d="M 10 25 Q 35 8 60 25 Q 85 42 110 25 Q 135 8 160 25 Q 185 42 210 25"
        fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M 10 25 Q 35 42 60 25 Q 85 8 110 25 Q 135 42 160 25 Q 185 8 210 25"
        fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
      {[35, 85, 135, 185].map((x, i) => (
        <circle key={i} cx={x} cy="25" r="2.5" fill={color} opacity="0.35"
          style={{ animation: `breathDot ${5 + i}s ease-in-out ${i * 1.2}s infinite` }} />
      ))}
    </svg>
  );
}

function LeavesIllustration({ color }) {
  return (
    <svg viewBox="0 0 240 60" className={styles.illustration}>
      <style>{`
        @keyframes leafDrift { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; } 50% { transform: translateY(5px) rotate(8deg); opacity: 0.6; } }
      `}</style>
      {[25, 65, 105, 145, 185, 215].map((x, i) => {
        const y = 20 + (i % 3) * 10;
        const size = 7 + (i % 3) * 2;
        return (
          <g key={i} style={{ animation: `leafDrift ${5 + i * 0.8}s ease-in-out ${i * 0.6}s infinite`, transformOrigin: `${x}px ${y}px` }}>
            <ellipse cx={x} cy={y} rx={size} ry={size * 0.4} fill={color} opacity="0.25" transform={`rotate(${-20 + i * 15} ${x} ${y})`} />
            <line x1={x - size * 0.5} y1={y} x2={x + size * 0.5} y2={y} stroke={color} strokeWidth="0.5" opacity="0.35" transform={`rotate(${-20 + i * 15} ${x} ${y})`} />
          </g>
        );
      })}
    </svg>
  );
}

function ThemesIllustration({ color, element }) {
  if (element === 'water') {
    // Water: still lake with depth lines
    return (
      <svg viewBox="0 0 220 80" className={styles.illustration}>
        <style>{`
          @keyframes waterStill { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
          @keyframes waterDepth { 0%, 100% { opacity: 0.15; transform: scaleX(1); } 50% { opacity: 0.35; transform: scaleX(1.03); } }
        `}</style>
        {/* Horizontal depth lines — like a still lake */}
        {[25, 38, 50, 60].map((y, i) => (
          <line key={i} x1={40 + i * 8} y1={y} x2={180 - i * 8} y2={y}
            stroke={color} strokeWidth={0.8 - i * 0.1} opacity={0.4 - i * 0.08}
            style={{ animation: `waterDepth ${8 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`, transformOrigin: '110px 40px' }}
          />
        ))}
        {/* Surface reflection */}
        <ellipse cx="110" cy="20" rx="50" ry="3" fill="none" stroke={color} strokeWidth="0.6" opacity="0.35"
          style={{ animation: 'waterStill 7s ease-in-out infinite' }} />
        {/* Deep center dot */}
        <circle cx="110" cy="55" r="4" fill={color} opacity="0.3"
          style={{ animation: 'waterStill 6s ease-in-out infinite' }} />
        <circle cx="110" cy="55" r="8" fill="none" stroke={color} strokeWidth="0.4" opacity="0.15" />
      </svg>
    );
  }
  // Default: harvest/gathering motif (for metal/phase 7)
  return (
    <svg viewBox="0 0 220 80" className={styles.illustration}>
      <style>{`
        @keyframes themeGather { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
        @keyframes themePulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
      {[-40, -20, 0, 20, 40].map((offset, i) => (
        <path key={i}
          d={`M ${60 + offset * 0.5} 65 Q 110 ${15 + Math.abs(offset) * 0.3} ${160 - offset * 0.5} 65`}
          fill="none" stroke={color} strokeWidth="0.7" opacity="0.3"
          style={{ animation: `themeGather ${7 + i}s ease-in-out ${i * 0.6}s infinite` }}
        />
      ))}
      <circle cx="110" cy="35" r="8" fill={color} opacity="0.1"
        style={{ animation: 'themePulse 6s ease-in-out infinite' }} />
      <circle cx="110" cy="35" r="4" fill={color} opacity="0.25" />
      {[75, 90, 110, 130, 145].map((x, i) => (
        <circle key={`d${i}`} cx={x} cy={60 - (i % 2) * 5} r="2" fill={color} opacity="0.2"
          style={{ animation: `themePulse ${5 + i * 0.8}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </svg>
  );
}

function OrganFlowIllustration({ color, yinOrgan, yangOrgan }) {
  return (
    <svg viewBox="0 0 200 55" className={styles.illustration}>
      <style>{`@keyframes organPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.65; } }`}</style>
      <circle cx="70" cy="28" r="16" fill={color} opacity="0.06" />
      <circle cx="70" cy="28" r="16" fill="none" stroke={color} strokeWidth="0.8" opacity="0.45"
        style={{ animation: 'organPulse 6s ease-in-out infinite' }} />
      <text x="70" y="29" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="6" opacity="0.65" fontFamily="var(--font-display)" fontStyle="italic">{yinOrgan}</text>
      <line x1="86" y1="28" x2="114" y2="28" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="2 3" />
      <circle cx="130" cy="28" r="16" fill={color} opacity="0.06" />
      <circle cx="130" cy="28" r="16" fill="none" stroke={color} strokeWidth="0.8" opacity="0.45"
        style={{ animation: 'organPulse 6s ease-in-out 1.5s infinite' }} />
      <text x="130" y="29" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="6" opacity="0.65" fontFamily="var(--font-display)" fontStyle="italic">{yangOrgan}</text>
    </svg>
  );
}

function SeasonsIllustration({ color }) {
  const seasons = [
    { label: 'Spring', c: '#4a9e6e' },
    { label: 'Summer', c: '#c75a3a' },
    { label: 'Late Sum.', c: '#c9a84c' },
    { label: 'Autumn', c: '#a8b8c8' },
    { label: 'Winter', c: '#3a6fa0' },
  ];
  return (
    <svg viewBox="0 0 260 55" className={styles.illustration}>
      <style>{`@keyframes sDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }`}</style>
      {seasons.map((s, i) => {
        const x = 30 + i * 50;
        const isActive = s.c === color;
        return (
          <g key={i}>
            {i < 4 && <line x1={x + 12} y1="22" x2={x + 38} y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />}
            {isActive && <circle cx={x} cy="22" r="13" fill={s.c} opacity="0.1" />}
            <circle cx={x} cy="22" r={isActive ? '10' : '7'} fill="none" stroke={s.c}
              strokeWidth={isActive ? '1.2' : '0.7'} opacity={isActive ? '0.7' : '0.35'}
              style={{ animation: `sDot ${6 + i}s ease-in-out ${i * 0.5}s infinite` }} />
            <text x={x} y="40" textAnchor="middle" fill={s.c} fontSize="5.5" opacity={isActive ? '0.8' : '0.45'}
              fontFamily="var(--font-display)" fontStyle="italic">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ReflectionIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 60" className={styles.illustration}>
      <style>{`@keyframes ripple { 0% { r: 5; opacity: 0.5; } 100% { r: 45; opacity: 0; } }`}</style>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="100" cy="30" r="5" fill="none" stroke={color} strokeWidth="0.7"
          style={{ animation: `ripple 5s ease-out ${i * 1.7}s infinite` }} />
      ))}
      <circle cx="100" cy="30" r="4" fill={color} opacity="0.4" />
    </svg>
  );
}
