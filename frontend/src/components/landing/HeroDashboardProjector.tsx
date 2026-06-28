import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroDashboardProjector: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="relative w-full max-w-[660px] flex items-center justify-center select-none py-2">
      {/* Dynamic Backlight Ambient Glow */}
      <div className={`absolute inset-4 rounded-full blur-[90px] pointer-events-none transition-all duration-700 ${
        dark 
          ? 'bg-gradient-to-tr from-sky-500/30 via-blue-600/20 to-indigo-600/30 opacity-90' 
          : 'bg-gradient-to-tr from-sky-400/25 via-blue-300/20 to-indigo-300/20 opacity-80'
      }`} />

      {/* Perfect Circular Transparent Hologram Stage */}
      <div className="relative w-full flex items-center justify-center">
        <img
          src={dark ? '/assets/hero-hologram-circle-dark.png' : '/assets/hero-hologram-circle-light.png'}
          alt="CodeForge 3D Dashboard Circular Hologram"
          className="w-full h-auto max-h-[600px] object-contain pointer-events-none drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HeroDashboardProjector;
