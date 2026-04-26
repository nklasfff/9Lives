import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrgan, hasDepthContent, ELEMENT_GROUP_ORDER } from '../engine/organs';
import { getElementInfo } from '../engine/elements';
import { getCurrentOrgan } from '../engine/organClock';
import { SPIRITS } from '../engine/wuShen';
import { saveOrganReflection, getLatestOrganReflectionForQuestion } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import styles from './OrganDeepPage.module.css';

function LifeQuestion({ organKey, questionIndex, question, color }) {
  const existing = getLatestOrganReflectionForQuestion(organKey, questionIndex);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing ? existing.text : '');
  const [savedReflection, setSavedReflection] = useState(existing);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    saveOrganReflection(organKey, questionIndex, question, trimmed);
    setSavedReflection({ text: trimmed, date: new Date().toISOString() });
    setJustSaved(true);
    setOpen(false);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className={styles.questionBlock}>
      <p className={styles.question}>{question}</p>
      {savedReflection && !open && (
        <div className={styles.savedReflection} style={{ borderLeftColor: `${color}55` }}>
          <span className={styles.savedDate}>
            {new Date(savedReflection.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <p className={styles.savedText}>{savedReflection.text}</p>
        </div>
      )}
      {!open ? (
        <button
          className={styles.reflectBtn}
          style={{ color }}
          onClick={() => setOpen(true)}
        >
          {savedReflection ? 'Edit your reflection' : 'Reflect →'}
          {justSaved && <span className={styles.savedFlash}> · saved</span>}
        </button>
      ) : (
        <div className={styles.reflectArea}>
          <textarea
            className={styles.reflectTextarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write what comes up. Nothing has to be polished."
            rows={5}
            autoFocus
          />
          <div className={styles.reflectActions}>
            <button
              className={styles.reflectCancel}
              onClick={() => { setOpen(false); setText(savedReflection ? savedReflection.text : ''); }}
            >Cancel</button>
            <button
              className={styles.reflectSave}
              style={{ background: `${color}25`, color }}
              disabled={!text.trim()}
              onClick={handleSave}
            >Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

function previewSentences(text, count = 2) {
  if (!text) return '';
  const parts = text.split(/(?<=[.!?])\s+/);
  if (parts.length <= count) return text;
  return parts.slice(0, count).join(' ');
}

function CollapsibleDescription({ text, color }) {
  const [open, setOpen] = useState(false);
  const preview = previewSentences(text, 2);
  const isTruncated = preview !== text;
  return (
    <GlassCard
      glowColor={`${color}0a`}
      onClick={isTruncated ? () => setOpen(!open) : undefined}
      className={isTruncated ? styles.collapsibleCard : ''}
    >
      <p className={styles.description}>{open ? text : preview}</p>
      {isTruncated && (
        <span className={styles.readMore} style={{ color }}>
          {open ? '↑ Show less' : 'Read more →'}
        </span>
      )}
    </GlassCard>
  );
}

function CollapsibleTheme({ num, title, body, color }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard
      glowColor={`${color}0d`}
      onClick={() => setOpen(!open)}
      className={styles.collapsibleCard}
    >
      <div className={styles.themeHeader}>
        <span className={styles.themeNum}>{num}</span>
        <h3 className={styles.themeTitle}>{title}</h3>
        <span className={styles.expandIcon} style={{ color }}>{open ? '−' : '+'}</span>
      </div>
      {open ? (
        <p className={styles.themeBody}>{body}</p>
      ) : (
        <span className={styles.readMore} style={{ color }}>Read more →</span>
      )}
    </GlassCard>
  );
}

export default function OrganDeepPage() {
  const { organKey } = useParams();
  const navigate = useNavigate();
  const organ = getOrgan(organKey);

  if (!organ) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/explore/organs')}>Back</button>
        <div className={styles.comingSoon}>
          <h2>Organ not found</h2>
          <p className={styles.comingSoonNote}>The organ you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const el = getElementInfo(organ.element);
  const partner = getOrgan(organ.partner);
  const spirit = SPIRITS[organ.spirit];
  const current = getCurrentOrgan();
  const isActive = current && current.key === organ.key;
  const hasDepth = hasDepthContent(organ);

  const groupIdx = ELEMENT_GROUP_ORDER.indexOf(organ.key);
  const prevKey = ELEMENT_GROUP_ORDER[(groupIdx - 1 + ELEMENT_GROUP_ORDER.length) % ELEMENT_GROUP_ORDER.length];
  const nextKey = ELEMENT_GROUP_ORDER[(groupIdx + 1) % ELEMENT_GROUP_ORDER.length];
  const prevOrgan = getOrgan(prevKey);
  const nextOrgan = getOrgan(nextKey);
  const prevEl = prevOrgan && getElementInfo(prevOrgan.element);
  const nextEl = nextOrgan && getElementInfo(nextOrgan.element);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore/organs')}>Back</button>

      <header className={styles.header}>
        <span className={styles.label}>{el.name} · {organ.yinYang === 'yin' ? 'Yin' : 'Yang'}</span>
        <div className={styles.chinese} style={{ color: el.hex }}>{organ.chinese}</div>
        <h1 className={styles.title}>{organ.name}</h1>
        <span className={styles.englishName}>{organ.englishName}</span>
        {isActive && (
          <span className={styles.activeBadge} style={{ background: `${el.hex}25`, color: el.hex }}>
            Active now
          </span>
        )}

        <div className={styles.pillRow}>
          <span className={styles.pill}>{organ.organClockTime}</span>
          {partner && (
            <span
              className={`${styles.pill} ${styles.pillLink}`}
              onClick={() => navigate(`/explore/organs/${partner.key}`)}
            >
              ⇄ {partner.name}
            </span>
          )}
          {spirit && (
            <span
              className={`${styles.pill} ${styles.pillLink}`}
              onClick={() => navigate('/explore/spirits')}
            >
              {spirit.chinese} {spirit.name}
            </span>
          )}
          <span className={styles.pill}>
            {organ.emotion.balanced} · {organ.emotion.imbalanced}
          </span>
        </div>
      </header>

      <OrganBreathIllustration color={el.hex} />

      <div className={styles.cards}>
        {!hasDepth && (
          <GlassCard>
            <p className={styles.description} style={{ fontStyle: 'italic' }}>
              {organ.essence}
            </p>
          </GlassCard>
        )}

        {hasDepth && (
          <>
            <CollapsibleDescription text={organ.description} color={el.hex} />

            <GlassCard>
              <div className={styles.balanceGrid}>
                <div>
                  <span className={styles.balanceLabelAccent} style={{ color: el.hex }}>In Balance</span>
                  <p className={styles.balanceText}>{organ.balanced}</p>
                </div>
                <div>
                  <span className={styles.balanceLabel}>Out of Balance</span>
                  <p className={styles.balanceText}>{organ.blocked}</p>
                </div>
              </div>
            </GlassCard>

            <YinYangIllustration color={el.hex} chinese={organ.chinese} partnerChinese={partner?.chinese} />

            <h2 className={styles.themesTitle}>Six Themes</h2>
            {organ.themes.map((theme, i) => (
              <CollapsibleTheme
                key={i}
                num={String(i + 1).padStart(2, '0')}
                title={theme.title}
                body={theme.body}
                color={el.hex}
              />
            ))}

            <GlassCard
              className={styles.questionsCard}
              glowColor={`${el.hex}15`}
              style={{ borderLeft: `2px solid ${el.hex}55` }}
            >
              <span className={styles.questionsTitle}>Life Questions</span>
              {organ.lifeQuestions.map((q, i) => (
                <LifeQuestion
                  key={i}
                  organKey={organ.key}
                  questionIndex={i}
                  question={q}
                  color={el.hex}
                />
              ))}
            </GlassCard>
          </>
        )}

        {!hasDepth && (
          <GlassCard>
            <div className={styles.comingSoon}>
              <h2 style={{ color: el.hex }}>Depth coming soon</h2>
              <p className={styles.comingSoonNote}>
                The full poetic depth for {organ.name} is being written. For now, this organ lives
                in the organ clock and on the listing page — the deeper themes, balanced and blocked
                states, and life questions will be added in the next phase.
              </p>
            </div>
          </GlassCard>
        )}

        {(partner || spirit) && (
          <div>
            <h2 className={styles.themesTitle}>Connections</h2>
            <div className={styles.linksRow}>
              {partner && (
                <GlassCard
                  className={styles.linkCard}
                  glowColor={`${el.hex}10`}
                  onClick={() => navigate(`/explore/organs/${partner.key}`)}
                >
                  <span className={styles.linkLabel}>Partner organ</span>
                  <span className={styles.linkChinese} style={{ color: el.hex }}>{partner.chinese}</span>
                  <span className={styles.linkName}>{partner.name}</span>
                </GlassCard>
              )}
              {spirit && (
                <GlassCard
                  className={styles.linkCard}
                  glowColor={`${el.hex}10`}
                  onClick={() => navigate('/explore/spirits')}
                >
                  <span className={styles.linkLabel}>Resident spirit</span>
                  <span className={styles.linkChinese} style={{ color: el.hex }}>{spirit.chinese}</span>
                  <span className={styles.linkName}>{spirit.name}</span>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {prevOrgan && nextOrgan && (
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={() => navigate(`/explore/organs/${prevOrgan.key}`)}
            >
              <span className={styles.navArrow} style={{ color: prevEl.hex }}>←</span>
              <span className={styles.navLabel}>
                <span className={styles.navChinese} style={{ color: prevEl.hex }}>{prevOrgan.chinese}</span>
                <span className={styles.navName}>{prevOrgan.name}</span>
              </span>
            </button>
            <button
              className={`${styles.navBtn} ${styles.navBtnRight}`}
              onClick={() => navigate(`/explore/organs/${nextOrgan.key}`)}
            >
              <span className={styles.navLabel}>
                <span className={styles.navChinese} style={{ color: nextEl.hex }}>{nextOrgan.chinese}</span>
                <span className={styles.navName}>{nextOrgan.name}</span>
              </span>
              <span className={styles.navArrow} style={{ color: nextEl.hex }}>→</span>
            </button>
          </div>
        )}

        <button className={styles.topBtn} onClick={scrollToTop}>↑ Back to top</button>
      </div>
    </div>
  );
}

/* === Illustrations === */

function OrganBreathIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 90" className={styles.heroIllustration}>
      <style>{`
        @keyframes orgBreathRing { 0%, 100% { r: 22; opacity: 0.35; } 50% { r: 32; opacity: 0.1; } }
        @keyframes orgBreathInner { 0%, 100% { r: 8; opacity: 0.55; } 50% { r: 12; opacity: 0.85; } }
        @keyframes orgBreathDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
      `}</style>
      <circle cx="100" cy="45" r="22" fill="none" stroke={color} strokeWidth="0.7" opacity="0.35"
        style={{ animation: 'orgBreathRing 8s ease-in-out infinite' }} />
      <circle cx="100" cy="45" r="14" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <circle cx="100" cy="45" r="8" fill={color} opacity="0.18"
        style={{ animation: 'orgBreathInner 6s ease-in-out infinite' }} />
      <circle cx="100" cy="45" r="3" fill={color} opacity="0.55" />
      {[60, 100, 140].map((x, i) => (
        <circle key={i} cx={x} cy={75} r="1.5" fill={color} opacity="0.3"
          style={{ animation: `orgBreathDot ${4 + i}s ease-in-out ${i * 1.2}s infinite` }} />
      ))}
    </svg>
  );
}

function YinYangIllustration({ color, chinese, partnerChinese }) {
  return (
    <svg viewBox="0 0 200 100" className={styles.illustration}>
      <style>{`
        @keyframes yyOrbit { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes yyLine { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -12; } }
      `}</style>
      <circle cx="60" cy="50" r="22" fill={color} opacity="0.08" />
      <circle cx="60" cy="50" r="22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4"
        style={{ animation: 'yyOrbit 7s ease-in-out infinite' }} />
      <text x="60" y="52" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize="22" fontWeight="300" opacity="0.7" fontFamily="var(--font-display)">
        {chinese}
      </text>

      <line x1="84" y1="50" x2="116" y2="50" stroke={color} strokeWidth="0.6" opacity="0.4"
        strokeDasharray="3 3" style={{ animation: 'yyLine 4s linear infinite' }} />

      <circle cx="140" cy="50" r="22" fill={color} opacity="0.05" />
      <circle cx="140" cy="50" r="22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3"
        style={{ animation: 'yyOrbit 7s ease-in-out 1.5s infinite' }} />
      {partnerChinese && (
        <text x="140" y="52" textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize="18" fontWeight="300" opacity="0.55" fontFamily="var(--font-display)">
          {partnerChinese}
        </text>
      )}
    </svg>
  );
}
