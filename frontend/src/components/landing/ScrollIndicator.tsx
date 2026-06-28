import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 relative z-30 select-none">
      <div className={`scroll-mouse ${dark ? 'border-slate-600' : 'border-slate-400'}`}>
        <div className={`w-1 h-2 rounded-full mx-auto mt-1.5 animate-bounce ${dark ? 'bg-sky-400' : 'bg-sky-600'}`} />
      </div>
      <span className={`text-[12px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
        Scroll to explore <ChevronDown className="w-3.5 h-3.5 animate-bounce text-sky-500" />
      </span>
    </div>
  );
};

export default ScrollIndicator;
