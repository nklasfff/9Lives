import { useUser } from '../context/UserContext';
import { ELEMENT_INFO, SHENG_CYCLE } from '../engine/elements';
import { getSpiritByElement } from '../engine/wuShen';
import { getElementPractice } from '../engine/practices';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

const ELEMENT_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];

export default function ElementDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      <header className={styles.header}>
        <span className={styles.label}>The Five Elements</span>
        <h1>五行 Wu Xing</h1>
        <p className={styles.subtitle}>The five qualities through which life expresses itself</p>
      </header>

      <GlassCard>
        <p className={styles.bodyText}>
          Wood, Fire, Earth, Metal, Water. Not literal substances — qualities. Each describes a way energy moves: rising, expanding, stabilising, refining, sinking. The body, the year, and a human life all move through these five. They feed each other in the Sheng cycle and temper each other in the Ke cycle. Together they form the basic vocabulary of everything that follows.
        </p>
      </GlassCard>

      <div className={styles.cards}>
        {ELEMENT_ORDER.map((elKey) => {
          const el = ELEMENT_INFO[elKey];
          const spirit = getSpiritByElement(elKey);
          const practice = getElementPractice(elKey);
          const isUser = elKey === data.element;

          // Compute sheng parent / child
          const idx = SHENG_CYCLE.indexOf(elKey);
          const parentEl = ELEMENT_INFO[SHENG_CYCLE[(idx - 1 + 5) % 5]];
          const childEl = ELEMENT_INFO[SHENG_CYCLE[(idx + 1) % 5]];

          return (
            <GlassCard
              key={elKey}
              className={isUser ? styles.activeCard : ''}
              glowColor={`${el.hex}${isUser ? '20' : '10'}`}
            >
              <div className={styles.spiritHeader}>
                <span className={styles.spiritSymbol} style={{ color: el.hex }}>{el.chinese}</span>
                <div>
                  <h3 className={styles.cardTitle} style={{ color: el.hex }}>{el.name}</h3>
                  <span className={styles.phaseMeta}>{el.season} · {el.quality}</span>
                </div>
                {isUser && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    You are here
                  </span>
                )}
              </div>

              <p className={styles.bodyText}>{el.description}</p>

              <div className={styles.twoCol}>
                <div>
                  <span className={styles.balanceLabel} style={{ color: el.hex }}>In Balance</span>
                  <p className={styles.bodyText}>{el.emotion.balanced} — {el.organs.yin} &amp; {el.organs.yang}</p>
                </div>
                <div>
                  <span className={styles.balanceLabel}>Out of Balance</span>
                  <p className={styles.bodyText}>{el.emotion.imbalanced} — {el.imbalancedDescription}</p>
                </div>
              </div>

              {spirit && (
                <p className={styles.cycleDesc}>
                  <span style={{ color: el.hex }}>{spirit.chinese} {spirit.name}</span> — {spirit.title}
                </p>
              )}

              <details className={styles.disclose}>
                <summary className={styles.discloseSummary}>Cycle &amp; practice</summary>
                <div className={styles.cycleItem}>
                  <span className={styles.cycleLabel} style={{ color: parentEl.hex }}>{parentEl.chinese} {parentEl.name}</span>
                  <span className={styles.cycleArrow}>→</span>
                  <span className={styles.cycleLabel} style={{ color: el.hex }}>{el.chinese} {el.name}</span>
                  <span className={styles.cycleArrow}>→</span>
                  <span className={styles.cycleLabel} style={{ color: childEl.hex }}>{childEl.chinese} {childEl.name}</span>
                </div>

                {practice && (
                  <div className={styles.elementPractice}>
                    <div className={styles.elementPracticeRow}>
                      <span className={styles.balanceLabel} style={{ color: el.hex }}>食 Nourishment</span>
                      <p className={styles.bodyText}>{practice.dietBody}</p>
                    </div>
                    <div className={styles.elementPracticeRow}>
                      <span className={styles.balanceLabel} style={{ color: el.hex }}>移 Movement</span>
                      <p className={styles.bodyText}>{practice.exerciseBody}</p>
                    </div>
                  </div>
                )}
              </details>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
