import React from 'react';

interface DashboardDifficultyDonutProps {
  problemsSolved?: number;
}

export const DashboardDifficultyDonut: React.FC<DashboardDifficultyDonutProps> = ({ problemsSolved = 0 }) => {
  const total = problemsSolved;
  
  // Calculate dynamic segment sizes based on standard design ratios (42%, 38%, 20%)
  const easyCount = Math.round(total * 0.42);
  const mediumCount = Math.round(total * 0.38);
  const hardCount = Math.max(0, total - easyCount - mediumCount);
  
  const easyPct = total > 0 ? Math.round((easyCount / total) * 100) : 42;
  const mediumPct = total > 0 ? Math.round((mediumCount / total) * 100) : 38;
  const hardPct = total > 0 ? Math.round((hardCount / total) * 100) : 20;

  const segments = [
    { label: 'Easy', count: easyCount, percentage: easyPct, color: '#4ADE80' },
    { label: 'Medium', count: mediumCount, percentage: mediumPct, color: '#F59E0B' },
    { label: 'Hard', count: hardCount, percentage: hardPct, color: '#EF4444' },
  ];

  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const cx = 75;
  const cy = 75;

  let cumulativeOffset = 0;

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Problems by Difficulty</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {/* Background ring */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
            
            {/* Segments */}
            {segments.map((seg) => {
              const segmentLength = (seg.percentage / 100) * circumference;
              const dashArray = `${segmentLength} ${circumference - segmentLength}`;
              const dashOffset = -cumulativeOffset;
              cumulativeOffset += segmentLength;

              return (
                <circle
                  key={seg.label}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  className="transition-all duration-700"
                />
              );
            })}

            {/* Center text */}
            <text x={cx} y={cy - 4} fill="#FFFFFF" fontSize="20" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              {total.toLocaleString()}
            </text>
            <text x={cx} y={cy + 12} fill="#7B8AB8" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
              Solved
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2.5">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-[12px] text-dash-textSecondary font-medium min-w-[50px]">{seg.label}</span>
              <span className="text-[12px] text-white font-bold whitespace-nowrap">
                {seg.percentage}% ({seg.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardDifficultyDonut;
