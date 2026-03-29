import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getTimelineGroupedByWeek } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import styles from './TimelinePage.module.css';

function formatWeek(dateStr) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en', { month: 'long' });
  const day = d.getDate();
  return `Week of ${month} ${day}`;
}

function formatEntryDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getStepLabel(step) {
  if (step === 'theme') return 'Reflection';
  if (step === 'body') return 'Body';
  if (step === 'time') return 'Time';
  return step;
}

export default function TimelinePage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const phaseEl = getElementInfo(data?.phase?.element || 'water');

  const weeks = useMemo(() => getTimelineGroupedByWeek(), []);

  if (!data) return null;

  const hasEntries = weeks.length > 0;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      <header className={styles.header}>
        <span className={styles.phaseLabel}>Phase {data.phase.phase} · {data.phase.season}</span>
        <h1 className={styles.title} style={{ color: phaseEl.hex }}>Timeline</h1>
        <p className={styles.subtitle}>Your reflections over time</p>
      </header>

      <TimelineIllustration color={phaseEl.hex} count={weeks.length} />

      {!hasEntries && (
        <>
          <GlassCard>
            <p className={styles.emptyText}>
              Your timeline begins when you write your first reflection.
              Each entry becomes a point of light — and over time,
              a picture of how you move through this phase.
            </p>
          </GlassCard>
          <button className={styles.startBtn} onClick={() => navigate('/explore/journal')}>
            Begin your first reflection →
          </button>
        </>
      )}

      {hasEntries && (
        <div className={styles.timeline}>
          {weeks.map((week, wi) => (
            <div key={week.weekOf} className={styles.weekGroup}>
              <div className={styles.weekHeader}>
                <span className={styles.weekLine} style={{ background: phaseEl.hex }} />
                <span className={styles.weekLabel}>{formatWeek(week.weekOf)}</span>
              </div>

              {week.entries.map((entry, ei) => (
                <div key={entry.id} className={styles.entryRow}>
                  <div className={styles.entryDot} style={{ background: phaseEl.hex }} />
                  <GlassCard className={styles.entryCard}>
                    <div className={styles.entryMeta}>
                      <span className={styles.entryStep} style={{ color: phaseEl.hex }}>
                        {entry.type === 'journal' ? getStepLabel(entry.step) : 'Choice'}
                      </span>
                      <span className={styles.entryDate}>{formatEntryDate(entry.date)}</span>
                    </div>
                    {entry.type === 'journal' && (
                      <>
                        <p className={styles.entryPrompt}>{entry.prompt}</p>
                        <p className={styles.entryText}>{entry.text}</p>
                      </>
                    )}
                    {entry.type === 'reflection' && (
                      <p className={styles.entryText}>{entry.choiceText}</p>
                    )}
                  </GlassCard>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {hasEntries && (
        <>
          {weeks.length >= 2 && (
            <GlassCard glowColor={`${phaseEl.hex}12`}>
              <p className={styles.insightText}>
                <span className={styles.insightLabel} style={{ color: phaseEl.hex }}>
                  {weeks.length} week{weeks.length === 1 ? '' : 's'} of reflections
                </span>
                The questions stay the same, but your answers shift.
                That movement is the work — even when it feels like nothing is changing.
              </p>
            </GlassCard>
          )}

          <button className={styles.startBtn} onClick={() => navigate('/explore/journal')}>
            Add a new reflection →
          </button>
        </>
      )}

      <ClosingIllustration color={phaseEl.hex} />
    </div>
  );
}

function TimelineIllustration({ color, count }) {
  const dots = Math.min(Math.max(count, 3), 8);
  return (
    <svg viewBox="0 0 200 60" className={styles.illustration}>
      <style>{`
        @keyframes tlPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
        @keyframes tlFlow { 0% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
      `}</style>
      <line x1="20" y1="30" x2="180" y2="30" stroke={color} strokeWidth="0.6" opacity="0.2"
        strokeDasharray="4 4" style={{ animation: 'tlFlow 8s linear infinite' }} />
      {Array.from({ length: dots }, (_, i) => {
        const x = 20 + i * (160 / (dots - 1));
        return (
          <circle key={i} cx={x} cy="30" r={i === dots - 1 ? 4 : 2.5} fill={color}
            opacity={0.2 + (i / dots) * 0.4}
            style={{ animation: `tlPulse ${4 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }} />
        );
      })}
    </svg>
  );
}

function ClosingIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 40" className={styles.illustration}>
      <style>{`@keyframes tlFade { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.35; } }`}</style>
      <path d="M 30 20 Q 65 8 100 20 Q 135 32 170 20" fill="none" stroke={color}
        strokeWidth="0.6" opacity="0.25" style={{ animation: 'tlFade 7s ease-in-out infinite' }} />
    </svg>
  );
}
