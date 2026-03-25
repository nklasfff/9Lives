import { useUser } from '../context/UserContext';
import { getElementInfo, SHENG_CYCLE, SHENG_DESCRIPTIONS, KE_DESCRIPTIONS } from '../engine/elements';
import { getSpiritByElement } from '../engine/wuShen';
import { getElementPractice } from '../engine/practices';
import { useNavigate } from 'react-router-dom';
import { getPhasePractices } from '../engine/phasePractices';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

export default function ElementDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  const el = getElementInfo(data.element);
  const spirit = getSpiritByElement(data.element);
  const practice = getElementPractice(data.element);

  const shengParentIdx = (SHENG_CYCLE.indexOf(data.element) - 1 + 5) % 5;
  const shengChildIdx = (SHENG_CYCLE.indexOf(data.element) + 1) % 5;
  const shengParent = getElementInfo(SHENG_CYCLE[shengParentIdx]);
  const shengChild = getElementInfo(SHENG_CYCLE[shengChildIdx]);
  const shengReceiveKey = `${SHENG_CYCLE[shengParentIdx]}_${data.element}`;
  const shengGiveKey = `${data.element}_${SHENG_CYCLE[shengChildIdx]}`;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>
      <header className={styles.header}>
        <span className={styles.label}>01 — Your Element</span>
        <div className={styles.bigSymbol} style={{ color: el.hex }}>{el.chinese}</div>
        <h1 style={{ color: el.hex }}>{el.name}</h1>
        <p className={styles.subtitle}>{el.quality}</p>
      </header>

      <div className={styles.cards}>
        <GlassCard>
          <p className={styles.bodyText}>{el.description}</p>
        </GlassCard>

        <GlassCard>
          <h3 className={styles.cardTitle}>Correspondences</h3>
          <div className={styles.grid}>
            <Row label="Season" value={el.season} />
            <Row label="Direction" value={el.direction} />
            <Row label="Color" value={el.elementColor} />
            <Row label="Yin Organ" value={el.organs.yin} />
            <Row label="Yang Organ" value={el.organs.yang} />
            <Row label="Taste" value={el.taste} />
            <Row label="Sense" value={`${el.sense} (${el.senseOrgan})`} />
            <Row label="Tissue" value={el.tissue} />
            <Row label="Organ Clock" value={el.organClockTime} />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className={styles.cardTitle}>Balance & Imbalance</h3>
          <div className={styles.balanceRow}>
            <div>
              <span className={styles.balanceLabel} style={{ color: el.hex }}>In Balance</span>
              <p className={styles.bodyText}>{el.emotion.balanced} — {el.description.split('. When')[0].split('. ').pop()}</p>
            </div>
          </div>
          <div className={styles.balanceRow}>
            <div>
              <span className={styles.balanceLabel} style={{ color: 'var(--text-muted)' }}>Out of Balance</span>
              <p className={styles.bodyText}>{el.imbalancedDescription}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className={styles.cardTitle}>The Nourishing Cycle</h3>
          <div className={styles.cycleItem}>
            <span className={styles.cycleLabel} style={{ color: shengParent.hex }}>{shengParent.chinese} {shengParent.name}</span>
            <span className={styles.cycleArrow}>→</span>
            <span className={styles.cycleLabel} style={{ color: el.hex }}>{el.chinese} {el.name}</span>
          </div>
          <p className={styles.cycleDesc}>{SHENG_DESCRIPTIONS[shengReceiveKey] || ''}</p>
          <div className={styles.cycleItem}>
            <span className={styles.cycleLabel} style={{ color: el.hex }}>{el.chinese} {el.name}</span>
            <span className={styles.cycleArrow}>→</span>
            <span className={styles.cycleLabel} style={{ color: shengChild.hex }}>{shengChild.chinese} {shengChild.name}</span>
          </div>
          <p className={styles.cycleDesc}>{SHENG_DESCRIPTIONS[shengGiveKey] || ''}</p>
        </GlassCard>

        {spirit && (
          <GlassCard glowColor={`${el.hex}15`}>
            <h3 className={styles.cardTitle}>Your Spirit — {spirit.chinese} {spirit.name}</h3>
            <p className={styles.spiritTitle}>{spirit.title}</p>
            <p className={styles.bodyText}>{spirit.description}</p>
          </GlassCard>
        )}

        <GlassCard glowColor={`${el.hex}12`} onClick={() => navigate('/practice')} className={styles.clickable}>
          <div className={styles.practiceEntryRow}>
            <span className={styles.practiceEntryChar} style={{ color: el.hex }}>移食</span>
            <div>
              <h3 className={styles.cardTitle}>Øvelser &amp; Kost</h3>
              <p className={styles.bodyText}>Åndedræt, meridianstrygning, yin yoga, refleksion og kostråd — valgt specifikt til din fase.</p>
            </div>
          </div>
          <span className={styles.tapHint}>Udforsk din fases praksis →</span>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}
