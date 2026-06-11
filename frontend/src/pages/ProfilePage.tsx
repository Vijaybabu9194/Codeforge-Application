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
  const { user, updateUserStats } = useAuth();
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('LeetCode');
  const [dashboard, setDashboard] = useState<PlatformDashboardData | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Link platform states
  const [isConnecting, setIsConnecting] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');

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

  // Reset form when changing platform
  useEffect(() => {
    setIsConnecting(false);
    setUsernameInput('');
    setError('');
  }, [selectedPlatform]);

  const handleLinkPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    try {
      setError('');
      const response = await api.post<PlatformItem>('/profile/platforms/link', {
        platform: selectedPlatform,
        username: usernameInput.trim()
      });
      
      // Update local platforms list
      setPlatforms((prev) =>
        prev.map((p) =>
          p.platform.toLowerCase() === selectedPlatform.toLowerCase()
            ? { ...p, username: response.data.username, connected: true }
            : p
        )
      );
      
      setIsConnecting(false);
      setUsernameInput('');
      
      // Refresh user context to pick up the new avatar
      updateUserStats();
      
      // Load newly connected dashboard
      setLoadingDashboard(true);
      const dashResponse = await api.get<PlatformDashboardData>(`/profile/${selectedPlatform}`);
      setDashboard(dashResponse.data);
    } catch (err: any) {
      console.error('Failed to link platform profile:', err);
      setError('Could not connect account. Please verify credentials and try again.');
    } finally {
      setLoadingDashboard(false);
    }
  };

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
          <div className="bg-white border border-border rounded-premium p-12 text-center text-[#6B7280] shadow-card max-w-xl mx-auto mt-12">
            <HelpCircle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-text">Connect Your {selectedPlatform} Account</h3>
            <p className="text-xs mt-1 text-secondaryText">Enter your platform username to sync ratings, submissions, and badges directly.</p>
            
            {isConnecting ? (
              <form onSubmit={handleLinkPlatform} className="mt-6 space-y-4 max-w-sm mx-auto text-left">
                <div>
                  <label className="block text-xs font-bold text-secondaryText mb-1.5 uppercase">USERNAME</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder={`e.g. ${selectedPlatform.toLowerCase()}_coder`}
                    className="w-full bg-[#FAFBFC] border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-premium px-4 py-2.5 text-sm outline-none transition"
                  />
                </div>
                {error && <p className="text-xs font-semibold text-danger">{error}</p>}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-grow px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-premium shadow-sm transition"
                  >
                    Link Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsConnecting(false); setError(''); }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-text text-xs font-bold rounded-premium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsConnecting(true)}
                className="mt-6 px-5 py-2.5 bg-primary text-white font-medium rounded-premium shadow-glow hover:bg-primary-hover flex items-center space-x-2 mx-auto transition active:scale-95"
              >
                <Link className="w-4 h-4" />
                <span>Connect {selectedPlatform}</span>
              </button>
            )}
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
