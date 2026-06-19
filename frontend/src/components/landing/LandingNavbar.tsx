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
      isScrolled ? 'glass-nav-dark py-3' : 'bg-transparent py-5'
    }`}>
      <div className="w-full max-w-full px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer">
          <span className="text-[#4A6CF7] text-[26px] font-bold tracking-tight select-none">&lt;/&gt;</span>
          <span className="font-bold text-[22px] tracking-tight text-white">
            Codeforge
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-10 text-[15px] font-medium text-[#7B8AB8]">
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#roadmap" className="hover:text-white transition-colors duration-200">Roadmap</a>
          <a href="#companies" className="hover:text-white transition-colors duration-200">Companies</a>
          <a href="#testimonials" className="hover:text-white transition-colors duration-200">Testimonials</a>
          <a href="#faqs" className="hover:text-white transition-colors duration-200">FAQs</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onLoginClick}
            className="text-[15px] font-medium text-[#C8D0E7] hover:text-white px-6 py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            Log in
          </button>
          <button 
            onClick={onSignupClick}
            className="text-[15px] font-semibold bg-[#4A6CF7] hover:bg-[#3B5BEB] text-white px-6 py-2.5 rounded-full shadow-[0_0_24px_rgba(74,108,247,0.25)] hover:shadow-[0_0_32px_rgba(74,108,247,0.4)] transition-all duration-200"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};
export default LandingNavbar;
