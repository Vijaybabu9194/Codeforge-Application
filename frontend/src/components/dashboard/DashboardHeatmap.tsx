import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HeatmapEntry {
  date: string;
  count: number;
}

interface DashboardHeatmapProps {
  heatmapData?: HeatmapEntry[];
}

const days = ['Mon', '', 'Wed', '', 'Fri', '', ''];

export const DashboardHeatmap: React.FC<DashboardHeatmapProps> = ({ heatmapData = [] }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const today = new Date();
  
  const getColor = (level: number) => {
    switch (level) {
      case 0: return isLight ? '#EBEDF0' : '#262626'; // Empty cell (light gray vs dark gray)
      case 1: return isLight ? '#9BE9A8' : '#0E4429'; // Low submissions (light green in light mode, dark green in dark mode)
      case 2: return isLight ? '#40C463' : '#006D32'; // Medium submissions
      case 3: return isLight ? '#30A14E' : '#26A641'; // High submissions
      case 4: return isLight ? '#216E39' : '#39D353'; // Max submissions (darkest green in light mode, brightest neon green in dark mode)
      default: return isLight ? '#EBEDF0' : '#262626';
    }
  };

  // Format dynamic month labels based on the current date
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const getMonthLabels = () => {
    const labels: string[] = [];
    const dayOfWeek = today.getDay();
    const daysToSubtract = 32 * 7 - (7 - dayOfWeek);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    for (let m = 0; m < 8; m++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (m * 4 * 7));
      labels.push(monthNames[currentDate.getMonth()]);
    }
    return labels;
  };

  const dynamicMonths = getMonthLabels();

  // Map backend date-counts to 32x7 grid
  const getGridData = () => {
    const dataMap = new Map<string, number>();
    heatmapData.forEach(entry => dataMap.set(entry.date, entry.count));

    const grid: number[][] = [];
    const dayOfWeek = today.getDay();
    const daysToSubtract = 32 * 7 - (7 - dayOfWeek);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    for (let w = 0; w < 32; w++) {
      const weekData: number[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7 + d));
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = dataMap.get(dateStr) || 0;
        
        let level = 0;
        if (count === 0) level = 0;
        else if (count <= 2) level = 1;
        else if (count <= 5) level = 2;
        else if (count <= 8) level = 3;
        else level = 4;
        
        weekData.push(level);
      }
      grid.push(weekData);
    }
    return grid;
  };

  const finalGrid = getGridData();

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Activity Heatmap</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">View full activity</button>
      </div>

      <div className="overflow-x-auto dash-scroll pb-2">
        {/* Month labels dynamically placed above each 4-week group with identical gap spacing */}
        <div className="flex ml-[38px] mb-2 gap-6">
          {dynamicMonths.map((m, mIdx) => (
            <span key={mIdx} className="text-[11px] text-dash-textMuted font-medium w-[61px] text-left">
              {m}
            </span>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-2 pt-0.5">
            {days.map((d, i) => (
              <div key={i} className="h-[13px] flex items-center">
                <span className="text-[10px] text-dash-textMuted font-medium w-[30px] text-right">{d}</span>
              </div>
            ))}
          </div>

          {/* Heatmap grid separated into 8 month groups with gap-6 spacing */}
          <div className="flex gap-6">
            {Array.from({ length: 8 }).map((_, mIdx) => (
              <div key={mIdx} className="flex gap-[3px]">
                {finalGrid.slice(mIdx * 4, (mIdx + 1) * 4).map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((level, dIdx) => (
                      <div
                        key={dIdx}
                        className="w-[13px] h-[13px] rounded-[3px] hover:scale-125 transition-transform duration-100 cursor-pointer relative group"
                        style={{ backgroundColor: getColor(level) }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-[10px] rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-20 border border-dash-border shadow-lg">
                          Level {level} Activity
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-4 mr-2">
          <span className="text-[10px] text-dash-textMuted">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: getColor(level) }} />
          ))}
          <span className="text-[10px] text-dash-textMuted">More</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeatmap;
