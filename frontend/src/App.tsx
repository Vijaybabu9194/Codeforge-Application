import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import CompanyQuestionsPage from './pages/CompanyQuestionsPage';
import ProfilePage from './pages/ProfilePage';
import ProblemEditorPage from './pages/ProblemEditorPage';
import ContestsPage from './pages/ContestsPage';
import DiscussPage from './pages/DiscussPage';
import ProblemOfTheDayPage from './pages/ProblemOfTheDayPage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardSidebar from './components/dashboard/DashboardSidebar';
import DashboardTopbar from './components/dashboard/DashboardTopbar';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);

  const renderActiveView = () => {
    if (selectedProblem) {
      return (
        <ProblemEditorPage
          problem={selectedProblem}
          onBack={() => setSelectedProblem(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'problems':
        return <ProblemsPage onSolve={setSelectedProblem} />;
      case 'companies':
        return <CompanyQuestionsPage />;
      case 'potd':
        return <ProblemOfTheDayPage />;
      case 'profile':
        return <ProfilePage />;
      case 'contests':
        return <ContestsPage />;
      case 'discuss':
        return <DiscussPage />;
      case 'roadmap':
        return <RoadmapPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-dash-bg text-white font-sans select-none flex">
      {/* Left Sidebar — Fixed */}
      <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedProblem(null); }} />

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 ml-[240px] flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar — Sticky */}
        <DashboardTopbar />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden dash-scroll">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dash-bg flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] flex items-center justify-center text-white font-bold text-2xl shadow-glow animate-bounce">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M7 8l-4 4 4 4" />
            <path d="M17 8l4 4-4 4" />
            <path d="M14 4l-4 16" />
          </svg>
        </div>
        <p className="text-xs text-dash-textSecondary font-semibold animate-pulse">Setting up environment...</p>
      </div>
    );
  }

  return token ? <DashboardContent /> : <LandingPage />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
