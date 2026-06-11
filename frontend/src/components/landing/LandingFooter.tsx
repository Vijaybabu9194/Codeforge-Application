import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-secondaryText">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-glow">
            CF
          </div>
          <span className="font-bold text-text">Codeforge</span>
        </div>
        <p>© {new Date().getFullYear()} Codeforge Inc. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <a href="#privacy" className="hover:text-text transition">Privacy Policy</a>
          <a href="#terms" className="hover:text-text transition">Terms of Service</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
