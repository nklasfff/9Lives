import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

const LAYERS = [
  { number: '01', title: 'Your Element', subtitle: 'Identity & Constitution', description: 'Your elemental nature shapes everything — from how you see the world to what foods nourish you.', route: '/explore/element' },
  { number: '02', title: 'Life Phase', subtitle: 'The Nine Seasons', description: 'Nine phases unfold across your lifetime, each with its own element, wisdom, and calling.', route: '/explore/phases' },
  { number: '03', title: 'Daily Spirits', subtitle: 'The Five Shen', description: 'Five spirits govern your inner landscape — consciousness, vision, instinct, thought, and will.', route: '/explore/spirits' },
  { number: '04', title: 'The Twelve Organs', subtitle: 'Body as Function & Teacher', description: 'Twelve organs in five elemental pairs — each carrying a function, an emotion, and a particular kind of intelligence.', route: '/explore/organs' },
  { number: '05', title: 'Relations', subtitle: 'Elemental Dynamics', description: 'Every relationship carries an elemental signature — nourishing, tempering, or transforming.', route: '/relations' },
  { number: '06', title: 'Time Travel', subtitle: 'Past & Future', description: 'Map the elemental landscape of any day — past or future — and see how it shapes your journey.', route: '/time' },
  { number: '07', title: 'The Depths', subtitle: 'Extraordinary Vessels', description: 'Eight hidden rivers of energy that carry your deepest patterns, traumas, and gifts.', route: '/explore/depths' },
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

      {/* Seven concentric arcs — each in an element color, breathing in waves */}
      {[96, 82, 68, 54, 42, 30, 20].map((r, i) => (
        <path
          key={i}
          d={`M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
          fill="none"
          stroke={layerColors[i]}
          strokeWidth={0.9}
          strokeDasharray={i % 2 === 0 ? 'none' : '4 3'}
          opacity="0.35"
          style={{
            animation: `arcWave ${8 + i * 0.5}s ease-in-out ${i * 1.2}s infinite`,
          }}
        />
      ))}

      {/* Dots at the endpoints of each arc */}
      {[92, 60, 32].map((r, i) => (
        <g key={`d-${i}`}>
          <circle cx={100 - r} cy="100" r="1.5" fill={layerColors[i * 2]} opacity="0.3"
            style={{ animation: `corePulse ${6 + i}s ease-in-out ${i * 2}s infinite` }} />
          <circle cx={100 + r} cy="100" r="1.5" fill={layerColors[i * 2]} opacity="0.3"
            style={{ animation: `corePulse ${6 + i}s ease-in-out ${i * 2 + 1}s infinite` }} />
        </g>
      ))}

      {/* Vertical axis */}
      <line x1="100" y1="100" x2="100" y2="5" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" strokeDasharray="2 4" />

      {/* Top circle */}
      <circle cx="100" cy="5" r="4" fill="none" strokeWidth="0.6"
        style={{ stroke: 'var(--text-illustration-dim)', animation: 'corePulse 7s ease-in-out infinite' }} />

      {/* Center dot */}
      <circle cx="100" cy="100" r="3.5" style={{ fill: 'var(--line-subtle)', animation: 'corePulse 5s ease-in-out infinite' }} />
      <circle cx="100" cy="100" r="1.5" style={{ fill: 'var(--line-strong)' }} />
    </svg>
  );
}

function WuXingFlowIllustration() {
  // 5 elements placed evenly on a circle (72° apart), starting from top
  const cx = 100, cy = 100, orbit = 68;
  const elements = [
    { char: '水', color: '#3a6fa0' },  // Water — top
    { char: '木', color: '#4a9e6e' },  // Wood — upper right
    { char: '火', color: '#c75a3a' },  // Fire — lower right
    { char: '土', color: '#c9a84c' },  // Earth — lower left
    { char: '金', color: '#a8b8c8' },  // Metal — upper left
  ].map((el, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { ...el, x: cx + orbit * Math.cos(angle), y: cy + orbit * Math.sin(angle) };
  });

  const cycleDur = 10; // seconds for full cycle
  const slotDur = cycleDur / 5; // 2s per element

  return (
    <svg viewBox="0 0 200 200" className={styles.midIllustration}>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={orbit} fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.6" />

      {/* Pentagon sheng-cycle lines */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        return (
          <line key={`line-${i}`}
            x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            stroke={el.color} strokeWidth="0.5" opacity="0.15" />
        );
      })}

      {/* Element circles — sequential glow using SMIL */}
      {elements.map((el, i) => (
        <g key={i}>
          {/* Breathing glow ring */}
          <circle cx={el.x} cy={el.y} r="14" fill={el.color} opacity="0">
            <animate attributeName="r" values="14;26;14"
              dur={`${cycleDur}s`} begin={`${i * slotDur}s`}
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0;0.2;1"
              keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            <animate attributeName="opacity" values="0.25;0;0.25"
              dur={`${cycleDur}s`} begin={`${i * slotDur}s`}
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0;0.2;1"
              keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </circle>

          {/* Main circle — brightens when active */}
          <circle cx={el.x} cy={el.y} r="16" fill={`${el.color}12`} stroke={el.color} strokeWidth="0.7" opacity="0.3">
            <animate attributeName="opacity" values="0.85;0.3;0.3"
              dur={`${cycleDur}s`} begin={`${i * slotDur}s`}
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0;0.25;1"
              keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </circle>

          {/* Chinese character */}
          <text x={el.x} y={el.y + 1}
            textAnchor="middle" dominantBaseline="central"
            fill={el.color} fontSize="11" fontWeight="300" opacity="0.5">
            <animate attributeName="opacity" values="0.9;0.5;0.5"
              dur={`${cycleDur}s`} begin={`${i * slotDur}s`}
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0;0.25;1"
              keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            {el.char}
          </text>
        </g>
      ))}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" style={{ fill: 'var(--dot-illustration)' }}>
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
      </circle>
    </svg>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Explore</h1>
        <p className={styles.subtitle}>Seven layers of understanding</p>
      </header>

      <ExploreIllustration />

      <div className={styles.layers}>
        {LAYERS.map((layer, idx) => (
          <React.Fragment key={layer.number}>
            {idx === 3 && <WuXingFlowIllustration />}
            <GlassCard
              className={`${styles.layerCard} ${layer.route ? styles.clickable : ''}`}
              onClick={layer.route ? () => navigate(layer.route) : undefined}
            >
              <div className={styles.layerHeader}>
                <div>
                  <span className={styles.layerNumber}>{layer.number}</span>
                  <h3 className={styles.layerTitle}>{layer.title}</h3>
                  <p className={styles.layerSubtitle}>{layer.subtitle}</p>
                </div>
                {layer.route && <span className={styles.arrow}>→</span>}
                {!layer.route && <span className={styles.comingSoon}>Soon</span>}
              </div>
              <p className={styles.layerDesc}>{layer.description}</p>
            </GlassCard>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
