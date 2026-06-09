import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = { EASY: '#22C55E', MEDIUM: '#F59E0B', HARD: '#EF4444' };

interface CompanyDetail {
  name: string;
  totalQuestions: number;
  interviewFrequency: number;
  hiringTrend: string;
  difficultyDistribution: Record<string, number>;
  topTopics: { topic: string; count: number }[];
}

interface CompanyDashboardProps {
  detail: CompanyDetail | null;
  loading: boolean;
}

export default function CompanyDashboard({ detail, loading }: CompanyDashboardProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-bg-secondary rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-bg-secondary rounded-2xl" />
          <div className="h-64 bg-bg-secondary rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const pieData = Object.entries(detail.difficultyDistribution || {}).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-surface rounded-2xl p-6 card-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">{detail.name}</h2>
            <p className="text-text-secondary text-sm mt-1">
              {detail.totalQuestions} questions · Interview frequency: {detail.interviewFrequency}/10
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">{detail.hiringTrend}</span>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-surface rounded-2xl p-6 card-shadow">
          <h3 className="text-base font-semibold text-text mb-4">Difficulty Distribution</h3>
          <div className="flex items-center gap-8">
            <div className="w-[160px] h-[160px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
                  />
                  <span className="text-sm text-text-secondary">
                    {d.name.charAt(0) + d.name.slice(1).toLowerCase()}
                  </span>
                  <span className="text-sm font-semibold text-text">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-surface rounded-2xl p-6 card-shadow">
          <h3 className="text-base font-semibold text-text mb-4">Most Asked Topics</h3>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detail.topTopics} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="topic"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
