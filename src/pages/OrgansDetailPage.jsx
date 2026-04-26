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
  // Stylized vertical body silhouette with 12 lights pulsing in clock order.
  // Lights are placed roughly along the torso/head/legs to suggest a body without literalism.
  const lights = [
    { x: 100, y: 40, c: '#a8b8c8' },   // lung — upper chest
    { x: 100, y: 95, c: '#a8b8c8' },   // large intestine — lower belly
    { x: 100, y: 70, c: '#c9a84c' },   // stomach — mid
    { x: 90,  y: 65, c: '#c9a84c' },   // spleen — left mid
    { x: 100, y: 50, c: '#c75a3a' },   // heart — chest
    { x: 100, y: 80, c: '#c75a3a' },   // small intestine — abdomen
    { x: 110, y: 90, c: '#3a6fa0' },   // bladder — pelvis
    { x: 90,  y: 75, c: '#3a6fa0' },   // kidney — back
    { x: 105, y: 50, c: '#c75a3a' },   // pericardium — near heart
    { x: 95,  y: 55, c: '#c75a3a' },   // triple heater — torso
    { x: 105, y: 70, c: '#4a9e6e' },   // gallbladder — right
    { x: 95,  y: 70, c: '#4a9e6e' },   // liver — right
  ];
  return (
    <svg viewBox="0 0 200 130" className={styles.heroIllustration}>
      <style>{`
        @keyframes organBreath { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.65; } }
        @keyframes silhouettePulse { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.32; } }
      `}</style>
      {/* Body silhouette — soft outline */}
      <ellipse cx="100" cy="22" rx="11" ry="13" fill="none"
        style={{ stroke: 'var(--line-subtle)', animation: 'silhouettePulse 9s ease-in-out infinite' }}
        strokeWidth="0.6" />
      <path d="M 100 35 Q 80 50 80 85 Q 80 110 95 115 L 95 122
              M 100 35 Q 120 50 120 85 Q 120 110 105 115 L 105 122"
        fill="none" stroke="var(--line-subtle)" strokeWidth="0.6"
        style={{ animation: 'silhouettePulse 9s ease-in-out infinite' }} />
      {/* Twelve organ lights */}
      {lights.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill={p.c} opacity="0.08" />
          <circle cx={p.x} cy={p.y} r="2.5" fill={p.c} opacity="0.4"
            style={{ animation: `organBreath ${4 + i * 0.4}s ease-in-out ${i * 0.35}s infinite` }} />
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
