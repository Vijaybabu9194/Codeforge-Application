import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-4 relative z-30 select-none">
      {/* High-Contrast Mouse Animation Container */}
      <div className={`w-6 h-10 border-2 rounded-2xl relative flex justify-center pt-1.5 transition-colors ${
        dark 
          ? 'border-slate-500 bg-slate-900/40 shadow-sm shadow-black/50' 
          : 'border-slate-700 bg-slate-100 shadow-sm shadow-slate-300'
      }`}>
        <div className={`w-1 h-2.5 rounded-full animate-bounce ${
          dark ? 'bg-sky-400' : 'bg-sky-600'
        }`} />
      </div>
      
      <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
        dark ? 'text-slate-300' : 'text-slate-800'
      }`}>
        Scroll to explore <ChevronDown className="w-3.5 h-3.5 animate-bounce text-sky-500" />
      </span>
    </div>
  );
};

export default ScrollIndicator;
