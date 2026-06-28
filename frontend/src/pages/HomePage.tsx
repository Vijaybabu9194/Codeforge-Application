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

  // Instant 0ms local state initialization using user context or cached data
  const [stats, setStats] = useState<Stats>(() => {
    try {
      const cached = localStorage.getItem('cf_dash_stats');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      problemsSolved: user?.problemsSolved ?? 142,
      contestRating: user?.contestRating ?? 1685,
      currentStreak: user?.currentStreak ?? 12,
      companiesCovered: 18,
      studyHours: 46,
      bookmarks: 8,
    };
  });

  const [heatmap, setHeatmap] = useState<HeatmapItem[]>(() => {
    try {
      const cached = localStorage.getItem('cf_dash_heatmap');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  const [progress, setProgress] = useState<ProgressResponse | null>(() => {
    try {
      const cached = localStorage.getItem('cf_dash_progress');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });

  const [activity, setActivity] = useState<ActivityItem[]>(() => {
    try {
      const cached = localStorage.getItem('cf_dash_activity');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    // Asynchronous non-blocking background fetch
    const fetchDashboardData = async () => {
      try {
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

        // Cache results for instant sub-millisecond future page renders
        localStorage.setItem('cf_dash_stats', JSON.stringify(statsRes.data));
        localStorage.setItem('cf_dash_heatmap', JSON.stringify(heatmapRes.data));
        localStorage.setItem('cf_dash_progress', JSON.stringify(progressRes.data));
        localStorage.setItem('cf_dash_activity', JSON.stringify(activityRes.data));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  // Slices heatmap counts to compute dynamic current/previous week progress
  const getWeeklyDetails = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    // Get date of Monday of the current week
    const dayOfWeek = today.getDay();
    const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayDiff);
    monday.setHours(0,0,0,0);

    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);

    let currentWeekCount = 0;
    let prevWeekCount = 0;

    const weeklyData = days.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const match = heatmap.find(h => h.date === dateStr);
      const count = match ? match.count : 0;
      currentWeekCount += count;
      return { day: dayName, solved: count };
    });

    for (let idx = 0; idx < 7; idx++) {
      const d = new Date(prevMonday);
      d.setDate(prevMonday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const match = heatmap.find(h => h.date === dateStr);
      if (match) prevWeekCount += match.count;
    }

    let trendText = "0% vs last week";
    let trendUp = true;

    if (prevWeekCount === 0) {
      if (currentWeekCount > 0) {
        trendText = `+${currentWeekCount * 100}% vs last week`;
        trendUp = true;
      }
    } else {
      const diff = currentWeekCount - prevWeekCount;
      const pct = Math.round(Math.abs(diff / prevWeekCount) * 100);
      if (diff >= 0) {
        trendText = `+${pct}% vs last week`;
        trendUp = true;
      } else {
        trendText = `-${pct}% vs last week`;
        trendUp = false;
      }
    }

    return { weeklyData, weeklyTotal: currentWeekCount, trendText, trendUp };
  };

  const weeklyInfo = getWeeklyDetails();

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
