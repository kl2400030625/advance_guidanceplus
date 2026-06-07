import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import AIMentor from './pages/AIMentor';
import PlacementPrep from './pages/PlacementPrep';
import ResumeBuilder from './pages/ResumeBuilder';
import Projects from './pages/Projects';
import Jobs from './pages/Jobs';
import Forum from './pages/Forum';
import Progress from './pages/Progress';
import Admin from './pages/Admin';
import AppLayout from './components/AppLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading Guidance+...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="roadmaps" element={<Roadmaps />} />
        <Route path="ai-mentor" element={<AIMentor />} />
        <Route path="prep" element={<PlacementPrep />} />
        <Route path="resume" element={<ResumeBuilder />} />
        <Route path="projects" element={<Projects />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="forum" element={<Forum />} />
        <Route path="progress" element={<Progress />} />
        <Route path="admin" element={<Admin />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px' },
              success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
              error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
