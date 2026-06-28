import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const LandingFooter: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <footer className={`border-t py-12 relative z-10 select-none transition-colors duration-300 ${
      dark ? 'bg-[#020205] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2.5">
          <span className="text-sky-500 text-[20px] font-bold">&lt;/&gt;</span>
          <span className={`font-black text-[18px] tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>Codeforge</span>
        </div>
        
        {/* Copyright */}
        <p>© {new Date().getFullYear()} Codeforge Inc. All rights reserved.</p>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <a href="#privacy" className="hover:text-sky-500 transition duration-200">Privacy Policy</a>
          <a href="#terms" className="hover:text-sky-500 transition duration-200">Terms of Service</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition duration-200">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
