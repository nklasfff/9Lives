import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import GrainOverlay from '../common/GrainOverlay';
import GlowOrb from '../common/GlowOrb';
import { useUser } from '../../context/UserContext';
import styles from './AppShell.module.css';

export default function AppShell() {
  const { theme, toggleTheme } = useUser();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={styles.shell}>
      <GlowOrb color="rgba(58, 111, 160, 0.12)" size={400} top="-100px" right="-100px" />
      <GlowOrb color="rgba(199, 90, 58, 0.08)" size={350} bottom="100px" left="-80px" delay={5} />
      <GrainOverlay />

      <button
        className={styles.themeBtn}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
      >
        <svg viewBox="0 0 24 24" className={styles.themeIcon}>
          {theme === 'dark' ? (
            /* Sun — day mode */
            <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" />
              <line x1="12" y1="2" x2="12" y2="4.5" />
              <line x1="12" y1="19.5" x2="12" y2="22" />
              <line x1="2" y1="12" x2="4.5" y2="12" />
              <line x1="19.5" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="6.76" y2="6.76" />
              <line x1="17.24" y1="17.24" x2="19.07" y2="19.07" />
              <line x1="19.07" y1="4.93" x2="17.24" y2="6.76" />
              <line x1="6.76" y1="17.24" x2="4.93" y2="19.07" />
            </g>
          ) : (
            /* Moon — night mode */
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      <main className={styles.main}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
