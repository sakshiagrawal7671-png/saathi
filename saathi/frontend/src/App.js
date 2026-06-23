import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import PersonalizationModal from './components/layout/PersonalizationModal';

import Layout from './components/layout/Layout';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodPage      from './pages/MoodPage';
import JournalPage   from './pages/JournalPage';
import CompanionPage from './pages/CompanionPage';
import HabitsPage    from './pages/HabitsPage';
import GoalsPage     from './pages/GoalsPage';
import FamilyPage    from './pages/FamilyPage';
import GratitudePage from './pages/GratitudePage';
import CommunityPage from './pages/CommunityPage';
import FocusPage     from './pages/FocusPage';
import WellnessPage  from './pages/WellnessPage';
// v2
import RPGPage         from './pages/RPGPage';
import VirtualPetPage  from './pages/VirtualPetPage';
import DreamTowerPage  from './pages/DreamTowerPage';
import LifeJourneyPage from './pages/LifeJourneyPage';
// v3
import PersonalityPage from './pages/PersonalityPage';
import PurposePage     from './pages/PurposePage';
import CareerPage      from './pages/CareerPage';
// v4
import PersonalIslandPage  from './pages/PersonalIslandPage';
import ConnectionScorePage from './pages/ConnectionScorePage';
import ShortsPage          from './pages/ShortsPage';
// v5
import LifeLibraryPage    from './pages/LifeLibraryPage';
import HopeLibraryPage    from './pages/HopeLibraryPage';
import DailySurprisePage  from './pages/DailySurprisePage';
import ExpertCreatorPage  from './pages/ExpertCreatorPage';
// v6
import NotificationsPage   from './pages/NotificationsPage';
import AdminDashboardPage  from './pages/AdminDashboardPage';
import OAuthCallbackPage   from './pages/OAuthCallbackPage';
// v7
import DigitalDetoxPage  from './pages/DigitalDetoxPage';
import AIInsightsPage    from './pages/AIInsightsPage';
import OfflineModePage   from './pages/OfflineModePage';
// v8
import ReasonsToLivePage    from './pages/ReasonsToLivePage';
import StressDestroyerPage  from './pages/StressDestroyerPage';
import AnonAskPage          from './pages/AnonAskPage';
import DreamCommunitiesPage from './pages/DreamCommunitiesPage';
import InnerCirclePage      from './pages/InnerCirclePage';
// v9
import PositiveMemoryVaultPage from './pages/PositiveMemoryVaultPage';
import CalmColoringPage        from './pages/CalmColoringPage';
import RelaxationHubPage       from './pages/RelaxationHubPage';
import LifeMapPage             from './pages/LifeMapPage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [showPersonalization, setShowPersonalization] = useState(false);

  useEffect(() => {
    // Restore saved theme preferences
    const savedTheme  = localStorage.getItem('saathi_theme');
    const savedLayout = localStorage.getItem('saathi_layout');
    const savedFont   = localStorage.getItem('saathi_font');
    if (savedTheme)  document.documentElement.setAttribute('data-theme',  savedTheme  === 'default' ? '' : savedTheme);
    if (savedLayout) document.documentElement.setAttribute('data-layout', savedLayout === 'default' ? '' : savedLayout);
    if (savedFont)   document.documentElement.setAttribute('data-font',   savedFont   === 'default' ? '' : savedFont);

    if (localStorage.getItem('saathi_token')) dispatch(fetchProfile());
  }, []);

  // Show personalization modal on first login
  useEffect(() => {
    if (isAuthenticated && !localStorage.getItem('saathi_personalized')) {
      setTimeout(() => setShowPersonalization(true), 800);
    }
  }, [isAuthenticated]);

  return (
      <>
        {showPersonalization && (
            <PersonalizationModal onComplete={() => setShowPersonalization(false)} />
        )}
        <Routes>
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {/* v1 */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="mood"      element={<MoodPage />} />
            <Route path="journal"   element={<JournalPage />} />
            <Route path="companion" element={<CompanionPage />} />
            <Route path="habits"    element={<HabitsPage />} />
            <Route path="goals"     element={<GoalsPage />} />
            <Route path="family"    element={<FamilyPage />} />
            <Route path="gratitude" element={<GratitudePage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="focus"     element={<FocusPage />} />
            <Route path="wellness"  element={<WellnessPage />} />
            {/* v2 */}
            <Route path="rpg"     element={<RPGPage />} />
            <Route path="pet"     element={<VirtualPetPage />} />
            <Route path="dreams"  element={<DreamTowerPage />} />
            <Route path="journey" element={<LifeJourneyPage />} />
            {/* v3 */}
            <Route path="personality" element={<PersonalityPage />} />
            <Route path="purpose"     element={<PurposePage />} />
            <Route path="career"      element={<CareerPage />} />
            {/* v4 */}
            <Route path="island"     element={<PersonalIslandPage />} />
            <Route path="connection" element={<ConnectionScorePage />} />
            <Route path="shorts"     element={<ShortsPage />} />
            {/* v5 */}
            <Route path="life-library" element={<LifeLibraryPage />} />
            <Route path="hope-library" element={<HopeLibraryPage />} />
            <Route path="surprise"     element={<DailySurprisePage />} />
            <Route path="experts"      element={<ExpertCreatorPage />} />
            {/* v6 */}
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="admin"         element={<AdminDashboardPage />} />
            {/* v7 */}
            <Route path="detox"   element={<DigitalDetoxPage />} />
            <Route path="ai"      element={<AIInsightsPage />} />
            <Route path="offline" element={<OfflineModePage />} />
            {/* v8 */}
            <Route path="vault"         element={<ReasonsToLivePage />} />
            <Route path="stress-game"   element={<StressDestroyerPage />} />
            <Route path="ask"           element={<AnonAskPage />} />
            <Route path="dream-communities" element={<DreamCommunitiesPage />} />
            <Route path="inner-circle"  element={<InnerCirclePage />} />
            {/* v9 */}
            <Route path="memories"  element={<PositiveMemoryVaultPage />} />
            <Route path="coloring"  element={<CalmColoringPage />} />
            <Route path="relax"     element={<RelaxationHubPage />} />
            <Route path="life-map"  element={<LifeMapPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </>
  );
}
