import React from 'react';
import { 
  Award, 
  Layers, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  problemsSolved: number;
  currentStreak: number;
  contestRating: number;
}

interface PlatformDashboard {
  platform: string;
  username: string;
  globalRank: number;
  countryRank: number;
  contestRating: number;
  problemsSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  badgesCount: number;
  contestHistory: string;
  heatmapData: string;
  badges: string;
  recentActivity: string;
}

interface Badge {
  name: string;
  icon: string;
  description: string;
}

interface RecentSubmission {
  title: string;
  status: string;
  time: string;
  language?: string;
}

interface LeetCodeDashboardProps {
  dashboard: PlatformDashboard;
  user: UserInfo | null;
  heatmapList: { date: string; count: number }[];
  contestHistoryData: { label: string; rating: number }[];
  badgesList: Badge[];
  recentActivityList: RecentSubmission[];
}

export const LeetCodeDashboard: React.FC<LeetCodeDashboardProps> = ({
  dashboard,
  user,
  heatmapList,
  contestHistoryData,
  badgesList,
  recentActivityList,
}) => {
  const getPlatformIcon = (name: string) => {
    switch (name) {
      case 'LeetCode': return '🟡';
      case 'Codeforces': return '🔴';
      case 'CodeChef': return '🟤';
      case 'GeeksForGeeks': return '🟢';
      default: return '💻';
    }
  };

  const getRadialData = () => {
    return [
      { name: 'Hard', value: dashboard.hardSolved, fill: '#EF4444' },
      { name: 'Medium', value: dashboard.mediumSolved, fill: '#F59E0B' },
      { name: 'Easy', value: dashboard.easySolved, fill: '#22C55E' },
    ];
  };

  const renderHeatmap = () => {
    if (heatmapList.length === 0) return <p className="text-xs text-secondaryText">No platform calendar data found.</p>;

    const last180 = heatmapList.slice(-182);
    const weeks: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    last180.forEach((item, index) => {
      currentWeek.push(item);
      if (currentWeek.length === 7 || index === last180.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="flex gap-1 overflow-x-auto pb-2 select-none justify-center">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-rows-7 gap-1">
            {week.map((day, dIdx) => {
              let bgColor = 'bg-gray-100';
              if (day.count > 0 && day.count <= 2) bgColor = 'bg-indigo-100';
              else if (day.count > 2 && day.count <= 4) bgColor = 'bg-indigo-300';
              else if (day.count > 4) bgColor = 'bg-primary';

              return (
                <div
                  key={dIdx}
                  className={`w-2.5 h-2.5 rounded-[2px] ${bgColor} hover:scale-125 transition duration-100 relative group cursor-pointer`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900 text-white text-[9px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-10 shadow-card">
                    {day.count} solved on {day.date}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* PLATFORM HEADER */}
      <div className="bg-white border border-border rounded-premium p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-border flex items-center justify-center text-3xl font-bold">
            {user?.avatarUrl ? user.avatarUrl : getPlatformIcon(dashboard.platform)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-1.5">
              <span>{dashboard.username}</span>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondaryText mt-1.5">
              <span className="flex items-center gap-1">🌐 Rank: <span className="font-bold text-text">#{dashboard.globalRank}</span></span>
              <span className="flex items-center gap-1">📍 Country Rank: <span className="font-bold text-text">#{dashboard.countryRank}</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center border-l border-border pl-6">
          <div>
            <span className="text-[10px] font-bold text-secondaryText block">CONTEST RATING</span>
            <span className="text-xl font-bold text-primary block mt-0.5">{dashboard.contestRating}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondaryText block">SOLVED</span>
            <span className="text-xl font-bold text-success block mt-0.5">{dashboard.problemsSolved}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondaryText block">ACHIEVEMENTS</span>
            <span className="text-xl font-bold text-text block mt-0.5">{dashboard.badgesCount} Badges</span>
          </div>
        </div>
      </div>

      {/* ANALYTICS SECTION: Heatmap, Distribution and Contest trends */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Solved Breakdown Radial Chart */}
        <div className="bg-white border border-border rounded-premium p-5 shadow-card flex flex-col space-y-4">
          <h2 className="text-sm font-bold text-text">Difficulty Distribution</h2>
          <div className="flex items-center justify-between flex-1">
            <div className="h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={8} data={getRadialData()}>
                  <RadialBar background dataKey="value" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 flex-1 pl-4">
              <div className="flex justify-between items-center bg-[#F5F7FA] p-2.5 rounded-premium text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-text">
                  <span className="w-2.5 h-2.5 rounded-full bg-success" /> Easy
                </span>
                <span className="font-bold text-success">{dashboard.easySolved} Solved</span>
              </div>
              <div className="flex justify-between items-center bg-[#F5F7FA] p-2.5 rounded-premium text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-text">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning" /> Medium
                </span>
                <span className="font-bold text-warning">{dashboard.mediumSolved} Solved</span>
              </div>
              <div className="flex justify-between items-center bg-[#F5F7FA] p-2.5 rounded-premium text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-text">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger" /> Hard
                </span>
                <span className="font-bold text-danger">{dashboard.hardSolved} Solved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Rating Progress */}
        <div className="bg-white border border-border rounded-premium p-5 shadow-card flex flex-col space-y-4">
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Rating Progress Trends</span>
          </h2>
          {contestHistoryData.length === 0 ? (
            <p className="text-xs text-secondaryText text-center my-auto">No contest history recorded</p>
          ) : (
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contestHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="rating" name="Rating" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* CONTRIBUTION GRAPH */}
      <div className="bg-white border border-border rounded-premium p-6 shadow-card">
        <h2 className="text-sm font-bold text-text mb-4">Submission Calendar</h2>
        {renderHeatmap()}
      </div>

      {/* ACHIEVEMENT BADGES */}
      <div className="bg-white border border-border rounded-premium p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span>Earned Badges ({badgesList.length})</span>
        </h2>
        {badgesList.length === 0 ? (
          <p className="text-xs text-secondaryText">No achievement badges unlocked yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badgesList.map((badge, i) => (
              <div key={i} className="border border-border bg-[#F5F7FA] p-4 rounded-premium text-center hover:translate-y-[-2px] transition duration-200">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl mx-auto mb-3">
                  {badge.icon ? badge.icon : '🏅'}
                </div>
                <span className="text-xs font-bold text-text block truncate">{badge.name}</span>
                <span className="text-[10px] text-secondaryText block mt-1 leading-snug">{badge.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT PLATFORM ACTIVITY */}
      <div className="bg-white border border-border rounded-premium p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>Recent Submissions</span>
        </h2>
        {recentActivityList.length === 0 ? (
          <p className="text-xs text-secondaryText">No recent platform activities</p>
        ) : (
          <div className="divide-y divide-border">
            {recentActivityList.map((sub, i) => (
              <div key={i} className="flex justify-between items-center py-3 text-xs first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-text">{sub.title}</p>
                  <p className="text-[10px] text-secondaryText mt-0.5">{sub.time}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {sub.language && (
                    <span className="bg-secondaryBg text-muted px-2 py-0.5 rounded-full border border-border text-[9px] font-medium">{sub.language}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    sub.status === 'Accepted' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default LeetCodeDashboard;
