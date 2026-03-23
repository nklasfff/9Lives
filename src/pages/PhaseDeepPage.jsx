import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getPhaseDeep } from '../engine/phaseDeep';
import { getAllPhases } from '../engine/lifePhase';
import GlassCard from '../components/common/GlassCard';
import styles from './PhaseDeepPage.module.css';

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
  const allPhases = getAllPhases(data.gender);
  const phase = allPhases[phaseNum - 1];

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

      {/* Transition into phase */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.transition.title}</h2>
        <p className={styles.body}>{deep.transition.body}</p>
        <p className={styles.body}>{deep.transition.detail}</p>
      </GlassCard>

      {/* Personal quote */}
      <GlassCard glowColor={`${el.hex}12`}>
        <p className={styles.quoteIntro}>{deep.personal.title}</p>
        <blockquote className={styles.quote} style={{ borderColor: `${el.hex}40` }}>
          {deep.personal.quote}
        </blockquote>
        <p className={styles.quoteReflection}>{deep.personal.reflection}</p>
      </GlassCard>

      {/* Element info bar */}
      <GlassCard className={styles.elementBar}>
        <div className={styles.elementGrid}>
          <ElementDetail label="Element" value={el.name} symbol={el.chinese} color={el.hex} />
          <ElementDetail label="Organs" value={`${el.organs.yin} & ${el.organs.yang}`} />
          <ElementDetail label="Sense" value={`${el.sense} (${el.senseOrgan})`} />
          <ElementDetail label="Tissue" value={el.tissue} />
          <ElementDetail label="Taste" value={el.taste} />
          <ElementDetail label="Season" value={deep.season} />
          <ElementDetail label="Balanced" value={el.emotion.balanced} color={el.hex} />
          <ElementDetail label="Imbalanced" value={el.emotion.imbalanced} />
        </div>
      </GlassCard>

      <BreathIllustration color={el.hex} />

      {/* Body in balance */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.bodyInBalance.title}</h2>
        <p className={styles.body}>{deep.bodyInBalance.body}</p>
      </GlassCard>

      {/* Body imbalanced */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.bodyImbalanced.title}</h2>
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
      </GlassCard>

      {/* Emotion */}
      <GlassCard glowColor={`${el.hex}10`}>
        <h2 className={styles.sectionTitle}>{deep.emotion.title}</h2>
        <p className={styles.body}>{deep.emotion.body}</p>
        <p className={styles.body}>{deep.emotion.grief}</p>
        <p className={styles.bodyAccent}>{deep.emotion.gift}</p>
      </GlassCard>

      {/* Menopause / phase-specific */}
      {deep.menopause && (
        <GlassCard>
          <h2 className={styles.sectionTitle}>{deep.menopause.title}</h2>
          <p className={styles.body}>{deep.menopause.body}</p>
          <p className={styles.body}>{deep.menopause.gift}</p>
          <p className={styles.bodyAccent}>{deep.menopause.wisdom}</p>
        </GlassCard>
      )}

      <HarvestIllustration color={el.hex} />

      {/* Themes */}
      <div className={styles.themesSection}>
        <h2 className={styles.themesTitle}>Themes in the Harvest Years</h2>
        {deep.themes.map((theme, i) => (
          <GlassCard key={i}>
            <h3 className={styles.themeTitle}>{theme.title}</h3>
            <p className={styles.body}>{theme.body}</p>
          </GlassCard>
        ))}
      </div>

      {/* Advice */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>Guidance for This Phase</h2>
        <div className={styles.adviceList}>
          {deep.advice.map((item, i) => (
            <div key={i} className={styles.adviceItem}>
              <h3 className={styles.adviceTitle}>{item.title}</h3>
              <p className={styles.adviceBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Exercises */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>Exercises</h2>
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
      </GlassCard>

      {/* Diet */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.diet.title}</h2>
        <p className={styles.body}>{deep.diet.intro}</p>
        <div className={styles.dietList}>
          {deep.diet.foods.map((food, i) => (
            <div key={i} className={styles.dietItem}>
              <h3 className={styles.dietCategory}>{food.category}</h3>
              <p className={styles.body}>{food.items}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Seasonal rhythm */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.seasons.title}</h2>
        <div className={styles.seasonList}>
          {deep.seasons.entries.map((s, i) => (
            <div key={i} className={styles.seasonItem}>
              <span className={styles.seasonName} style={{ color: el.hex }}>{s.season}</span>
              <p className={styles.seasonBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <ReflectionIllustration color={el.hex} />

      {/* Reflections */}
      <GlassCard glowColor={`${el.hex}15`}>
        <h2 className={styles.sectionTitle}>Reflection</h2>
        <div className={styles.reflectionList}>
          {deep.reflections.map((r, i) => (
            <p key={i} className={styles.reflectionItem}>{r}</p>
          ))}
        </div>
        <p className={styles.reflectionNote}>You don't need to act on these yet. Just let the questions be there.</p>
      </GlassCard>

      {/* Transition to next */}
      <GlassCard>
        <h2 className={styles.sectionTitle}>{deep.transitionNext.title}</h2>
        <p className={styles.body}>{deep.transitionNext.body}</p>
        <p className={styles.bodyAccent}>{deep.transitionNext.next}</p>
      </GlassCard>
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

function PhaseElementIllustration({ element }) {
  const el = getElementInfo(element);
  return (
    <svg viewBox="0 0 200 80" className={styles.illustration}>
      <style>{`
        @keyframes phaseBreathe { 0%, 100% { opacity: 0.2; r: 30; } 50% { opacity: 0.35; r: 34; } }
      `}</style>
      <circle cx="100" cy="40" r="30" fill={el.hex} opacity="0.12"
        style={{ animation: 'phaseBreathe 8s ease-in-out infinite' }} />
      <circle cx="100" cy="40" r="22" fill="none" stroke={el.hex} strokeWidth="0.7" opacity="0.35" />
      <text x="100" y="42" textAnchor="middle" dominantBaseline="central"
        fill={el.hex} fontSize="16" fontWeight="300" opacity="0.7">
        {el.chinese}
      </text>
    </svg>
  );
}

function BreathIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 60" className={styles.illustration}>
      <style>{`
        @keyframes breathIn { 0%, 100% { d: path('M 20 30 Q 60 10 100 30 Q 140 50 180 30'); } 50% { d: path('M 20 30 Q 60 50 100 30 Q 140 10 180 30'); } }
        @keyframes breathDot { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
      `}</style>
      <path d="M 20 30 Q 60 10 100 30 Q 140 50 180 30" fill="none"
        stroke={color} strokeWidth="0.8" opacity="0.3"
        style={{ animation: 'breathIn 6s ease-in-out infinite' }} />
      <path d="M 20 30 Q 60 50 100 30 Q 140 10 180 30" fill="none"
        stroke={color} strokeWidth="0.5" opacity="0.15"
        style={{ animation: 'breathIn 6s ease-in-out 3s infinite' }} />
      {[40, 70, 100, 130, 160].map((x, i) => (
        <circle key={i} cx={x} cy="30" r="2" fill={color} opacity="0.2"
          style={{ animation: `breathDot ${5 + i * 0.5}s ease-in-out ${i * 0.8}s infinite` }} />
      ))}
    </svg>
  );
}

function HarvestIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 70" className={styles.illustration}>
      <style>{`@keyframes harvestFall { 0%, 100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(4px); opacity: 0.5; } }`}</style>
      {[30, 60, 90, 120, 150, 170].map((x, i) => (
        <g key={i} style={{ animation: `harvestFall ${4 + i * 0.7}s ease-in-out ${i * 0.5}s infinite` }}>
          <line x1={x} y1={15 + i * 3} x2={x} y2={45 + i * 2}
            stroke={color} strokeWidth="0.6" opacity="0.25" />
          <circle cx={x} cy={48 + i * 2} r={2 + (i % 3)} fill={color} opacity="0.15" />
        </g>
      ))}
    </svg>
  );
}

function ReflectionIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 60" className={styles.illustration}>
      <style>{`@keyframes ripple { 0% { r: 5; opacity: 0.4; } 100% { r: 40; opacity: 0; } }`}</style>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="100" cy="30" r="5" fill="none"
          stroke={color} strokeWidth="0.5"
          style={{ animation: `ripple 5s ease-out ${i * 1.7}s infinite` }} />
      ))}
      <circle cx="100" cy="30" r="3" fill={color} opacity="0.3" />
    </svg>
  );
}
