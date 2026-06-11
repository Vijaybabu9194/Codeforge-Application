import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import CompanyQuestionsPage from './pages/CompanyQuestionsPage';
import ProfilePage from './pages/ProfilePage';
import { 
  LogOut, 
  Bell, 
  User as UserIcon
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'problems' | 'companies' | 'profile'>('home');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'problems':
        return <ProblemsPage />;
      case 'companies':
        return <CompanyQuestionsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#111827] flex flex-col font-sans select-none">
      {/* GLOBAL APPLICATION HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-glow">
              CF
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 bg-clip-text text-transparent">Codeforge</span>
          </div>

          {/* Centered Navigation Links with Sliding underline style */}
          <nav className="flex items-center space-x-1 relative h-full">
            {(['home', 'problems', 'companies', 'profile'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'home' ? 'Home' :
                            tab === 'problems' ? 'Problems' :
                            tab === 'companies' ? 'Company Questions' : 'Profile';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-premium text-sm font-semibold transition-all relative ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-secondaryText hover:text-text'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-primary rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Operations */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-secondaryText hover:text-text rounded-premium hover:bg-secondaryBg relative transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger border border-white" />
            </button>
            
            <div className="flex items-center space-x-3 border-l border-[#E5E7EB] pl-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary font-bold text-sm border border-indigo-100">
                {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold block text-text leading-none">{user?.name}</span>
                <span className="text-[10px] text-secondaryText font-medium mt-0.5 block">{user?.email}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-secondaryText hover:text-danger rounded-premium hover:bg-red-50 transition ml-2"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* RENDER ACTIVE BODY VIEW */}
      <div className="flex-1">
        {renderActiveView()}
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-glow animate-bounce">
          CF
        </div>
        <p className="text-xs text-secondaryText font-semibold animate-pulse">Setting up environment...</p>
      </div>
    );
  }

  return token ? <DashboardContent /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
