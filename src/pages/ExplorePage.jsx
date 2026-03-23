import GlassCard from '../components/common/GlassCard';
import styles from './ExplorePage.module.css';

const LAYERS = [
  { number: '01', title: 'Your Element', subtitle: 'Identity & Constitution', description: 'Your elemental nature shapes everything — from how you see the world to what foods nourish you.' },
  { number: '02', title: 'Life Phase', subtitle: 'The Nine Seasons', description: 'Nine phases unfold across your lifetime, each with its own element, wisdom, and calling.' },
  { number: '03', title: 'Daily Spirits', subtitle: 'The Five Shen', description: 'Five spirits govern your inner landscape — consciousness, vision, instinct, thought, and will.' },
  { number: '04', title: 'Relations', subtitle: 'Elemental Dynamics', description: 'Every relationship carries an elemental signature — nourishing, tempering, or transforming.' },
  { number: '05', title: 'Time Travel', subtitle: 'Past & Future', description: 'Map the elemental landscape of any day — past or future — and see how it shapes your journey.' },
  { number: '06', title: 'The Depths', subtitle: 'Extraordinary Vessels', description: 'Eight hidden rivers of energy that carry your deepest patterns, traumas, and gifts.' },
];

function ExploreIllustration() {
  return (
    <svg viewBox="0 0 200 120" className={styles.illustration}>
      {/* Six concentric arcs representing the 6 layers */}
      {[90, 75, 60, 45, 30, 18].map((r, i) => (
        <path
          key={i}
          d={`M ${100 - r} 95 A ${r} ${r} 0 0 1 ${100 + r} 95`}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={i === 0 ? 1 : 0.7}
          strokeDasharray={i % 2 === 0 ? 'none' : '3 3'}
        />
      ))}
      {/* Center dot */}
      <circle cx="100" cy="95" r="3" fill="rgba(255,255,255,0.3)" />
      {/* Small dots at arc intersections */}
      {[90, 60, 30].map((r, i) => (
        <g key={`dots-${i}`}>
          <circle cx={100 - r} cy="95" r="1.5" fill="rgba(255,255,255,0.2)" />
          <circle cx={100 + r} cy="95" r="1.5" fill="rgba(255,255,255,0.2)" />
        </g>
      ))}
      {/* Vertical line from center upward */}
      <line x1="100" y1="95" x2="100" y2="5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2 4" />
      {/* Top circle */}
      <circle cx="100" cy="5" r="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />
    </svg>
  );
}

export default function ExplorePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <ExploreIllustration />
        <h1>Explore</h1>
        <p className={styles.subtitle}>Six layers of understanding</p>
      </header>

      <div className={styles.layers}>
        {LAYERS.map((layer) => (
          <GlassCard key={layer.number} className={styles.layerCard}>
            <span className={styles.layerNumber}>{layer.number}</span>
            <h3 className={styles.layerTitle}>{layer.title}</h3>
            <p className={styles.layerSubtitle}>{layer.subtitle}</p>
            <p className={styles.layerDesc}>{layer.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
