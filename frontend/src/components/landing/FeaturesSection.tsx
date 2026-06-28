import React from 'react';
import { CheckCircle } from 'lucide-react';

/* =========================================================
   FEATURE ILLUSTRATIONS — Render the high-fidelity design image assets
   ========================================================= */

const FeatureIllustration: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-[145px] flex items-end justify-center overflow-hidden pointer-events-none select-none">
    {/* Soft glow behind the illustration */}
    <div className="absolute bottom-[-10px] w-[130px] h-[35px] rounded-full bg-[#4A6CF7]/20 blur-md" />
    <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 hover:scale-105">
      {children}
    </div>
  </div>
);

const TopicIllustration: React.FC = () => (
  <svg viewBox="0 0 160 145" className="w-full h-full max-h-[135px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nodeGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4A6CF7" />
        <stop offset="100%" stopColor="#6B8AFF" />
      </linearGradient>
      <linearGradient id="activeNode" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    
    <path d="M 30 105 L 60 70 M 60 70 L 100 50 M 60 70 L 80 105 M 100 50 L 130 85 M 100 50 L 130 25" stroke="#4A6CF7" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="3 3" />
    <path d="M 30 105 L 60 70 L 100 50 L 130 25" stroke="url(#nodeGlow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

    <circle cx="30" cy="105" r="9" fill="#0A0F24" stroke="url(#nodeGlow)" strokeWidth="2" />
    <path d="M 27 105 L 29 107 L 33 103" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />

    <circle cx="60" cy="70" r="11" fill="#0A0F24" stroke="url(#nodeGlow)" strokeWidth="2" />
    <path d="M 57 70 L 59 72 L 63 68" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />

    <circle cx="100" cy="50" r="13" fill="#030712" stroke="url(#activeNode)" strokeWidth="2.5" className="animate-pulse" />
    <circle cx="100" cy="50" r="5" fill="#22D3EE" />

    <circle cx="80" cy="105" r="8" fill="#050A18" stroke="#334155" strokeWidth="2" />
    <circle cx="130" cy="85" r="8" fill="#050A18" stroke="#334155" strokeWidth="2" />
    <circle cx="130" cy="25" r="9" fill="#050A18" stroke="#334155" strokeWidth="2" />

    <rect x="15" y="122" width="30" height="11" rx="3" fill="#111827" stroke="#4A6CF7" strokeWidth="0.5" strokeOpacity="0.5" />
    <text x="30" y="130" fill="#A8B8E0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BASIC</text>

    <rect x="85" y="15" width="30" height="11" rx="3" fill="#111827" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.5" />
    <text x="100" y="23" fill="#22D3EE" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ACTIVE</text>
  </svg>
);

const CompanyIllustration: React.FC = () => (
  <svg viewBox="0 0 160 145" className="w-full h-full max-h-[135px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardGlowGoogle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EA4335" />
        <stop offset="50%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
      <linearGradient id="cardGlowMeta" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0668E1" />
        <stop offset="100%" stopColor="#00F2FE" />
      </linearGradient>
    </defs>

    <g transform="translate(15, 65) rotate(-6)">
      <rect width="62" height="40" rx="6" fill="#0A0F24" stroke="#334155" strokeWidth="1" />
      <g transform="translate(6, 12)">
        <rect x="0" y="0" width="8" height="8" fill="#F25022" />
        <rect x="10" y="0" width="8" height="8" fill="#7FBA00" />
        <rect x="0" y="10" width="8" height="8" fill="#00A4EF" />
        <rect x="10" y="10" width="8" height="8" fill="#FFB900" />
      </g>
      <text x="28" y="20" fill="#A8B8E0" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">MSFT</text>
      <text x="28" y="29" fill="#4ADE80" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">45 Qs</text>
    </g>

    <g transform="translate(82, 52) rotate(6)">
      <rect width="62" height="40" rx="6" fill="#0A0F24" stroke="url(#cardGlowGoogle)" strokeWidth="1" />
      <circle cx="14" cy="20" r="7" fill="#1F2937" />
      <text x="14" y="23" fill="#EA4335" fontSize="10" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">G</text>
      <text x="26" y="18" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Google</text>
      <text x="26" y="27" fill="#FBBC05" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">120+ Qs</text>
    </g>

    <g transform="translate(44, 22) rotate(-2)">
      <rect width="72" height="44" rx="8" fill="#050B1E" stroke="url(#cardGlowMeta)" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 4px 10px rgba(6, 104, 225, 0.25))' }} />
      <path d="M 12 24 C 16 16, 23 16, 23 24 C 23 32, 16 32, 12 24" stroke="#0668E1" strokeWidth="2" fill="none" />
      <path d="M 28 24 C 24 16, 17 16, 17 24 C 17 32, 24 32, 28 24" stroke="#00F2FE" strokeWidth="2" fill="none" />
      
      <text x="35" y="20" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">Meta</text>
      <text x="35" y="29" fill="#00F2FE" fontSize="6.5" fontWeight="semibold" fontFamily="sans-serif">Top Rated</text>
      <rect x="35" y="32" width="28" height="6" rx="2" fill="#0668E1" fillOpacity="0.2" />
      <text x="49" y="37" fill="#00F2FE" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HOT</text>
    </g>
  </svg>
);

