import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CTABannerProps {
  onSignupClick: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onSignupClick }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section className="py-8 relative z-10 select-none">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        <div className={`px-6 md:px-8 py-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg transition-colors duration-300 ${
          dark 
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800' 
            : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border-sky-400 text-white'
        }`}>
          {/* Left: Rocket & Heading */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 select-none pointer-events-none animate-float-slow">
              <div className="absolute inset-0 bg-sky-400/30 rounded-full blur-lg scale-75" />
              <svg className="w-full h-full object-contain relative z-10 transform rotate-12 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="rocketBodyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="60%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="rocketFinsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                  <linearGradient id="rocketFlameGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="50%" stopColor="#F97316" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path d="M 44 76 Q 50 100, 50 100 Q 50 100, 56 76 Z" fill="url(#rocketFlameGrad)" className="animate-pulse" />
                <path d="M 47 76 Q 50 90, 50 90 Q 50 90, 53 76 Z" fill="#FDE047" />
                <path d="M 33 55 L 20 70 L 35 68 Z" fill="url(#rocketFinsGrad)" />
                <path d="M 67 55 L 80 70 L 65 68 Z" fill="url(#rocketFinsGrad)" />
                <path d="M 41 71 L 59 71 L 55 76 L 45 76 Z" fill="#334155" />
                <path d="M 50 8 C 65 38, 65 66, 64 70 C 50 74, 50 74, 36 70 C 35 66, 35 38, 50 8 Z" fill="url(#rocketBodyGrad)" />
                <circle cx="50" cy="38" r="8" fill="#0A0F24" />
                <circle cx="50" cy="38" r="6" fill="#000" stroke="#E2E8F0" strokeWidth="0.5" />
                <path d="M 45 35 A 6 6 0 0 1 55 35" fill="none" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round" />
                <path d="M 50 8 C 53 14, 56 22, 57 24 C 50 22, 50 22, 43 24 C 44 22, 47 14, 50 8 Z" fill="#EF4444" />
              </svg>
            </div>
            <div>
              <h3 className={`font-black text-[15px] md:text-[17px] leading-tight select-none ${dark ? 'text-white' : 'text-white'}`}>
                Ready to forge your coding journey?
              </h3>
              <p className={`text-[12px] mt-0.5 select-none font-medium ${dark ? 'text-slate-400' : 'text-sky-100'}`}>
                Join thousands of developers and start your transformation today.
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={onSignupClick}
            className={`px-5 py-2.5 font-bold text-[13px] whitespace-nowrap flex-shrink-0 select-none rounded-xl flex items-center gap-2 transition shadow-md ${
              dark 
                ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20' 
                : 'bg-white text-sky-700 hover:bg-sky-50 shadow-black/10'
            }`}
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default CTABanner;
