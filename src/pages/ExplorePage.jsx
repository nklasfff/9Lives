import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

const LAYERS = [
  { number: '01', title: 'Your Element', subtitle: 'Identity & Constitution', description: 'Your elemental nature shapes everything — from how you see the world to what foods nourish you.', route: '/explore/element' },
  { number: '02', title: 'Life Phase', subtitle: 'The Nine Seasons', description: 'Nine phases unfold across your lifetime, each with its own element, wisdom, and calling.', route: '/explore/phases' },
  { number: '03', title: 'Daily Spirits', subtitle: 'The Five Shen', description: 'Five spirits govern your inner landscape — consciousness, vision, instinct, thought, and will.', route: '/explore/spirits' },
  { number: '04', title: 'Relations', subtitle: 'Elemental Dynamics', description: 'Every relationship carries an elemental signature — nourishing, tempering, or transforming.', route: '/relations' },
  { number: '05', title: 'Time Travel', subtitle: 'Past & Future', description: 'Map the elemental landscape of any day — past or future — and see how it shapes your journey.', route: '/time' },
  { number: '06', title: 'The Depths', subtitle: 'Extraordinary Vessels', description: 'Eight hidden rivers of energy that carry your deepest patterns, traumas, and gifts.', route: '/explore/depths' },
];

function ExploreIllustration() {
  const layerColors = ['#3a6fa0', '#a8b8c8', '#c9a84c', '#c75a3a', '#4a9e6e', '#7a9ab5'];

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

      {/* Six concentric arcs — each in an element color, breathing in waves */}
      {[92, 76, 60, 46, 32, 20].map((r, i) => (
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
  const elements = [
    { char: '水', color: '#3a6fa0', x: 100, y: 18 },
    { char: '木', color: '#4a9e6e', x: 170, y: 45 },
    { char: '火', color: '#c75a3a', x: 155, y: 105 },
    { char: '土', color: '#c9a84c', x: 45, y: 105 },
    { char: '金', color: '#a8b8c8', x: 30, y: 45 },
  ];

  return (
    <svg viewBox="0 0 200 130" className={styles.midIllustration}>
      <style>{`
        @keyframes flowDot {
          0%, 100% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          95% { opacity: 0; }
        }
        @keyframes elementBreathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }
      `}</style>

      {/* Sheng cycle connecting lines */}
      {elements.map((el, i) => {
        const next = elements[(i + 1) % 5];
        return (
          <line key={`flow-${i}`}
            x1={el.x} y1={el.y} x2={next.x} y2={next.y}
            stroke={el.color} strokeWidth="0.5" opacity="0.2"
            style={{ animation: `elementBreathe ${8 + i}s ease-in-out ${i * 1.2}s infinite` }}
          />
        );
      })}

      {/* Element circles with characters */}
      {elements.map((el, i) => (
        <g key={i}>
          <circle cx={el.x} cy={el.y} r="14" fill="none" stroke={el.color} strokeWidth="0.6" opacity="0.35"
            style={{ animation: `elementBreathe ${7 + i * 0.8}s ease-in-out ${i * 0.5}s infinite` }} />
          <text
            x={el.x} y={el.y + 1}
            textAnchor="middle" dominantBaseline="central"
            fill={el.color} fontSize="9" fontWeight="300" opacity="0.6"
          >
            {el.char}
          </text>
        </g>
      ))}

      {/* Center dot */}
      <circle cx="100" cy="65" r="2" style={{ fill: 'var(--dot-illustration)' }}
        style={{ animation: 'elementBreathe 5s ease-in-out infinite' }} />
    </svg>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Explore</h1>
        <p className={styles.subtitle}>Six layers of understanding</p>
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
