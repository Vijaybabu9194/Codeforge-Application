import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sparklinePath?: string;
  sparklineColorClass?: string;
  progressBar?: boolean;
  progressPercentage?: number;
  progressBarColorClass?: string;
  customFooter?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  sparklinePath,
  sparklineColorClass = 'text-primary',
  progressBar = false,
  progressPercentage = 0,
  progressBarColorClass = 'bg-primary',
  customFooter,
}) => {
  return (
    <div className="bg-white border border-border rounded-premium p-5 shadow-card hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-secondaryText">{label}</span>
        <div className="text-secondaryText group-hover:text-text transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text mb-2">{value}</p>
      
      {sparklinePath && (
        <div className="h-6 flex items-end">
          <svg className={`w-full h-full ${sparklineColorClass}`} viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {progressBar && (
        <div className="h-2 w-full bg-secondaryBg rounded-full overflow-hidden mt-4">
          <div className={`${progressBarColorClass} h-full rounded-full`} style={{ width: `${progressPercentage}%` }} />
        </div>
      )}

      {customFooter && (
        <div className="h-6 flex items-end">
          {customFooter}
        </div>
      )}
    </div>
  );
};
export default StatsCard;
