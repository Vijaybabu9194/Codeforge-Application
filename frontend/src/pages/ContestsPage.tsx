import React, { useState } from 'react';
import { Trophy, Calendar, Clock, ExternalLink, Zap, Star, Users, ChevronRight } from 'lucide-react';

interface Contest {
  id: string;
  platform: 'leetcode' | 'gfg' | 'codeforces' | 'codeforge';
  name: string;
  startTime: string;        // ISO or display string
  duration: string;
  registerUrl: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  participants?: number;
  difficulty?: string;
  prize?: string;
}

const PLATFORM_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  leetcode: {
    label: 'LeetCode',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/25',
    icon: (
      <svg viewBox="0 0 95 111" className="w-5 h-5" fill="none">
        <path d="M68.6 55.7H27.5a4 4 0 0 0 0 8h41.1a4 4 0 0 0 0-8z" fill="#B3B3B3"/>
        <path d="M42.2 83.1 21.8 62.7a4 4 0 0 1 0-5.7l20.4-20.4a4 4 0 0 1 5.7 5.7L30.3 59.8l17.6 17.6a4 4 0 0 1-5.7 5.7z" fill="#F89F1B"/>
        <path d="M56.6 37.1c-1-1-2.5-1.5-3.9-1.2-1.5.3-2.7 1.2-3.4 2.5-.6 1.3-.5 2.8.3 4l6.8 11.3 6.6-11.1a4 4 0 0 0-1.3-5.4 3.98 3.98 0 0 0-5.1.1v-.2z" fill="#070706"/>
      </svg>
    ),
  },
  gfg: {
    label: 'GeeksForGeeks',
    color: 'text-[#4ADE80]',
    bg: 'bg-[#4ADE80]/10',
    border: 'border-[#4ADE80]/25',
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5">
        <path d="M8 24a16 16 0 1 1 32 0 16 16 0 0 1-32 0" fill="#2F8D46"/>
        <path d="M13 21h8v6h-8zM27 21h8v6h-8z" fill="white"/>
        <rect x="21" y="23" width="6" height="2" fill="white"/>
      </svg>
    ),
  },
  codeforces: {
    label: 'Codeforces',
    color: 'text-[#EF4444]',
    bg: 'bg-[#EF4444]/10',
    border: 'border-[#EF4444]/25',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <rect x="1" y="10" width="5" height="13" rx="1" fill="#EF4444"/>
        <rect x="9.5" y="5" width="5" height="18" rx="1" fill="#818CF8"/>
        <rect x="18" y="0" width="5" height="23" rx="1" fill="#F59E0B"/>
      </svg>
    ),
  },
  codeforge: {
    label: 'CodeForge',
    color: 'text-[#A78BFA]',
    bg: 'bg-[#A78BFA]/10',
    border: 'border-[#A78BFA]/25',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#A78BFA]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M7 8l-4 4 4 4"/>
        <path d="M17 8l4 4-4 4"/>
        <path d="M14 4l-4 16"/>
      </svg>
    ),
  },
};

// Static contest data — links open the real platform pages
const CONTESTS: Contest[] = [
  // ── LeetCode ──
  {
    id: 'lc-weekly',
    platform: 'leetcode',
    name: 'Weekly Contest',
    startTime: 'Every Sunday 10:30 AM IST',
    duration: '1h 30m',
    registerUrl: 'https://leetcode.com/contest/',
    status: 'upcoming',
    participants: 25000,
    difficulty: 'Mixed',
  },
  {
    id: 'lc-biweekly',
    platform: 'leetcode',
    name: 'Biweekly Contest',
    startTime: 'Every other Saturday 12:00 AM IST',
    duration: '1h 30m',
    registerUrl: 'https://leetcode.com/contest/',
    status: 'upcoming',
    participants: 18000,
    difficulty: 'Mixed',
  },
  // ── GFG ──
  {
    id: 'gfg-weekly',
    platform: 'gfg',
    name: 'GFG Weekly Coding Contest',
    startTime: 'Every Wednesday 7:00 PM IST',
    duration: '1h 30m',
    registerUrl: 'https://practice.geeksforgeeks.org/contest/',
    status: 'upcoming',
    participants: 5000,
    difficulty: 'Mixed',
  },
  {
    id: 'gfg-jobathon',
    platform: 'gfg',
    name: 'Job-A-Thon Hiring Challenge',
    startTime: 'Monthly — Check GFG for dates',
    duration: '2h',
    registerUrl: 'https://practice.geeksforgeeks.org/contest/',
    status: 'upcoming',
    participants: 12000,
    difficulty: 'Medium–Hard',
    prize: 'Job Opportunities',
  },
  // ── Codeforces ──
  {
    id: 'cf-div1',
    platform: 'codeforces',
    name: 'Codeforces Round (Div. 1)',
    startTime: 'Announced on Codeforces',
    duration: '2h',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 8000,
    difficulty: 'Advanced',
  },
  {
    id: 'cf-div2',
    platform: 'codeforces',
    name: 'Codeforces Round (Div. 2)',
    startTime: 'Announced on Codeforces',
    duration: '2h',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 22000,
    difficulty: 'Intermediate',
  },
  {
    id: 'cf-educational',
    platform: 'codeforces',
    name: 'Educational Codeforces Round',
    startTime: 'Every 2–3 weeks',
    duration: '2h',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 15000,
    difficulty: 'Mixed',
  },
  // ── CodeForge ──
  {
    id: 'forge-sprint',
    platform: 'codeforge',
    name: 'CodeForge Sprint #1',
    startTime: 'Coming Soon',
    duration: '1h',
    registerUrl: '#',
    status: 'upcoming',
    difficulty: 'Easy–Medium',
    prize: 'Exclusive Badge',
  },
  {
    id: 'forge-interview',
    platform: 'codeforge',
    name: 'Interview Prep Challenge',
    startTime: 'Coming Soon',
    duration: '2h',
    registerUrl: '#',
    status: 'upcoming',
    difficulty: 'Medium–Hard',
    prize: 'Certificate + Badge',
  },
];