const AnalyticsIllustration: React.FC = () => (
  <svg viewBox="0 0 160 145" className="w-full h-full max-h-[135px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g transform="translate(15, 12)">
      <text x="0" y="0" fill="#6B8AFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">SOLVED HEATMAP</text>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => {
          const vals = [0.1, 0.4, 0.8, 0.9, 0.2, 0.7, 0.1, 0.3, 0.6, 0.9, 0.2, 0.5, 0.8, 0.1, 0.4, 0.7, 0.9, 0.3, 0.2, 0.5, 0.8, 0.1, 0.6, 0.9, 0.2, 0.4, 0.7, 0.3];
          const opacity = vals[(r * 9 + c) % vals.length];
          const color = opacity > 0.7 ? '#22D3EE' : opacity > 0.3 ? '#4A6CF7' : '#1F2937';
          return (
            <rect
              key={`${r}-${c}`}
              x={c * 9}
              y={r * 9 + 4}
              width="6.5"
              height="6.5"
              rx="1.5"
              fill={color}
              fillOpacity={color === '#1F2937' ? 0.3 : 1}
              stroke={color === '#1F2937' ? 'none' : '#22D3EE'}
              strokeWidth="0.25"
              strokeOpacity="0.2"
            />
          );
        })
      )}
    </g>

    <g transform="translate(15, 75)">
      <path d="M 0 42 L 130 42" stroke="#334155" strokeWidth="1" />
      <path d="M 0 42 Q 25 15, 45 30 T 90 10 T 130 5" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 0 42 Q 25 15, 45 30 T 90 10 T 130 5 L 130 42 L 0 42 Z" fill="url(#chartGradient)" />
      
      <circle cx="90" cy="10" r="4.5" fill="#22D3EE" className="animate-pulse" />
      <circle cx="90" cy="10" r="2.2" fill="#FFFFFF" />

      <rect x="73" y="-12" width="34" height="11" rx="3" fill="#0C1024" stroke="#22D3EE" strokeWidth="0.75" />
      <text x="90" y="-4.5" fill="#22D3EE" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">85% Accuracy</text>
    </g>
  </svg>
);

