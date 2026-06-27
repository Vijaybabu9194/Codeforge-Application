import React from 'react';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardGoalProgressProps {
  current?: number;
  target?: number;
}

export const DashboardGoalProgress: React.FC<DashboardGoalProgressProps> = ({
  current = 0,
  target = 200,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const cx = 75;
  const cy = 75;

  // Calculate days left in the current month dynamically
  const getDaysLeftInMonth = () => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = endOfMonth.getTime() - today.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysLeftInMonth();

  return (
    <div className="dash-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[16px] font-bold text-white">Goal Progress</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">Edit Goal</button>
      </div>

      <p className="text-[12px] text-dash-textSecondary font-medium mb-4">
        Solve {target} problems this month
      </p>

      {/* Circular progress */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.04)'}
              strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="#4A6CF7"
              strokeWidth={strokeWidth}
              strokeDasharray={`${progress} ${circumference - progress}`}
              strokeDashoffset={circumference / 4}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-700"
              style={{ filter: 'drop-shadow(0 0 6px rgba(74, 108, 247, 0.4))' }}
            />
            {/* Center text with dynamic theme colors */}
            <text x={cx} y={cy - 4} fill={isLight ? '#0F172A' : '#FFFFFF'} fontSize="28" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              {percentage}%
            </text>
            <text x={cx} y={cy + 14} fill={isLight ? '#475569' : '#7B8AB8'} fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
              {current} / {target}
            </text>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5 mt-2 text-dash-textSecondary">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-[12px] font-medium">{daysLeft} days left</span>
      </div>
    </div>
  );
};

export default DashboardGoalProgress;
