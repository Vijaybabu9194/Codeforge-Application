import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface WeeklyProgressDay {
  day: string;
  value: number;
}

interface DashboardWeeklyProgressProps {
  weeklyData?: WeeklyProgressDay[];
  solvedCount?: number;
  trendText?: string;
  trendUp?: boolean;
}

const defaultWeeklyData = [
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 0 },
  { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 },
  { day: 'Fri', value: 0 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
];

export const DashboardWeeklyProgress: React.FC<DashboardWeeklyProgressProps> = ({
  weeklyData = defaultWeeklyData,
  solvedCount = 0,
  trendText = 'vs last week',
  trendUp = true,
}) => {
  const values = weeklyData.map((d) => d.value);
  const maxVal = Math.max(...values, 5); // Default min scale ceiling of 5
  
  // Calculate scaled Y-axis labels
  const yMax = Math.ceil(maxVal * 1.25);
  const yMid2 = Math.ceil(maxVal * 0.83);
  const yMid1 = Math.ceil(maxVal * 0.42);

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[16px] font-bold text-white">Weekly Progress</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">View all</button>
      </div>

      {/* Stats callout */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-dash-textSecondary font-medium">Problems Solved</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-extrabold text-white">{solvedCount}</span>
          <div className="flex items-center gap-1">
            {trendUp ? (
              <TrendingUp className="w-3 h-3 text-dash-green" />
            ) : (
              <TrendingDown className="w-3 h-3 text-dash-red" />
            )}
            <span className={`text-[11px] font-bold ${trendUp ? 'text-dash-green' : 'text-dash-red'}`}>
              {trendText}
            </span>
          </div>
        </div>
      </div>

      {/* Y-axis + bars */}
      <div className="flex items-end gap-0">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-[130px] pr-2 pb-6 min-w-[24px] text-right">
          <span className="text-[9px] text-dash-textMuted">{yMax}</span>
          <span className="text-[9px] text-dash-textMuted">{yMid2}</span>
          <span className="text-[9px] text-dash-textMuted">{yMid1}</span>
          <span className="text-[9px] text-dash-textMuted">0</span>
        </div>

        {/* Bar chart */}
        <div className="flex-1 flex items-end justify-between gap-2 h-[130px] border-b border-white/[0.04] pb-0">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full relative" style={{ height: `${(d.value / yMax) * 100}%`, minHeight: '4px' }}>
                <div
                  className="w-full h-full rounded-t-md"
                  style={{
                    background: `linear-gradient(180deg, #4ADE80 0%, #059669 100%)`,
                    opacity: d.value === maxVal && d.value > 0 ? 1 : 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex ml-[24px]">
        {weeklyData.map((d) => (
          <div key={d.day} className="flex-1 text-center">
            <span className="text-[10px] text-dash-textMuted font-medium">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardWeeklyProgress;
