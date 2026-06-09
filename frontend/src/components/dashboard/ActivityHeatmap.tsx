import { useMemo, useState } from 'react';

interface HeatmapEntry {
  date: string;
  count: number;
}

const CELL_SIZE = 13;
const CELL_GAP = 3;
const DAYS_OF_WEEK = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColor(count: number): string {
  if (count === 0) return '#EBEDF0';
  if (count <= 2) return '#C7D2FE';
  if (count <= 4) return '#A5B4FC';
  if (count <= 6) return '#818CF8';
  return '#6366F1';
}

export default function ActivityHeatmap({ data }: { data: HeatmapEntry[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

  const { grid, monthLabels, totalContributions } = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d.count]));
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: { date: Date; count: number }[][] = [];
    const labels: { label: string; week: number }[] = [];
    let total = 0;
    let currentMonth = -1;

    const cursor = new Date(startDate);
    let weekIdx = 0;

    while (cursor <= today || weeks.length === 0 || weeks[weeks.length - 1].length < 7) {
      if (!weeks[weekIdx]) weeks[weekIdx] = [];
      const dateStr = cursor.toISOString().split('T')[0];
      const count = map.get(dateStr) || 0;
      total += count;

      if (cursor.getMonth() !== currentMonth) {
        currentMonth = cursor.getMonth();
        labels.push({ label: MONTHS[currentMonth], week: weekIdx });
      }

      weeks[weekIdx].push({ date: new Date(cursor), count });

      if (weeks[weekIdx].length === 7) weekIdx++;
      cursor.setDate(cursor.getDate() + 1);

      if (cursor > today && weeks[weeks.length - 1]?.length === 7) break;
    }

    return { grid: weeks, monthLabels: labels, totalContributions: total };
  }, [data]);

  return (
    <div className="bg-surface rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text">Activity</h3>
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text">{totalContributions}</span> contributions in the last year
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: '700px' }}>
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-xs text-text-secondary"
                style={{ position: 'absolute', left: `${m.week * (CELL_SIZE + CELL_GAP) + 32}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex mt-5">
            {/* Day labels */}
            <div className="flex flex-col mr-2 mt-0" style={{ gap: `${CELL_GAP}px` }}>
              {DAYS_OF_WEEK.map((day, i) => (
                <span key={i} className="text-xs text-text-secondary leading-none" style={{ height: `${CELL_SIZE}px`, lineHeight: `${CELL_SIZE}px` }}>
                  {day}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: `${CELL_GAP}px` }}>
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${CELL_GAP}px` }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="rounded-sm cursor-pointer transition-transform hover:scale-125"
                      style={{
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                        backgroundColor: getColor(day.count),
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          date: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          count: day.count,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4">
            <span className="text-xs text-text-secondary mr-1">Less</span>
            {[0, 2, 4, 6, 8].map((v) => (
              <div
                key={v}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(v) }}
              />
            ))}
            <span className="text-xs text-text-secondary ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-text text-white text-xs rounded-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <span className="font-semibold">{tooltip.count} contributions</span> on {tooltip.date}
        </div>
      )}
    </div>
  );
}
