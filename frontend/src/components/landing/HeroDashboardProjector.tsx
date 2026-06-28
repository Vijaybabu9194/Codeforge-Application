import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroDashboardProjector: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / rect.height) * 15,
      y: (x / rect.width) * 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[650px] aspect-square flex items-center justify-center select-none cursor-pointer group"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic Ambient Backlight Glows */}
      <div className={`absolute inset-4 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
        dark 
          ? 'bg-gradient-to-tr from-sky-500/30 via-indigo-600/20 to-purple-600/30 opacity-90' 
          : 'bg-gradient-to-tr from-sky-300/40 via-blue-200/30 to-indigo-200/30 opacity-80'
      }`} />

      {/* Rotating Light Rings Behind Image */}
      <div className="absolute inset-8 pointer-events-none rounded-full border border-sky-400/20 dark:border-sky-400/10 animate-rotate-ring" />
      <div className="absolute inset-16 pointer-events-none rounded-full border border-indigo-400/20 dark:border-indigo-400/10 animate-rotate-ring" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />

      {/* 3D Tilted Artwork Container */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
        }}
      >
        {/* Hologram Image with Radial Feathering for Seamless Background Blend */}
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={dark ? '/assets/hero-hologram-dark.jpg' : '/assets/hero-hologram-light.jpg'}
            alt="CodeForge 3D Dashboard Hologram"
            className={`w-full h-full object-contain pointer-events-none transition-all duration-500 transform group-hover:scale-105 ${
              dark 
                ? 'drop-shadow-[0_0_50px_rgba(38,198,218,0.3)]' 
                : 'drop-shadow-[0_20px_50px_rgba(2,132,199,0.2)]'
            }`}
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 98%)',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 98%)',
            }}
          />
        </div>

        {/* Floating 3D Code Cubes & Sparkle Accents */}
        <div className="absolute top-[8%] left-[10%] px-3 py-1.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 backdrop-blur-md shadow-lg animate-float-slow text-sky-500 font-mono text-xs font-bold pointer-events-none">
          &lt;Algorithm /&gt;
        </div>
        <div className="absolute bottom-[18%] right-[8%] px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md shadow-lg animate-float-medium text-indigo-500 font-mono text-xs font-bold pointer-events-none" style={{ animationDelay: '1s' }}>
          O(N log N)
        </div>
      </div>
    </div>
  );
};

export default HeroDashboardProjector;
