import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getDayPillar } from '../engine/calendar';
import { getCurrentOrgan } from '../engine/organClock';
import { getSpiritByElement } from '../engine/wuShen';
import { EXTRAORDINARY_MERIDIANS } from '../engine/meridians';
import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

// Map a user's constitutional element + life phase to one most-active vessel,
// surfaced as a personal one-liner on the Eight Vessels card.
const ELEMENT_VESSEL = {
  wood:  2, // Du Mai — yang authority, the upright spine
  fire:  1, // Ren Mai — bonding
  earth: 1, // Ren Mai — nourishment
  metal: 3, // Dai Mai — release
  water: 0, // Chong Mai — essence
};
const PHASE_VESSEL = {
  1: 7, 2: 7,  // Yang Qiao — visibility, becoming
  3: 2,        // Du Mai — uprightness
  4: 1, 5: 1,  // Ren Mai — holding, bonding
  6: 5, 7: 5,  // Yang Wei — release, evolution
  8: 4,        // Yin Wei — meaning
  9: 0,        // Chong Mai — second spring
};

function getActiveVessel(element, phase) {
  // Phase pull takes precedence — life-stage tends to dominate which vessel asks attention now
  const idx = PHASE_VESSEL[phase] ?? ELEMENT_VESSEL[element] ?? 4;
  return EXTRAORDINARY_MERIDIANS[idx];
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();

  const view = useMemo(() => {
    if (!data) return null;
    const userEl = getElementInfo(data.element);
    const phaseEl = getElementInfo(data.phase.element);
    const spirit = getSpiritByElement(data.element);
    const currentOrgan = getCurrentOrgan();
    const organEl = getElementInfo(currentOrgan.element);
    const todayPillar = getDayPillar(new Date());
    const dayEl = getElementInfo(todayPillar.element);
    const activeVessel = getActiveVessel(data.element, data.phase.phase);
    return { userEl, phaseEl, spirit, currentOrgan, organEl, todayPillar, dayEl, activeVessel };
  }, [data]);

  if (!data || !view) return null;

  const layers = [
    {
      key: 'element',
      kicker: '01',
      chinese: '五行',
      title: 'The Five Elements',
      subtitle: 'Wu Xing',
      body: 'Wood, Fire, Earth, Metal, Water — five qualities through which all life moves. The vocabulary that everything else in this app is built from.',
      personal: (
        <>You are <span style={{ color: view.userEl.hex }}>{view.userEl.chinese} {view.userEl.name}</span> — {view.userEl.quality.toLowerCase()}.</>
      ),
      accent: view.userEl.hex,
      route: '/explore/element',
    },
    {
      key: 'phases',
      kicker: '02',
      chinese: '九季',
      title: 'The Nine Seasons',
      subtitle: data.gender === 'female' ? 'Seven-year cycles' : 'Eight-year cycles',
      body: 'Nine phases of a life, each carrying its own element and season. From the seed in spring to the second spring at the end.',
      personal: (
        <>You are in Phase {data.phase.phase} — <span style={{ color: view.phaseEl.hex }}>{data.phase.title}</span>.</>
      ),
      accent: view.phaseEl.hex,
      route: '/explore/phases',
    },
    {
      key: 'spirits',
      kicker: '03',
      chinese: '五神',
      title: 'The Five Spirits',
      subtitle: 'Wu Shen',
      body: 'Five aspects of consciousness, one residing in each yin organ. The architecture of inner life — presence, vision, instinct, thought, will.',
      personal: view.spirit ? (
        <>Your inhabiting spirit is <span style={{ color: view.userEl.hex }}>{view.spirit.chinese} {view.spirit.name}</span> — {view.spirit.title.toLowerCase()}.</>
      ) : null,
      accent: view.userEl.hex,
      route: '/explore/spirits',
    },
    {
      key: 'organs',
      kicker: '04',
      chinese: '十二臟',
      title: 'The Twelve Organs & the Day',
      subtitle: 'Five elemental pairs, twenty-four hours',
      body: "Each organ a function, an emotion, a time of day. Together they form the body's living rhythm — the clock that turns inside you.",
      personal: (
        <>This hour belongs to your <span style={{ color: view.organEl.hex }}>{view.currentOrgan.organ}</span> — {view.currentOrgan.quality.toLowerCase()}.</>
      ),
      accent: view.organEl.hex,
      route: '/explore/organs',
    },
    {
      key: 'depths',
      kicker: '05',
      chinese: '八脈',
      title: 'The Eight Vessels',
      subtitle: 'Qi Jing Ba Mai',
      body: 'The deepest currents in the body — older than the meridians, carrying what was passed down and what asks to be released.',
      personal: (
        <>Most active in you now: <span style={{ color: view.userEl.hex }}>{view.activeVessel.chinese} {view.activeVessel.name}</span> — {view.activeVessel.englishName.toLowerCase()}.</>
      ),
      accent: view.userEl.hex,
      route: '/explore/depths',
    },
    {
      key: 'calendar',
      kicker: '06',
      chinese: '干支',
      title: 'The Calendar — Stems & Branches',
      subtitle: 'Gan Zhi',
      body: 'Ten heavenly stems, twelve earthly branches. The pairing that gives every day, every year, every two-hour window its own elemental signature.',
      personal: (
        <>Today is <span style={{ color: view.dayEl.hex }}>{view.todayPillar.chineseLabel} {view.todayPillar.label}</span> — {view.dayEl.name} day.</>
      ),
      accent: view.dayEl.hex,
      route: '/explore/calendar',
    },
  ];

  // Place hero illustration at top, mid illustration after 3rd layer
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Explore</h1>
        <p className={styles.subtitle}>Six layers of the same life</p>
      </header>

      <SixLayersIllustration />

      <div className={styles.content}>
        {layers.slice(0, 3).map((l) => <LayerCard key={l.key} layer={l} onClick={() => navigate(l.route)} />)}

        <ShengKeIllustration />

        {layers.slice(3).map((l) => <LayerCard key={l.key} layer={l} onClick={() => navigate(l.route)} />)}
      </div>
    </div>
  );
}

