import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardApi } from '@/lib/api';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import ProgressCharts from '@/components/dashboard/ProgressCharts';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, h, p, a] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getHeatmap(),
          dashboardApi.getProgress(),
          dashboardApi.getRecentActivity(),
        ]);
        setStats(s.data);
        setHeatmap(h.data);
        setProgress(p.data);
        setActivities(a.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-bg-secondary rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-bg-secondary rounded-2xl" />)}
        </div>
        <div className="h-48 bg-bg-secondary rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-text">
          {getGreeting()}, {user?.name} 👋
        </h1>
        <p className="text-text-secondary mt-1">
          Consistency compounds. Keep solving. Keep growing.
        </p>
      </div>

      {/* Stats Grid */}
      {stats && <StatsGrid stats={stats} />}

      {/* Activity Heatmap */}
      <ActivityHeatmap data={heatmap} />

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {progress && <ProgressCharts progress={progress} />}
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
