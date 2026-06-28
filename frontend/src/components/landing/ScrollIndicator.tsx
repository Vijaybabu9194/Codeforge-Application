import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-6 relative z-10 transition-opacity duration-500 select-none">
      <div className={`scroll-mouse ${dark ? 'border-slate-700' : 'border-slate-300'}`}>
        <div className={`w-1 h-2 rounded-full mx-auto mt-1.5 animate-bounce ${dark ? 'bg-sky-400' : 'bg-sky-600'}`} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
        Scroll to explore <ChevronDown className="w-3 h-3 animate-bounce" />
      </span>
    </div>
  );
};

export default ScrollIndicator;
