import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Setup from './pages/Setup';
import Guide from './pages/Guide';
import Dashboard from './pages/Dashboard';
import SubjectTopics from './pages/SubjectTopics';
import TutorSession from './pages/TutorSession';
import HomeworkHelper from './pages/HomeworkHelper';
import Progress from './pages/Progress';
import Shop from './pages/Shop';
import ZephirChat from './pages/ZephirChat';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscribe from './pages/Subscribe';
import Account from './pages/Account';
import Feedback from './pages/Feedback';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminUser from './pages/AdminUser';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import Promo from './pages/Promo';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookieBanner from './components/CookieBanner';
import AnalyticsProvider from './components/AnalyticsProvider';
import Exams from './pages/Exams';
import ExamSession from './pages/ExamSession';
import Diagnostic from './pages/Diagnostic';

// Forces full remount of TutorSession when navigating between levels/topics
function KeyedTutorSession() {
  const { subjectId, topicId, level } = useParams();
  return <TutorSession key={`${subjectId}-${topicId}-${level}`} />;
}

// Requires valid auth token; redirects to /login otherwise
function AuthRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Requires token + active trial or subscription; redirects to /subscribe otherwise
function SubscribedRoute({ children }) {
  const { token, user, loading, isTrialActive } = useAuth();
  const { state } = useApp();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  const sub = user?.subscription;
  const hasAccess = isTrialActive() || (sub && sub.expiresAt > Date.now());
  if (!hasAccess) return <Navigate to="/subscribe" replace />;
  // Still need language + profile to enter the app
  if (!state.language) return <Navigate to="/welcome" replace />;
  if (!state.grade || !state.studentName) return <Navigate to="/setup" replace />;
  return children;
}

// Syncs server-side profile (grade/name/language) into AppContext on login or app reload.
// Runs inside AppProvider so it has access to updateState.
function ProfileSync() {
  const { user, loading } = useAuth();
  const { state, updateState } = useApp();
  useEffect(() => {
    if (loading || !user?.profile) return;
    const p = user.profile;
    const updates = {};
    // Server is source of truth for grade — subscription grade takes priority over profile grade
    const subGrade = user?.subscription?.expiresAt > Date.now() ? user.subscription.grade : null;
    const targetGrade = subGrade ?? p.grade;
    if (targetGrade && state.grade !== targetGrade) updates.grade = targetGrade;
    if (p.studentName && !state.studentName) updates.studentName = p.studentName;
    if (p.language && !state.language) updates.language = p.language;
    if (Object.keys(updates).length > 0) updateState(updates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);
  return null;
}

// Sets document.title based on selected language
function TitleSync() {
  const { state } = useApp();
  useEffect(() => {
    const lang = state.language;
    if (lang === 'lv') document.title = 'Zināšanu Maģija · SmartSkola';
    else if (lang === 'uk') document.title = 'Магія Знань · SmartSkola';
    else if (lang === 'ru') document.title = 'Магия Знаний · SmartSkola';
    else document.title = 'SmartSkola';
  }, [state.language]);
  return null;
}

// AppProvider keyed by user email so state resets on user change
function AppWithAuth({ children }) {
  const { user } = useAuth();
  return (
    <AppProvider key={user?.email || 'guest'}>
      <ProfileSync />
      <TitleSync />
      {children}
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth>
        <BrowserRouter>
          <CookieBanner />
          <AnalyticsProvider />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/promo/:code" element={<Promo />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Auth required (not necessarily subscribed) */}
            <Route path="/success" element={<AuthRoute><PaymentSuccess /></AuthRoute>} />
            <Route path="/subscribe" element={<AuthRoute><Subscribe /></AuthRoute>} />
            <Route path="/account" element={<AuthRoute><Account /></AuthRoute>} />
            <Route path="/welcome" element={<AuthRoute><Welcome /></AuthRoute>} />
            <Route path="/setup" element={<AuthRoute><Setup /></AuthRoute>} />
            <Route path="/guide" element={<AuthRoute><Guide /></AuthRoute>} />

            {/* Subscribed routes */}
            <Route path="/dashboard" element={<SubscribedRoute><Dashboard /></SubscribedRoute>} />
            <Route path="/topics/:subjectId" element={<SubscribedRoute><SubjectTopics /></SubscribedRoute>} />
            <Route
              path="/tutor/:subjectId/:topicId/:level"
              element={<SubscribedRoute><KeyedTutorSession /></SubscribedRoute>}
            />
            <Route path="/homework" element={<SubscribedRoute><HomeworkHelper /></SubscribedRoute>} />
            <Route path="/progress" element={<SubscribedRoute><Progress /></SubscribedRoute>} />
            <Route path="/shop" element={<SubscribedRoute><Shop /></SubscribedRoute>} />
            <Route path="/oris" element={<SubscribedRoute><ZephirChat /></SubscribedRoute>} />
            <Route path="/feedback" element={<SubscribedRoute><Feedback /></SubscribedRoute>} />
            <Route path="/exams" element={<SubscribedRoute><Exams /></SubscribedRoute>} />
            <Route path="/exams/:examId" element={<SubscribedRoute><ExamSession /></SubscribedRoute>} />

            {/* Admin CRM — path set via VITE_ADMIN_PATH env var */}
            {(() => {
              const ap = import.meta.env.VITE_ADMIN_PATH || 'admin';
              return (<>
                <Route path={`/${ap}/login`} element={<AdminLogin />} />
                <Route path={`/${ap}`} element={<Admin />} />
                <Route path={`/${ap}/user/:email`} element={<AdminUser />} />
              </>);
            })()}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppWithAuth>
    </AuthProvider>
  );
}
