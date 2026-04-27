import { EXTRAORDINARY_MERIDIANS } from '../engine/meridians';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

export default function DepthDetailPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
      <header className={styles.header}>
        <span className={styles.label}>06 — The Depths</span>
        <h1>Qi Jing Ba Mai</h1>
        <p className={styles.subtitle}>Eight extraordinary vessels carrying your deepest patterns</p>
      </header>

      <div className={styles.cards}>
        {EXTRAORDINARY_MERIDIANS.map((m, i) => (
          <GlassCard key={i}>
            <div className={styles.meridianHeader}>
              <span className={styles.meridianChinese}>{m.chinese}</span>
              <div>
                <h3 className={styles.cardTitle}>{m.name}</h3>
                <span className={styles.phaseMeta}>{m.englishName}</span>
              </div>
            </div>

            <p className={styles.meridianEssence}>{m.essence}</p>

            <details className={styles.disclose}>
              <summary className={styles.discloseSummary}>Read deeper</summary>

              <p className={styles.bodyText}>{m.description}</p>

              <div className={styles.meridianStates}>
                <div>
                  <span className={styles.balanceLabel} style={{ color: 'var(--element-water)' }}>In Flow</span>
                  <p className={styles.bodyText}>{m.balanced}</p>
                </div>
                <div>
                  <span className={styles.balanceLabel}>Blocked</span>
                  <p className={styles.bodyText}>{m.blocked}</p>
                </div>
              </div>

              <div className={styles.lifeQuestion}>
                <p className={styles.questionText}>{m.lifeQuestion}</p>
              </div>
            </details>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