function LayerCard({ layer, onClick }) {
  return (
    <GlassCard
      glowColor={`${layer.accent}10`}
      onClick={onClick}
      className={styles.layerCard}
    >
      <div className={styles.layerHead}>
        <span className={styles.layerKicker}>{layer.kicker}</span>
        <span className={styles.layerChinese} style={{ color: layer.accent }}>
          {layer.chinese}
        </span>
        <div className={styles.layerTitles}>
          <h3 className={styles.layerTitle}>{layer.title}</h3>
          <span className={styles.layerSubtitle}>{layer.subtitle}</span>
        </div>
      </div>
      <p className={styles.layerBody}>{layer.body}</p>
      {layer.personal && (
        <p className={styles.layerPersonal}>{layer.personal}</p>
      )}
      <span className={styles.layerHint}>Read this layer →</span>
    </GlassCard>
  );
}

/* ─── Illustrations ───────────────────────────────────────────── */

function SixLayersIllustration() {
  // Six concentric arcs — one per layer — gently breathing.
  // Each layer is a doorway into the same life.
  const cx = 120, cy = 95;
  const layers = [
    { r: 64, color: '#3a6fa0', char: '干支', delay: 0 },  // calendar
    { r: 54, color: '#a8b8c8', char: '八脈', delay: 1 },  // depths
    { r: 44, color: '#c75a3a', char: '十二臟', delay: 2 }, // organs
    { r: 34, color: '#c9a84c', char: '五神', delay: 3 },  // spirits
    { r: 24, color: '#4a9e6e', char: '九季', delay: 4 },  // phases
    { r: 14, color: '#c75a3a', char: '五行', delay: 5 },  // element (center)
  ];

  return (
    <svg viewBox="0 0 240 190" className={styles.heroIllustration}>
      <style>{`
        @keyframes layerBreathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes layerCore { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.06); } }
      `}</style>

      {layers.map((l, i) => (
        <circle key={i} cx={cx} cy={cy} r={l.r} fill="none"
          stroke={l.color} strokeWidth="0.6"
          strokeDasharray={i % 2 === 0 ? '3 5' : 'none'}
          opacity="0.45"
          style={{ animation: `layerBreathe ${10 + i * 1.2}s ease-in-out ${l.delay * 0.4}s infinite` }} />
      ))}

      {/* Center node */}
      <circle cx={cx} cy={cy} r="4" fill="#c75a3a" opacity="0.55"
        style={{ animation: 'layerCore 6s ease-in-out infinite', transformOrigin: `${cx}px ${cy}px` }} />

      {/* Six radial markers — one per layer — placed at the top of each ring */}
      {layers.map((l, i) => (
        <text key={`t-${i}`} x={cx} y={cy - l.r + 1.5}
          textAnchor="middle" dominantBaseline="central"
          fill={l.color} fontSize="4.5" fontWeight="300" opacity="0.55">
          {l.char}
        </text>
      ))}
    </svg>
  );
}

function ShengKeIllustration() {
  // Five-element pentagon: sheng (generating) edges as solid, ke (controlling) as dashed inner star.
  const cx = 100, cy = 75, orbit = 50;
  const els = [
    { char: '木', color: '#4a9e6e' },
    { char: '火', color: '#c75a3a' },
    { char: '土', color: '#c9a84c' },
    { char: '金', color: '#a8b8c8' },
    { char: '水', color: '#3a6fa0' },
  ].map((el, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return { ...el, x: cx + orbit * Math.cos(a), y: cy + orbit * Math.sin(a) };
  });

  return (
    <svg viewBox="0 0 200 150" className={styles.midIllustration}>
      <style>{`
        @keyframes shengPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
      `}</style>

      <circle cx={cx} cy={cy} r={orbit} fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.4" />

      {/* Sheng edges — adjacent pentagon */}
      {els.map((el, i) => {
        const next = els[(i + 1) % 5];
        return (
          <line key={`s-${i}`} x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            stroke={el.color} strokeWidth="0.6" opacity="0.4"
            style={{ animation: `shengPulse ${6 + i}s ease-in-out ${i * 0.5}s infinite` }} />
        );
      })}

      {/* Ke edges — across the pentagon */}
      {els.map((el, i) => {
        const across = els[(i + 2) % 5];
        return (
          <line key={`k-${i}`} x1={el.x} y1={el.y} x2={across.x} y2={across.y}
            style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.4" strokeDasharray="2 4" />
        );
      })}

      {/* Element nodes */}
      {els.map((el, i) => (
        <g key={i}>
          <circle cx={el.x} cy={el.y} r="11" fill={`${el.color}15`}
            stroke={el.color} strokeWidth="0.6" opacity="0.55" />
          <text x={el.x} y={el.y + 1} textAnchor="middle" dominantBaseline="central"
            fill={el.color} fontSize="9" fontWeight="300" opacity="0.7">
            {el.char}
          </text>
        </g>
      ))}
    </svg>
  );
}
