import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroDashboardProjector: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="relative w-full max-w-[660px] flex items-center justify-center select-none py-2">
      {/* Soft Ambient Backlight Glow behind Circle */}
      <div className={`absolute inset-6 rounded-full blur-[80px] pointer-events-none transition-all duration-700 ${
        dark 
          ? 'bg-gradient-to-tr from-sky-500/20 via-blue-600/15 to-indigo-600/20 opacity-80' 
          : 'bg-gradient-to-tr from-sky-300/30 via-blue-200/20 to-indigo-200/20 opacity-70'
      }`} />

      {/* Pristine Crisp Circular Artwork with Heavy Outer Ring Trimmed Off */}
      <div className="relative w-full flex items-center justify-center">
        <img
          src={dark ? '/assets/hero-circle-dark.png' : '/assets/hero-circle-light.png'}
          alt="CodeForge 3D Dashboard Circular Hologram"
          className="w-full h-auto max-h-[600px] object-contain pointer-events-none transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default HeroDashboardProjector;
