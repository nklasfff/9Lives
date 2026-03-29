import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getElementInfo } from '../engine/elements';
import { getJournalPrompts, getJournalSummaryMessage } from '../engine/journalPrompts';
import { saveJournalEntry, getJournalForPhase } from '../utils/reflectionStore';
import GlassCard from '../components/common/GlassCard';
import styles from './JournalPage.module.css';

export default function JournalPage() {
  const navigate = useNavigate();
  const { getDerivedData } = useUser();
  const data = getDerivedData();
  const el = getElementInfo(data.element);
  const phaseEl = getElementInfo(data.phase.element);
  const prompts = getJournalPrompts(data.phase.element);
  const pastEntries = getJournalForPhase(data.phase.phase);

  // Steps: 'choose' → 'body' → 'time' → 'summary'
  const [step, setStep] = useState('choose');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themeText, setThemeText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [saved, setSaved] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [step]);

  if (!data) return null;

  const handleChooseTheme = (theme) => {
    setSelectedTheme(theme);
    setStep('theme');
  };

  const handleNext = () => {
    if (step === 'theme' && themeText.trim()) {
      setStep('body');
    } else if (step === 'body' && bodyText.trim()) {
      setStep('time');
    } else if (step === 'time' && timeText.trim()) {
      // Save all three entries
      saveJournalEntry(data.phase.phase, 'theme', selectedTheme.prompt, themeText);
      saveJournalEntry(data.phase.phase, 'body', prompts.bodyPrompt, bodyText);
      saveJournalEntry(data.phase.phase, 'time', prompts.timePrompt, timeText);
      setSaved(true);
      setStep('summary');
    }
  };

  const handleStartOver = () => {
    setStep('choose');
    setSelectedTheme(null);
    setThemeText('');
    setBodyText('');
    setTimeText('');
    setSaved(false);
  };

  const stepNumber = step === 'choose' ? 0 : step === 'theme' ? 1 : step === 'body' ? 2 : step === 'time' ? 3 : 4;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/explore')}>Back</button>

      <header className={styles.header}>
        <span className={styles.phaseLabel}>Phase {data.phase.phase} · {data.phase.season}</span>
        <h1 className={styles.title} style={{ color: phaseEl.hex }}>Journal</h1>
        <p className={styles.subtitle}>A guided reflection for where you are</p>
      </header>

      <JournalIllustration color={phaseEl.hex} step={stepNumber} />

      {/* Intro */}
      {step === 'choose' && (
        <>
          <GlassCard>
            <p className={styles.intro}>{prompts.intro}</p>
          </GlassCard>

          <p className={styles.prompt}>What wants your attention right now?</p>

          <div className={styles.themeGrid}>
            {prompts.themes.map((theme, i) => (
              <GlassCard
                key={i}
                className={styles.themeCard}
                glowColor={`${phaseEl.hex}12`}
                onClick={() => handleChooseTheme(theme)}
              >
                <span className={styles.themeLabel} style={{ color: phaseEl.hex }}>{theme.label}</span>
              </GlassCard>
            ))}
          </div>

          {pastEntries.length > 0 && (
            <p className={styles.pastNote}>
              You have {pastEntries.length} reflection{pastEntries.length === 1 ? '' : 's'} in this phase.{' '}
              <span className={styles.pastLink} onClick={() => navigate('/explore/timeline')}>
                See your timeline →
              </span>
            </p>
          )}
        </>
      )}

      {/* Step 1: Theme reflection */}
      {step === 'theme' && selectedTheme && (
        <GlassCard glowColor={`${phaseEl.hex}10`}>
          <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>{selectedTheme.label}</span>
          <p className={styles.questionText}>{selectedTheme.prompt}</p>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={themeText}
            onChange={(e) => setThemeText(e.target.value)}
            placeholder="Write freely. There is no right answer."
            rows={5}
          />
          <StepIndicator current={1} total={3} color={phaseEl.hex} />
          <button
            className={styles.nextBtn}
            style={{ borderColor: themeText.trim() ? phaseEl.hex : undefined, color: themeText.trim() ? phaseEl.hex : undefined }}
            onClick={handleNext}
            disabled={!themeText.trim()}
          >
            Go deeper →
          </button>
        </GlassCard>
      )}

      {/* Step 2: Body awareness */}
      {step === 'body' && (
        <GlassCard glowColor={`${phaseEl.hex}10`}>
          <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>Body</span>
          <p className={styles.questionText}>{prompts.bodyPrompt}</p>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Notice without judgement."
            rows={4}
          />
          <StepIndicator current={2} total={3} color={phaseEl.hex} />
          <button
            className={styles.nextBtn}
            style={{ borderColor: bodyText.trim() ? phaseEl.hex : undefined, color: bodyText.trim() ? phaseEl.hex : undefined }}
            onClick={handleNext}
            disabled={!bodyText.trim()}
          >
            One more →
          </button>
        </GlassCard>
      )}

      {/* Step 3: Time perspective */}
      {step === 'time' && (
        <GlassCard glowColor={`${phaseEl.hex}10`}>
          <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>Time</span>
          <p className={styles.questionText}>{prompts.timePrompt}</p>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={timeText}
            onChange={(e) => setTimeText(e.target.value)}
            placeholder="Let the memory come."
            rows={4}
          />
          <StepIndicator current={3} total={3} color={phaseEl.hex} />
          <button
            className={styles.nextBtn}
            style={{ borderColor: timeText.trim() ? phaseEl.hex : undefined, color: timeText.trim() ? phaseEl.hex : undefined }}
            onClick={handleNext}
            disabled={!timeText.trim()}
          >
            Complete →
          </button>
        </GlassCard>
      )}

      {/* Summary */}
      {step === 'summary' && saved && (
        <>
          <GlassCard glowColor={`${phaseEl.hex}15`}>
            <p className={styles.summaryMessage}>
              {getJournalSummaryMessage(data.phase.element, selectedTheme.label)}
            </p>
          </GlassCard>

          <GlassCard>
            <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>{selectedTheme.label}</span>
            <p className={styles.savedText}>{themeText}</p>
            <div className={styles.savedDivider} style={{ borderColor: `${phaseEl.hex}25` }} />
            <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>Body</span>
            <p className={styles.savedText}>{bodyText}</p>
            <div className={styles.savedDivider} style={{ borderColor: `${phaseEl.hex}25` }} />
            <span className={styles.stepLabel} style={{ color: phaseEl.hex }}>Time</span>
            <p className={styles.savedText}>{timeText}</p>
          </GlassCard>

          <div className={styles.summaryActions}>
            <button className={styles.actionBtn} onClick={handleStartOver}>
              Reflect again
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/explore/timeline')}>
              See your timeline →
            </button>
          </div>
        </>
      )}

      <ClosingIllustration color={phaseEl.hex} />
    </div>
  );
}

