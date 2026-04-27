import { useUser } from '../context/UserContext';
import { SPIRITS, SPIRIT_ORDER } from '../engine/wuShen';
import { getElementInfo } from '../engine/elements';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

export default function SpiritsDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
      <header className={styles.header}>
        <span className={styles.label}>03 — The Five Spirits</span>
        <h1>Wu Shen 五神</h1>
        <p className={styles.subtitle}>Five aspects of consciousness residing in the five yin organs</p>
      </header>

      <div className={styles.cards}>
        {SPIRIT_ORDER.map((key) => {
          const spirit = SPIRITS[key];
          const el = getElementInfo(spirit.element);
          const isPersonal = spirit.element === data.element;

          return (
            <GlassCard
              key={key}
              className={isPersonal ? styles.activeCard : ''}
              glowColor={`${el.hex}15`}
            >
              <div className={styles.spiritHeader}>
                <span className={styles.spiritSymbol} style={{ color: el.hex }}>{spirit.chinese}</span>
                <div>
                  <h3 className={styles.cardTitle} style={{ color: el.hex }}>{spirit.name}</h3>
                  <span className={styles.phaseMeta}>{spirit.title}</span>
                </div>
                {isPersonal && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    Your spirit
                  </span>
                )}
              </div>

              <p className={styles.phaseMeta}>{el.chinese} {el.name} · {spirit.organ}</p>
              <p className={styles.bodyText}>{spirit.description}</p>

              <details className={styles.disclose}>
                <summary className={styles.discloseSummary}>Qualities &amp; reflections</summary>

                <div className={styles.twoCol}>
                  <div>
                    <span className={styles.balanceLabel} style={{ color: el.hex }}>In Balance</span>
                    <ul className={styles.list}>
                      {spirit.balancedQualities.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className={styles.balanceLabel}>Out of Balance</span>
                    <ul className={styles.list}>
                      {spirit.imbalancedSigns.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <div className={styles.reflections}>
                  <span className={styles.reflectionsTitle}>Reflections</span>
                  {spirit.reflections.slice(0, 5).map((r, i) => (
                    <p key={i} className={styles.reflection}>{r}</p>
                  ))}
                </div>
              </details>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
