import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getElementInfo } from '../../engine/elements';
import { loadFriends } from '../../utils/localStorage';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const { profile } = useUser();
  const location = useLocation();
  const elementInfo = profile ? getElementInfo(profile.element) : null;
  const accentColor = elementInfo?.hex || '#7a9ab5';

  // Re-check friends on every navigation so the presence dot stays in sync
  // after the user adds someone in Relations.
  const [hasField, setHasField] = useState(() => loadFriends().length > 0);
  useEffect(() => {
    setHasField(loadFriends().length > 0);
  }, [location.pathname]);

  const tabs = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/explore', label: 'Explore', icon: ExploreIcon },
    { path: '/relations', label: 'Relations', icon: () => <RelationsIcon hasField={hasField} /> },
    { path: '/time', label: 'Time', icon: TimeIcon },
    { path: '/profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <nav className={styles.nav} style={{ '--accent': accentColor }}>
      {tabs.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          <Icon />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="6" y1="12" x2="18" y2="12" strokeDasharray="2 2" />
    </svg>
  );
}

function RelationsIcon({ hasField = false }) {
  // Three orbs in a triangle — the field, not just two people.
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3" />
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <line x1="11" y1="9" x2="7.5" y2="14.5" strokeOpacity="0.55" />
      <line x1="13" y1="9" x2="16.5" y2="14.5" strokeOpacity="0.55" />
      <line x1="9" y1="17" x2="15" y2="17" strokeOpacity="0.55" />
      {hasField && (
        <circle cx="20.5" cy="5" r="1.7" fill="currentColor" stroke="none">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
        </circle>
      )}
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,7 12,12 16,14" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
