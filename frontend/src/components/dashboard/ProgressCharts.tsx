import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

interface Progress {
  contestTrend: { label: string; value: number }[];
  questionsTrend: { label: string; value: number }[];
  topicMastery: { topic: string; solved: number; total: number; percentage: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-text text-white px-3 py-2 rounded-lg text-xs">
        <p className="font-medium">{label}</p>
        <p>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function ProgressCharts({ progress }: { progress: Progress }) {
  return (
    <div className="space-y-6">
      {/* Contest Rating Trend */}
      <div className="bg-surface rounded-2xl p-6 card-shadow">
        <h3 className="text-base font-semibold text-text mb-4">Contest Rating</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={progress.contestTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 3 }} activeDot={{ r: 5, fill: '#4F46E5' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Mastery */}
      <div className="bg-surface rounded-2xl p-6 card-shadow">
        <h3 className="text-base font-semibold text-text mb-4">Topic Mastery</h3>
        <div className="space-y-3">
          {progress.topicMastery.slice(0, 8).map((t) => (
            <div key={t.topic}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-text font-medium">{t.topic}</span>
                <span className="text-text-secondary">{t.solved}/{t.total}</span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${t.percentage}%`,
                    backgroundColor: t.percentage > 70 ? '#22C55E' : t.percentage > 40 ? '#6366F1' : '#F59E0B',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
