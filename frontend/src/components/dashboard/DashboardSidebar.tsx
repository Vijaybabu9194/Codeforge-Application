import React, { useState, useEffect } from 'react';
import {
  Home, Code2, Building2, Trophy, MessageSquare, Map,
  Bookmark, BarChart3, BookOpen, Settings
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'problems', label: 'Problems', icon: Code2 },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'contests', label: 'Contests', icon: Trophy },
  { id: 'discuss', label: 'Discuss', icon: MessageSquare },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notebook', label: 'Notebook', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching sidebar stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();

    // Listen to custom stats-updated events to refresh statistics
    window.addEventListener('stats-updated', fetchStats);
    return () => {
      window.removeEventListener('stats-updated', fetchStats);
    };
  }, []);

  const solvedCount = stats?.problemsSolved ?? user?.problemsSolved ?? 0;
  const bookmarksCount = stats?.bookmarks ?? 0;
  const streakCount = stats?.currentStreak ?? user?.currentStreak ?? 0;
  const attemptedCount = stats?.attempted ?? solvedCount;
  const totalProblems = stats?.totalProblems ?? 3840;

  // Difficulty donut calculation
  const easyCount = Math.round(totalProblems * 0.42);
  const mediumCount = Math.round(totalProblems * 0.38);
  const hardCount = totalProblems - easyCount - mediumCount;

  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const segments = [
    { percentage: 42, color: '#4ADE80' }, // Easy
    { percentage: 38, color: '#F59E0B' }, // Medium
    { percentage: 20, color: '#EF4444' }, // Hard
  ];

  return (
    <aside className="w-[240px] h-screen bg-dash-sidebar flex flex-col border-r border-dash-border fixed left-0 top-0 z-30 select-none">
      {/* Logo */}
      <div className="flex items-center px-6 h-[68px] border-b border-dash-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-dash-blue flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 8l-4 4 4 4" />
              <path d="M17 8l4 4-4 4" />
              <path d="M14 4l-4 16" />
            </svg>
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight">Codeforge</span>
        </div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto dash-scroll flex flex-col pb-6">
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`dash-nav-item w-full ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>


        {/* Problem Stats Card */}
        <div className="mx-4 my-2.5 p-4 rounded-2xl bg-[#090D1A] border border-white/[0.04]">
          <h4 className="text-[11px] font-bold text-[#4A5580] uppercase tracking-wider mb-3">Problem Stats</h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                <span className="text-[12px] text-[#7B8AB8] font-semibold">Solved</span>
              </div>
              <span className="text-[13px] text-white font-extrabold">{solvedCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="text-[12px] text-[#7B8AB8] font-semibold">Attempted</span>
              </div>
              <span className="text-[13px] text-white font-extrabold">{attemptedCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[12px] text-[#7B8AB8] font-semibold">Bookmarks</span>
              </div>
              <span className="text-[13px] text-white font-extrabold">{bookmarksCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <span className="text-[12px] text-[#7B8AB8] font-semibold">Streak</span>
              </div>
              <span className="text-[13px] text-white font-extrabold">{streakCount} days</span>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown Card */}
        <div className="mx-4 my-2.5 p-4 rounded-2xl bg-[#090D1A] border border-white/[0.04] flex flex-col">
          <h4 className="text-[11px] font-bold text-[#4A5580] uppercase tracking-wider mb-4">Difficulty Breakdown</h4>
          
          <div className="flex items-center justify-center mb-4 relative">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} />
              {segments.map((seg, i) => {
                const segmentLength = (seg.percentage / 100) * circumference;
                const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                const dashOffset = -cumulativeOffset;
                cumulativeOffset += segmentLength;

                return (
                  <circle
                    key={i}
                    cx="55"
                    cy="55"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[15px] font-extrabold text-white leading-none">{totalProblems.toLocaleString()}</span>
              <span className="text-[8px] text-[#7B8AB8] font-bold uppercase mt-1">Total</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span className="text-[#7B8AB8] font-semibold">Easy</span>
              </div>
              <span className="text-white font-bold">42% ({easyCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[#7B8AB8] font-semibold">Medium</span>
              </div>
              <span className="text-white font-bold">38% ({mediumCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span className="text-[#7B8AB8] font-semibold">Hard</span>
              </div>
              <span className="text-white font-bold">20% ({hardCount.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
