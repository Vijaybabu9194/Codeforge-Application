import React from 'react';
import { Lock } from 'lucide-react';

interface Badge {
  label: string;
  icon: React.ReactNode;
  color: string;
  isUnlocked: boolean;
}

const HexBadge: React.FC<{ badge: Badge }> = ({ badge }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer relative">
    <div className={`relative w-[60px] h-[68px] transition-all duration-300 ${badge.isUnlocked ? 'scale-100' : 'scale-95 opacity-25 grayscale'}`}>
      <svg viewBox="0 0 60 68" className="w-full h-full">
        <defs>
          <linearGradient id={`badge-${badge.label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={badge.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={badge.color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Hexagon shape */}
        <path
          d="M30 2 L56 18 L56 50 L30 66 L4 50 L4 18 Z"
          fill={badge.isUnlocked ? `url(#badge-${badge.label})` : 'rgba(255,255,255,0.01)'}
          stroke={badge.isUnlocked ? badge.color : 'rgba(255,255,255,0.1)'}
          strokeWidth="1.5"
          strokeOpacity={badge.isUnlocked ? 0.6 : 0.2}
          className="transition-all duration-300"
        />
      </svg>
      {/* Icon centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        {badge.isUnlocked ? (
          badge.icon
        ) : (
          <Lock className="w-4 h-4 text-dash-textSecondary" />
        )}
      </div>
    </div>
    <span className={`text-[10px] font-medium text-center leading-tight max-w-[70px] transition-colors duration-300 ${badge.isUnlocked ? 'text-dash-textSecondary' : 'text-dash-textMuted'}`}>
      {badge.label}
    </span>
  </div>
);

interface DashboardBadgesProps {
  solved?: number;
  streak?: number;
  rating?: number;
}

export const DashboardBadges: React.FC<DashboardBadgesProps> = ({
  solved = 0,
  streak = 0,
  rating = 0,
}) => {
  const badges: Badge[] = [
    {
      label: '7 Days Streak',
      color: '#FB923C',
      icon: <span className="text-[18px] font-extrabold text-[#FB923C]">7</span>,
      isUnlocked: streak >= 7,
    },
    {
      label: '100 Problems',
      color: '#F59E0B',
      icon: (
        <svg className="w-6 h-6 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      isUnlocked: solved >= 100,
    },
    {
      label: 'Contest Participant',
      color: '#22D3EE',
      icon: (
        <svg className="w-6 h-6 text-[#22D3EE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
      isUnlocked: rating > 0,
    },
    {
      label: 'Top 10% Contest',
      color: '#4ADE80',
      icon: (
        <svg className="w-6 h-6 text-[#4ADE80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
        </svg>
      ),
      isUnlocked: rating >= 1800,
    },
    {
      label: 'Easy Problems',
      color: '#A78BFA',
      icon: <span className="text-[16px] font-extrabold text-[#A78BFA]">50</span>,
      isUnlocked: solved >= 50,
    },
    {
      label: 'Problem Solver',
      color: '#EF4444',
      icon: (
        <svg className="w-6 h-6 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M7 8l-4 4 4 4" /><path d="M17 8l4 4-4 4" />
        </svg>
      ),
      isUnlocked: solved >= 1,
    },
  ];

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Badges</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">View all</button>
      </div>

      <div className="grid grid-cols-3 gap-3 place-items-center">
        {badges.map((badge) => (
          <HexBadge key={badge.label} badge={badge} />
        ))}
      </div>
    </div>
  );
};

export default DashboardBadges;
