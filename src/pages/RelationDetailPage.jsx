import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo, SHENG_DESCRIPTIONS, KE_DESCRIPTIONS } from '../engine/elements';
import { getRelationship, getShengParent, getShengChild } from '../engine/cycles';
import { getLifePhase } from '../engine/lifePhase';
import { getSpiritBetween, getSpiritByElement } from '../engine/wuShen';
import { EXTRAORDINARY_MERIDIANS } from '../engine/meridians';
import { calculateAge } from '../utils/dateUtils';
import { loadFriends } from '../utils/localStorage';
import GlassCard from '../components/common/GlassCard';
import styles from './RelationDetailPage.module.css';

// Map relationship types to relevant meridians (indices into EXTRAORDINARY_MERIDIANS)
const RELATION_MERIDIANS = {
  same: [0, 4],       // Chong Mai (ancestry/mirror) + Yin Wei Mai (inner coherence)
  sheng_give: [1, 5], // Ren Mai (nourishment) + Yang Wei Mai (evolution)
  sheng_receive: [1, 6], // Ren Mai (receiving) + Yin Qiao Mai (self-trust/receptivity)
  ke_control: [2, 3], // Du Mai (authority) + Dai Mai (shadow/integration)
  ke_controlled: [3, 6], // Dai Mai (containment) + Yin Qiao Mai (inner standing)
};

// Unique relational texts based on the dynamic type
const DYNAMIC_TEXTS = {
  same: {
    opening: 'When the same element meets itself, a mirror appears. This is not simply agreement — it is recognition at the deepest level. You see in each other what you cannot see alone: your gifts amplified, your blind spots reflected back.',
    emotional: 'The emotional field between you resonates on a single frequency. In balance, this creates an intimacy that needs few words — an understanding that arrives before explanation. In shadow, the same frequency can amplify imbalance: if one of you is stuck, the other may feel it in their body before they understand it in their mind.',
    bodyWisdom: 'You share the same organ pair, the same tissue, the same sensory gateway. When one of you is depleted, the other feels it as a subtle disturbance in their own system. This is not codependence — it is elemental resonance. The medicine is the same for both of you.',
    question: 'What do you see in this person that you have not yet fully claimed in yourself?',
  },
  sheng_give: {
    opening: 'You are the nourishing element in this relationship — the one whose nature feeds and sustains the other. This is not a choice; it is the direction of elemental flow. Your presence strengthens them in ways that may be invisible to both of you.',
    emotional: 'There is a natural generosity in this dynamic — your emotional ground supports their emotional expression. But nourishment that flows in only one direction eventually depletes the source. The question is not whether you can give, but whether you can notice when giving has become a habit that costs more than it returns.',
    bodyWisdom: 'Your element\'s organs generate the energy that their element\'s organs need. This is the Sheng cycle in the body — a living, physiological reality, not just a metaphor. Pay attention to your own organ health: when you are depleted, the flow to them diminishes.',
    question: 'Where has your nourishment of this person become automatic — and where does it still carry genuine intention?',
  },
  sheng_receive: {
    opening: 'In this relationship, you are the one being nourished. Their element naturally feeds yours — not through effort or obligation, but through the inherent direction of elemental flow. Their presence strengthens something fundamental in you.',
    emotional: 'Receiving is harder than giving for many people. This relationship asks you to stay open — to allow yourself to be supported, replenished, changed by what another person naturally offers. The shadow is not in their giving, but in your reluctance to need.',
    bodyWisdom: 'Their element\'s organs produce the energy that your organs require. You may notice that you feel physically better in their presence, more grounded, more vital. This is not imagination — it is the Sheng cycle expressing itself through the body.',
    question: 'What would change in this relationship if you allowed yourself to fully receive what is being offered?',
  },
  ke_control: {
    opening: 'Your element naturally tempers and shapes theirs. In the Ke cycle, this is not aggression — it is the discipline that prevents excess from becoming destruction. You bring structure, boundary, and form to something that might otherwise grow without direction.',
    emotional: 'The emotional dynamic carries an inherent tension that can feel uncomfortable but is often exactly what both of you need. You challenge their growth in ways no one else can. The danger is when tempering becomes control — when your shaping of their expression hardens into limitation.',
    bodyWisdom: 'Your element controls theirs in the body\'s own ecosystem. This means you have a physiological influence on their system — your presence can calm what is overactive or contain what is overflowing. But if this dynamic becomes excessive, it suppresses rather than refines.',
    question: 'Where is your influence on this person still serving their growth — and where has it begun to serve your comfort instead?',
  },
  ke_controlled: {
    opening: 'Their element tempers yours. In the Ke cycle, they carry the shaping force — the boundary, the discipline, the containment that your element needs in order to find its truest expression. This can feel like friction, but it is often the friction that polishes.',
    emotional: 'You may sometimes feel held back, limited, or challenged by this person in ways that are difficult to name. This is the Ke dynamic at work — and it is not inherently negative. The discipline they bring may be exactly what you need to refine your own expression. The question is whether you can distinguish healthy tempering from genuine suppression.',
    bodyWisdom: 'Their element has a controlling relationship to the organs that define your constitution. In the body, this means their presence may sometimes feel like pressure — a tightening, a containment. But in balance, this pressure is what creates form: like a riverbank shaping the flow of water.',
    question: 'What has this person\'s presence in your life required you to become that you could not have become alone?',
  },
};

