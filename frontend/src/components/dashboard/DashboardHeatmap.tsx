import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HeatmapEntry {
  date: string;
  count: number;
}

interface DashboardHeatmapProps {
  heatmapData?: HeatmapEntry[];
}

export const DashboardHeatmap: React.FC<DashboardHeatmapProps> = ({ heatmapData = [] }) => {
  const { theme } = useTheme();
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string; sub: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
    sub: '',
  });
  const heatmapScrollRef = useRef<HTMLDivElement>(null);

  const isLight = document.documentElement.classList.contains('light-theme') || document.body.classList.contains('light-theme') || theme === 'light';
  const today = new Date();

  const getColor = (level: number) => {
    switch (level) {
      case 0: return isLight ? '#EBEDF0' : '#2D3748';
      case 1: return isLight ? '#9BE9A8' : '#0E4429';
      case 2: return isLight ? '#40C463' : '#006D32';
      case 3: return isLight ? '#30A14E' : '#26A641';
      case 4: return isLight ? '#216E39' : '#39D353';
      default: return isLight ? '#EBEDF0' : '#2D3748';
    }
  };

  const showTooltip = (e: React.MouseEvent, text: string, sub: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text,
      sub,
    });
  };

  const hideTooltip = () => setTooltip(t => ({ ...t, visible: false }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Build month-based horizontal heatmap matching ProfilePage
  const dataMap = new Map<string, number>();
  heatmapData.forEach(entry => dataMap.set(entry.date, entry.count));

  const monthsList: { year: number; month: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthsList.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const formatDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="dash-card p-6 border rounded-2xl shadow-sm relative">
      {/* Floating Global Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white px-3 py-1.5 rounded-xl text-center shadow-2xl border border-slate-700/80 transition-all duration-150"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-xs font-black tracking-tight text-white leading-none mb-0.5">{tooltip.text}</p>
          <p className="text-[10px] text-slate-400 font-semibold leading-none">{tooltip.sub}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-extrabold text-slate-900 dark:text-white">Activity Heatmap</h2>
        <a href="/profile" className="text-[12px] text-[#0284C7] dark:text-dash-blue font-bold hover:underline transition">View full profile</a>
      </div>

      <div ref={heatmapScrollRef} className="select-none overflow-x-auto w-full dash-scroll pb-2">
        <div className="flex gap-[14px] md:gap-[18px] min-w-max">
          {monthsList.map(({ year, month }, mIdx) => {
            const lastDay = new Date(year, month + 1, 0);
            const totalDays = lastDay.getDate();

            const weeks: ({ date: string; count: number; level: number } | null)[][] = [];
            let currentWeek: ({ date: string; count: number; level: number } | null)[] = Array(7).fill(null);

            for (let d = 1; d <= totalDays; d++) {
              const currentDate = new Date(year, month, d);
              const dayOfWeek = currentDate.getDay();
              const yyyy = currentDate.getFullYear();
              const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
              const dd = String(currentDate.getDate()).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;
              const count = dataMap.get(dateStr) || 0;
              let level = 0;
              if (count <= 0) level = 0;
              else if (count <= 2) level = 1;
              else if (count <= 5) level = 2;
              else if (count <= 8) level = 3;
              else level = 4;

              const currentDateOnly = new Date(yyyy, currentDate.getMonth(), currentDate.getDate());
              const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              currentWeek[dayOfWeek] = currentDateOnly > todayOnly
                ? null
                : { date: dateStr, count, level };

              if (dayOfWeek === 6 || d === totalDays) {
                weeks.push(currentWeek);
                currentWeek = Array(7).fill(null);
              }
            }

            return (
              <div key={mIdx} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="flex gap-[3px]">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px] flex-shrink-0">
                      {week.map((day, dIdx) =>
                        !day ? (
                          <div key={dIdx} className="w-[10px] h-[10px] flex-shrink-0 opacity-0" />
                        ) : (
                          <div
                            key={dIdx}
                            className="w-[10px] h-[10px] rounded-[2px] hover:scale-125 transition-transform duration-100 cursor-pointer flex-shrink-0"
                            style={{ backgroundColor: getColor(day.level) }}
                            onMouseEnter={(e) => showTooltip(
                              e,
                              day.count === 0
                                ? 'No submissions'
                                : `${day.count} submission${day.count !== 1 ? 's' : ''}`,
                              `on ${formatDate(day.date)}`
                            )}
                            onMouseLeave={hideTooltip}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-[#4A5580] uppercase tracking-wider select-none">
                  {monthNames[month]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-[#7B8AB8] font-bold pt-4 border-t border-slate-200 dark:border-white/[0.04] mt-4">
          <span>Total Submissions: {heatmapData.reduce((acc, entry) => acc + entry.count, 0)}</span>
          
          <div className="flex items-center gap-1">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <span key={lvl} className="w-2.5 h-2.5 rounded-[1.5px]" style={{ backgroundColor: getColor(lvl) }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeatmap;
