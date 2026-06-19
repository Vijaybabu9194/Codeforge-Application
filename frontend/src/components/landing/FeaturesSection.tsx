import React from 'react';
import { CheckCircle } from 'lucide-react';

/* =========================================================
   BOTTOM ILLUSTRATIONS — 3D isometric objects on glowing pedestals
   Each matches the design's space/hologram style exactly
   ========================================================= */

const TopicIllustration = () => (
  <div className="relative w-full h-[140px] flex items-end justify-center">
    {/* Glowing circular pedestal */}
    <div className="absolute bottom-0 w-[120px] h-[40px] rounded-full bg-gradient-to-t from-[#4A6CF7]/25 to-transparent blur-md" />
    <div className="absolute bottom-1 w-[100px] h-[8px] rounded-full bg-[#4A6CF7]/35 shadow-[0_0_20px_rgba(74,108,247,0.5)] blur-[2px]" />
    
    <svg width="100" height="110" viewBox="0 0 100 110" className="relative z-10 drop-shadow-[0_8px_16px_rgba(74,108,247,0.25)] select-none pointer-events-none">
      {/* 3D Isometric Book 1 (Bottom - Blue) */}
      <g transform="translate(10, 68)">
        {/* Spine base */}
        <polygon points="0,10 50,25 80,10 30,-5" fill="#1E3A8A" />
        {/* Spine front-left cover */}
        <polygon points="0,10 50,25 50,33 0,18" fill="#3B82F6" />
        {/* Spine front-right pages */}
        <polygon points="50,25 80,10 80,18 50,33" fill="#2563EB" />
        {/* Pages inner texture */}
        <polygon points="48,24 78,10 78,15 48,29" fill="#E2E8F0" />
      </g>
      
      {/* 3D Isometric Book 2 (Middle - Cyan) */}
      <g transform="translate(18, 45)">
        <polygon points="0,10 45,22 72,10 27,-2" fill="#0891B2" />
        <polygon points="0,10 45,22 45,30 0,18" fill="#22D3EE" />
        <polygon points="45,22 72,10 72,18 45,30" fill="#0E7490" />
        <polygon points="43,21 70,10 70,15 43,26" fill="#F1F5F9" />
      </g>
      
      {/* 3D Isometric Book 3 (Top - Purple) */}
      <g transform="translate(24, 23)">
        <polygon points="0,10 40,20 64,10 24,0" fill="#6D28D9" />
        <polygon points="0,10 40,20 40,28 0,18" fill="#A78BFA" />
        <polygon points="40,20 64,10 64,18 40,28" fill="#7C3AED" />
        <polygon points="38,19 62,10 62,15 38,24" fill="#F8FAFC" />
      </g>
      
      {/* Floating Gear above books, angled */}
      <g transform="translate(48, 12) rotate(-15)">
        <circle cx="0" cy="0" r="10" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="5" fill="#3B82F6" />
        {/* Gear Teeth */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-2.5" y="-13" width="5" height="4" fill="#60A5FA" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </svg>
  </div>
);

const CompanyIllustration = () => (
  <div className="relative w-full h-[140px] flex items-end justify-center">
    {/* Glowing circular pedestal */}
    <div className="absolute bottom-0 w-[120px] h-[40px] rounded-full bg-gradient-to-t from-[#22D3EE]/20 to-transparent blur-md" />
    <div className="absolute bottom-1 w-[100px] h-[8px] rounded-full bg-[#22D3EE]/30 shadow-[0_0_20px_rgba(34,211,238,0.4)] blur-[2px]" />
    
    <svg width="110" height="100" viewBox="0 0 110 100" className="relative z-10 drop-shadow-[0_8px_16px_rgba(34,211,238,0.2)] select-none pointer-events-none">
      {/* Building 1 (Left - smaller) */}
      <g transform="translate(15, 45)">
        {/* Top Face */}
        <polygon points="0,5 12,0 24,5 12,10" fill="#22D3EE" />
        {/* Left Face */}
        <polygon points="0,5 12,10 12,45 0,40" fill="#0891B2" />
        {/* Right Face */}
        <polygon points="12,10 24,5 24,40 12,45" fill="#0E7490" />
        {/* Windows */}
        <line x1="3" y1="12" x2="3" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 3" />
        <line x1="7" y1="14" x2="7" y2="37" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 3" />
      </g>
      
      {/* Building 2 (Center - tall skyscraper) */}
      <g transform="translate(38, 18)">
        {/* Top Face */}
        <polygon points="0,7 16,0 32,7 16,14" fill="#67E8F9" />
        {/* Left Face */}
        <polygon points="0,7 16,14 16,72 0,65" fill="#06B6D4" />
        {/* Right Face */}
        <polygon points="16,14 32,7 32,65 16,72" fill="#0891B2" />
        {/* Windows */}
        <line x1="4" y1="17" x2="4" y2="60" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="10" y1="20" x2="10" y2="63" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="22" y1="17" x2="22" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>
      
      {/* Building 3 (Right - medium skyscraper) */}
      <g transform="translate(68, 38)">
        {/* Top Face */}
        <polygon points="0,6 12,0 24,6 12,12" fill="#22D3EE" opacity="0.8" />
        {/* Left Face */}
        <polygon points="0,6 12,12 12,50 0,44" fill="#0891B2" opacity="0.8" />
        {/* Right Face */}
        <polygon points="12,12 24,6 24,44 12,50" fill="#0E7490" opacity="0.8" />
        {/* Windows */}
        <line x1="4" y1="13" x2="4" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 3" />
        <line x1="8" y1="15" x2="8" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 3" />
      </g>
    </svg>
  </div>
);

const AnalyticsIllustration = () => (
  <div className="relative w-full h-[140px] flex items-end justify-center">
    {/* Glowing circular pedestal */}
    <div className="absolute bottom-0 w-[120px] h-[40px] rounded-full bg-gradient-to-t from-[#A78BFA]/20 to-transparent blur-md" />
    <div className="absolute bottom-1 w-[100px] h-[8px] rounded-full bg-[#A78BFA]/30 shadow-[0_0_20px_rgba(167,139,250,0.4)] blur-[2px]" />
    
    <svg width="110" height="100" viewBox="0 0 110 100" className="relative z-10 drop-shadow-[0_8px_16px_rgba(167,139,250,0.2)] select-none pointer-events-none">
      {/* 3D Isometric Bar 1 (Left - low) */}
      <g transform="translate(15, 60)">
        <polygon points="0,3 7,0 14,3 7,6" fill="#DDD6FE" />
        <polygon points="0,3 7,6 7,30 0,27" fill="#8B5CF6" />
        <polygon points="7,6 14,3 14,27 7,30" fill="#7C3AED" />
      </g>
      
      {/* 3D Isometric Bar 2 (Medium) */}
      <g transform="translate(35, 40)">
        <polygon points="0,3 7,0 14,3 7,6" fill="#C084FC" />
        <polygon points="0,3 7,6 7,50 0,47" fill="#A855F7" />
        <polygon points="7,6 14,3 14,47 7,50" fill="#9333EA" />
      </g>
      
      {/* 3D Isometric Bar 3 (Tall) */}
      <g transform="translate(55, 20)">
        <polygon points="0,3 7,0 14,3 7,6" fill="#DDD6FE" />
        <polygon points="0,3 7,6 7,70 0,67" fill="#8B5CF6" />
        <polygon points="7,6 14,3 14,67 7,70" fill="#7C3AED" />
      </g>

      {/* 3D Isometric Bar 4 (Medium-High) */}
      <g transform="translate(75, 45)">
        <polygon points="0,3 7,0 14,3 7,6" fill="#F472B6" />
        <polygon points="0,3 7,6 7,45 0,42" fill="#EC4899" />
        <polygon points="7,6 14,3 14,42 7,45" fill="#DB2777" />
      </g>
      
      {/* Grid Floor Line */}
      <path d="M 5 72 L 98 72" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
    </svg>
  </div>
);

const TrophyIllustration = () => (
  <div className="relative w-full h-[140px] flex items-end justify-center">
    {/* Glowing circular pedestal */}
    <div className="absolute bottom-0 w-[120px] h-[40px] rounded-full bg-gradient-to-t from-[#F59E0B]/20 to-transparent blur-md" />
    <div className="absolute bottom-1 w-[100px] h-[8px] rounded-full bg-[#F59E0B]/30 shadow-[0_0_20px_rgba(245,158,11,0.4)] blur-[2px]" />
    
    <svg width="100" height="100" viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)] select-none pointer-events-none">
      <defs>
        <linearGradient id="goldLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="goldCore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      
      {/* Left Handle */}
      <path d="M 32 30 C 18 30 18 46 32 48" fill="none" stroke="url(#goldLight)" strokeWidth="3.5" />
      {/* Right Handle */}
      <path d="M 68 30 C 82 30 82 46 68 48" fill="none" stroke="url(#goldLight)" strokeWidth="3.5" />
      
      {/* Trophy Bowl */}
      <path d="M 32 20 L 68 20 L 62 48 Q 50 56 38 48 Z" fill="url(#goldCore)" stroke="#D97706" strokeWidth="1" />
      
      {/* Base Stem */}
      <path d="M 46 48 L 54 48 L 52 68 L 48 68 Z" fill="url(#goldLight)" />
      
      {/* 3D Wood Base Pedestal */}
      <polygon points="34,72 66,72 62,84 38,84" fill="#451A03" stroke="#1c0a02" strokeWidth="1.25" />
      <polygon points="38,84 62,84 60,92 40,92" fill="#1C0A02" />
      
      {/* Star decal inside trophy bowl */}
      <polygon points="50,28 52,33 57,33 53,36 55,41 50,38 45,41 47,36 43,33 48,33" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  </div>
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
  <div className="feature-card flex flex-col h-full select-none">
    {/* Icon */}
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    {/* Title */}
    <h3 className="text-[18px] font-bold text-white mb-2.5">{title}</h3>
    {/* Description */}
    <p className="text-[14px] text-[#7B8AB8] leading-relaxed mb-5">{description}</p>
    {/* Checklist */}
    <div className="space-y-2.5 mb-6">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-[#4A6CF7] flex-shrink-0" />
          <span className="text-[13px] text-[#A8B8E0] font-medium">{item}</span>
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
      illustration: <TopicIllustration />,
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
      illustration: <CompanyIllustration />,
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
      illustration: <AnalyticsIllustration />,
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
      illustration: <TrophyIllustration />,
    },
  ];

  return (
    <section id="features" className="py-16 relative z-10">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-[30px] lg:text-[36px] font-bold text-white tracking-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-[#4A6CF7] to-[#6B8AFF] bg-clip-text text-transparent">
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
