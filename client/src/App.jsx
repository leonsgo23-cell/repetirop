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
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminUser from './pages/AdminUser';

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
    if (p.grade && !state.grade) updates.grade = p.grade;
    if (p.studentName && !state.studentName) updates.studentName = p.studentName;
    if (p.language && !state.language) updates.language = p.language;
    if (Object.keys(updates).length > 0) updateState(updates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);
  return null;
}

// AppProvider keyed by user email so state resets on user change
function AppWithAuth({ children }) {
  const { user } = useAuth();
  return (
    <AppProvider key={user?.email || 'guest'}>
      <ProfileSync />
      {children}
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Auth required (not necessarily subscribed) */}
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
            <Route path="/zephir" element={<SubscribedRoute><ZephirChat /></SubscribedRoute>} />

            {/* Admin CRM */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/user/:email" element={<AdminUser />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppWithAuth>
    </AuthProvider>
  );
}
