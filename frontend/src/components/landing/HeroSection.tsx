import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import HeroDashboardProjector from './HeroDashboardProjector';

const DevAvatar: React.FC<{ index: number }> = ({ index }) => {
  const gradients = [
    { from: '#4A6CF7', to: '#6B8AFF', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
    { from: '#22D3EE', to: '#06B6D4', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
    { from: '#A78BFA', to: '#8B5CF6', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
  ];
  
  const g = gradients[index % gradients.length];
  
  return (
    <svg className="w-9 h-9 rounded-full border-2 border-[#020205] shadow-[0_0_8px_rgba(0,0,0,0.4)] relative z-10" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`avatarGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#avatarGrad-${index})`} />
      <path d={g.shape} fill="#FFFFFF" fillOpacity="0.85" />
      {index === 0 && (
        <path d="M 16 11 L 24 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      )}
      {index === 1 && (
        <circle cx="20" cy="11.5" r="1.5" fill="#E0F2FE" />
      )}
      {index === 2 && (
        <path d="M 17 11.5 A 1.5 1.5 0 0 0 23 11.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      )}
    </svg>
  );
};

interface HeroSectionProps {
  onSignupClick: () => void;
  onDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSignupClick,
  onDemoClick,
}) => {
  return (
    <section className="pt-24 pb-8 w-full max-w-full px-6 md:px-12 grid md:grid-cols-[55%_45%] gap-8 items-center min-h-[60vh] relative z-10">
      {/* LEFT COLUMN */}
      <div className="space-y-5 text-left flex flex-col justify-center">
        {/* Badge */}
        <div className="self-start inline-flex items-center space-x-2 bg-[#4A6CF7]/[0.08] text-[#849DFF] px-4 py-2 rounded-full text-[13px] font-semibold border-none">
          <Star className="w-4 h-4 text-[#6B8AFF] fill-[#6B8AFF]" />
          <span>Built for DSA warriors</span>
        </div>

        {/* Main Heading — Sleeker, elegant heading size */}
        <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.06] text-white select-none">
          MASTER DSA.<br />
          CRACK INTERVIEWS.<br />
          TRACK{' '}
          <span className="bg-gradient-to-r from-[#4A6CF7] via-[#6B8AFF] to-[#4A6CF7] bg-clip-text text-transparent">
            EVERYTHING.
          </span>
        </h1>

        {/* Description */}
        <p className="text-[16px] text-[#7B8AB8] leading-[1.65] max-w-[480px] select-none">
          The all-in-one platform to practice DSA, explore
          company questions, track progress, analyze
          coding profiles and become interview ready.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-0.5">
          <button 
            onClick={onSignupClick}
            className="btn-landing-primary select-none"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={onDemoClick}
            className="btn-landing-outline select-none"
          >
            <span>Explore Features</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white ml-0.5 hover:bg-white/20 transition-colors">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
          </button>
        </div>

        {/* Stats Row — matching design with dark glass, glowing border, dividers, overlapping avatars, indigo icon square */}
        <div className="stats-container max-w-fit select-none">
          {/* Avatar Stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              <DevAvatar index={0} />
              <DevAvatar index={1} />
              <DevAvatar index={2} />
            </div>
            <div>
              <span className="text-white font-bold text-[16px] block leading-tight">10,000+</span>
              <p className="text-[11px] text-[#7B8AB8] leading-none mt-0.5">Developers</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/[0.12]" />

          {/* Stat: Companies */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101935] border border-[#1e295d] flex items-center justify-center shadow-[inset_0_0_8px_rgba(74,108,247,0.1)]">
              <svg className="w-4 h-4 text-[#4A6CF7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-[16px] block leading-tight">200+</span>
              <p className="text-[11px] text-[#7B8AB8] leading-none mt-0.5">Companies</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/[0.12]" />

          {/* Stat: Questions */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101935] border border-[#1e295d] flex items-center justify-center shadow-[inset_0_0_8px_rgba(74,108,247,0.1)]">
              <svg className="w-4 h-4 text-[#4A6CF7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-[16px] block leading-tight">1,500+</span>
              <p className="text-[11px] text-[#7B8AB8] leading-none mt-0.5">Questions</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/[0.12]" />

          {/* Stat: Platforms */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101935] border border-[#1e295d] flex items-center justify-center shadow-[inset_0_0_8px_rgba(74,108,247,0.1)]">
              <svg className="w-4 h-4 text-[#4A6CF7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-[16px] block leading-tight">5</span>
              <p className="text-[11px] text-[#7B8AB8] leading-none mt-0.5">Platforms</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Dashboard Projector */}
      <div className="relative hidden md:flex items-center justify-center">
        <HeroDashboardProjector />
      </div>
    </section>
  );
};
export default HeroSection;
