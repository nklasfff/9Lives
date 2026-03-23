import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

const LAYERS = [
  { number: '01', title: 'Your Element', subtitle: 'Identity & Constitution', description: 'Your elemental nature shapes everything — from how you see the world to what foods nourish you.', route: '/explore/element' },
  { number: '02', title: 'Life Phase', subtitle: 'The Nine Seasons', description: 'Nine phases unfold across your lifetime, each with its own element, wisdom, and calling.', route: '/explore/phases' },
  { number: '03', title: 'Daily Spirits', subtitle: 'The Five Shen', description: 'Five spirits govern your inner landscape — consciousness, vision, instinct, thought, and will.', route: '/explore/spirits' },
  { number: '04', title: 'Relations', subtitle: 'Elemental Dynamics', description: 'Every relationship carries an elemental signature — nourishing, tempering, or transforming.', route: null },
  { number: '05', title: 'Time Travel', subtitle: 'Past & Future', description: 'Map the elemental landscape of any day — past or future — and see how it shapes your journey.', route: null },
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
      <line x1="100" y1="100" x2="100" y2="5" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" strokeDasharray="2 4" />

      {/* Top circle */}
      <circle cx="100" cy="5" r="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6"
        style={{ animation: 'corePulse 7s ease-in-out infinite' }} />

      {/* Center dot */}
      <circle cx="100" cy="100" r="3.5" fill="rgba(255,255,255,0.15)"
        style={{ animation: 'corePulse 5s ease-in-out infinite' }} />
      <circle cx="100" cy="100" r="1.5" fill="rgba(255,255,255,0.35)" />
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
        <ExploreIllustration />
      </header>

      <div className={styles.layers}>
        {LAYERS.map((layer) => (
          <GlassCard
            key={layer.number}
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
        ))}
      </div>
    </div>
  );
}
