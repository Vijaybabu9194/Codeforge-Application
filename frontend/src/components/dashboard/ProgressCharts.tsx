import React from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartPoint {
  label: string;
  value: number;
}

interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

interface ProgressChartsProps {
  contestTrend: ChartPoint[];
  topicMastery: TopicProgress[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  contestTrend,
  topicMastery,
}) => {
  return (
    <div className="bg-white border border-border rounded-premium p-6 shadow-card md:col-span-2 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-text flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Contest & Questions Solved Trend</span>
        </h2>
        <span className="text-xs text-secondaryText">Monthly metrics</span>
      </div>
      
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={contestTrend}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
            <Area type="monotone" dataKey="value" name="Rating" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Mastery Progress Bars */}
      <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
        <h3 className="text-sm font-bold text-text">Topic Mastery</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {topicMastery.slice(0, 3).map((topic, i) => (
            <div key={i} className="bg-secondaryBg border border-border p-3.5 rounded-premium">
              <div className="flex justify-between text-xs mb-1.5 font-semibold text-text">
                <span>{topic.topic}</span>
                <span>{topic.percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${topic.percentage}%` }} />
              </div>
              <span className="text-[10px] text-secondaryText block mt-1.5">{topic.solved} of {topic.total} solved</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProgressCharts;
