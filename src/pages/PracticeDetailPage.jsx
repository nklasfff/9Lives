import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getPhasePractices } from '../engine/phasePractices';
import GlassCard from '../components/common/GlassCard';
import styles from './PracticeDetailPage.module.css';

const EXERCISE_CATEGORIES = {
  åndedræt: { label: 'Åndedræt', char: '息', match: ['åndedræt', 'vejrtrækning', 'vejret'] },
  meridian: { label: 'Meridianstrygning', char: '經', match: ['meridian', 'strygning'] },
  yoga: { label: 'Yin Yoga', char: '柔', match: ['yoga', 'stilling', 'yin'] },
  sind: { label: 'Sind & Refleksion', char: '心', match: ['sind', 'brev', 'notesbog'] },
  bevægelse: { label: 'Bevægelse', char: '動', match: ['gåtur', 'gang', 'løb', 'bevægelse', 'bare fødder'] },
};

function categorize(name) {
  const lower = name.toLowerCase();
  for (const [key, cat] of Object.entries(EXERCISE_CATEGORIES)) {
    if (cat.match.some(m => lower.includes(m))) return key;
  }
  return 'bevægelse';
}

export default function PracticeDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const [activeTab, setActiveTab] = useState('exercises');
  const [expandedEx, setExpandedEx] = useState(null);

  if (!data) return null;

  const phase = data.phase;
  const el = getElementInfo(data.element);
  const practices = getPhasePractices(phase.phase);

  if (!practices) return null;

  const { exercises, diet } = practices;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

      <header className={styles.header}>
        <span className={styles.label}>Phase {phase.phase} · {phase.season}</span>
        <div className={styles.bigSymbol} style={{ color: el.hex }}>{el.chinese}</div>
        <h1 className={styles.title}>Practice & Nourishment</h1>
        <p className={styles.subtitle}>From the source — exercises and food for your phase</p>
      </header>

      <PracticeIllustration element={data.element} />

      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'exercises' ? styles.tabActive : ''}`}
          style={activeTab === 'exercises' ? { borderBottomColor: el.hex, color: el.hex } : {}}
          onClick={() => setActiveTab('exercises')}
        >
          移 Øvelser
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'diet' ? styles.tabActive : ''}`}
          style={activeTab === 'diet' ? { borderBottomColor: el.hex, color: el.hex } : {}}
          onClick={() => setActiveTab('diet')}
        >
          食 Kost
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'exercises' && (
          <div className={styles.exerciseList}>
            <p className={styles.intro}>
              Disse øvelser er valgt specifikt til din fase — de støtter de organer og den energikvalitet, der er mest aktiv i {phase.title.toLowerCase()}.
            </p>
            {exercises.map((ex, i) => {
              const cat = categorize(ex.name);
              const catInfo = EXERCISE_CATEGORIES[cat];
              const isExpanded = expandedEx === i;
              return (
                <GlassCard
                  key={i}
                  className={styles.exerciseCard}
                  glowColor={`${el.hex}10`}
                  onClick={() => setExpandedEx(isExpanded ? null : i)}
                >
                  <div className={styles.exHeader}>
                    <span className={styles.exChar} style={{ color: el.hex }}>{catInfo.char}</span>
                    <div className={styles.exMeta}>
                      <span className={styles.exCategory}>{catInfo.label}</span>
                      <h3 className={styles.exName}>{ex.name}</h3>
                    </div>
                    <span className={styles.exToggle} style={{ color: el.hex }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                  {isExpanded && (
                    <p className={styles.exDescription}>{ex.description}</p>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {activeTab === 'diet' && (
          <div className={styles.dietContent}>
            {diet.intro && (
              <GlassCard glowColor={`${el.hex}10`}>
                <p className={styles.dietIntro}>{diet.intro}</p>
              </GlassCard>
            )}

            {diet.foods && (
              <GlassCard glowColor={`${el.hex}10`}>
                <div className={styles.dietHeader}>
                  <span className={styles.dietChar} style={{ color: el.hex }}>食</span>
                  <h3 className={styles.dietTitle}>Fødevarer</h3>
                </div>
                <p className={styles.dietText}>{diet.foods.replace(/^Fødevarer der støtter \S+-elementet:\s*/, '')}</p>
              </GlassCard>
            )}

            {diet.herbs && (
              <GlassCard glowColor={`${el.hex}10`}>
                <div className={styles.dietHeader}>
                  <span className={styles.dietChar} style={{ color: el.hex }}>草</span>
                  <h3 className={styles.dietTitle}>Urter & Krydderier</h3>
                </div>
                <p className={styles.dietText}>{diet.herbs.replace(/^Urter og krydderier:\s*/, '')}</p>
              </GlassCard>
            )}

            {diet.extra && (
              <GlassCard glowColor={`${el.hex}10`}>
                <div className={styles.dietHeader}>
                  <span className={styles.dietChar} style={{ color: el.hex }}>補</span>
                  <h3 className={styles.dietTitle}>Særlig opmærksomhed</h3>
                </div>
                <p className={styles.dietText}>{diet.extra.replace(/^[^:]+:\s*/, '')}</p>
              </GlassCard>
            )}

            {diet.avoid && (
              <GlassCard>
                <div className={styles.dietHeader}>
                  <span className={styles.dietChar} style={{ color: 'var(--text-muted)' }}>減</span>
                  <h3 className={styles.dietTitle} style={{ color: 'var(--text-secondary)' }}>Moderer</h3>
                </div>
                <p className={styles.dietText}>{diet.avoid.replace(/^Undgå eller reducer:\s*/, '')}</p>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeIllustration({ element }) {
  const ELEMENT_COLORS = {
    wood: '#4a9e6e', fire: '#c75a3a', earth: '#c9a84c', metal: '#a8b8c8', water: '#3a6fa0',
  };
  const color = ELEMENT_COLORS[element] || '#a8b8c8';
  const categories = Object.values(EXERCISE_CATEGORIES);

  return (
    <svg viewBox="0 0 260 100" className={styles.illustration}>
      {categories.map(({ char }, i) => {
        const x = 26 + i * 52;
        const y = 50;
        return (
          <g key={i}>
            {i < 4 && (
              <line x1={x + 14} y1={y} x2={x + 38} y2={y}
                stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 3">
                <animate attributeName="stroke-dashoffset" values="0;-10" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              </line>
            )}
            <circle cx={x} cy={y} r="16" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2">
              <animate attributeName="r" values="16;22;16" dur={`${7 + i * 0.6}s`} begin={`${i * 1.4}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
              <animate attributeName="opacity" values="0.2;0.04;0.2" dur={`${7 + i * 0.6}s`} begin={`${i * 1.4}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            </circle>
            <circle cx={x} cy={y} r="4" fill={color} opacity="0.6">
              <animate attributeName="r" values="4;6;4" dur={`${5 + i * 0.5}s`} begin={`${i * 0.9}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            </circle>
            <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central"
              fill={color} fontSize="9" fontWeight="300" opacity="0.7">
              {char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
