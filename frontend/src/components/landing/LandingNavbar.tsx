import React from 'react';

interface LandingNavbarProps {
  isScrolled: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  isScrolled,
  onLoginClick,
  onSignupClick,
}) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-nav py-4 shadow-card' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-glow">
            CF
          </div>
          <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 bg-clip-text text-transparent">
            Codeforge
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#6B7280]">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#roadmap" className="hover:text-primary transition">Roadmap</a>
          <a href="#companies" className="hover:text-primary transition">Companies</a>
          <a href="#stories" className="hover:text-primary transition">Success Stories</a>
          <a href="#pricing" className="hover:text-primary transition">Pricing</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onLoginClick}
            className="text-sm font-medium text-[#6B7280] hover:text-text px-4 py-2 transition"
          >
            Login
          </button>
          <button 
            onClick={onSignupClick}
            className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-premium shadow-glow hover:scale-[1.02] transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};
export default LandingNavbar;
