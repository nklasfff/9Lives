import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import { getTimelineGroupedByWeek } from '../utils/reflectionStore';
import styles from './ExplorePage.module.css';

const LAYERS = [
  { key: 'elements', chinese: '五行', title: 'The Five Elements', subtitle: 'Wood · Fire · Earth · Metal · Water', tagline: 'The five qualities through which life expresses itself.', route: '/explore/element' },
  { key: 'phases',   chinese: '九段', title: 'The Nine Seasons',  subtitle: 'A lifetime in nine chapters',                tagline: 'Seven-year cycles for women, eight for men — each its own element, season, and calling.', route: '/explore/phases' },
  { key: 'spirits',  chinese: '五神', title: 'The Five Spirits',  subtitle: 'Wu Shen — consciousness in five forms',     tagline: 'Five aspects of the soul, residing in the five yin organs.', route: '/explore/spirits' },
  { key: 'organs',   chinese: '十二臟', title: 'The Twelve Organs', subtitle: 'Twelve systems, twelve teachers',         tagline: 'Each organ a function, an emotion, a time of day, and a particular kind of intelligence.', route: '/explore/organs' },
  { key: 'depths',   chinese: '八脈', title: 'The Eight Depths',   subtitle: 'Qi Jing Ba Mai — extraordinary vessels',   tagline: 'Eight hidden rivers carrying inheritance, shadow, and unfinished work.', route: '/explore/depths' },
];

const FIRST_CONCEPTS = [
  {
    chinese: '陰陽',
    name: 'Yin & Yang',
    body: 'Two qualities that cannot exist without each other. Yin is the quiet, the inward, the dark, the receptive. Yang is the active, the outward, the light, the expanding. Night and day. Winter and summer. Rest and movement. Yin is not absence of force — it is the kind of force that works while you rest.',
  },
  {
    chinese: '精氣神',
    name: 'Jing · Qi · Shen',
    body: 'Three forms of life-force living in everyone. Jing is the deep essence inherited at conception, stored in the Kidneys — your battery for a whole life. Qi is the daily energy that moves through breath, food, and movement. Shen is consciousness and inner light, dwelling in the Heart and visible in the eyes. These three are the threads woven through every chapter that follows.',
  },
];

function ExploreIllustration() {
  const layerColors = ['#3a6fa0', '#a8b8c8', '#c9a84c', '#c75a3a', '#4a9e6e', '#b88a6a', '#7a9ab5'];

  return (
    <svg viewBox="0 0 200 130" className={styles.illustration}>
      <style>{`
        @keyframes arcWave {
          0% { opacity: 0; stroke-dashoffset: 60; }
          20% { opacity: 0.45; stroke-dashoffset: 0; }
          70% { opacity: 0.45; stroke-dashoffset: 0; }
          100% { opacity: 0; stroke-dashoffset: -60; }
        }
        @keyframes corePulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {[96, 82, 68, 54, 42, 30, 20].map((r, i) => (
        <path key={i}
          d={`M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
          fill="none"
          stroke={layerColors[i]}
          strokeWidth={0.9}
          strokeDasharray={i % 2 === 0 ? 'none' : '4 3'}
          opacity="0.35"
          style={{ animation: `arcWave ${8 + i * 0.5}s ease-in-out ${i * 1.2}s infinite` }}
        />
      ))}
      {[92, 60, 32].map((r, i) => (
        <g key={`d-${i}`}>
          <circle cx={100 - r} cy="100" r="1.5" fill={layerColors[i * 2]} opacity="0.3"
            style={{ animation: `corePulse ${6 + i}s ease-in-out ${i * 2}s infinite` }} />
          <circle cx={100 + r} cy="100" r="1.5" fill={layerColors[i * 2]} opacity="0.3"
            style={{ animation: `corePulse ${6 + i}s ease-in-out ${i * 2 + 1}s infinite` }} />
        </g>
      ))}
      <line x1="100" y1="100" x2="100" y2="5" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" strokeDasharray="2 4" />
      <circle cx="100" cy="5" r="4" fill="none" strokeWidth="0.6"
        style={{ stroke: 'var(--text-illustration-dim)', animation: 'corePulse 7s ease-in-out infinite' }} />
      <circle cx="100" cy="100" r="3.5" style={{ fill: 'var(--line-subtle)', animation: 'corePulse 5s ease-in-out infinite' }} />
      <circle cx="100" cy="100" r="1.5" style={{ fill: 'var(--line-strong)' }} />
    </svg>
  );
}

