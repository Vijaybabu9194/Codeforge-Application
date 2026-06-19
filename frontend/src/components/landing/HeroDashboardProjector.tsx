import React from 'react';
import { Flame } from 'lucide-react';

const Crystal3D: React.FC<{ className?: string; delay?: string; size?: number; primaryColor?: string; secondaryColor?: string; accentColor?: string }> = ({
  className = '',
  delay = '0s',
  size = 24,
  primaryColor = '#22D3EE',
  secondaryColor = '#60A5FA',
  accentColor = '#3B82F6',
}) => {
  return (
    <div className={`absolute animate-float-slow ${className}`} style={{ animationDelay: delay }}>
      <svg width={size} height={size * 1.3} viewBox="0 0 24 32" fill="none" className="drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
        {/* Top Left Facet */}
        <path d="M12 2L4 12L12 14V2Z" fill={primaryColor} fillOpacity="0.8" />
        {/* Top Right Facet */}
        <path d="M12 2V14L20 12L12 2Z" fill={secondaryColor} fillOpacity="0.9" />
        {/* Bottom Left Facet */}
        <path d="M4 12L12 30V14L4 12Z" fill={accentColor} fillOpacity="0.95" />
        {/* Bottom Right Facet */}
        <path d="M12 14L20 12L12 30V14Z" fill={primaryColor} fillOpacity="0.75" />
      </svg>
    </div>
  );
};

