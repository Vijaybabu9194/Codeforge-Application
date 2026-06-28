import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import HeroDashboardProjector from './HeroDashboardProjector';
import { useTheme } from '../../context/ThemeContext';

const DevAvatar: React.FC<{ index: number }> = ({ index }) => {
  const gradients = [
    { from: '#0284C7', to: '#38BDF8', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
    { from: '#22D3EE', to: '#06B6D4', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
    { from: '#A78BFA', to: '#8B5CF6', shape: 'M 10 30 C 10 23 14 19 20 19 C 26 19 30 23 30 30 Z M 20 17 C 23 17 25.5 14.5 25.5 11.5 C 25.5 8.5 23 6 20 6 C 17 6 14.5 8.5 14.5 11.5 C 14.5 14.5 17 17 20 17 Z' },
  ];
  
  const g = gradients[index % gradients.length];
  
  return (
    <svg className="w-9 h-9 rounded-full border-2 border-slate-900 shadow-md relative z-10" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={`avatarGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#avatarGrad-${index})`} />
      <path d={g.shape} fill="#FFFFFF" fillOpacity="0.85" />
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
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section className="pt-28 pb-12 w-full max-w-full px-6 md:px-12 grid lg:grid-cols-[52%_48%] gap-8 items-center min-h-[70vh] relative z-10">
      {/* LEFT COLUMN */}
      <div className="space-y-6 text-left flex flex-col justify-center">
        {/* Badge */}
        <div className={`self-start inline-flex items-center space-x-2 px-4 py-2 rounded-full text-[13px] font-bold ${dark ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-sky-100 text-sky-700 border border-sky-200'}`}>
          <Star className="w-4 h-4 text-sky-500 fill-sky-500" />
          <span>Built for DSA warriors</span>
        </div>

        {/* Main Heading */}
        <h1 className={`text-[36px] sm:text-[46px] lg:text-[52px] xl:text-[58px] font-black tracking-[-0.03em] leading-[1.06] select-none ${dark ? 'text-white' : 'text-slate-900'}`}>
          MASTER DSA.<br />
          CRACK INTERVIEWS.<br />
          TRACK{' '}
          <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            EVERYTHING.
          </span>
        </h1>

        {/* Description */}
        <p className={`text-[16px] leading-[1.65] max-w-[500px] select-none ${dark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
          The all-in-one platform to practice DSA, explore company questions, track progress, analyze coding profiles and become interview ready.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-1">
          <button 
            onClick={onSignupClick}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-sky-500/30 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 select-none"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={onDemoClick}
            className={`px-6 py-4 font-bold text-base rounded-2xl border flex items-center gap-3 transition-all select-none ${
              dark 
                ? 'border-slate-800 text-white hover:bg-slate-900/60' 
                : 'border-slate-200 text-slate-800 hover:bg-slate-100/80 bg-white shadow-sm'
            }`}
          >
            <span>Explore Features</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
          </button>
        </div>

        {/* Stats Row */}
        <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-6 max-w-fit select-none ${
          dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              <DevAvatar index={0} />
              <DevAvatar index={1} />
              <DevAvatar index={2} />
            </div>
            <div>
              <p className={`text-base font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>10,000+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Developers</p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <p className={`text-base font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>200+</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Companies</p>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <p className={`text-base font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>1,500+</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Questions</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 3D Animated Hologram Projector Stage */}
      <div className="flex justify-center items-center relative w-full">
        <HeroDashboardProjector />
      </div>
    </section>
  );
};

export default HeroSection;
