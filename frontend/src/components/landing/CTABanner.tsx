import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
  onSignupClick: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onSignupClick }) => {
  return (
    <section className="py-14 relative z-10">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        <div className="cta-banner px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Rocket & Heading */}
          <div className="flex items-center gap-7 flex-1">
            {/* Custom 3D Vector Rocket SVG */}
            <svg className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 select-none pointer-events-none animate-float-slow transform rotate-12 drop-shadow-[0_0_24px_rgba(74,108,247,0.35)]" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="rocketBody" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="40%" stopColor="#3B82F6" />
                  <stop offset="80%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#E0F2FE" />
                </linearGradient>
                <linearGradient id="rocketFin" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
                <linearGradient id="exhaustGlow" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
                  <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  <stop offset="80%" stopColor="#4A6CF7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              
              {/* Exhaust trail clouds */}
              <path d="M15 85 C 5 95, 2 92, 2 98 C 8 98, 5 95, 15 85 Z" fill="url(#exhaustGlow)" />
              <path d="M 22 78 C 8 92, 10 90, 8 96 C 14 96, 12 92, 22 78 Z" fill="url(#exhaustGlow)" />
              
              {/* Left fin */}
              <path d="M 32 72 L 14 78 L 22 58 Z" fill="url(#rocketFin)" stroke="#1E40AF" strokeWidth="0.5" />
              {/* Right fin */}
              <path d="M 68 36 L 78 18 L 58 26 Z" fill="url(#rocketFin)" stroke="#1E40AF" strokeWidth="0.5" />
              
              {/* Rocket Fuselage */}
              <path d="M 26 74 C 44 60, 60 44, 76 24 C 56 40, 40 56, 26 74 Z" fill="url(#rocketBody)" />
              <path d="M 32 68 C 48 54, 62 40, 76 24 C 60 38, 48 50, 32 68 Z" fill="#FFFFFF" fillOpacity="0.15" />
              
              {/* Nose cone */}
              <path d="M 64 36 C 72 28, 76 24, 76 24 C 76 24, 72 28, 64 36 Z" fill="#EF4444" />
              
              {/* Porthole */}
              <circle cx="51" cy="49" r="6" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="51" cy="49" r="4" fill="#0EA5E9" />
              <circle cx="49" cy="47" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
              
              {/* booster connection ring */}
              <ellipse cx="26" cy="74" rx="4" ry="4" fill="#64748B" transform="rotate(-45 26 74)" />
            </svg>
            <div>
              <h3 className="text-white font-bold text-[22px] md:text-[26px] leading-tight select-none">
                Ready to forge your coding journey?
              </h3>
              <p className="text-[#7B8AB8] text-[15px] mt-2 select-none">
                Join thousands of developers and start your transformation today.
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={onSignupClick}
            className="btn-landing-primary text-[16px] whitespace-nowrap flex-shrink-0 select-none"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default CTABanner;
