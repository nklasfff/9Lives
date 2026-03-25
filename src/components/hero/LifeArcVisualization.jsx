import { getElementInfo } from '../../engine/elements';
import { PHASE_ELEMENTS } from '../../engine/lifePhase';
import styles from './LifeArcVisualization.module.css';

const SEASON_LABELS = [
  { text: 'Spring', x: 72 },
  { text: 'Summer', x: 170 },
  { text: 'Late Sum.', x: 268 },
  { text: 'Autumn', x: 398 },
  { text: 'Winter', x: 495 },
  { text: '2nd Spring', x: 560 },
];

export default function LifeArcVisualization({ currentPhase = 1, userElement, onPhaseClick }) {
  const activeIndex = currentPhase - 1;

  const circles = Array.from({ length: 9 }, (_, i) => {
    const x = 40 + i * 65;
    const y = 120 - Math.sin((Math.PI * i) / 8) * 80;
    const phaseElement = PHASE_ELEMENTS[i];
    const elementInfo = getElementInfo(phaseElement);
    const isActive = i === activeIndex;

    return { x, y, i, phaseElement, elementInfo, isActive };
  });

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 620 185" className={styles.svg}>
        <defs>
          {circles.map(({ i, elementInfo, isActive }) => (
            isActive && (
              <filter key={`glow-${i}`} id={`glow-${i}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor={elementInfo.hex} floodOpacity="0.4" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )
          ))}
        </defs>

        {/* Connecting arc — smooth curve */}
        <path
          d={`M ${circles[0].x} ${circles[0].y} ${circles.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')}`}
          fill="none"
          style={{ stroke: 'var(--line-subtle)' }}
          strokeWidth="0.8"
          strokeDasharray="3 4"
          className={styles.arcPath}
        />

        {/* Phase circles */}
        {circles.map(({ x, y, i, elementInfo, isActive }) => (
          <g
            key={i}
            onClick={() => onPhaseClick?.(i + 1)}
            style={{ cursor: onPhaseClick ? 'pointer' : 'default' }}
            className={`${styles.phaseGroup} ${isActive ? styles.active : ''}`}
          >
            <circle
              cx={x}
              cy={y}
              r={isActive ? 22 : 17}
              fill={isActive ? `${elementInfo.hex}18` : `${elementInfo.hex}0a`}
              style={{ stroke: isActive ? elementInfo.hex : 'var(--line-strong)' }}
              strokeWidth={isActive ? 1.2 : 0.8}
              filter={isActive ? `url(#glow-${i})` : undefined}
              className={styles.circle}
            />
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: isActive ? elementInfo.hex : 'var(--text-illustration)' }}
              fontSize={isActive ? '14' : '11'}
              fontFamily="var(--font-display)"
              fontWeight="300"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Season labels — italic, elegant */}
        {SEASON_LABELS.map(({ text, x }) => (
          <text
            key={text}
            x={x}
            y={172}
            textAnchor="middle"
            style={{ fill: 'var(--text-illustration-dim)' }}
            fontSize="10"
            fontFamily="var(--font-display)"
            fontStyle="italic"
            fontWeight="300"
            letterSpacing="-0.01em"
          >
            {text}
          </text>
        ))}
      </svg>
    </div>
  );
}
