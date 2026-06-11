import React from 'react';
import { Calendar } from 'lucide-react';

interface HeatmapItem {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  heatmapData: HeatmapItem[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ heatmapData }) => {
  if (heatmapData.length === 0) return null;

  // Take the last 371 elements to display exactly 53 weeks of grid
  const last365 = heatmapData.slice(-371);
  const weeks: HeatmapItem[][] = [];
  let currentWeek: HeatmapItem[] = [];

  last365.forEach((item, index) => {
    currentWeek.push(item);
    if (currentWeek.length === 7 || index === last365.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-white border border-border rounded-premium p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-text flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Activity Heatmap</span>
        </h2>
        <span className="text-xs text-secondaryText">Past year of submissions</span>
      </div>

      <div className="flex flex-col space-y-2 select-none">
        <div className="flex items-center justify-between text-xs text-secondaryText">
          <div className="flex gap-2">
            <span>Jan</span>
            <span className="ml-8">Mar</span>
            <span className="ml-10">May</span>
            <span className="ml-10">Jul</span>
            <span className="ml-12">Sep</span>
            <span className="ml-10">Nov</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 bg-gray-100 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-indigo-100 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-indigo-300 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
            <span>More</span>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2 flex">
          <div className="grid grid-flow-col gap-1 pr-4">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-1">
                {week.map((day, dIdx) => {
                  let bgColor = 'bg-gray-100';
                  if (day.count > 0 && day.count <= 2) bgColor = 'bg-indigo-100';
                  else if (day.count > 2 && day.count <= 5) bgColor = 'bg-indigo-300';
                  else if (day.count > 5) bgColor = 'bg-primary';

                  return (
                    <div
                      key={dIdx}
                      className={`w-2.5 h-2.5 rounded-[2px] ${bgColor} hover:scale-125 transition-transform duration-100 cursor-pointer relative group`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-10 shadow-card">
                        {day.count} solved on {day.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActivityHeatmap;
