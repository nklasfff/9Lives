import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, getDayPillar, getYearPillar } from '../engine/calendar';
import { getElementInfo } from '../engine/elements';
import GlassCard from '../components/common/GlassCard';
import styles from './DetailPage.module.css';

export default function CalendarDetailPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  if (!data) return null;

  const today = new Date();
  const birthDate = new Date(data.birthDate.year, data.birthDate.month - 1, data.birthDate.day);
  const birthDay = getDayPillar(birthDate);
  const birthYear = getYearPillar(data.birthDate.year);
  const todayPillar = getDayPillar(today);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      <header className={styles.header}>
        <span className={styles.label}>06 — The Calendar</span>
        <h1>干支 Gan Zhi</h1>
        <p className={styles.subtitle}>Ten heavenly stems, twelve earthly branches — the engine that reads any day</p>
      </header>

      <CalendarIllustration />

      <GlassCard>
        <p className={styles.bodyText}>
          The Chinese calendar measures time not as numbers on a grid but as a pairing of qualities.
          Each day, each year, each hour is a meeting of one of ten Heavenly Stems with one of twelve
          Earthly Branches — the stems carrying the upper, generative force, the branches carrying
          the grounded, embodied form. From this pairing comes the day-pillar your app reads, the
          year-pillar of your birth, and the twelve animals that name each two-hour window of the day.
        </p>
      </GlassCard>

      {/* Your birth-pillars — your personal anchor in the system */}
      <GlassCard glowColor={`${getElementInfo(birthDay.element).hex}15`}>
        <span className={styles.label}>Your birth in this system</span>
        <div className={styles.birthGrid}>
          <BirthPillarRow
            label="Year of birth"
            year={data.birthDate.year}
            stem={birthYear.stem}
            branch={birthYear.branch}
          />
          <BirthPillarRow
            label="Day of birth"
            year={`${data.birthDate.month}/${data.birthDate.day}/${data.birthDate.year}`}
            stem={HEAVENLY_STEMS.find(s => s.name === birthDay.stem)}
            branch={EARTHLY_BRANCHES.find(b => b.name === birthDay.branch)}
          />
        </div>
      </GlassCard>

      {/* Heavenly stems */}
      <section className={styles.cards}>
        <div className={styles.sectionHeading}>
          <span className={styles.label}>The Ten Heavenly Stems</span>
          <h2 className={styles.sectionTitle}>天干 Tian Gan</h2>
          <p className={styles.subtitle}>The upper force — generative, paired yin and yang in each element</p>
        </div>

        {HEAVENLY_STEMS.map((stem) => {
          const el = getElementInfo(stem.element);
          const isBirth = stem.name === birthDay.stem;
          const isToday = stem.name === todayPillar.stem;
          return (
            <GlassCard
              key={stem.name}
              className={isBirth || isToday ? styles.activeCard : ''}
              glowColor={`${el.hex}${isBirth ? '20' : '0a'}`}
            >
              <div className={styles.spiritHeader}>
                <span className={styles.spiritSymbol} style={{ color: el.hex }}>{stem.chinese}</span>
                <div>
                  <h3 className={styles.cardTitle} style={{ color: el.hex }}>{stem.name}</h3>
                  <span className={styles.phaseMeta}>
                    {stem.yinYang === 'yang' ? 'Yang' : 'Yin'} {el.name}
                  </span>
                </div>
                {isBirth && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    Your birth-stem
                  </span>
                )}
                {!isBirth && isToday && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    Today
                  </span>
                )}
              </div>
              <p className={styles.bodyText}>{stem.image}</p>
            </GlassCard>
          );
        })}
      </section>

      {/* Earthly branches */}
      <section className={styles.cards}>
        <div className={styles.sectionHeading}>
          <span className={styles.label}>The Twelve Earthly Branches</span>
          <h2 className={styles.sectionTitle}>地支 Di Zhi</h2>
          <p className={styles.subtitle}>The lower form — twelve animals, twelve seasons of the day and the year</p>
        </div>

        {EARTHLY_BRANCHES.map((branch) => {
          const el = getElementInfo(branch.element);
          const isBirth = branch.name === birthDay.branch;
          const isToday = branch.name === todayPillar.branch;
          return (
            <GlassCard
              key={branch.name}
              className={isBirth || isToday ? styles.activeCard : ''}
              glowColor={`${el.hex}${isBirth ? '20' : '0a'}`}
            >
              <div className={styles.spiritHeader}>
                <span className={styles.spiritSymbol} style={{ color: el.hex }}>{branch.chinese}</span>
                <div>
                  <h3 className={styles.cardTitle} style={{ color: el.hex }}>{branch.name} · the {branch.animal}</h3>
                  <span className={styles.phaseMeta}>
                    {branch.hours} · {branch.season} · {branch.yinYang === 'yang' ? 'Yang' : 'Yin'} {el.name}
                  </span>
                </div>
                {isBirth && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    Your birth-branch
                  </span>
                )}
                {!isBirth && isToday && (
                  <span className={styles.currentBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
                    Today
                  </span>
                )}
              </div>
              <p className={styles.bodyText}>{branch.character}</p>
            </GlassCard>
          );
        })}
      </section>
    </div>
  );
}

