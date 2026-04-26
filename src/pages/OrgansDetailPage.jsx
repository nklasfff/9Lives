import { useNavigate } from 'react-router-dom';
import { getOrgansGroupedByElement } from '../engine/organs';
import { getElementInfo } from '../engine/elements';
import { getCurrentOrgan } from '../engine/organClock';
import GlassCard from '../components/common/GlassCard';
import styles from './OrgansDetailPage.module.css';

const ELEMENT_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];

export default function OrgansDetailPage() {
  const navigate = useNavigate();
  const groups = getOrgansGroupedByElement();
  const current = getCurrentOrgan();

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      <header className={styles.header}>
        <span className={styles.label}>04 — The Twelve Organs</span>
        <h1 className={styles.title}>十二臟</h1>
        <p className={styles.subtitle}>Five elemental pairs — each organ a function and a teacher</p>
      </header>

      <BodyOrgansIllustration />

      <GlassCard>
        <p className={styles.intro}>
          The twelve organs are the body&apos;s living systems — each carrying a function, an emotion,
          a time of day, and a particular kind of intelligence. They move in pairs of yin and yang,
          and they organize themselves under the five elements. To know an organ is to know one of
          the ways the body holds a life.
        </p>
      </GlassCard>

      {ELEMENT_ORDER.map((element, idx) => {
        const el = getElementInfo(element);
        const organs = groups[element];

        return (
          <div key={element}>
            {idx === 2 && <ShengRingIllustration />}
            <section className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupChinese} style={{ color: el.hex }}>{el.chinese}</span>
                <span className={styles.groupName} style={{ color: el.hex }}>{el.name}</span>
                <span className={styles.groupSeason}>{el.season}</span>
              </div>

              <div className={styles.cards}>
                {organs.map((organ) => {
                  const isActive = current && current.key === organ.key;
                  return (
                    <GlassCard
                      key={organ.key}
                      glowColor={`${el.hex}${isActive ? '20' : '0d'}`}
                      onClick={() => navigate(`/explore/organs/${organ.key}`)}
                      className={styles.organCard}
                    >
                      <div className={styles.organHeader}>
                        <span className={styles.organChinese} style={{ color: el.hex }}>
                          {organ.chinese}
                        </span>
                        <div className={styles.organMain}>
                          <h3 className={styles.organName}>{organ.name}</h3>
                          <span className={styles.organEnglishName}>{organ.englishName}</span>
                        </div>
                        {isActive && (
                          <span className={styles.activeBadge}
                            style={{ background: `${el.hex}25`, color: el.hex }}>
                            Active now
                          </span>
                        )}
                      </div>

                      <div className={styles.pillRow}>
                        <span className={styles.pill}>{organ.yinYang === 'yin' ? 'Yin' : 'Yang'}</span>
                        <span className={styles.pill}>{organ.organClockTime}</span>
                        <span className={styles.pill}>
                          {organ.emotion.balanced} · {organ.emotion.imbalanced}
                        </span>
                      </div>

                      <p className={styles.essence}>{organ.essence}</p>
                      <span className={styles.tapHint}>Read more →</span>
                    </GlassCard>
                  );
                })}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}

/* === Illustrations === */

function BodyOrgansIllustration() {
  // Three burning spaces (San Jiao) — Upper, Middle, Lower —
  // each containing the organs that live there in classical anatomy.
  // The Triple Heater is the vertical channel running through all three.
  const upper = [
    { x: 100, y: 44, c: '#c75a3a', delay: 0 },    // Heart
    { x: 87,  y: 56, c: '#a8b8c8', delay: 0.6 },  // Lung
    { x: 113, y: 56, c: '#c75a3a', delay: 1.2 },  // Pericardium
  ];
  const middle = [
    { x: 88,  y: 88,  c: '#c9a84c', delay: 0 },    // Spleen
    { x: 112, y: 88,  c: '#4a9e6e', delay: 0.5 },  // Liver
    { x: 92,  y: 102, c: '#c9a84c', delay: 1.0 },  // Stomach
    { x: 108, y: 102, c: '#4a9e6e', delay: 1.5 },  // Gallbladder
  ];
  const lower = [
    { x: 88,  y: 134, c: '#3a6fa0', delay: 0 },    // Kidney left
    { x: 112, y: 134, c: '#3a6fa0', delay: 0.4 },  // Kidney right
    { x: 88,  y: 148, c: '#a8b8c8', delay: 0.8 },  // Large Intestine
    { x: 112, y: 148, c: '#c75a3a', delay: 1.2 },  // Small Intestine
    { x: 100, y: 154, c: '#3a6fa0', delay: 1.6 },  // Bladder
  ];

  return (
    <svg viewBox="0 0 200 180" className={styles.heroIllustration}>
      <style>{`
        @keyframes burnerBreath { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.45; } }
        @keyframes organPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes silhouetteBreath { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.32; } }
        @keyframes thFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -20; } }
      `}</style>

      {/* Body silhouette — head, shoulders, torso, hips */}
      <ellipse cx="100" cy="18" rx="9" ry="11" fill="none"
        style={{ stroke: 'var(--line-subtle)', animation: 'silhouetteBreath 10s ease-in-out infinite' }}
        strokeWidth="0.6" />
      <path
        d="M 100 30 L 78 34 Q 76 48 76 70 Q 74 100 76 130 Q 78 155 88 168 L 92 175
           M 100 30 L 122 34 Q 124 48 124 70 Q 126 100 124 130 Q 122 155 112 168 L 108 175"
        fill="none" strokeWidth="0.6"
        style={{ stroke: 'var(--line-subtle)', animation: 'silhouetteBreath 10s ease-in-out infinite' }} />

      {/* Triple Heater — the vertical channel through all three burners */}
      <line x1="100" y1="32" x2="100" y2="170"
        stroke="#c75a3a" strokeWidth="0.5" opacity="0.28" strokeDasharray="2 4"
        style={{ animation: 'thFlow 8s linear infinite' }} />

      {/* Three burning spaces — outer rings */}
      {[
        { cy: 52, r: 22, label: '上' },   // upper burner (Shang)
        { cy: 95, r: 24, label: '中' },   // middle burner (Zhong)
        { cy: 142, r: 24, label: '下' },  // lower burner (Xia)
      ].map((b, i) => (
        <g key={i}>
          <circle cx="100" cy={b.cy} r={b.r} fill="none"
            stroke="var(--line-faint)" strokeWidth="0.5" strokeDasharray="3 4"
            opacity="0.5"
            style={{ animation: `burnerBreath ${10 + i * 1.5}s ease-in-out ${i * 1.2}s infinite` }} />
          <text x={100 + b.r + 8} y={b.cy + 1}
            textAnchor="start" dominantBaseline="central"
            style={{ fill: 'var(--text-illustration-dim)' }}
            fontSize="6" fontFamily="var(--font-display)" fontStyle="italic" opacity="0.45">
            {b.label}
          </text>
        </g>
      ))}

      {/* Organ lights — each burner's inhabitants */}
      {[...upper, ...middle, ...lower].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5.5" fill={p.c} opacity="0.1" />
          <circle cx={p.x} cy={p.y} r="2.4" fill={p.c} opacity="0.45"
            style={{ animation: `organPulse ${4 + (i % 4) * 0.6}s ease-in-out ${p.delay}s infinite` }} />
        </g>
      ))}
    </svg>
  );
}

function ShengRingIllustration() {
  // Five elements arranged on a ring in Sheng order.
  const cx = 100, cy = 75, orbit = 50;
  const elements = [
    { char: '木', color: '#4a9e6e' },  // Wood — top
    { char: '火', color: '#c75a3a' },  // Fire — upper right
    { char: '土', color: '#c9a84c' },  // Earth — lower right
    { char: '金', color: '#a8b8c8' },  // Metal — lower left
    { char: '水', color: '#3a6fa0' },  // Water — upper left
  ].map((el, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { ...el, x: cx + orbit * Math.cos(angle), y: cy + orbit * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 200 150" className={styles.illustration}>
      <style>{`
        @keyframes shengRing { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
        @keyframes shengCore { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
      `}</style>
      <circle cx={cx} cy={cy} r={orbit} fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" />
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        return (
          <line key={`l-${i}`} x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            stroke={el.color} strokeWidth="0.5" opacity="0.2" />
        );
      })}
      {elements.map((el, i) => (
        <g key={i}>
          <circle cx={el.x} cy={el.y} r="14" fill={el.color} opacity="0.08"
            style={{ animation: `shengRing ${5 + i * 0.5}s ease-in-out ${i * 0.6}s infinite` }} />
          <circle cx={el.x} cy={el.y} r="11" fill="none" stroke={el.color} strokeWidth="0.6" opacity="0.4" />
          <text x={el.x} y={el.y + 1} textAnchor="middle" dominantBaseline="central"
            fill={el.color} fontSize="11" fontWeight="300" opacity="0.65">
            {el.char}
          </text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="3" fill="var(--dot-illustration)"
        style={{ animation: 'shengCore 6s ease-in-out infinite' }} />
    </svg>
  );
}
