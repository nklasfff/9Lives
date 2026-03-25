import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import AppShell from './components/layout/AppShell';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RelationsPage from './pages/RelationsPage';
import TimePage from './pages/TimePage';
import ProfilePage from './pages/ProfilePage';
import ElementDetailPage from './pages/ElementDetailPage';
import LifePhaseDetailPage from './pages/LifePhaseDetailPage';
import SpiritsDetailPage from './pages/SpiritsDetailPage';
import DepthDetailPage from './pages/DepthDetailPage';
import PhaseDeepPage from './pages/PhaseDeepPage';
import RelationDetailPage from './pages/RelationDetailPage';
import GroupDynamicsPage from './pages/GroupDynamicsPage';
import PracticeDetailPage from './pages/PracticeDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { isOnboarded } = useUser();

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <Routes>
      <Route element={<><ScrollToTop /><AppShell /></>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/element" element={<ElementDetailPage />} />
        <Route path="/explore/phases" element={<LifePhaseDetailPage />} />
        <Route path="/explore/phases/:phaseId" element={<PhaseDeepPage />} />
        <Route path="/explore/spirits" element={<SpiritsDetailPage />} />
        <Route path="/explore/depths" element={<DepthDetailPage />} />
        <Route path="/relations" element={<RelationsPage />} />
        <Route path="/relations/group" element={<GroupDynamicsPage />} />
        <Route path="/relations/:friendId" element={<RelationDetailPage />} />
        <Route path="/time" element={<TimePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/practice" element={<PracticeDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </HashRouter>
  );
}