function BirthPillarRow({ label, year, stem, branch }) {
  if (!stem || !branch) return null;
  const stemEl = getElementInfo(stem.element);
  const branchEl = getElementInfo(branch.element);
  return (
    <div className={styles.birthRow}>
      <span className={styles.birthLabel}>{label}</span>
      <span className={styles.birthDate}>{year}</span>
      <span className={styles.birthChars}>
        <span style={{ color: stemEl.hex }}>{stem.chinese}</span>
        <span style={{ color: branchEl.hex }}>{branch.chinese}</span>
      </span>
      <span className={styles.birthName}>
        {stem.name}-{branch.name}
        {' · '}
        <span style={{ color: branchEl.hex }}>the {branch.animal}</span>
      </span>
    </div>
  );
}

function CalendarIllustration() {
  // Two concentric arcs: 10 stems on the outer ring, 12 branches on the inner.
  const cx = 110, cy = 95, outerR = 70, innerR = 42;
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const stemColors = ['#4a9e6e', '#4a9e6e', '#c75a3a', '#c75a3a', '#c9a84c', '#c9a84c', '#a8b8c8', '#a8b8c8', '#3a6fa0', '#3a6fa0'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const branchColors = ['#3a6fa0', '#c9a84c', '#4a9e6e', '#4a9e6e', '#c9a84c', '#c75a3a', '#c75a3a', '#c9a84c', '#a8b8c8', '#a8b8c8', '#c9a84c', '#3a6fa0'];

  return (
    <svg viewBox="0 0 220 190" className={styles.heroIllustration}>
      <style>{`
        @keyframes ganZhiBreathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.65; } }
        @keyframes ganZhiCore { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.55; } }
        @keyframes ganZhiSlowSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={outerR + 8} fill="none"
        style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.4" strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r={outerR} fill="none"
        style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none"
        style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.5" />

      {/* Stems on outer ring */}
      {stems.map((char, i) => {
        const a = (-90 + (i * 360) / 10) * (Math.PI / 180);
        const x = cx + outerR * Math.cos(a);
        const y = cy + outerR * Math.sin(a);
        return (
          <text key={`s-${i}`} x={x} y={y + 1}
            textAnchor="middle" dominantBaseline="central"
            fill={stemColors[i]}
            fontSize="7.5" fontWeight="300"
            opacity="0.6"
            style={{ animation: `ganZhiBreathe ${8 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
          >
            {char}
          </text>
        );
      })}

      {/* Branches on inner ring */}
      {branches.map((char, i) => {
        const a = (-90 + (i * 360) / 12) * (Math.PI / 180);
        const x = cx + innerR * Math.cos(a);
        const y = cy + innerR * Math.sin(a);
        return (
          <text key={`b-${i}`} x={x} y={y + 1}
            textAnchor="middle" dominantBaseline="central"
            fill={branchColors[i]}
            fontSize="6.5" fontWeight="300"
            opacity="0.5"
            style={{ animation: `ganZhiBreathe ${10 + i * 0.3}s ease-in-out ${i * 0.4}s infinite` }}
          >
            {char}
          </text>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r="4"
        style={{ fill: 'var(--dot-illustration)', animation: 'ganZhiCore 6s ease-in-out infinite' }} />
    </svg>
  );
}
