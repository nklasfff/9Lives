import { getElementInfo } from '../../engine/elements';
import { PHASE_ELEMENTS } from '../../engine/lifePhase';
import styles from './LifeArcVisualization.module.css';

// x = 70 + i * 60 → centered in 620 viewBox
// Spring=avg(70,130), Summer=190, Late Sum=avg(250,310), Autumn=avg(370,430), Winter=490, 2nd Spring=550
const SEASON_LABELS = [
  { text: 'Spring', x: 100 },
  { text: 'Summer', x: 190 },
  { text: 'Late Sum.', x: 280 },
  { text: 'Autumn', x: 400 },
  { text: 'Winter', x: 490 },
  { text: '2nd Spring', x: 550 },
];

export default function LifeArcVisualization({ currentPhase = 1, userElement, onPhaseClick }) {
  const activeIndex = currentPhase - 1;
  const userHex = getElementInfo(userElement).hex;

  const circles = Array.from({ length: 9 }, (_, i) => {
    const x = 70 + i * 60;
    const y = 120 - Math.sin((Math.PI * i) / 8) * 80;
    const phaseElement = PHASE_ELEMENTS[i];
    const elementInfo = getElementInfo(phaseElement);
    const isActive = i === activeIndex;

    return { x, y, i, phaseElement, elementInfo, isActive };
  });

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 620 210" className={styles.svg}>
        <defs>
          <filter id="glow-active" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={userHex} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes travelRing {
            0%, 15%, 100% { opacity: 0; }
            7.5% { opacity: 0.55; }
          }
        `}</style>

        {/* Active circle breathing glow */}
        {circles.filter(c => c.isActive).map(({ x, y, i }) => (
          <circle key={`breath-${i}`} cx={x} cy={y} r="26" fill={userHex} opacity="0.2">
            <animate attributeName="r" values="26;40;26" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
            <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          </circle>
        ))}

        {/* Connecting arc */}
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
              r={isActive ? 26 : 20}
              fill={isActive ? `${userHex}45` : `${elementInfo.hex}0a`}
              style={{ stroke: isActive ? userHex : 'var(--line-medium)' }}
              strokeWidth={isActive ? 1.5 : 0.9}
              filter={isActive ? 'url(#glow-active)' : undefined}
              className={styles.circle}
            />
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: isActive ? 'var(--text-bright)' : 'var(--text-illustration)' }}
              fontSize={isActive ? '20' : '17'}
              fontFamily="var(--font-display)"
              fontWeight={isActive ? '500' : '300'}
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Traveling ring — visits each non-active circle sequentially */}
        {(() => {
          const nonActive = circles.filter(c => !c.isActive);
          const slotDur = 2.5;
          const cycleDur = nonActive.length * slotDur;
          return nonActive.map(({ x, y, i }, slot) => (
            <circle
              key={`travel-${i}`}
              cx={x}
              cy={y}
              r="24"
              fill="none"
              stroke={userHex}
              strokeWidth="1"
              opacity="0"
              style={{
                animation: `travelRing ${cycleDur}s ease-in-out ${slot * slotDur}s infinite`,
              }}
            />
          ));
        })()}

        {/* Season labels */}
        {SEASON_LABELS.map(({ text, x }) => (
          <text
            key={text}
            x={x}
            y={196}
            textAnchor="middle"
            style={{ fill: 'var(--text-illustration)' }}
            fontSize="16"
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
