import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Flame, 
  Building2, 
  Clock, 
  Bookmark, 
  CheckCircle 
} from 'lucide-react';

import StatsCard from '../components/dashboard/StatsCard';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import ProgressCharts from '../components/dashboard/ProgressCharts';
import RecentActivity from '../components/dashboard/RecentActivity';

interface Stats {
  problemsSolved: number;
  contestRating: number;
  currentStreak: number;
  companiesCovered: number;
  studyHours: number;
  bookmarks: number;
}

interface HeatmapItem {
  date: string;
  count: number;
}

interface ProgressResponse {
  contestTrend: { label: string; value: number }[];
  questionsTrend: { label: string; value: number }[];
  topicMastery: { topic: string; solved: number; total: number; percentage: number }[];
}

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  detail: string;
  difficulty: string;
  createdAt: string;
}

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapItem[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, heatmapRes, progressRes, activityRes] = await Promise.all([
          api.get<Stats>('/dashboard/stats'),
          api.get<HeatmapItem[]>('/dashboard/heatmap'),
          api.get<ProgressResponse>('/dashboard/progress'),
          api.get<ActivityItem[]>('/dashboard/recent-activity')
        ]);
        setStats(statsRes.data);
        setHeatmap(heatmapRes.data);
        setProgress(progressRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-white border border-border rounded-premium w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-border rounded-premium" />
          ))}
        </div>
        <div className="h-48 bg-white border border-border rounded-premium" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-72 bg-white border border-border rounded-premium" />
          <div className="h-72 bg-white border border-border rounded-premium" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-border rounded-premium p-6 shadow-card">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Good Evening, {user?.name || 'Vijay'} 👋
          </h1>
          <p className="text-sm text-secondaryText mt-1">
            Consistency compounds. Keep solving. Keep growing.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs text-primary font-semibold bg-indigo-50 px-3.5 py-1.5 rounded-full">
          <Flame className="w-4 h-4" />
          <span>Active Streak: {stats?.currentStreak || 0} Days</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {/* Problems Solved */}
        <StatsCard
          label="Solved"
          value={stats?.problemsSolved || 0}
          icon={<CheckCircle className="w-4 h-4 text-success" />}
          sparklinePath="M0,15 L20,13 L40,14 L60,8 L80,10 L100,2"
          sparklineColorClass="text-success"
        />

        {/* Contest Rating */}
        <StatsCard
          label="Rating"
          value={stats?.contestRating || 0}
          icon={<Trophy className="w-4 h-4 text-primary" />}
          sparklinePath="M0,18 L20,16 L40,15 L60,11 L80,5 L100,1"
          sparklineColorClass="text-primary"
        />

        {/* Current Streak */}
        <StatsCard
          label="Streak"
          value={stats?.currentStreak || 0}
          icon={<Flame className="w-4 h-4 text-warning" />}
          sparklinePath="M0,16 L25,12 L50,14 L75,8 L100,2"
          sparklineColorClass="text-warning"
        />

        {/* Companies Covered */}
        <StatsCard
          label="Companies"
          value={stats?.companiesCovered || 0}
          icon={<Building2 className="w-4 h-4 text-[#8B5CF6]" />}
          progressBar={true}
          progressPercentage={45}
          progressBarColorClass="bg-[#8B5CF6]"
        />

        {/* Study Hours */}
        <StatsCard
          label="Study Hours"
          value={`${stats?.studyHours?.toFixed(1) || 0}h`}
          icon={<Clock className="w-4 h-4 text-secondaryText" />}
          customFooter={
            <div className="h-6 flex items-end justify-between gap-1 w-full mt-2">
              {[3, 5, 8, 4, 7, 6, 9].map((val, idx) => (
                <div key={idx} className="bg-indigo-100 group-hover:bg-primary transition w-full rounded-sm" style={{ height: `${val * 10}%` }} />
              ))}
            </div>
          }
        />

        {/* Bookmarks */}
        <StatsCard
          label="Bookmarks"
          value={stats?.bookmarks || 0}
          icon={<Bookmark className="w-4 h-4 text-danger" />}
          customFooter={
            <span className="text-[10px] text-secondaryText font-medium bg-red-50 text-danger border border-red-100 px-2 py-0.5 rounded-full mb-1">
              Saved Problems
            </span>
          }
        />
      </div>

      {/* HEATMAP */}
      <ActivityHeatmap heatmapData={heatmap} />

      {/* PROGRESS ANALYTICS AND TIMELINE */}
      <div className="grid md:grid-cols-3 gap-8">
        <ProgressCharts
          contestTrend={progress?.contestTrend || []}
          topicMastery={progress?.topicMastery || []}
        />

        <RecentActivity activityItems={activity} />
      </div>
    </div>
  );
};
export default HomePage;
