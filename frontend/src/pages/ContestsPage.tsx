import React, { useState } from 'react';
import { Trophy, Calendar, Clock, ExternalLink, Zap, Star, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { LeetCodeLogo, GfgLogo } from '../components/CompanyLogos';

interface Contest {
  id: string;
  platform: 'leetcode' | 'gfg' | 'codeforces' | 'codeforge';
  name: string;
  startTime: string;
  duration: string;
  registerUrl: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  participants?: number;
  difficulty?: string;
  prize?: string;
  note?: string;
}

const PLATFORM_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
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
  leetcode: {
    label: 'LeetCode',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/25',
    icon: <LeetCodeLogo className="w-5.5 h-6" />,
  },
  codeforces: {
    label: 'Codeforces',
    color: 'text-[#60A5FA]',
    bg: 'bg-[#60A5FA]/10',
    border: 'border-[#60A5FA]/25',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <rect x="1" y="10" width="5" height="13" rx="1" fill="#EF4444"/>
        <rect x="9.5" y="5" width="5" height="18" rx="1" fill="#60A5FA"/>
        <rect x="18" y="0" width="5" height="23" rx="1" fill="#F59E0B"/>
      </svg>
    ),
  },
  gfg: {
    label: 'GeeksForGeeks',
    color: 'text-[#4ADE80]',
    bg: 'bg-[#4ADE80]/10',
    border: 'border-[#4ADE80]/25',
    icon: <GfgLogo className="w-8 h-4" />,
  },
};


// Accurate, verified contest data (June 2025)
const CONTESTS: Contest[] = [

  // ─── CodeForge (coming soon) ───────────────────────────────────────────
  {
    id: 'forge-sprint',
    platform: 'codeforge',
    name: 'CodeForge Sprint #1',
    startTime: 'Coming Soon',
    duration: '1h',
    registerUrl: '#',
    status: 'upcoming',
    difficulty: 'Easy · Medium',
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
    difficulty: 'Medium · Hard',
    prize: 'Certificate + Badge',
  },

  // ─── LeetCode ─────────────────────────────────────────────────────────
  // Source: leetcode.com/contest — verified schedule
  {
    id: 'lc-weekly',
    platform: 'leetcode',
    name: 'LeetCode Weekly Contest',
    // Every Sunday, 8:00 AM IST (2:30 AM UTC)
    startTime: 'Every Sunday · 8:00 AM IST',
    duration: '1h 30m',
    registerUrl: 'https://leetcode.com/contest/',
    status: 'upcoming',
    participants: 30000,
    // 4 problems: Q1 Easy, Q2–Q3 Medium, Q4 Hard
    difficulty: '4 problems: Easy · Medium · Medium · Hard',
  },
  {
    id: 'lc-biweekly',
    platform: 'leetcode',
    name: 'LeetCode Biweekly Contest',
    // Alternate Saturdays, 8:00 PM IST (2:30 PM UTC)
    startTime: 'Alternate Saturdays · 8:00 PM IST',
    duration: '1h 30m',
    registerUrl: 'https://leetcode.com/contest/',
    status: 'upcoming',
    participants: 20000,
    difficulty: '4 problems: Easy · Medium · Medium · Hard',
  },

  // ─── Codeforces ───────────────────────────────────────────────────────
  // Source: codeforces.com/contests — typical round structures
  {
    id: 'cf-div2',
    platform: 'codeforces',
    name: 'Codeforces Round (Div. 2)',
    // Multiple times per month; no fixed day/time
    startTime: 'Multiple times/month · See codeforces.com',
    duration: '2h – 2h 30m',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 25000,
    // Open to all, rated for rating < 2100
    difficulty: 'Rated for < 2100 · 5–6 problems (A–F)',
  },
  {
    id: 'cf-div1',
    platform: 'codeforces',
    name: 'Codeforces Round (Div. 1)',
    startTime: 'Multiple times/month · See codeforces.com',
    duration: '2h – 2h 30m',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 8000,
    // Rated for rating ≥ 1900
    difficulty: 'Rated for ≥ 1900 · 5–6 hard problems',
  },
  {
    id: 'cf-div12',
    platform: 'codeforces',
    name: 'Codeforces Round (Div. 1 + Div. 2)',
    startTime: 'Occasionally · See codeforces.com',
    duration: '2h 30m',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 30000,
    // Shared problem set; Div.2 solves easier subset
    difficulty: 'Open to all · 6–8 problems',
  },
  {
    id: 'cf-educational',
    platform: 'codeforces',
    name: 'Educational Codeforces Round',
    // Roughly every 2–3 weeks; unrated during contest, rated after
    startTime: 'Every 2–3 weeks · See codeforces.com',
    duration: '2h',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 18000,
    difficulty: 'Unrated during · Focus on learning · 6–7 problems',
  },
  {
    id: 'cf-global',
    platform: 'codeforces',
    name: 'Codeforces Global Round',
    startTime: 'Infrequently · See codeforces.com',
    duration: '2h 30m',
    registerUrl: 'https://codeforces.com/contests',
    status: 'upcoming',
    participants: 35000,
    difficulty: 'Open to all · Rated for all · 8 problems',
    prize: 'T-shirts for top finishers',
  },

  // ─── GeeksForGeeks ────────────────────────────────────────────────────
  // Source: geeksforgeeks.org/events — verified as of June 2025
  {
    id: 'gfg-weekly',
    platform: 'gfg',
    name: 'GFG Weekly Coding Contest',
    // Currently paused as of June 2025 — GFG has officially paused this
    startTime: 'Currently paused — check GFG Events for resumption',
    duration: '1h 30m',
    registerUrl: 'https://www.geeksforgeeks.org/events',
    status: 'upcoming',
    participants: 5000,
    difficulty: 'Mixed · Easy to Hard',
    note: '⚠️ Currently paused. Check GFG Events page for updates.',
  },
  {
    id: 'gfg-jobathon',
    platform: 'gfg',
    name: 'Job-A-Thon Hiring Challenge',
    // Quarterly (every ~3 months); evening 8 PM – 10:30 PM IST
    startTime: 'Quarterly · 8:00 PM – 10:30 PM IST',
    duration: '2h 30m',
    registerUrl: 'https://www.geeksforgeeks.org/events',
    status: 'upcoming',
    participants: 15000,
    difficulty: 'Medium · Hard',
    prize: 'Direct job opportunities with partner companies',
  },
];