const ContestIllustration: React.FC = () => (
  <svg viewBox="0 0 160 145" className="w-full h-full max-h-[135px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trophyGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    <circle cx="80" cy="65" r="28" fill="#F59E0B" fillOpacity="0.08" className="blur-xl" />

    <g transform="translate(18, 62) rotate(-8)">
      <circle cx="15" cy="15" r="15" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
      <text x="15" y="19" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">#2</text>
    </g>

    <g transform="translate(112, 66) rotate(10)">
      <circle cx="15" cy="15" r="15" fill="#0F172A" stroke="#B45309" strokeWidth="1" />
      <text x="15" y="19" fill="#B45309" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">#3</text>
    </g>

    <g transform="translate(52, 28)">
      <path d="M 12 52 L 44 52 L 38 48 L 18 48 Z" fill="#475569" />
      <rect x="14" y="52" width="28" height="7" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1" />
      
      <path d="M 26 34 L 30 34 L 30 48 L 26 48 Z" fill="url(#trophyGlow)" />
      
      <path d="M 14 14 C 4 14 4 32 14 32 Z" stroke="url(#trophyGlow)" strokeWidth="2" fill="none" />
      <path d="M 42 14 C 52 14 52 32 42 32 Z" stroke="url(#trophyGlow)" strokeWidth="2" fill="none" />

      <path d="M 14 9 L 42 9 L 38 36 C 35 43, 21 43, 18 36 Z" fill="url(#trophyGlow)" stroke="#FBBF24" strokeWidth="0.5" />
      
      <text x="28" y="26" fill="#FFFFFF" fontSize="14" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">1</text>
      
      <polygon points="28,2 29.5,5 33,5.5 30.5,8 31.5,11.5 28,9.5 24.5,11.5 25.5,8 23,5.5 26.5,5" fill="#FDE047" transform="translate(0, -10)" />
    </g>
  </svg>
);

/* =========================================================
   FEATURE CARD COMPONENT
   ========================================================= */
interface FeatureCardProps {
  iconColor: string;
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  illustration: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  iconColor,
  iconBg,
  icon,
  title,
  description,
  items,
  illustration,
}) => (
  <div className="p-6 rounded-2xl border flex flex-col h-full select-none transition-all duration-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-sky-500/40 bg-white border-slate-200 hover:border-sky-400/50 shadow-md hover:shadow-xl">
    {/* Icon */}
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    {/* Title */}
    <h3 className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-2.5">{title}</h3>
    {/* Description */}
    <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{description}</p>
    {/* Checklist */}
    <div className="space-y-2.5 mb-6">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-[13px] text-slate-700 dark:text-slate-300 font-semibold">{item}</span>
        </div>
      ))}
    </div>
    {/* Illustration */}
    <div className="mt-auto pt-2">{illustration}</div>
  </div>
);

/* =========================================================
   FEATURES SECTION
   ========================================================= */
export const FeaturesSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      iconColor: '#4A6CF7',
      iconBg: 'rgba(74, 108, 247, 0.12)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
        </svg>
      ),
      title: 'Topic-wise Practice',
      description: 'Structured DSA topics from basic to advanced with a beautiful learning experience.',
      items: ['Arrays', 'Linked List', 'Dynamic Programming', 'Graphs & more'],
      illustration: <FeatureIllustration><TopicIllustration /></FeatureIllustration>,
    },
    {
      iconColor: '#22D3EE',
      iconBg: 'rgba(34, 211, 238, 0.1)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
        </svg>
      ),
      title: 'Company Questions',
      description: 'Access previous year interview questions from top product companies.',
      items: ['Google', 'Amazon', 'Microsoft', 'Meta & more'],
      illustration: <FeatureIllustration><CompanyIllustration /></FeatureIllustration>,
    },
    {
      iconColor: '#A78BFA',
      iconBg: 'rgba(167, 139, 250, 0.1)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
      ),
      title: 'Track & Analyze',
      description: 'Track your progress, solve rate, accuracy and identify your strengths & weaknesses.',
      items: ['Detailed Analytics', 'Contest Performance', 'Progress Heatmaps', 'Smart Insights'],
      illustration: <FeatureIllustration><AnalyticsIllustration /></FeatureIllustration>,
    },
    {
      iconColor: '#F59E0B',
      iconBg: 'rgba(245, 158, 11, 0.1)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/>
          <path d="M4 22h16"/><path d="M10 22V8h4v14"/><path d="M8 9h8"/>
        </svg>
      ),
      title: 'Contest & Compete',
      description: 'Participate in contests, climb rankings and compete with thousands of developers.',
      items: ['Weekly Contests', 'Global Rankings', 'Real-time Leaderboard', 'Exciting Rewards'],
      illustration: <FeatureIllustration><ContestIllustration /></FeatureIllustration>,
    },
  ];

  return (
    <section id="features" className="py-16 relative z-10">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-[30px] lg:text-[36px] font-black text-slate-900 dark:text-white tracking-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              ace your next interview
            </span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
