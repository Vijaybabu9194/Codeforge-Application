import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

import DashboardGreeting from '../components/dashboard/DashboardGreeting';
import DashboardStatsRow from '../components/dashboard/DashboardStatsRow';
import DashboardHeatmap from '../components/dashboard/DashboardHeatmap';
import DashboardRecentActivity from '../components/dashboard/DashboardRecentActivity';
import DashboardContestPerformance from '../components/dashboard/DashboardContestPerformance';
import DashboardTopicMastery from '../components/dashboard/DashboardTopicMastery';
import DashboardDifficultyDonut from '../components/dashboard/DashboardDifficultyDonut';
import DashboardWeeklyProgress from '../components/dashboard/DashboardWeeklyProgress';
import DashboardGoalProgress from '../components/dashboard/DashboardGoalProgress';
import DashboardBadges from '../components/dashboard/DashboardBadges';
import DashboardUpcomingContests from '../components/dashboard/DashboardUpcomingContests';

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

  // Slices heatmap counts to compute dynamic current/previous week progress
  const getWeeklyDetails = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    // Get date of Monday of the current week
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayDiff);

    let weeklyTotal = 0;
    const weeklyData = days.map((day, idx) => {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + idx);
      
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dateVal = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateVal}`;
      
      const entry = heatmap.find(d => d.date === dateStr);
      const val = entry ? entry.count : 0;
      weeklyTotal += val;
      return {
        day,
        value: val
      };
    });

    // Compute previous week total solved
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    
    let prevWeeklyTotal = 0;
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(prevMonday);
      currentDate.setDate(prevMonday.getDate() + i);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dateVal = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateVal}`;
      const entry = heatmap.find(d => d.date === dateStr);
      prevWeeklyTotal += entry ? entry.count : 0;
    }

    const diff = weeklyTotal - prevWeeklyTotal;
    const trendText = diff >= 0 ? `↑ ${diff} vs last week` : `↓ ${Math.abs(diff)} vs last week`;
    const trendUp = diff >= 0;

    return { weeklyData, weeklyTotal, trendText, trendUp };
  };

  const weeklyInfo = getWeeklyDetails();

  if (loading) {
    return (
      <div className="space-y-5 select-none animate-pulse">
        {/* Greeting Banner Skeleton */}
        <div className="bg-[#090D1A] border border-white/[0.04] rounded-2xl h-[120px] w-full" />
        
        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-24">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#090D1A] border border-white/[0.04] rounded-xl h-[130px] w-full" />
          ))}
        </div>

        {/* Heatmap Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="bg-[#090D1A] border border-white/[0.04] rounded-xl h-[240px] w-full" />
          <div className="bg-[#090D1A] border border-white/[0.04] rounded-xl h-[240px] w-full" />
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#090D1A] border border-white/[0.04] rounded-xl h-[240px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 select-none">
      {/* Greeting Banner */}
      <DashboardGreeting name={user?.name} />

      {/* Stats Row — 4 cards */}
      <div className="pt-24">
        <DashboardStatsRow stats={stats} progress={progress} />
      </div>

      {/* Heatmap + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <DashboardHeatmap heatmapData={heatmap} />
        <DashboardRecentActivity activityItems={activity} />
      </div>

      {/* Contest Performance + Topic Mastery + Difficulty Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DashboardContestPerformance progress={progress} />
        <DashboardTopicMastery progress={progress} />
        <DashboardDifficultyDonut problemsSolved={stats?.problemsSolved} />
      </div>

      {/* Weekly Progress + Goal Progress + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <DashboardWeeklyProgress 
          weeklyData={weeklyInfo.weeklyData} 
          solvedCount={weeklyInfo.weeklyTotal} 
          trendText={weeklyInfo.trendText}
          trendUp={weeklyInfo.trendUp}
        />
        <DashboardGoalProgress current={stats?.problemsSolved} />
        <DashboardBadges solved={stats?.problemsSolved} streak={stats?.currentStreak} rating={stats?.contestRating} />
      </div>

      {/* Upcoming Contests */}
      <DashboardUpcomingContests />
    </div>
  );
};

export default HomePage;