const PLATFORM_FILTERS = ['All', 'CodeForge', 'LeetCode', 'Codeforces', 'GeeksForGeeks'] as const;
type PlatformFilter = typeof PLATFORM_FILTERS[number];

const filterMap: Record<PlatformFilter, string> = {
  All: '',
  CodeForge: 'codeforge',
  LeetCode: 'leetcode',
  Codeforces: 'codeforces',
  GeeksForGeeks: 'gfg',
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
    if (url === '#') return;
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
              Compete on CodeForge, LeetCode, Codeforces and GeeksForGeeks
            </p>
          </div>
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

        {/* ── PLATFORM SECTIONS — ordered: CodeForge → LeetCode → Codeforces → GFG ── */}
        {(['codeforge', 'leetcode', 'codeforces', 'gfg'] as const)
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
                      className={`bg-[#0F1526] border rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-white/[0.10] hover:bg-[#101629] group ${meta.border}`}
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[13px] font-bold text-white leading-snug">
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

                      {/* Note banner (e.g. paused) */}
                      {contest.note && (
                        <div className="flex items-start gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl px-3 py-2">
                          <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-[#F59E0B] font-semibold leading-relaxed">{contest.note}</p>
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[11px] text-[#7B8AB8]">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580] mt-0.5" />
                          <span className="leading-relaxed">{contest.startTime}</span>
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
                          <div className="flex items-start gap-2 text-[11px] text-[#7B8AB8]">
                            <Zap className="w-3.5 h-3.5 flex-shrink-0 text-[#4A5580] mt-0.5" />
                            <span className="leading-relaxed">{contest.difficulty}</span>
                          </div>
                        )}
                        {contest.prize && (
                          <div className="flex items-start gap-2 text-[11px] text-[#F59E0B]">
                            <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="font-semibold leading-relaxed">{contest.prize}</span>
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
            Contest details are accurate as of June 2025. Click <span className="text-[#7B8AB8] font-bold">Register / View</span> to check live schedules and register on the platform.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContestsPage;
