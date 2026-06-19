import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#020205] border-t border-white/[0.06] py-12 relative z-10 select-none">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#7B8AB8]">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2.5">
          <span className="text-[#4A6CF7] text-[20px] font-bold">&lt;/&gt;</span>
          <span className="font-bold text-[18px] text-white tracking-tight">Codeforge</span>
        </div>
        
        {/* Copyright */}
        <p>© {new Date().getFullYear()} Codeforge Inc. All rights reserved.</p>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <a href="#privacy" className="hover:text-white transition duration-200">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition duration-200">Terms of Service</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