function StepIndicator({ current, total, color }) {
  return (
    <div className={styles.stepIndicator}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={styles.stepDot}
          style={{
            background: i < current ? color : 'transparent',
            borderColor: i < current ? color : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

function JournalIllustration({ color, step }) {
  // Ripples that deepen with each step
  const rings = Math.min(step + 1, 4);
  return (
    <svg viewBox="0 0 200 80" className={styles.illustration}>
      <style>{`
        @keyframes journalRipple { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes journalDrop { 0% { r: 2; opacity: 0.8; } 100% { r: 30; opacity: 0; } }
      `}</style>
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx="100" cy="40" r={10 + i * 12} fill="none" stroke={color}
          strokeWidth={0.7 - i * 0.1} opacity={0.4 - i * 0.08}
          style={{ animation: `journalRipple ${5 + i * 1.5}s ease-in-out ${i * 0.8}s infinite` }}
        />
      ))}
      <circle cx="100" cy="40" r="3" fill={color} opacity="0.5"
        style={{ animation: 'journalRipple 4s ease-in-out infinite' }} />
    </svg>
  );
}

function ClosingIllustration({ color }) {
  return (
    <svg viewBox="0 0 200 50" className={styles.illustration}>
      <style>{`@keyframes closeFade { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.45; } }`}</style>
      <line x1="40" y1="25" x2="160" y2="25" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {[60, 100, 140].map((x, i) => (
        <circle key={i} cx={x} cy="25" r="2" fill={color} opacity="0.3"
          style={{ animation: `closeFade ${5 + i}s ease-in-out ${i * 0.6}s infinite` }} />
      ))}
    </svg>
  );
}
