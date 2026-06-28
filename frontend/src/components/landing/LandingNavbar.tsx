import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? dark ? 'glass-nav-dark py-3' : 'glass-nav py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="w-full max-w-full px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer">
          <span className="text-sky-500 text-[26px] font-bold tracking-tight select-none">&lt;/&gt;</span>
          <span className={`font-extrabold text-[22px] tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Codeforge
          </span>
        </div>

        {/* Navigation Links */}
        <div className={`hidden md:flex items-center space-x-10 text-[15px] font-medium ${dark ? 'text-[#7B8AB8]' : 'text-slate-600'}`}>
          <a href="#features" className="hover:text-sky-500 transition-colors duration-200">Features</a>
          <a href="#roadmap" className="hover:text-sky-500 transition-colors duration-200">Roadmap</a>
          <a href="#companies" className="hover:text-sky-500 transition-colors duration-200">Companies</a>
          <a href="#testimonials" className="hover:text-sky-500 transition-colors duration-200">Testimonials</a>
          <a href="#faqs" className="hover:text-sky-500 transition-colors duration-200">FAQs</a>
        </div>

        {/* Auth Buttons + Theme Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-200 ${
              dark 
                ? 'border-slate-800 bg-slate-900/80 text-amber-400 hover:bg-slate-800' 
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title={dark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={onLoginClick}
            className={`text-[15px] font-medium px-6 py-2.5 rounded-full border transition-all duration-200 ${
              dark
                ? 'text-[#C8D0E7] hover:text-white border-white/10 hover:border-white/20'
                : 'text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-white/80 shadow-sm'
            }`}
          >
            Log in
          </button>
          <button 
            onClick={onSignupClick}
            className="text-[15px] font-semibold bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
