import { useUser } from '../context/UserContext';
import { getAllPhases } from '../engine/lifePhase';
import { getElementInfo } from '../engine/elements';
import { getPhaseDeep } from '../engine/phaseDeep';
import { useNavigate } from 'react-router-dom';
import LifeArcVisualization from '../components/hero/LifeArcVisualization';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

export default function LifePhaseDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  const phases = getAllPhases(data.gender);
  const cycleLabel = data.gender === 'female' ? '7-year cycles' : '8-year cycles';

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
      <header className={styles.header}>
        <span className={styles.label}>02 — Life Phase</span>
        <h1>The Nine Seasons</h1>
        <p className={styles.subtitle}>{cycleLabel} — your journey through the five elements</p>
      </header>

      <div className={styles.arcWrap}>
        <LifeArcVisualization currentPhase={data.phase.phase} userElement={data.element} />
      </div>

      <div className={styles.cards}>
        {phases.map((phase) => {
          const phaseEl = getElementInfo(phase.element);
          const isCurrent = phase.phase === data.phase.phase;
          return (
            <GlassCard
              key={phase.phase}
              className={`${isCurrent ? styles.activeCard : ''} ${getPhaseDeep(phase.phase) ? styles.clickable : ''}`}
              glowColor={isCurrent ? `${phaseEl.hex}20` : undefined}
              onClick={getPhaseDeep(phase.phase) ? () => navigate(`/explore/phases/${phase.phase}`) : undefined}
            >
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber} style={{ color: phaseEl.hex }}>
                  {phase.phase}
                </span>
                <div>
                  <h3 className={styles.cardTitle}>{phase.title}</h3>
                  <span className={styles.phaseMeta}>
                    {phase.ageRange.start}–{phase.ageRange.end ?? '∞'} · {phaseEl.chinese} {phaseEl.name} · {phase.season}
                  </span>
                </div>
                {isCurrent && (
                  <span className={styles.currentBadge} style={{ background: `${phaseEl.hex}25`, color: phaseEl.hex }}>
                    You are here
                  </span>
                )}
              </div>
              <p className={styles.phaseQuote}>{phase.subtitle}</p>
              <p className={styles.bodyText}>{phase.description}</p>
              {phase.keywords && (
                <p className={styles.keywords}>{phase.keywords}</p>
              )}
              {getPhaseDeep(phase.phase) && (
                <span className={styles.tapHint}>Read the full chapter →</span>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
