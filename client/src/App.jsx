import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Welcome from './pages/Welcome';
import Setup from './pages/Setup';
import Guide from './pages/Guide';
import Dashboard from './pages/Dashboard';
import SubjectTopics from './pages/SubjectTopics';
import TutorSession from './pages/TutorSession';
import HomeworkHelper from './pages/HomeworkHelper';

function ProtectedRoute({ children }) {
  const { state } = useApp();
  if (!state.language) return <Navigate to="/" replace />;
  if (!state.grade || !state.studentName) return <Navigate to="/setup" replace />;
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/guide" element={<Guide />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/topics/:subjectId"
            element={<ProtectedRoute><SubjectTopics /></ProtectedRoute>}
          />
          <Route
            path="/tutor/:subjectId/:topicId/:level"
            element={<ProtectedRoute><TutorSession /></ProtectedRoute>}
          />
          <Route
            path="/homework"
            element={<ProtectedRoute><HomeworkHelper /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
