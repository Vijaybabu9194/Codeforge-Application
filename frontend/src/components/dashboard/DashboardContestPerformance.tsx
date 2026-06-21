import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ChartPoint {
  label: string;
  value: number;
}

interface DashboardContestPerformanceProps {
  progress?: {
    contestTrend: ChartPoint[];
  } | null;
}

const defaultDataPoints = [
  { label: 'Feb', value: 1200 },
  { label: 'Mar', value: 1280 },
  { label: 'Apr', value: 1350 },
  { label: 'May', value: 1500 },
  { label: 'Jun', value: 1620 },
  { label: 'Jul', value: 1834 },
  { label: 'Aug', value: 1900 },
];

export const DashboardContestPerformance: React.FC<DashboardContestPerformanceProps> = ({ progress }) => {
  const trendData = progress?.contestTrend && progress.contestTrend.length > 0
    ? progress.contestTrend.slice(-7) // Show last 7 data points
    : defaultDataPoints;

  const values = trendData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  
  // Calculate dynamic scale margins
  const minY = Math.max(0, Math.floor((minVal - 150) / 100) * 100);
  const maxY = Math.ceil((maxVal + 150) / 100) * 100;
  const range = maxY - minY || 100;
  
  const chartW = 320;
  const chartH = 180;

  const points = trendData.map((d, i) => ({
    x: (i / (trendData.length - 1)) * chartW,
    y: chartH - ((d.value - minY) / range) * chartH,
    month: d.label,
    value: d.value,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  // Draw 4 helper yLabels
  const step = Math.ceil((maxY - minY) / 3);
  const yLabels = [maxY, maxY - step, maxY - 2 * step, minY];

  // Tooltip point represents the latest rating (last point)
  const tooltipPoint = points[points.length - 1] || points[0];

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Contest Performance</h2>
        <button className="flex items-center gap-1.5 text-[12px] text-dash-textSecondary font-semibold bg-white/[0.04] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] transition">
          Monthly
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative overflow-hidden">
        <svg viewBox={`-50 -30 ${chartW + 60} ${chartH + 50}`} className="w-full h-[220px]">
          <defs>
            <linearGradient id="contestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A6CF7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis labels & grid lines */}
          {yLabels.map((label) => {
            const y = chartH - ((label - minY) / range) * chartH;
            return (
              <g key={label}>
                <text x="-12" y={y + 4} fill="#4A5580" fontSize="10" textAnchor="end" fontFamily="sans-serif">{label}</text>
                <line x1="0" y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </g>
            );
          })}

          {/* X-axis labels */}
          {points.map((p) => (
            <text key={p.month} x={p.x} y={chartH + 20} fill="#4A5580" fontSize="10" textAnchor="middle" fontFamily="sans-serif">{p.month}</text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#contestGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#4A6CF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#0B1120" stroke="#4A6CF7" strokeWidth="2" />
          ))}

          {/* Tooltip for latest point */}
          {tooltipPoint && (
            <g>
              <rect x={Math.max(10, Math.min(chartW - 100, tooltipPoint.x - 45))} y={Math.max(10, tooltipPoint.y - 55)} width="90" height="42" rx="8" fill="#1E293B" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <text x={Math.max(55, Math.min(chartW - 55, tooltipPoint.x))} y={Math.max(10, tooltipPoint.y - 55) + 17} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Current</text>
              <text x={Math.max(55, Math.min(chartW - 55, tooltipPoint.x))} y={Math.max(10, tooltipPoint.y - 55) + 30} fill="#7B8AB8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Rating: {tooltipPoint.value}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default DashboardContestPerformance;
