import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroDashboardProjector: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="relative w-full max-w-[450px] flex items-center justify-center select-none py-4">
      {/* Dynamic Ambient Backlight Glows */}
      <div className={`absolute inset-6 rounded-full blur-[90px] pointer-events-none transition-all duration-700 ${
        dark 
          ? 'bg-gradient-to-tr from-sky-500/25 via-indigo-600/15 to-purple-600/20 opacity-90' 
          : 'bg-gradient-to-tr from-sky-300/35 via-blue-200/25 to-indigo-200/25 opacity-80'
      }`} />

      {/* Stationary Artwork Container */}
      <div className="relative w-full flex items-center justify-center">
        {/* Hologram Image with Radial Feathering for Seamless Fixed Background Blend */}
        <img
          src={dark ? '/assets/hero-hologram-dark.jpg' : '/assets/hero-hologram-light.jpg'}
          alt="CodeForge 3D Dashboard Hologram"
          className={`w-full h-auto max-h-[420px] object-contain pointer-events-none ${
            dark 
              ? 'drop-shadow-[0_0_40px_rgba(38,198,218,0.25)]' 
              : 'drop-shadow-[0_15px_40px_rgba(2,132,199,0.15)]'
          }`}
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 96%)',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 96%)',
          }}
        />

        {/* Floating Code Accents */}
        <div className="absolute top-[5%] left-[5%] px-3 py-1.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 backdrop-blur-md shadow-md text-sky-500 font-mono text-xs font-bold pointer-events-none">
          &lt;Algorithm /&gt;
        </div>
        <div className="absolute bottom-[10%] right-[5%] px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md shadow-md text-indigo-500 font-mono text-xs font-bold pointer-events-none">
          O(N log N)
        </div>
      </div>
    </div>
  );
};

export default HeroDashboardProjector;
