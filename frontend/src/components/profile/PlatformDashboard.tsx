import React from 'react';
import LeetCodeDashboard from './LeetCodeDashboard';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  problemsSolved: number;
  currentStreak: number;
  contestRating: number;
}

interface PlatformDashboardData {
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

interface PlatformDashboardProps {
  dashboard: PlatformDashboardData;
  user: UserInfo | null;
  heatmapList: { date: string; count: number }[];
  contestHistoryData: { label: string; rating: number }[];
  badgesList: Badge[];
  recentActivityList: RecentSubmission[];
}

export const PlatformDashboard: React.FC<PlatformDashboardProps> = (props) => {
  // Re-uses the high-fidelity LeetCode layout as a base style for all other platforms
  return <LeetCodeDashboard {...props} />;
};
export default PlatformDashboard;