const PLATFORM_FILTERS = ['All', 'LeetCode', 'GeeksForGeeks', 'Codeforces', 'CodeForge'] as const;
type PlatformFilter = typeof PLATFORM_FILTERS[number];

const filterMap: Record<PlatformFilter, string> = {
  All: '',
  LeetCode: 'leetcode',
  GeeksForGeeks: 'gfg',
  Codeforces: 'codeforces',
  CodeForge: 'codeforge',
};

export const ContestsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>('All');

  const filtered = activeFilter === 'All'
    ? CONTESTS
    : CONTESTS.filter(c => c.platform === filterMap[activeFilter]);

  const getStatusBadge = (status: Contest['status']) => {
    if (status === 'ongoing') return 'text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20';
    if (status === 'ended') return 'text-[#4A5580] bg-white/[0.04] border border-white/[0.06]';
    return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20';
  };

  const getStatusLabel = (status: Contest['status']) => {
    if (status === 'ongoing') return '🟢 Live';
    if (status === 'ended') return 'Ended';
    return '⏰ Upcoming';
  };

  const handleRegister = (url: string) => {
    if (url === '#') return; // CodeForge contests not live yet
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] select-none bg-[#060912]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Contests</h1>
            <p className="text-[#4A5580] text-sm mt-0.5 font-medium">
              Compete on LeetCode, GeeksForGeeks, Codeforces and CodeForge
            </p>
          </div>
          {/* Total count */}
          <div className="flex items-center gap-2 bg-[#4A6CF7]/10 border border-[#4A6CF7]/20 px-4 py-2 rounded-xl">
            <Trophy className="w-4 h-4 text-[#4A6CF7]" />
            <span className="text-white text-sm font-bold">{CONTESTS.length} Contests</span>
          </div>
        </div>

        {/* ── PLATFORM FILTER TABS ── */}
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-[#4A6CF7] text-white shadow-lg shadow-[#4A6CF7]/25'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#7B8AB8] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── PLATFORM SECTIONS ── */}
        {(['leetcode', 'gfg', 'codeforces', 'codeforge'] as const)
          .filter(platform => {
            if (activeFilter === 'All') return true;
            return platform === filterMap[activeFilter];
          })
          .map(platform => {
            const meta = PLATFORM_META[platform];
            const platformContests = filtered.filter(c => c.platform === platform);
            if (platformContests.length === 0) return null;

            return (
              <div key={platform} className="space-y-3">
                {/* Platform heading */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center`}>
                    {meta.icon}
                  </div>
                  <h2 className={`text-sm font-extrabold uppercase tracking-wider ${meta.color}`}>
                    {meta.label}
                  </h2>
                  <div className={`h-px flex-1 ${meta.bg} border-t ${meta.border}`} />
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} border ${meta.border}`}>
                    {platformContests.length} contest{platformContests.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Contest cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platformContests.map(contest => (
                    <div
                      key={contest.id}
                      className={`bg-[#0F1526] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-white/[0.10] hover:bg-[#0F1526]/80 group ${meta.border}`}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[13px] font-bold text-white leading-snug group-hover:text-white/90">
                            {contest.name}
                          </h3>
                          <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(contest.status)}`}>
                            {getStatusLabel(contest.status)}
                          </span>
                        </div>
                        <div className={`w-9 h-9 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center flex-shrink-0`}>
                          {meta.icon}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-[#7B8AB8]">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580]" />
                          <span className="truncate">{contest.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#7B8AB8]">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580]" />
                          <span>Duration: <span className="text-white font-bold">{contest.duration}</span></span>
                        </div>
                        {contest.participants && (
                          <div className="flex items-center gap-2 text-[11px] text-[#7B8AB8]">
                            <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580]" />
                            <span>~{contest.participants.toLocaleString()} participants</span>
                          </div>
                        )}
                        {contest.difficulty && (
                          <div className="flex items-center gap-2 text-[11px] text-[#7B8AB8]">
                            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580]" />
                            <span>Difficulty: <span className="text-white font-semibold">{contest.difficulty}</span></span>
                          </div>
                        )}
                        {contest.prize && (
                          <div className="flex items-center gap-2 text-[11px] text-[#F59E0B]">
                            <Star className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-bold">{contest.prize}</span>
                          </div>
                        )}
                      </div>

                      {/* Register button */}
                      <button
                        onClick={() => handleRegister(contest.registerUrl)}
                        disabled={contest.registerUrl === '#'}
                        className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                          contest.registerUrl === '#'
                            ? 'bg-white/[0.04] border border-white/[0.06] text-[#4A5580] cursor-not-allowed'
                            : `${meta.bg} border ${meta.border} ${meta.color} hover:opacity-80 hover:scale-[1.02]`
                        }`}
                      >
                        {contest.registerUrl === '#' ? (
                          <>Coming Soon</>
                        ) : (
                          <>
                            Register / View
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center">
              <Trophy className="w-7 h-7 text-[#4A5580]" />
            </div>
            <p className="text-[#7B8AB8] font-bold">No contests found</p>
          </div>
        )}

        {/* ── FOOTER NOTE ── */}
        <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#4A6CF7]/10 flex items-center justify-center flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-[#4A6CF7]" />
          </div>
          <p className="text-[11px] text-[#4A5580] font-medium">
            Contest schedules are approximate. Click <span className="text-[#7B8AB8] font-bold">Register / View</span> to check the latest times and register on the respective platform.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContestsPage;
