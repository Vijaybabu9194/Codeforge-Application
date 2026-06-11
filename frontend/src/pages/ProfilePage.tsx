import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Link } from 'lucide-react';

import PlatformSidebar from '../components/profile/PlatformSidebar';
import LeetCodeDashboard from '../components/profile/LeetCodeDashboard';
import PlatformDashboard from '../components/profile/PlatformDashboard';

interface PlatformItem {
  platform: string;
  username: string;
  problemsSolved: number;
  contestRating: number;
  connected: boolean;
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
  contestHistory: string; // JSON
  heatmapData: string; // JSON
  badges: string; // JSON
  recentActivity: string; // JSON
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

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('LeetCode');
  const [dashboard, setDashboard] = useState<PlatformDashboardData | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fetch connected platforms list
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoadingList(true);
        const response = await api.get<PlatformItem[]>('/profile/platforms');
        setPlatforms(response.data);
      } catch (err) {
        console.error('Error fetching platforms:', err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchPlatforms();
  }, []);

  // Fetch dashboard details when selected platform changes
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingDashboard(true);
        const response = await api.get<PlatformDashboardData>(`/profile/${selectedPlatform}`);
        setDashboard(response.data);
      } catch (err) {
        console.error(`Error fetching ${selectedPlatform} dashboard:`, err);
        setDashboard(null);
      } finally {
        setLoadingDashboard(false);
      }
    };
    fetchDashboard();
  }, [selectedPlatform]);

  // Safe parsing helper
  const parseJsonData = <T,>(jsonStr: string | undefined, fallback: T): T => {
    if (!jsonStr) return fallback;
    try {
      return JSON.parse(jsonStr) as T;
    } catch (e) {
      console.error('JSON parse error:', e);
      return fallback;
    }
  };

  // Safe parsed lists
  const contestHistoryData = parseJsonData<{ label: string; rating: number }[]>(dashboard?.contestHistory, []);
  const badgesList = parseJsonData<Badge[]>(dashboard?.badges, []);
  const recentActivityList = parseJsonData<RecentSubmission[]>(dashboard?.recentActivity, []);
  const heatmapList = parseJsonData<{ date: string; count: number }[]>(dashboard?.heatmapData, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)] select-none">
      {/* LEFT SIDEBAR: PLATFORMS */}
      <PlatformSidebar
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={setSelectedPlatform}
        loadingList={loadingList}
      />

      {/* MAIN PLATFORM DASHBOARD AREA */}
      <main className="flex-1 bg-[#FAFBFC] p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-64px)]">
        {loadingDashboard ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-28 bg-white border border-border rounded-premium" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-56 bg-white border border-border rounded-premium" />
              <div className="h-56 bg-white border border-border rounded-premium" />
            </div>
            <div className="h-44 bg-white border border-border rounded-premium" />
          </div>
        ) : !dashboard ? (
          <div className="bg-white border border-border rounded-premium p-12 text-center text-[#6B7280] shadow-card">
            <HelpCircle className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="font-bold text-lg text-text">Platform Profile Not Connected</p>
            <p className="text-xs mt-1">Connect your coding platform account in settings to import ratings and submissions.</p>
            <button className="mt-6 px-5 py-2.5 bg-primary text-white font-medium rounded-premium shadow-glow hover:bg-primary-hover flex items-center space-x-2 mx-auto">
              <Link className="w-4 h-4" />
              <span>Connect {selectedPlatform}</span>
            </button>
          </div>
        ) : selectedPlatform === 'LeetCode' ? (
          <LeetCodeDashboard
            dashboard={dashboard}
            user={user}
            heatmapList={heatmapList}
            contestHistoryData={contestHistoryData}
            badgesList={badgesList}
            recentActivityList={recentActivityList}
          />
        ) : (
          <PlatformDashboard
            dashboard={dashboard}
            user={user}
            heatmapList={heatmapList}
            contestHistoryData={contestHistoryData}
            badgesList={badgesList}
            recentActivityList={recentActivityList}
          />
        )}
      </main>
    </div>
  );
};
export default ProfilePage;