function formatWeek(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function entryRoute(entry) {
  if (entry.type === 'organ') return `/explore/organs/${entry.organKey}`;
  if (entry.type === 'reflection' || entry.type === 'journal') return `/explore/phases/${entry.phaseId}`;
  return null;
}

function entrySource(entry) {
  if (entry.type === 'organ') return entry.organKey ? entry.organKey.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()) : 'Organ';
  if (entry.type === 'reflection' || entry.type === 'journal') return `Phase ${entry.phaseId}`;
  return '';
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const trailWeeks = useMemo(() => getTimelineGroupedByWeek(), []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Explore</h1>
        <p className={styles.subtitle}>The wisdom system, and the trail you leave inside it</p>
      </header>

      <ExploreIllustration />

      <div className={styles.content}>
        {/* First concepts — the foundation the book opens with */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>First concepts</h2>
          <p className={styles.sectionLead}>The two ideas that ground everything that follows.</p>
          {FIRST_CONCEPTS.map((c) => (
            <GlassCard key={c.chinese} className={styles.conceptCard}>
              <div className={styles.conceptHeader}>
                <span className={styles.conceptChinese}>{c.chinese}</span>
                <h3 className={styles.conceptName}>{c.name}</h3>
              </div>
              <p className={styles.conceptBody}>{c.body}</p>
            </GlassCard>
          ))}
        </section>

        {/* The system — five lenses */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The system</h2>
          <p className={styles.sectionLead}>Five lenses through which the body, the life, and the field are read.</p>
          {LAYERS.map((layer) => (
            <GlassCard
              key={layer.key}
              className={styles.layerCard}
              onClick={() => navigate(layer.route)}
            >
              <div className={styles.layerHeader}>
                <span className={styles.layerChinese}>{layer.chinese}</span>
                <div className={styles.layerText}>
                  <h3 className={styles.layerTitle}>{layer.title}</h3>
                  <span className={styles.layerSubtitle}>{layer.subtitle}</span>
                </div>
                <span className={styles.layerArrow}>→</span>
              </div>
              <p className={styles.layerTagline}>{layer.tagline}</p>
            </GlassCard>
          ))}
        </section>

        {/* Your trail — what you have written, gathered */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your trail</h2>
          {trailWeeks.length === 0 ? (
            <GlassCard>
              <p className={styles.trailEmpty}>
                As you reflect on the questions inside each layer, your trail begins here. A line at a time. A week at a time. A life, slowly making itself visible.
              </p>
            </GlassCard>
          ) : (
            <p className={styles.sectionLead}>
              {trailWeeks.reduce((sum, w) => sum + w.entries.length, 0)} reflections, gathered week by week.
            </p>
          )}

          {trailWeeks.slice().reverse().map((week) => (
            <div key={week.weekOf} className={styles.trailWeek}>
              <h3 className={styles.trailWeekLabel}>Week of {formatWeek(week.weekOf)}</h3>
              {week.entries.slice().reverse().map((entry) => {
                const route = entryRoute(entry);
                const source = entrySource(entry);
                const question = entry.question || entry.prompt || (entry.choiceText ? 'Reflection' : '');
                const text = entry.text || entry.choiceText || '';
                return (
                  <button
                    key={entry.id}
                    className={styles.trailEntry}
                    onClick={() => route && navigate(route)}
                  >
                    <div className={styles.trailEntryHeader}>
                      <span className={styles.trailEntrySource}>{source}</span>
                      <span className={styles.trailEntryDate}>
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {question && <p className={styles.trailEntryQuestion}>{question}</p>}
                    {text && <p className={styles.trailEntryText}>{text}</p>}
                  </button>
                );
              })}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
