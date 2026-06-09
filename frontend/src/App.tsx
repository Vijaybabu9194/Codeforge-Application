import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from '@/pages/LandingPage';
import HomePage from '@/pages/HomePage';
import ProblemsPage from '@/pages/ProblemsPage';
import CompanyQuestionsPage from '@/pages/CompanyQuestionsPage';
import ProfilePage from '@/pages/ProfilePage';
import AppLayout from '@/layouts/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '3px solid #6366F1', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />} />
      <Route path="/home" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute><AppLayout><ProblemsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><AppLayout><CompanyQuestionsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