export default function RelationDetailPage() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const friends = loadFriends();
  const friend = friends.find(f => f.id === friendId);

  if (!data || !friend) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/relations')}>← Back</button>
        <p>Person not found.</p>
      </div>
    );
  }

  const userEl = getElementInfo(data.element);
  const friendEl = getElementInfo(friend.element);
  const rel = getRelationship(data.element, friend.element);
  const { spirit, reason } = getSpiritBetween(data.element, friend.element);
  const spiritEl = getElementInfo(spirit.element);

  const userSpirit = getSpiritByElement(data.element);
  const friendSpirit = getSpiritByElement(friend.element);

  const friendAge = calculateAge(friend.birthYear, 6, 15);
  const friendPhase = getLifePhase(Math.max(0, friendAge), friend.gender);
  const friendPhaseEl = getElementInfo(friendPhase.element);
  const userPhaseEl = getElementInfo(data.phase.element);

  const dynamicText = DYNAMIC_TEXTS[rel.type] || DYNAMIC_TEXTS.same;
  const meridianIndices = RELATION_MERIDIANS[rel.type] || [0, 4];
  const meridians = meridianIndices.map(i => EXTRAORDINARY_MERIDIANS[i]);

  // Get the Sheng/Ke cycle description if available
  const cycleKey = `${data.element}_${friend.element}`;
  const reverseCycleKey = `${friend.element}_${data.element}`;
  const shengDesc = SHENG_DESCRIPTIONS[cycleKey] || SHENG_DESCRIPTIONS[reverseCycleKey];
  const keDesc = KE_DESCRIPTIONS[cycleKey] || KE_DESCRIPTIONS[reverseCycleKey];
  const cycleMetaphor = shengDesc || keDesc;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/relations')}>← Relations</button>

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.label}>Your connection with</span>
        <h1>{friend.name}</h1>
        <div className={styles.elementPair}>
          <span className={styles.elementSymbol} style={{ color: userEl.hex }}>{userEl.chinese}</span>
          <span className={styles.pairBridge}>
            {rel.type === 'same' ? '⟷' : rel.type.includes('give') || rel.type.includes('control') ? '→' : '←'}
          </span>
          <span className={styles.elementSymbol} style={{ color: friendEl.hex }}>{friendEl.chinese}</span>
        </div>
        <p className={styles.subtitle}>
          {userEl.name} & {friendEl.name} · {rel.name}
        </p>
      </header>

      <RelationIllustration userColor={userEl.hex} friendColor={friendEl.hex} spiritColor={spiritEl.hex} />

      <div className={styles.cards}>
        {/* ─── The Dynamic ─── */}
        <GlassCard glowColor={`${friendEl.hex}15`}>
          <span className={styles.cardLabel}>The Dynamic</span>
          <h2 className={styles.cardTitle}>{rel.name}</h2>
          {cycleMetaphor && (
            <p className={styles.metaphor}>{cycleMetaphor}</p>
          )}
          <p className={styles.bodyText}>{dynamicText.opening}</p>
          <p className={styles.bodyText}>{rel.description}</p>
        </GlassCard>

        {/* ─── Emotional Landscape ─── */}
        <GlassCard>
          <span className={styles.cardLabel}>Emotional Landscape</span>
          <h2 className={styles.cardTitle}>Where Feeling Meets Feeling</h2>
          <div className={styles.emotionMeeting}>
            <div className={styles.emotionSide}>
              <span className={styles.emotionElement} style={{ color: userEl.hex }}>{userEl.chinese}</span>
              <span className={styles.emotionBalanced}>{userEl.emotion.balanced}</span>
              <span className={styles.emotionShadow}>{userEl.emotion.imbalanced}</span>
            </div>
            <span className={styles.emotionBridge}>meets</span>
            <div className={styles.emotionSide}>
              <span className={styles.emotionElement} style={{ color: friendEl.hex }}>{friendEl.chinese}</span>
              <span className={styles.emotionBalanced}>{friendEl.emotion.balanced}</span>
              <span className={styles.emotionShadow}>{friendEl.emotion.imbalanced}</span>
            </div>
          </div>
          <p className={styles.bodyText}>{dynamicText.emotional}</p>
        </GlassCard>

        {/* ─── Spirit Between ─── */}
        <GlassCard glowColor={`${spiritEl.hex}15`}>
          <span className={styles.cardLabel}>Wu Shen · The Spirit Between You</span>
          <div className={styles.spiritHeader}>
            <span className={styles.spiritChinese} style={{ color: spiritEl.hex }}>{spirit.chinese}</span>
            <div>
              <h2 className={styles.cardTitle}>{spirit.name}</h2>
              <span className={styles.spiritSubtitle}>{spirit.title}</span>
            </div>
          </div>
          <p className={styles.spiritReason}>{reason}</p>
          <p className={styles.bodyText}>{spirit.description}</p>

          <div className={styles.spiritQualities}>
            <div className={styles.qualitySection}>
              <span className={styles.qualityLabel}>When flowing</span>
              <ul className={styles.qualityList}>
                {spirit.balancedQualities.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
            <div className={styles.qualitySection}>
              <span className={styles.qualityLabel}>When disturbed</span>
              <ul className={styles.qualityList}>
                {spirit.imbalancedSigns.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.reflectionBox}>
            <span className={styles.reflectionLabel}>A reflection for this connection</span>
            <p className={styles.reflectionText}>{dynamicText.question}</p>
          </div>
        </GlassCard>

        {/* ─── Body & Resonance ─── */}
        <GlassCard>
          <span className={styles.cardLabel}>Body & Resonance</span>
          <h2 className={styles.cardTitle}>The Physical Field</h2>
          <p className={styles.bodyText}>{dynamicText.bodyWisdom}</p>

          <div className={styles.organPairs}>
            <div className={styles.organPair}>
              <span className={styles.organLabel}>You</span>
              <span className={styles.organValue} style={{ color: userEl.hex }}>
                {userEl.organs.yin} & {userEl.organs.yang}
              </span>
              <span className={styles.organMeta}>
                {userEl.tissue} · {userEl.senseOrgan} · {userEl.taste}
              </span>
            </div>
            <div className={styles.organPair}>
              <span className={styles.organLabel}>{friend.name}</span>
              <span className={styles.organValue} style={{ color: friendEl.hex }}>
                {friendEl.organs.yin} & {friendEl.organs.yang}
              </span>
              <span className={styles.organMeta}>
                {friendEl.tissue} · {friendEl.senseOrgan} · {friendEl.taste}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* ─── Life Seasons ─── */}
        <GlassCard>
          <span className={styles.cardLabel}>Life Seasons</span>
          <h2 className={styles.cardTitle}>Where You Each Stand in Time</h2>

          <div className={styles.phaseComparison}>
            <div className={styles.phaseCard}>
              <span className={styles.phaseNum} style={{ color: userPhaseEl.hex }}>{data.phase.phase}</span>
              <div>
                <span className={styles.phaseName}>You</span>
                <h3 className={styles.phaseTitle}>{data.phase.title}</h3>
                <span className={styles.phaseSeason}>
                  {userPhaseEl.chinese} {userPhaseEl.name} · {data.phase.season}
                </span>
              </div>
            </div>
            <div className={styles.phaseCard}>
              <span className={styles.phaseNum} style={{ color: friendPhaseEl.hex }}>{friendPhase.phase}</span>
              <div>
                <span className={styles.phaseName}>{friend.name}</span>
                <h3 className={styles.phaseTitle}>{friendPhase.title}</h3>
                <span className={styles.phaseSeason}>
                  {friendPhaseEl.chinese} {friendPhaseEl.name} · {friendPhase.season}
                </span>
              </div>
            </div>
          </div>

          <p className={styles.bodyText}>
            {data.phase.phase === friendPhase.phase
              ? `You share the same life season — ${data.phase.title}. This is rare. It means you are navigating the same elemental territory at the same time, carrying similar questions and facing similar thresholds. What one of you learns, the other can recognize.`
              : data.phase.element === friendPhase.element
                ? `Though your phases differ, you share the same element season — ${userPhaseEl.name}. The questions you carry are cousins: different in detail, alike in depth.`
                : `You stand in different seasons: you in ${data.phase.season}, ${friend.name} in ${friendPhase.season}. This is not distance — it is complementarity. What one season lacks, the other provides.`
            }
          </p>

          <p className={styles.phaseInsight}>
            {data.phase.subtitle} — you.
            {friendPhase.subtitle} — {friend.name}.
          </p>
        </GlassCard>

        {/* ─── The Deeper Vessels ─── */}
        <GlassCard>
          <span className={styles.cardLabel}>Qi Jing Ba Mai · Relational Vessels</span>
          <h2 className={styles.cardTitle}>The Depths Between You</h2>
          <p className={styles.bodyText}>
            Beneath the elemental dynamic, extraordinary meridians carry the deeper currents of relationship — what is inherited, what is held, what is becoming.
          </p>

          {meridians.map((m, i) => (
            <div key={i} className={styles.meridianSection}>
              <div className={styles.meridianHeader}>
                <span className={styles.meridianChinese}>{m.chinese}</span>
                <div>
                  <h3 className={styles.meridianName}>{m.name}</h3>
                  <span className={styles.meridianEnglish}>{m.englishName}</span>
                </div>
              </div>
              <p className={styles.meridianEssence}>{m.essence}</p>
              <p className={styles.bodyText}>{m.description}</p>

              <div className={styles.meridianStates}>
                <div>
                  <span className={styles.qualityLabel}>When flowing</span>
                  <p className={styles.stateText}>{m.balanced}</p>
                </div>
                <div>
                  <span className={styles.qualityLabel}>When blocked</span>
                  <p className={styles.stateText}>{m.blocked}</p>
                </div>
              </div>

              <div className={styles.reflectionBox}>
                <span className={styles.reflectionLabel}>Life question</span>
                <p className={styles.reflectionText}>{m.lifeQuestion}</p>
              </div>
            </div>
          ))}
        </GlassCard>

        {/* ─── Spirits You Each Carry ─── */}
        {data.element !== friend.element && (
          <GlassCard>
            <span className={styles.cardLabel}>Wu Shen · Your Spirits</span>
            <h2 className={styles.cardTitle}>What Each of You Brings</h2>

            <div className={styles.spiritPair}>
              <div className={styles.spiritSide}>
                <span className={styles.spiritSideChinese} style={{ color: userEl.hex }}>{userSpirit.chinese}</span>
                <h3 className={styles.spiritSideName}>{userSpirit.name}</h3>
                <span className={styles.spiritSideTitle}>{userSpirit.title}</span>
                <p className={styles.spiritSideDesc}>
                  Rooted in the {userEl.name} element and the {userSpirit.organ}. Your spirit governs {userSpirit.domain.slice(0, 3).join(', ')}.
                </p>
              </div>
              <div className={styles.spiritSide}>
                <span className={styles.spiritSideChinese} style={{ color: friendEl.hex }}>{friendSpirit.chinese}</span>
                <h3 className={styles.spiritSideName}>{friendSpirit.name}</h3>
                <span className={styles.spiritSideTitle}>{friendSpirit.title}</span>
                <p className={styles.spiritSideDesc}>
                  Rooted in the {friendEl.name} element and the {friendSpirit.organ}. {friend.name}'s spirit governs {friendSpirit.domain.slice(0, 3).join(', ')}.
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ─── Final Reflection ─── */}
        <GlassCard>
          <div className={styles.finalReflection}>
            <span className={styles.cardLabel}>A closing thought</span>
            <p className={styles.finalText}>
              No relationship is only one thing. The {rel.name.toLowerCase()} dynamic between {userEl.name} and {friendEl.name} is
              the elemental signature — the ground tone. But within that tone,
              there are harmonics: the spirit that governs the space between you,
              the life seasons you each inhabit, the vessels that carry what words cannot.
              What you do with this knowledge is not to fix or optimize — it is to see more clearly,
              and to meet each other with the kind of attention that only understanding can bring.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function RelationIllustration({ userColor, friendColor, spiritColor }) {
  return (
    <svg viewBox="0 0 240 160" className={styles.illustration}>
      <style>{`
        @keyframes relBreathe1 {
          0%, 100% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
        }
        @keyframes relBreathe2 {
          0%, 100% { transform: translateX(3px); }
          50% { transform: translateX(-3px); }
        }
        @keyframes relPulse {
          0%, 100% { opacity: 0.15; r: 18; }
          50% { opacity: 0.4; r: 24; }
        }
        @keyframes relFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -60; }
        }
      `}</style>

      <defs>
        <radialGradient id="relGrad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={userColor} stopOpacity="0.35" />
          <stop offset="70%" stopColor={userColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={userColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="relGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={friendColor} stopOpacity="0.35" />
          <stop offset="70%" stopColor={friendColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={friendColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Two breathing circles that overlap */}
      <g style={{ animation: 'relBreathe1 12s ease-in-out infinite' }}>
        <circle cx="90" cy="80" r="52" fill="url(#relGrad1)" />
        <circle cx="90" cy="80" r="52" fill="none" stroke={userColor} strokeWidth="1" opacity="0.65" />
        <circle cx="90" cy="80" r="30" fill="none" stroke={userColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 4" />
      </g>

      <g style={{ animation: 'relBreathe2 12s ease-in-out infinite' }}>
        <circle cx="150" cy="80" r="52" fill="url(#relGrad2)" />
        <circle cx="150" cy="80" r="52" fill="none" stroke={friendColor} strokeWidth="1" opacity="0.65" />
        <circle cx="150" cy="80" r="30" fill="none" stroke={friendColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 4" />
      </g>

      {/* Connection line flowing between */}
      <line x1="90" y1="80" x2="150" y2="80"
        style={{ stroke: 'var(--text-illustration-dim)' }} strokeWidth="0.8"
        strokeDasharray="3 6"
        style={{ animation: 'relFlow 8s linear infinite' }}
      />

      {/* Spirit pulse at intersection center */}
      <circle cx="120" cy="80" r="20"
        fill={spiritColor} opacity="0.18"
        style={{ animation: 'relPulse 7s ease-in-out infinite' }}
      />
      <circle cx="120" cy="80" r="3.5" fill={spiritColor} opacity="0.7" />

      {/* Subtle outer rings */}
      <circle cx="120" cy="80" r="70" fill="none" style={{ stroke: 'var(--line-subtle)' }} strokeWidth="0.6" />
      <circle cx="120" cy="80" r="75" fill="none" style={{ stroke: 'var(--line-faint)' }} strokeWidth="0.5" strokeDasharray="1 5" />
    </svg>
  );
}
