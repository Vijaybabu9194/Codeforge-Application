import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { 
  MapPin, Calendar, Edit3, Share2, ShieldCheck, Info, ChevronDown, Check, X,
  TrendingUp, Star, Award, Flag, Loader2
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface PlatformItem {
  platform: string;
  username: string | null;
  problemsSolved: number;
  contestRating: number;
  connected: boolean;
}

interface StatsResponse {
  problemsSolved: number;
  contestRating: number;
  currentStreak: number;
  companiesCovered: number;
  studyHours: number;
  bookmarks: number;
  totalProblems: number;
  attempted: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const heatmapScrollRef = React.useRef<HTMLDivElement>(null);
  
  // Dynamic API states
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [heatmapList, setHeatmapList] = useState<{ date: string; count: number }[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [recentActivityList, setRecentActivityList] = useState<any[]>([]);
  const [platformDashboards, setPlatformDashboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<string>('CODEFORGE');

  // Edit Bio & Location local persistent state
  const [bio, setBio] = useState(() => localStorage.getItem('cf_bio') || 'Consistency is the forge. Discipline is the fuel.');
  const [location, setLocation] = useState(() => localStorage.getItem('cf_location') || 'India');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState(bio);
  const [editLocation, setEditLocation] = useState(location);

  // Platform link connection states
  const [linkingPlatform, setLinkingPlatform] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [linkingError, setLinkingError] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  // Fetch all profile and dashboard data dynamically from API
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [platRes, statsRes, heatRes, progRes, actRes] = await Promise.all([
        api.get<PlatformItem[]>('/profile/platforms'),
        api.get<StatsResponse>('/dashboard/stats'),
        api.get<{ date: string; count: number }[]>('/dashboard/heatmap'),
        api.get<any>('/dashboard/progress'),
        api.get<any[]>('/dashboard/recent-activity')
      ]);

      setPlatforms(platRes.data);
      setStats(statsRes.data);
      setHeatmapList(heatRes.data);
      setProgress(progRes.data);
      setRecentActivityList(actRes.data);

      // Fetch dashboard details for each connected platform to aggregate badges and contest history
      const connected = platRes.data.filter(p => p.connected);
      if (connected.length > 0) {
        const dashPromises = connected.map(p => 
          api.get(`/profile/${p.platform.toUpperCase()}`)
            .then(res => res.data)
            .catch(err => {
              console.error(`Error loading dashboard for ${p.platform}:`, err);
              return null;
            })
        );
        const dashDataList = await Promise.all(dashPromises);
        setPlatformDashboards(dashDataList.filter(d => d !== null));
      } else {
        setPlatformDashboards([]);
      }

    } catch (err) {
      console.error('Error loading dynamic profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (heatmapScrollRef.current) {
      heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
    }
  }, [selectedPlatformTab, heatmapList, platformDashboards, loading]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setBio(editBio);
    setLocation(editLocation);
    localStorage.setItem('cf_bio', editBio);
    localStorage.setItem('cf_location', editLocation);
    setIsEditModalOpen(false);
  };

  const handleLinkPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !linkingPlatform) return;
    try {
      setLinkingError('');
      setIsLinking(true);
      await api.post('/profile/platforms/link', {
        platform: linkingPlatform,
        username: usernameInput.trim()
      });
      
      // Reset state and reload all details
      setLinkingPlatform(null);
      setUsernameInput('');
      fetchProfileData();
    } catch (err: any) {
      console.error('Failed to link platform profile:', err);
      setLinkingError('Could not connect account. Please check the username and try again.');
    } finally {
      setIsLinking(false);
    }
  };

  // Active selected platform filtering
  const activePlatItem = platforms.find(p => p.platform.toUpperCase() === selectedPlatformTab.toUpperCase());
  const isTabPlatformConnected = selectedPlatformTab === 'CODEFORGE' || (activePlatItem?.connected ?? false);
  const activePlatDash = platformDashboards.find(d => d.platform.toUpperCase() === selectedPlatformTab.toUpperCase());

  // Get active linked platform rank details
  const getConnectedRankDetails = () => {
    if (selectedPlatformTab === 'CODEFORGE') {
      return { global: 'N/A', country: 'N/A', platform: 'Codeforge' };
    }
    if (activePlatDash) {
      return { 
        global: activePlatDash.globalRank || 'N/A', 
        country: activePlatDash.countryRank || 'N/A',
        platform: activePlatDash.platform
      };
    }
    return { global: 'N/A', country: 'N/A', platform: selectedPlatformTab };
  };
  const activeRank = getConnectedRankDetails();

  // Dynamic values
  const totalSolved = stats?.problemsSolved ?? 0;
  const contestRating = stats?.contestRating ?? 0;
  const totalSubmissions = stats?.attempted ?? 0;
  const acceptanceRate = totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 1000) / 10 : 0;

  const activeProblemsSolved = selectedPlatformTab === 'CODEFORGE'
    ? totalSolved
    : (activePlatDash?.problemsSolved ?? 0);

  const activeRating = selectedPlatformTab === 'CODEFORGE'
    ? contestRating
    : (getPlatformRating(selectedPlatformTab) || 0);

  // Dynamic percentiles and tiers
  const globalNum = activeRank.global !== 'N/A' ? Number(activeRank.global) : NaN;
  const globalPct = !isNaN(globalNum) ? Math.max(0.1, Math.round((globalNum / 1000000) * 1000) / 10) : null;

  const countryNum = activeRank.country !== 'N/A' ? Number(activeRank.country) : NaN;
  const countryPct = !isNaN(countryNum) ? Math.max(0.1, Math.round((countryNum / 100000) * 1000) / 10) : null;

  const getGlobalSubtitle = () => {
    if (selectedPlatformTab === 'CODEFORGE') return 'No Rank';
    if (activeRank.global === 'N/A') {
      return isTabPlatformConnected ? 'N/A' : 'Not Connected';
    }
    return globalPct !== null ? `Top ${globalPct}%` : 'N/A';
  };

  const getCountrySubtitle = () => {
    if (selectedPlatformTab === 'CODEFORGE') return 'No Rank';
    if (activeRank.country === 'N/A') {
      return isTabPlatformConnected ? 'N/A' : 'Not Connected';
    }
    return countryPct !== null ? `Top ${countryPct}%` : 'N/A';
  };

  const getRatingTier = (rating: number) => {
    if (rating === 0) return 'No contests yet';
    if (rating >= 1900) return 'Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1300) return 'Specialist';
    return 'Novice';
  };

  const getAccuracyTier = (rate: number) => {
    if (rate >= 75) return 'Excellent Accuracy';
    if (rate >= 50) return 'Good Accuracy';
    return 'Needs Practice';
  };

  const getSolvedMilestone = (solved: number) => {
    if (solved >= 50) return 'Consistent Solver';
    if (solved >= 15) return 'Specialist Weaver';
    if (solved >= 5) return 'Novice Weaver';
    return 'First Forge';
  };

  // Chart data matching
  const ratingTrendData = progress?.contestTrend && progress.contestTrend.length > 0
    ? progress.contestTrend
    : [
        { label: 'Jan', rating: 0 },
        { label: 'Feb', rating: 0 },
        { label: 'Mar', rating: 0 },
        { label: 'Apr', rating: 0 },
        { label: 'May', rating: 0 },
        { label: 'Jun', rating: 0 },
        { label: 'Jul', rating: 0 },
        { label: 'Aug', rating: 0 },
        { label: 'Sep', rating: 0 },
        { label: 'Oct', rating: 0 },
        { label: 'Nov', rating: 0 },
        { label: 'Dec', rating: 0 }
      ];

  const codeforgeEasy = stats?.easySolved ?? 0;
  const codeforgeMedium = stats?.mediumSolved ?? 0;
  const codeforgeHard = stats?.hardSolved ?? 0;
  const codeforgeTotal = stats?.problemsSolved ?? 0;

  const codeforgeBreakdownData = codeforgeTotal > 0 ? [
    { name: 'Easy', value: codeforgeEasy, color: '#4ADE80' },
    { name: 'Medium', value: codeforgeMedium, color: '#F59E0B' },
    { name: 'Hard', value: codeforgeHard, color: '#EF4444' },
  ] : [
    { name: 'Empty', value: 1, color: '#1E293B' }
  ];

  const cfEasyPct = codeforgeTotal > 0 ? Math.round((codeforgeEasy / codeforgeTotal) * 100) : 0;
  const cfMediumPct = codeforgeTotal > 0 ? Math.round((codeforgeMedium / codeforgeTotal) * 100) : 0;
  const cfHardPct = codeforgeTotal > 0 ? Math.max(100 - cfEasyPct - cfMediumPct, 0) : 0;

  // Active selected platform filtering

  const activeEasy = selectedPlatformTab === 'CODEFORGE' 
    ? codeforgeEasy
    : (activePlatDash?.easySolved ?? 0);
  const activeMedium = selectedPlatformTab === 'CODEFORGE'
    ? codeforgeMedium
    : (activePlatDash?.mediumSolved ?? 0);
  const activeHard = selectedPlatformTab === 'CODEFORGE'
    ? codeforgeHard
    : (activePlatDash?.hardSolved ?? 0);
  const activeTotal = selectedPlatformTab === 'CODEFORGE'
    ? codeforgeTotal
    : (activePlatDash?.problemsSolved ?? 0);

  const activeBreakdownData = activeTotal > 0 ? [
    { name: 'Easy', value: activeEasy, color: '#4ADE80' },
    { name: 'Medium', value: activeMedium, color: '#F59E0B' },
    { name: 'Hard', value: activeHard, color: '#EF4444' },
  ] : [
    { name: 'Empty', value: 1, color: '#1E293B' }
  ];

  const activeEasyPct = activeTotal > 0 ? Math.round((activeEasy / activeTotal) * 100) : 0;
  const activeMediumPct = activeTotal > 0 ? Math.round((activeMedium / activeTotal) * 100) : 0;
  const activeHardPct = activeTotal > 0 ? Math.max(100 - activeEasyPct - activeMediumPct, 0) : 0;

  const getActiveHeatmap = () => {
    if (selectedPlatformTab === 'CODEFORGE') return heatmapList;
    if (activePlatDash?.heatmapData) {
      try {
        return JSON.parse(activePlatDash.heatmapData);
      } catch (e) {
        console.error('Error parsing platform heatmap:', e);
      }
    }
    return [];
  };
  const activeHeatmapList = getActiveHeatmap();

  const getActiveStreak = () => {
    if (selectedPlatformTab === 'CODEFORGE') return stats?.currentStreak ?? 0;
    if (!activeHeatmapList || activeHeatmapList.length === 0) return 0;
    
    const solvedDates = new Set(
      activeHeatmapList.filter(d => d.count > 0).map(d => d.date)
    );
    
    let streak = 0;
    let d = new Date();
    const getLocalFormat = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    let todayStr = getLocalFormat(d);
    
    if (!solvedDates.has(todayStr)) {
      d.setDate(d.getDate() - 1);
      todayStr = getLocalFormat(d);
    }
    
    while (solvedDates.has(todayStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
      todayStr = getLocalFormat(d);
    }
    return streak;
  };
  const activeStreak = getActiveStreak();

  // Dynamic Platform problems solved
  const leetcodeSolved = getPlatformSolved('LEETCODE');
  const codeforcesSolved = getPlatformSolved('CODEFORCES');
  const codechefSolved = getPlatformSolved('CODECHEF');
  const gfgSolved = getPlatformSolved('GEEKSFORGEEKS');
  const maxSolved = Math.max(codeforgeTotal, leetcodeSolved, codeforcesSolved, codechefSolved, gfgSolved, 1);

  function getPlatformSolved(platformName: string) {
    const p = platforms.find(item => item.platform.toUpperCase() === platformName.toUpperCase());
    return p?.connected ? p.problemsSolved : 0;
  }

  function getPlatformRating(platformName: string) {
    const p = platforms.find(item => item.platform.toUpperCase() === platformName.toUpperCase());
    return p?.connected ? p.contestRating : 0;
  }

  // Dynamic badges based on local Codeforge solving
  const getDynamicBadges = () => {
    const list: any[] = [];
    const solved = stats?.problemsSolved ?? 0;
    const streak = stats?.currentStreak ?? 0;
    
    if (solved >= 1) {
      list.push({ id: 'local-1', name: 'First Forge', icon: '🔥', color: 'from-[#06B6D4] to-[#0891B2]', desc: 'Solved first problem' });
    }
    if (solved >= 5) {
      list.push({ id: 'local-5', name: 'Novice Weaver', icon: '🐣', color: 'from-[#10B981] to-[#059669]', desc: 'Solved 5+ problems' });
    }
    if (solved >= 15) {
      list.push({ id: 'local-15', name: 'Specialist', icon: '💻', color: 'from-[#3B82F6] to-[#1D4ED8]', desc: 'Solved 15+ problems' });
    }
    if (solved >= 50) {
      list.push({ id: 'local-50', name: 'Consistent', icon: '🏆', color: 'from-[#F59E0B] to-[#B45309]', desc: 'Solved 50+ problems' });
    }
    if (streak >= 3) {
      list.push({ id: 'local-streak-3', name: 'Streak Starter', icon: '⚡', color: 'from-[#FBBF24] to-[#D97706]', desc: '3+ day streak' });
    }
    if (streak >= 7) {
      list.push({ id: 'local-streak-7', name: 'Consistent Coder', icon: '🎯', color: 'from-[#EC4899] to-[#BE185D]', desc: '7+ day streak' });
    }
    if (contestRating >= 1300) {
      list.push({ id: 'local-knight', name: 'Contest Knight', icon: '🛡️', color: 'from-[#8B5CF6] to-[#6D28D9]', desc: 'Rating over 1300' });
    }
    if (contestRating >= 1600) {
      list.push({ id: 'local-expert', name: 'Contest Expert', icon: '👑', color: 'from-[#EF4444] to-[#B91C1C]', desc: 'Rating over 1600' });
    }
    return list;
  };
  const dynamicBadges = getDynamicBadges();

  // Dynamic recent contests - only from actual contest data
  // CodeForge has not conducted any contests yet, so this always returns empty
  const getDynamicContests = () => {
    return [];
  };
  const dynamicContests = getDynamicContests();

  // Render Horizontal Heatmap with correct weekday alignments and month separations
  const renderHorizontalHeatmap = (heatmapData: { date: string; count: number }[]) => {
    const today = new Date();
    
    // Map database date counts
    const dataMap = new Map<string, number>();
    heatmapData.forEach(entry => dataMap.set(entry.date, entry.count));

    // Get the last 12 months list in chronological order
    // E.g., if today is Jun 2026, months will go from Jul 2025 to Jun 2026
    const monthsList: { year: number; month: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsList.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    const getColor = (level: number) => {
      switch (level) {
        case 0: return '#262626';
        case 1: return '#0E4429';
        case 2: return '#006D32';
        case 3: return '#26A641';
        case 4: return '#39D353';
        default: return '#262626';
      }
    };

    const formatDate = (dateStr: string) => {
      try {
        const [y, m, d] = dateStr.split('-');
        const date = new Date(Number(y), Number(m) - 1, Number(d));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    return (
      <div ref={heatmapScrollRef} className="flex select-none overflow-x-auto pt-10 pb-2 w-full dash-scroll">
        <div className="flex gap-[14px] md:gap-[18px] min-w-max pb-1">
          {monthsList.map(({ year, month }, mIdx) => {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const totalDays = lastDay.getDate();
            
            // Build columns (weeks) for this month
            const weeks: ({ date: string; count: number; level: number } | null)[][] = [];
            let currentWeek: ({ date: string; count: number; level: number } | null)[] = Array(7).fill(null);

            for (let d = 1; d <= totalDays; d++) {
              const currentDate = new Date(year, month, d);
              const dayOfWeek = currentDate.getDay(); // 0 = Sun, ..., 6 = Sat

              const yyyy = currentDate.getFullYear();
              const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
              const dd = String(currentDate.getDate()).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;

              const count = dataMap.get(dateStr) || 0;
              let level = 0;
              if (count === 0) level = 0;
              else if (count <= 2) level = 1;
              else if (count <= 5) level = 2;
              else if (count <= 8) level = 3;
              else level = 4;

              const currentDateOnly = new Date(yyyy, currentDate.getMonth(), currentDate.getDate());
              const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

              if (currentDateOnly > todayOnly) {
                currentWeek[dayOfWeek] = null;
              } else {
                currentWeek[dayOfWeek] = { date: dateStr, count, level };
              }

              if (dayOfWeek === 6 || d === totalDays) {
                weeks.push(currentWeek);
                currentWeek = Array(7).fill(null);
              }
            }

            return (
              <div key={mIdx} className="flex flex-col items-center gap-2 flex-shrink-0 relative hover:z-20">
                {/* 7xN Grid of days for this month */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px] flex-shrink-0 relative hover:z-30">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          // Transparent placeholder for padding boundary days
                          return (
                            <div 
                              key={dIdx} 
                              className="w-[10px] h-[10px] flex-shrink-0 opacity-0"
                            />
                          );
                        }
                        return (
                          <div
                            key={dIdx}
                            className="w-[10px] h-[10px] rounded-[2px] hover:scale-125 transition-transform duration-100 cursor-pointer relative group flex-shrink-0 hover:z-50"
                            style={{ backgroundColor: getColor(day.level) }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#0F172A] border border-white/[0.08] rounded-lg text-[9px] text-[#C8D1E8] font-bold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                              <span className="text-white font-extrabold">
                                {day.count === 0 ? 'No submissions' : `${day.count} submission${day.count !== 1 ? 's' : ''}`}
                              </span>
                              {" on "}{formatDate(day.date)}
                              {/* Small arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#0F172A]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Month Name centered under the block */}
                <span className="text-[9px] font-bold text-[#4A5580] uppercase tracking-wider select-none">
                  {monthNames[month]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderConnectPrompt = (platformName: string) => (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-[#090D1A]/40 border border-white/[0.03] rounded-xl h-full min-h-[160px] w-full">
      <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-3">
        <Edit3 className="w-5 h-5 text-[#7B8AB8]" />
      </div>
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{platformName} Profile Not Linked</h3>
      <p className="text-[10px] text-[#7B8AB8] max-w-xs font-medium leading-relaxed mb-4">
        Link your {platformName} username in the "Linked Profiles" section at the top of the page to import your solved questions and calendar heatmap.
      </p>
    </div>
  );

  // Helper for rendering hexagonal badge outlines
  const renderHexagon = (icon: string, colorClass: string, name: string, id: number) => {
    const fromHex = colorClass.match(/from-\[(\#[A-Fa-f0-9]+)\]/)?.[1] || '#4A6CF7';
    const toHex = colorClass.match(/to-\[(\#[A-Fa-f0-9]+)\]/)?.[1] || '#A78BFA';
    const gradId = `badgeGrad-${id}`;

    return (
      <div className="flex flex-col items-center group cursor-pointer">
        <div className="relative w-[50px] h-[55px] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
          <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(74,108,247,0.15)]" viewBox="0 0 100 115" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <polygon 
              points="50,2 98,28 98,82 50,113 2,82 2,28" 
              fill="#0F172A" 
              stroke={`url(#${gradId})`} 
              strokeWidth="4"
            />
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={fromHex} stopOpacity="0.8"/>
                <stop offset="100%" stopColor={toHex} stopOpacity="0.8"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="relative text-white font-extrabold text-[15px] flex items-center justify-center select-none">
            {icon === '50' ? (
              <span className="text-[11px] font-black text-[#A78BFA]">50</span>
            ) : (
              <span>{icon}</span>
            )}
          </div>
        </div>
        <span className="text-[9px] font-bold text-[#7B8AB8] mt-1.5 text-center leading-tight truncate w-16 group-hover:text-white transition duration-200">
          {name}
        </span>
      </div>
    );
  };

  const renderPlatformStats = (extraClasses: string = "") => {
    return (
      <div className={`bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4 ${extraClasses}`}>
        <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
          {selectedPlatformTab === 'CODEFORGE' ? 'Codeforge' : selectedPlatformTab.charAt(0) + selectedPlatformTab.slice(1).toLowerCase()} Stats
        </h2>
        
        {!isTabPlatformConnected ? (
          <div className="flex-1 flex items-center justify-center">
            {renderConnectPrompt(selectedPlatformTab.charAt(0) + selectedPlatformTab.slice(1).toLowerCase())}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between flex-1">
              <div className="h-32 w-32 relative mx-auto lg:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {activeBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[16px] font-extrabold text-white leading-none">{activeTotal}</span>
                  <span className="text-[8px] text-[#7B8AB8] font-bold uppercase mt-1">Total</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 pl-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#7B8AB8]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" /> Easy</span>
                  <span className="text-white">{activeEasyPct}% ({activeEasy})</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-[#7B8AB8]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Medium</span>
                  <span className="text-white">{activeMediumPct}% ({activeMedium})</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-[#7B8AB8]">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Hard</span>
                  <span className="text-white">{activeHardPct}% ({activeHard})</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[9px] font-bold tracking-tight pt-3.5 border-t border-white/[0.03]">
              <span className="text-emerald-400">Easy Solved: {activeEasy}</span>
              <span className="text-amber-400">Med. Solved: {activeMedium}</span>
              <span className="text-[#818CF8]">Rating: {selectedPlatformTab === 'CODEFORGE' ? contestRating : (getPlatformRating(selectedPlatformTab) || 'N/A')}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#4A6CF7] animate-spin" />
        <span className="text-xs font-semibold text-[#7B8AB8]">Loading dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#030712] min-h-screen text-[#C8D1E8] pb-12 select-none">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#4A6CF7]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center space-x-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] blur-[6px] opacity-40 animate-pulse" />
            <div className="w-24 h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] relative">
              <div className="w-full h-full rounded-full bg-[#090D1A] flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">{user?.name || 'Vijay_07'}</h1>
              <ShieldCheck className="w-4 h-4 text-[#4A6CF7] fill-[#4A6CF7]/20" />
            </div>
            
            <p className="text-xs text-[#7B8AB8] font-medium italic">
              "{bio}"
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#4A5580] font-semibold pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7B8AB8]" /> {location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7B8AB8]" /> Joined Dec 2021
              </span>
            </div>

            {/* Platform connection chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-wider mr-1">Linked Profiles:</span>
              
              {platforms.map((plat) => {
                const isLinked = plat.connected;
                const pName = plat.platform;
                
                let theme = 'bg-[#1E293B] text-[#7B8AB8] border-white/[0.05] hover:border-[#4A6CF7]/40';
                let dotColor = 'bg-[#7B8AB8]';
                
                if (isLinked) {
                  if (pName.toUpperCase() === 'LEETCODE') {
                    theme = 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20 hover:bg-[#D97706]/20';
                    dotColor = 'bg-[#D97706]';
                  } else if (pName.toUpperCase() === 'CODEFORCES') {
                    theme = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 hover:bg-[#3B82F6]/20';
                    dotColor = 'bg-[#3B82F6]';
                  } else if (pName.toUpperCase() === 'CODECHEF') {
                    theme = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#D97706]/20 hover:bg-[#F59E0B]/20';
                    dotColor = 'bg-[#F59E0B]';
                  } else if (pName.toUpperCase() === 'GEEKSFORGEEKS') {
                    theme = 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20';
                    dotColor = 'bg-[#10B981]';
                  }
                }

                return (
                  <button
                    key={pName}
                    onClick={() => {
                      setLinkingPlatform(pName);
                      setLinkingError('');
                      setUsernameInput(plat.username || '');
                    }}
                    className={`${theme} px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span>{isLinked ? plat.username : `+ Connect ${pName.toLowerCase()}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start md:self-center relative z-10">
          <button 
            onClick={() => {
              setEditBio(bio);
              setEditLocation(location);
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#090D1A] border border-white/[0.08] hover:border-white/[0.15] text-[12px] font-extrabold text-white rounded-xl transition duration-200"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#7B8AB8]" /> Edit Profile
          </button>
          
          <button 
            onClick={handleShare}
            className="p-2.5 bg-[#090D1A] border border-white/[0.08] hover:border-white/[0.15] text-[#7B8AB8] hover:text-white rounded-xl transition duration-200 relative group"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[9px] text-white rounded opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap">
              {isCopied ? 'Copied link!' : 'Copy profile URL'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. STATS ROW (5 Metrics Cards - Icon on Left, Text on Right) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        
        {/* Global Ranking */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 md:p-4.5 flex items-center gap-2.5 md:gap-3.5 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[8.5px] md:text-[10px] font-bold text-[#4A5580] uppercase tracking-wider block truncate">Global Ranking</span>
            <div className="text-[15px] md:text-[18px] font-extrabold text-white tracking-tight leading-tight truncate">
              {activeRank.global !== 'N/A' ? `#${Number(activeRank.global).toLocaleString()}` : 'N/A'}
            </div>
            <span className="text-[8.5px] md:text-[10px] font-semibold text-[#7B8AB8] block truncate">
              {getGlobalSubtitle()}
            </span>
          </div>
        </div>

        {/* Country Ranking */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 md:p-4.5 flex items-center gap-2.5 md:gap-3.5 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 fill-emerald-500/10" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[8.5px] md:text-[10px] font-bold text-[#4A5580] uppercase tracking-wider block truncate">Country Ranking</span>
            <div className="text-[15px] md:text-[18px] font-extrabold text-white tracking-tight leading-tight truncate">
              {activeRank.country !== 'N/A' ? `#${Number(activeRank.country).toLocaleString()}` : 'N/A'}
            </div>
            <span className="text-[8.5px] md:text-[10px] font-semibold text-[#7B8AB8] block truncate">
              {getCountrySubtitle()}
            </span>
          </div>
        </div>

        {/* Contest Rating */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 md:p-4.5 flex items-center gap-2.5 md:gap-3.5 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-purple-500 fill-purple-500/20" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[8.5px] md:text-[10px] font-bold text-[#4A5580] uppercase tracking-wider block truncate">Contest Rating</span>
            <div className="text-[15px] md:text-[18px] font-extrabold text-white tracking-tight leading-tight truncate">
              {activeRating > 0 ? activeRating : '—'}
            </div>
            <span className="text-[8.5px] md:text-[10px] font-semibold text-[#7B8AB8] block truncate">
              {getRatingTier(activeRating)}
            </span>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 md:p-4.5 flex items-center gap-2.5 md:gap-3.5 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[8.5px] md:text-[10px] font-bold text-[#4A5580] uppercase tracking-wider block truncate">Problems Solved</span>
            <div className="text-[15px] md:text-[18px] font-extrabold text-white tracking-tight leading-tight truncate">{activeProblemsSolved}</div>
            <span className="text-[8.5px] md:text-[10px] font-semibold text-[#7B8AB8] block truncate">
              {getSolvedMilestone(activeProblemsSolved)}
            </span>
          </div>
        </div>

        {/* Acceptance */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 md:p-4.5 flex items-center gap-2.5 md:gap-3.5 col-span-2 md:col-span-1 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-500 font-extrabold text-sm md:text-base">%</span>
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[8.5px] md:text-[10px] font-bold text-[#4A5580] uppercase tracking-wider block truncate">Acceptance</span>
            <div className="text-[15px] md:text-[18px] font-extrabold text-white tracking-tight leading-tight truncate text-white">
              {selectedPlatformTab === 'CODEFORGE' ? `${acceptanceRate}%` : '—'}
            </div>
            <span className="text-[8.5px] md:text-[10px] font-semibold text-[#7B8AB8] block truncate">
              {selectedPlatformTab === 'CODEFORGE' ? getAccuracyTier(acceptanceRate) : 'N/A'}
            </span>
          </div>
        </div>

      </div>

      {/* PLATFORM FILTERS */}
      <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-extrabold text-[#4A5580] uppercase tracking-wider pl-2 mr-2">View Analytics for:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'CODEFORGE', label: 'Codeforge', icon: '🔵', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' },
            { id: 'LEETCODE', label: 'LeetCode', icon: '🟡', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
            { id: 'CODEFORCES', label: 'Codeforces', icon: '🔵', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
            { id: 'CODECHEF', label: 'CodeChef', icon: '🟤', color: 'border-amber-700 text-amber-600 bg-amber-700/10' },
            { id: 'GEEKSFORGEEKS', label: 'GeeksForGeeks', icon: '🟢', color: 'border-green-500 text-green-400 bg-green-500/10' }
          ].map((tab) => {
            const isActive = selectedPlatformTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPlatformTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-200 ${
                  isActive 
                    ? `${tab.color} border-white/[0.15] scale-[1.03]`
                    : 'bg-[#090D1A] border-white/[0.04] text-[#7B8AB8] hover:text-white hover:border-white/[0.08]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. HEATMAP & RATING PROGRESS CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* SUBMISSION HEATMAP */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 lg:col-span-3 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">
                {selectedPlatformTab === 'CODEFORGE' ? 'Codeforge' : selectedPlatformTab.charAt(0) + selectedPlatformTab.slice(1).toLowerCase()} Heatmap
              </h2>
              <Info className="w-3.5 h-3.5 text-[#4A5580] cursor-pointer" />
            </div>
            
            <button className="flex items-center gap-1 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[10px] text-white font-bold">
              <span>All Time</span>
              <ChevronDown className="w-3 h-3 text-[#7B8AB8]" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between pt-2">
            {!isTabPlatformConnected ? (
              renderConnectPrompt(selectedPlatformTab.charAt(0) + selectedPlatformTab.slice(1).toLowerCase())
            ) : (
              <>
                {/* LeetCode Style Submissions Header */}
                <div className="flex flex-wrap items-baseline gap-x-4 text-[#7B8AB8] text-[11px] font-bold pb-4 select-none">
                  <span className="text-white text-base font-extrabold">
                    {activeHeatmapList.reduce((acc, entry) => acc + entry.count, 0)}
                  </span>
                  <span>submissions in the past one year</span>
                  <div className="ml-auto flex items-center gap-4">
                    <span>Total active days: {activeHeatmapList.filter(d => d.count > 0).length}</span>
                    <span>Max streak: {activeStreak}</span>
                  </div>
                </div>

                {renderHorizontalHeatmap(activeHeatmapList)}
              </>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#7B8AB8] font-bold pt-4 border-t border-white/[0.03] mt-2">
              <span>Total Active Days: {isTabPlatformConnected ? activeHeatmapList.filter(d => d.count > 0).length : 0}</span>
              
              <div className="flex items-center gap-1">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-[1.5px] bg-[#262626]" />
                <span className="w-2.5 h-2.5 rounded-[1.5px] bg-[#0E4429]" />
                <span className="w-2.5 h-2.5 rounded-[1.5px] bg-[#006D32]" />
                <span className="w-2.5 h-2.5 rounded-[1.5px] bg-[#26A641]" />
                <span className="w-2.5 h-2.5 rounded-[1.5px] bg-[#39D353]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* lg:col-span-2 section */}
        {selectedPlatformTab === 'CODEFORGE' ? (
          /* RATING PROGRESS CHART */
          <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 lg:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Rating Progress</h2>
              
              <button className="flex items-center gap-1 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[10px] text-white font-bold">
                <span>All Contests</span>
                <ChevronDown className="w-3 h-3 text-[#7B8AB8]" />
              </button>
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <div>
                <span className="text-[8px] font-bold text-[#4A5580] uppercase tracking-wider">Highest Rating</span>
                <div className="text-[16px] font-extrabold text-purple-400 mt-0.5">
                  {contestRating > 0 ? contestRating : 'N/A'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold text-[#4A5580] uppercase tracking-wider">Current Rating</span>
                <div className="text-[16px] font-extrabold text-blue-400 mt-0.5">
                  {contestRating > 0 ? contestRating : 'N/A'}
                </div>
              </div>
            </div>

            <div className="h-36 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ratingTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratingGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="label" stroke="#4A5580" fontSize={8} tickLine={false} />
                  <YAxis stroke="#4A5580" fontSize={8} tickLine={false} domain={['auto', 'auto']} />
                  <Area 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#ratingGlow)"
                    dot={{ r: 2.5, strokeWidth: 1.5, stroke: '#8B5CF6', fill: '#090D1A' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          renderPlatformStats("lg:col-span-2")
        )}

      </div>

      {/* 4. SOLVED PROGRESS (DONUTS & PLATFORM HORIZONTAL BARS) */}
      {selectedPlatformTab === 'CODEFORGE' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CODEFORGE SHEET STATS */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Codeforge Sheet Stats</h2>
          
          <div className="flex items-center justify-between flex-1">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={codeforgeBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={48}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {codeforgeBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[16px] font-extrabold text-white leading-none">{codeforgeTotal}</span>
                <span className="text-[8px] text-[#7B8AB8] font-bold uppercase mt-1">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 pl-4">
              <div className="flex justify-between items-center bg-white/[0.02] px-3 py-2 rounded-xl text-[11px] border border-white/[0.01]">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]" /> Easy
                </span>
                <span className="font-extrabold text-[#7B8AB8]">{cfEasyPct}% ({codeforgeEasy})</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] px-3 py-2 rounded-xl text-[11px] border border-white/[0.01]">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Medium
                </span>
                <span className="font-extrabold text-[#7B8AB8]">{cfMediumPct}% ({codeforgeMedium})</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] px-3 py-2 rounded-xl text-[11px] border border-white/[0.01]">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Hard
                </span>
                <span className="font-extrabold text-[#7B8AB8]">{cfHardPct}% ({codeforgeHard})</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#7B8AB8] font-bold pt-3 border-t border-white/[0.03]">
            <span>Total Submissions: {totalSubmissions}</span>
            <span>Acceptance: {acceptanceRate}%</span>
          </div>
        </div>

        {/* PROBLEMS BY PLATFORM (HORIZONTAL BARS) */}
        <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Problems by Platform</h2>
          
          <div className="flex-1 space-y-3.5 pt-1.5">
            {/* Codeforge */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#7B8AB8]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="text-indigo-500">🔵</span> Codeforge
                </span>
                <span className="text-white">{codeforgeTotal}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${(codeforgeTotal / maxSolved) * 100}%` }} />
              </div>
            </div>

            {/* LeetCode */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#7B8AB8]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="text-amber-500">🟡</span> LeetCode
                </span>
                <span className="text-white">{leetcodeSolved}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${(leetcodeSolved / maxSolved) * 100}%` }} />
              </div>
            </div>

            {/* Codeforces */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#7B8AB8]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="text-blue-500">🔵</span> Codeforces
                </span>
                <span className="text-white">{codeforcesSolved}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(codeforcesSolved / maxSolved) * 100}%` }} />
              </div>
            </div>

            {/* CodeChef */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#7B8AB8]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="text-amber-700">🟤</span> CodeChef
                </span>
                <span className="text-white">{codechefSolved}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full bg-amber-700 rounded-full transition-all duration-300" style={{ width: `${(codechefSolved / maxSolved) * 100}%` }} />
              </div>
            </div>

            {/* GeeksForGeeks */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-[#7B8AB8]">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="text-green-500">🟢</span> GeeksForGeeks
                </span>
                <span className="text-white">{gfgSolved}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${(gfgSolved / maxSolved) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED PLATFORM STATS */}
        {renderPlatformStats()}
      </div>
    ) : null}

      {/* 5. RECENT LISTS & BADGES GRID */}
      {selectedPlatformTab === 'CODEFORGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* RECENT CONTESTS */}
          <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Recent Contests</h2>
              <button className="text-[10px] font-bold text-[#4A6CF7] hover:underline">View all</button>
            </div>

            <div className="flex-1 space-y-3.5 pt-1 overflow-y-auto max-h-[220px]">
              {dynamicContests.length === 0 ? (
                <div className="text-center text-xs text-[#7B8AB8] py-12 font-medium">
                  No contest history linked yet
                </div>
              ) : (
                dynamicContests.map((contest) => (
                  <div key={contest.id} className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.03] last:border-b-0 last:pb-0">
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-white">{contest.name}</h4>
                      <p className="text-[10px] text-[#7B8AB8] font-bold uppercase tracking-wider">{contest.platform}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[11px] font-extrabold ${contest.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {contest.change}
                      </span>
                      <p className="text-[9px] text-[#4A5580] font-bold mt-0.5">Rating: {contest.rating}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BADGES SECTION */}
          <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#A78BFA]" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Badges</h2>
              </div>
              <button className="text-[10px] font-bold text-[#4A6CF7] hover:underline">View all</button>
            </div>

            {/* Hexagonal Badges grid 3x3 layout */}
            <div className="flex-1 grid grid-cols-3 gap-y-4.5 gap-x-2 pt-2 items-center justify-center overflow-y-auto max-h-[220px]">
              {dynamicBadges.length === 0 ? (
                <div className="col-span-3 text-center text-xs text-[#7B8AB8] py-12 font-medium">
                  No achievement badges unlocked yet
                </div>
              ) : (
                dynamicBadges.map(badge => (
                  <React.Fragment key={badge.id}>
                    {renderHexagon(badge.icon, badge.color, badge.name, badge.id)}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY TIMELINE */}
          <div className="bg-[#090D1A]/60 border border-white/[0.04] rounded-2xl p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">Recent Activity</h2>
              <button className="text-[10px] font-bold text-[#4A6CF7] hover:underline">View all</button>
            </div>

            <div className="flex-1 space-y-3.5 relative pl-6 pt-1.5 overflow-y-auto max-h-[220px]">
              {recentActivityList.length === 0 ? (
                <div className="text-center text-xs text-[#7B8AB8] py-12 font-medium">No recent activity logged</div>
              ) : (
                <>
                  <div className="absolute left-[4px] top-2.5 bottom-2.5 w-[1.5px] bg-[#1E293B] pointer-events-none" />
                  {recentActivityList.map((item, idx) => {
                    let badgeTheme = 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20';
                    let dotColor = 'bg-emerald-500';
                    
                    if (item.difficulty?.toUpperCase() === 'MEDIUM') {
                      badgeTheme = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
                      dotColor = 'bg-[#F59E0B]';
                    } else if (item.difficulty?.toUpperCase() === 'HARD') {
                      badgeTheme = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
                      dotColor = 'bg-rose-500';
                    }

                    return (
                      <div key={item.id || idx} className="flex justify-between items-center text-xs relative">
                        <div className={`absolute -left-[24px] w-2.5 h-2.5 rounded-full border-[2.5px] border-[#030712] ${dotColor}`} />
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-white">{item.description}</span>
                          <p className="text-[9px] text-[#4A5580] font-bold">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {item.difficulty && (
                          <span className={`${badgeTheme} px-2 py-0.5 border rounded-md text-[9px] font-extrabold uppercase`}>
                            {item.difficulty.toLowerCase()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 select-none">
          <div 
            onClick={() => setIsEditModalOpen(false)} 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="bg-[#090D1A] border border-white/[0.08] w-full max-w-lg rounded-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <header className="px-6 py-4.5 border-b border-white/[0.05] flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Edit Profile Details</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#7B8AB8] hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold text-[#7B8AB8] scrollbar-thin">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4A5580]">Bio Statement</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full p-4 rounded-xl bg-[#030712] border border-white/[0.06] text-white focus:outline-none focus:border-[#4A6CF7]/50 transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4A5580]">Location</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-[#030712] border border-white/[0.06] text-white focus:outline-none focus:border-[#4A6CF7]/50 transition"
                />
              </div>

              <footer className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04] mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-white rounded-xl transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#4A6CF7] hover:bg-[#3B5BEB] text-white rounded-xl shadow-glow transition duration-200"
                >
                  Save Changes
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* PLATFORM CONNECTION MODAL */}
      {linkingPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 select-none">
          <div 
            onClick={() => setLinkingPlatform(null)} 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="bg-[#090D1A] border border-white/[0.08] w-full max-w-sm rounded-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col">
            <header className="px-6 py-4.5 border-b border-white/[0.05] flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Link {linkingPlatform}</h3>
              <button 
                onClick={() => setLinkingPlatform(null)}
                className="p-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#7B8AB8] hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <form onSubmit={handleLinkPlatform} className="p-6 space-y-4 text-xs font-semibold text-[#7B8AB8]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#4A5580]">{linkingPlatform} Username</label>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={`e.g. ${linkingPlatform.toLowerCase()}_user`}
                  required
                  className="w-full h-10 px-4 rounded-xl bg-[#030712] border border-white/[0.06] text-white focus:outline-none focus:border-[#4A6CF7]/50 transition"
                />
              </div>

              {linkingError && (
                <p className="text-[10px] text-rose-500 font-extrabold">{linkingError}</p>
              )}

              <footer className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setLinkingPlatform(null)}
                  className="px-4 py-2 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-white rounded-xl transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLinking}
                  className="px-5 py-2 bg-[#4A6CF7] hover:bg-[#3B5BEB] text-white rounded-xl shadow-glow transition duration-200 flex items-center gap-1.5"
                >
                  {isLinking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isLinking ? 'Connecting...' : 'Link Account'}</span>
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
