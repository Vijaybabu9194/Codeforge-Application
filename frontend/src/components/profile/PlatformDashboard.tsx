import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Trophy, Globe, MapPin, Star } from 'lucide-react';

const PLATFORM_ICONS: Record<string, string> = {
  LEETCODE: '🟡', GEEKSFORGEEKS: '🟢', CODECHEF: '⭐', HACKERRANK: '🟩', CODEFORCES: '🔵'
};

const PLATFORM_NAMES: Record<string, string> = {
  LEETCODE: 'LeetCode', GEEKSFORGEEKS: 'GeeksForGeeks', CODECHEF: 'CodeChef',
  HACKERRANK: 'HackerRank', CODEFORCES: 'Codeforces'
};

const BRAND_COLORS: Record<string, string> = {
  LEETCODE: '#F59E0B',
  GEEKSFORGEEKS: '#16A34A',
  CODECHEF: '#B45309',
  HACKERRANK: '#10B981',
  CODEFORCES: '#3B82F6',
};

const DIFF_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

interface PlatformDashboardProps {
  platform: string;
  dashboard: any;
}

export default function PlatformDashboard({ platform, dashboard }: PlatformDashboardProps) {
  const brandColor = BRAND_COLORS[platform] || '#6366F1';

  const contestHistory = useMemo(() => {
    try {
      return typeof dashboard?.contestHistory === 'string'
        ? JSON.parse(dashboard.contestHistory || '[]')
        : dashboard?.contestHistory || [];
    } catch {
      return [];
    }
  }, [dashboard]);

  const badges = useMemo(() => {
    try {
      return typeof dashboard?.badges === 'string'
        ? JSON.parse(dashboard.badges || '[]')
        : dashboard?.badges || [];
    } catch {
      return [];
    }
  }, [dashboard]);

  const recentActivity = useMemo(() => {
    try {
      return typeof dashboard?.recentActivity === 'string'
        ? JSON.parse(dashboard.recentActivity || '[]')
        : dashboard?.recentActivity || [];
    } catch {
      return [];
    }
  }, [dashboard]);

  const diffPie = useMemo(() => {
    if (!dashboard) return [];
    return [
      { name: 'Easy', value: dashboard.easySolved || 0, color: DIFF_COLORS.easy },
      { name: 'Medium', value: dashboard.mediumSolved || 0, color: DIFF_COLORS.medium },
      { name: 'Hard', value: dashboard.hardSolved || 0, color: DIFF_COLORS.hard },
    ];
  }, [dashboard]);

  if (!dashboard) {
    return (
      <div className="text-center py-20 bg-surface rounded-2xl border border-border">
        <p className="text-text-secondary">No analytics available for this platform.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-surface rounded-2xl p-6 card-shadow border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: `${brandColor}15` }}
            >
              {PLATFORM_ICONS[platform] || '💻'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">{dashboard.username}</h2>
              <p className="text-text-secondary text-sm font-medium">{PLATFORM_NAMES[platform] || platform}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 self-stretch md:self-auto bg-bg-secondary/50 p-4 rounded-xl">
            <div className="text-center border-r border-border/50 pr-4 last:border-none">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Globe className="w-4 h-4 text-muted" />
              </div>
              <p className="text-base font-bold text-text">{dashboard.globalRank?.toLocaleString() || 'N/A'}</p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Global</p>
            </div>
            <div className="text-center border-r border-border/50 pr-4 last:border-none">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-muted" />
              </div>
              <p className="text-base font-bold text-text">{dashboard.countryRank?.toLocaleString() || 'N/A'}</p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Country</p>
            </div>
            <div className="text-center border-r border-border/50 pr-4 last:border-none">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <p className="text-base font-bold" style={{ color: brandColor }}>
                {dashboard.contestRating || 'N/A'}
              </p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Rating</p>
            </div>
            <div className="text-center last:border-none">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="w-4 h-4 text-warning" />
              </div>
              <p className="text-base font-bold text-text">{dashboard.problemsSolved || 0}</p>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Solved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="bg-surface rounded-2xl p-6 card-shadow border border-border/50">
          <h3 className="text-base font-semibold text-text mb-4">Difficulty Breakdown</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center sm:justify-start">
            <div className="w-[180px] h-[180px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diffPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {diffPie.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full max-w-[160px]">
              {diffPie.map((d) => (
                <div key={d.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm font-medium text-text-secondary">{d.name}</span>
                  </div>
                  <p className="text-lg font-bold text-text">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contest History */}
        <div className="bg-surface rounded-2xl p-6 card-shadow border border-border/50">
          <h3 className="text-base font-semibold text-text mb-4">Contest History</h3>
          {contestHistory.length > 0 ? (
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contestHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={brandColor}
                    strokeWidth={2.5}
                    dot={{ fill: brandColor, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[180px]">
              <p className="text-sm text-text-secondary">No contest data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-surface rounded-2xl p-6 card-shadow border border-border/50">
          <h3 className="text-base font-semibold text-text mb-4">Badges & Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((b: any, i: number) => (
              <div
                key={i}
                className="bg-bg rounded-xl p-4 text-center hover:translate-y-[-2px] transition-all border border-border/50 group cursor-default"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                  {b.icon || '🏅'}
                </span>
                <p className="text-sm font-semibold text-text truncate">{b.name}</p>
                <p className="text-[10px] text-text-secondary mt-1">{b.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-surface rounded-2xl p-6 card-shadow border border-border/50">
          <h3 className="text-base font-semibold text-text mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-bg-secondary/40 transition-colors border border-transparent hover:border-border/40"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    a.type === 'solved'
                      ? 'bg-success'
                      : a.type === 'contest'
                      ? 'bg-primary'
                      : 'bg-warning'
                  }`}
                />
                <span className="text-sm text-text flex-1 font-medium">{a.description}</span>
                {a.detail && (
                  <span className="text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-md font-semibold">
                    {a.detail}
                  </span>
                )}
                <span className="text-xs text-muted font-medium">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
