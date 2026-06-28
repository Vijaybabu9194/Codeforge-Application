import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroDashboardProjector: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="relative w-full max-w-[560px] flex items-center justify-center select-none py-2">
      {/* Ambient Backlight Glow behind 3D Stage */}
      <div className={`absolute inset-4 rounded-full blur-[90px] pointer-events-none transition-all duration-700 ${
        dark 
          ? 'bg-gradient-to-tr from-sky-500/25 via-blue-600/20 to-indigo-600/25 opacity-90' 
          : 'bg-gradient-to-tr from-sky-400/20 via-blue-300/15 to-indigo-300/15 opacity-70'
      }`} />

      {/* Fixed Transparent PNG Artwork - Zero Square Box */}
      <div className="relative w-full flex items-center justify-center">
        <img
          src={dark ? '/assets/hero-hologram-dark.png' : '/assets/hero-hologram-light.png'}
          alt="CodeForge 3D Dashboard Hologram"
          className="w-full h-auto max-h-[520px] object-contain pointer-events-none drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HeroDashboardProjector;