export const HeroDashboardProjector: React.FC = () => {
  return (
    <div className="relative w-full max-w-[620px] h-[540px] flex items-center justify-center select-none" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
      
      {/* ====== AMBIENT NEBULA GLOWS (Behind everything) ====== */}
      {/* Super bright core cyan/blue glow */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-[#22D3EE]/25 via-[#4A6CF7]/22 to-purple-600/12 rounded-full blur-[90px] pointer-events-none mix-blend-screen opacity-95 z-0" />
      {/* Accent purple/indigo glow */}
      <div className="absolute bottom-[8%] right-[2%] w-[280px] h-[280px] bg-[#6B8AFF]/25 rounded-full blur-[80px] pointer-events-none mix-blend-screen opacity-90 z-0" />

      {/* ====== PERSPECTIVE FLOOR GRID & CONCENTRIC RINGS ====== */}
      <div className="absolute bottom-[2%] w-[520px] h-[130px] pointer-events-none opacity-60 z-0">
        <svg className="w-full h-full" viewBox="0 0 520 130" fill="none">
          <defs>
            <linearGradient id="gridFade" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#4A6CF7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Floor rings (perspective ellipses) */}
          <ellipse cx="260" cy="65" rx="240" ry="28" stroke="url(#gridFade)" strokeWidth="1" />
          <ellipse cx="260" cy="65" rx="195" ry="23" stroke="url(#gridFade)" strokeWidth="1.25" />
          <ellipse cx="260" cy="65" rx="145" ry="17" stroke="#22D3EE" strokeWidth="1.5" strokeOpacity="0.45" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <ellipse cx="260" cy="65" rx="90" ry="10" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.55" />
          
          {/* Radial grid lines radiating from the center */}
          <line x1="260" y1="65" x2="50" y2="130" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="260" y1="65" x2="130" y2="130" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="260" y1="65" x2="210" y2="130" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="260" y1="65" x2="310" y2="130" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="260" y1="65" x2="390" y2="130" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="260" y1="65" x2="470" y2="130" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.15" />
          
          <line x1="260" y1="65" x2="0" y2="65" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.1" />
          <line x1="260" y1="65" x2="520" y2="65" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.1" />
          <line x1="260" y1="65" x2="80" y2="0" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.05" />
          <line x1="260" y1="65" x2="440" y2="0" stroke="#4A6CF7" strokeWidth="1" strokeOpacity="0.05" />
        </svg>
      </div>

      {/* ====== CONICAL GLOWING LIGHT FLARE ====== */}
      <div className="absolute bottom-[10%] left-[2%] right-[2%] h-[410px] pointer-events-none overflow-hidden z-0 opacity-95">
        <svg className="w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lightBeam" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
              <stop offset="25%" stopColor="#4A6CF7" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#3B50D4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0B1026" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="175,400 325,400 440,0 60,0" fill="url(#lightBeam)" />
        </svg>
      </div>

      {/* ====== FLOATING 3D SHADED CRYSTALS ====== */}
      <Crystal3D className="top-[9%] left-[6%]" delay="0.5s" size={24} primaryColor="#22D3EE" secondaryColor="#67E8F9" accentColor="#0891B2" />
      <Crystal3D className="top-[43%] left-[-8%]" delay="1.8s" size={18} primaryColor="#A78BFA" secondaryColor="#C084FC" accentColor="#7C3AED" />
      <Crystal3D className="bottom-[28%] right-[2%]" delay="2.5s" size={21} primaryColor="#60A5FA" secondaryColor="#93C5FD" accentColor="#2563EB" />
      
      {/* Floating Spheres */}
      <div className="absolute top-[31%] left-[17%] w-3 h-3 rounded-full bg-cyan-300/40 shadow-[0_0_12px_rgba(34,211,238,0.6)] animate-float-slow" style={{ animationDelay: '0.8s' }} />
      <div className="absolute bottom-[35%] left-[21%] w-2.5 h-2.5 rounded-full bg-purple-400/45 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-float-slow" style={{ animationDelay: '2.1s' }} />

      {/* Floating Code Bracket Bubble */}
      <div className="absolute top-[22%] right-[1%] w-11 h-11 rounded-xl bg-[#070c1e]/40 border border-white/[0.12] backdrop-blur-md flex items-center justify-center text-[#22D3EE] shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-float-slow z-20" style={{ animationDelay: '1.2s' }}>
        <span className="text-[15px] font-bold select-none">&lt;/&gt;</span>
      </div>

      {/* ====== CARD 1: Problems Solved (top-left) ====== */}
      <div className="absolute top-[6%] left-[6%] animate-float-slow z-10" style={{ animationDelay: '0s' }}>
        <div 
          className="w-[185px] bg-[#070c1e]/40 border border-white/[0.08] backdrop-blur-xl rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#22D3EE]/30 relative overflow-hidden"
          style={{ transform: 'rotateY(-18deg) rotateX(10deg) rotateZ(-1deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.06] pointer-events-none rounded-xl" />
          
          <span className="text-[11px] text-[#7B8AB8] font-semibold tracking-wide relative z-10">Problems Solved</span>
          <div className="flex items-baseline gap-2 mt-1.5 relative z-10">
            <span className="text-2.5xl font-bold text-white tracking-tight">1,248</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold relative z-10">↑ 142 this week</span>
          {/* Sparkline (glowing outline, no fill) */}
          <div className="h-10 mt-2 relative z-10">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 22 Q 15 12 30 18 T 60 8 T 90 3 T 100 6" fill="none" stroke="#22D3EE" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]" />
            </svg>
          </div>
        </div>
      </div>

      {/* ====== CARD 2: LeetCode Heatmap (top-right) ====== */}
      <div className="absolute top-[0%] right-[3%] animate-float-slow z-10" style={{ animationDelay: '1.2s' }}>
        <div 
          className="w-[245px] bg-[#070c1e]/40 border border-white/[0.08] backdrop-blur-xl rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#60A5FA]/30 relative overflow-hidden"
          style={{ transform: 'rotateY(16deg) rotateX(8deg) rotateZ(1deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.06] pointer-events-none rounded-xl" />
          
          <span className="text-[11px] text-[#7B8AB8] font-semibold tracking-wide block mb-2.5 relative z-10">LeetCode Heatmap</span>
          
          {/* Day headers */}
          <div className="flex items-start gap-2 relative z-10">
            <div className="w-4" />
            <div className="grid grid-cols-7 gap-[3.5px] flex-1 text-center">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <span key={i} className="text-[8px] text-[#7B8AB8]/60 font-bold">{d}</span>
              ))}
            </div>
          </div>

          {/* Heatmap rows */}
          <div className="flex items-start gap-2 mt-1 relative z-10">
            <div className="flex flex-col gap-[3.5px] text-[8px] text-[#7B8AB8]/60 font-bold pt-[1px]">
              <span className="h-[10px] flex items-center">M</span>
              <span className="h-[10px] flex items-center">M</span>
              <span className="h-[10px] flex items-center">A</span>
            </div>
            <div className="grid grid-cols-7 gap-[3.5px] flex-1">
              {Array.from({ length: 84 }).map((_, i) => {
                let colorClass = "bg-white/[0.02] border border-white/[0.01]";
                const r = (i * 3 + 5) % 17;
                if (r === 0 || r === 5) colorClass = "bg-[#00FF88]/20";
                else if (r === 1 || r === 8) colorClass = "bg-[#00FF88]/45";
                else if (r === 2 || r === 12) colorClass = "bg-[#00FF88] shadow-[0_0_6px_rgba(0,255,136,0.35)]";
                else if (r === 3) colorClass = "bg-emerald-500/70";
                return (
                  <div key={i} className={`w-full aspect-square rounded-[2px] ${colorClass}`} style={{ maxWidth: '10px', maxHeight: '10px' }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ====== CARD 3: Contest Rating (middle-left) ====== */}
      <div className="absolute top-[43%] left-[-2%] animate-float-slow z-10" style={{ animationDelay: '2.4s' }}>
        <div 
          className="w-[185px] bg-[#070c1e]/40 border border-white/[0.08] backdrop-blur-xl rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#818CF8]/30 relative overflow-hidden"
          style={{ transform: 'rotateY(-18deg) rotateX(-5deg) rotateZ(-2deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.06] pointer-events-none rounded-xl" />
          
          <span className="text-[11px] text-[#7B8AB8] font-semibold tracking-wide relative z-10">Contest Rating</span>
          <div className="flex items-baseline gap-2 mt-1.5 relative z-10">
            <span className="text-2.5xl font-bold text-white tracking-tight">1834</span>
          </div>
          <span className="text-[10px] text-[#818CF8] font-semibold relative z-10">Top 10%</span>
          {/* Line chart (glowing stroke, no fill) */}
          <div className="h-10 mt-2 relative z-10">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 25 Q 20 20 40 15 T 70 6 T 90 10 T 100 2" fill="none" stroke="#818CF8" strokeWidth="2.2" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(129,140,248,0.6)]" />
            </svg>
          </div>
        </div>
      </div>

      {/* ====== CARD 4: Difficulty Distribution (right) ====== */}
      <div className="absolute top-[28%] right-[-4%] animate-float-slow z-10" style={{ animationDelay: '1.7s' }}>
        <div 
          className="w-[210px] bg-[#070c1e]/40 border border-white/[0.08] backdrop-blur-xl rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#22D3EE]/30 relative overflow-hidden"
          style={{ transform: 'rotateY(20deg) rotateX(5deg) rotateZ(1.5deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.06] pointer-events-none rounded-xl" />
          
          <span className="text-[11px] text-[#7B8AB8] font-semibold tracking-wide block mb-3 relative z-10">Difficulty Distribution</span>
          <div className="flex items-center gap-4 relative z-10">
            {/* Donut */}
            <div className="w-14 h-14 relative flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22D3EE" strokeWidth="3" strokeDasharray="42 58" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="38 62" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
            </div>
            {/* Legend */}
            <div className="space-y-1.5 text-[10px] font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                <span className="text-white">Easy</span>
                <span className="text-[#7B8AB8]/60 ml-auto">42%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-white">Medium</span>
                <span className="text-[#7B8AB8]/60 ml-auto">38%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-white">Hard</span>
                <span className="text-[#7B8AB8]/60 ml-auto">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== CARD 5: Current Streak (bottom-center) ====== */}
      <div className="absolute bottom-[15%] left-[28%] animate-float-slow z-10" style={{ animationDelay: '2.8s' }}>
        <div 
          className="w-[155px] bg-[#070c1e]/40 border border-white/[0.08] backdrop-blur-xl rounded-xl p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-[#FFA500]/30 relative overflow-hidden"
          style={{ transform: 'rotateY(4deg) rotateX(15deg) rotateZ(0deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Glossy sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.06] pointer-events-none rounded-xl" />
          
          <span className="text-[10px] text-[#7B8AB8] font-semibold tracking-wide relative z-10">Current Streak</span>
          <div className="flex items-center gap-3 mt-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white leading-none block">72</span>
              <p className="text-[9px] text-[#7B8AB8] leading-none mt-0.5">Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== 3D Metallic Pedestal Base SVG (3-tiered) ====== */}
      <div className="absolute bottom-[-1.5%] w-[400px] h-[110px] flex items-center justify-center z-10 select-none pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 110" fill="none">
          <defs>
            <linearGradient id="pedestalMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D3A5F" />
              <stop offset="40%" stopColor="#151D35" />
              <stop offset="70%" stopColor="#090D1C" />
              <stop offset="100%" stopColor="#02040A" />
            </linearGradient>
            <linearGradient id="pedestalRim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="75%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="glowHorizontal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
              <stop offset="30%" stopColor="#22D3EE" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="70%" stopColor="#22D3EE" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Bottom shadow */}
          <ellipse cx="200" cy="72" rx="160" ry="15" fill="#000000" fillOpacity="0.65" filter="blur(4px)" />
          
          {/* Tier 1 (Bottom step) */}
          <path d="M 30 70 A 170 24 0 0 0 370 70 L 360 85 A 160 22 0 0 1 40 85 Z" fill="url(#pedestalMetal)" stroke="#1E293B" strokeWidth="0.75" />
          <ellipse cx="200" cy="70" rx="170" ry="24" fill="#0C122C" stroke="#1E294B" />
          <ellipse cx="200" cy="70" rx="168" ry="23" stroke="url(#glowHorizontal)" strokeWidth="1.25" />
          
          {/* Tier 2 (Middle step) */}
          <path d="M 55 52 A 145 20 0 0 0 345 52 L 340 65 A 140 18 0 0 1 60 65 Z" fill="url(#pedestalMetal)" />
          <ellipse cx="200" cy="52" rx="145" ry="20" fill="#0B1028" stroke="#1E294B" />
          <ellipse cx="200" cy="52" rx="143" ry="19" stroke="url(#glowHorizontal)" strokeWidth="1.25" />
          
          {/* Tier 3 (Top plate) */}
          <path d="M 75 35 A 125 16 0 0 0 325 35 L 322 45 A 122 15 0 0 1 78 45 Z" fill="url(#pedestalMetal)" />
          <ellipse cx="200" cy="35" rx="125" ry="16" fill="url(#pedestalMetal)" stroke="url(#pedestalRim)" strokeWidth="1.5" />
          
          {/* Glowing blue core core */}
          <ellipse cx="200" cy="35" rx="100" ry="12" fill="#1D4ED8" fillOpacity="0.4" />
          <ellipse cx="200" cy="35" rx="75" ry="9" fill="#22D3EE" fillOpacity="0.65" filter="blur(1.5px)" />
          <ellipse cx="200" cy="35" rx="40" ry="4" fill="#FFFFFF" fillOpacity="0.95" filter="blur(1px)" />
        </svg>
      </div>
    </div>
  );
};
export default HeroDashboardProjector;
