import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Award, Sparkles, CheckCircle2, Zap, ArrowUpRight, Clock, ShieldCheck, TrendingUp } from 'lucide-react';
import { LeetCodeLogo, GfgLogo } from '../components/CompanyLogos';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface PotdProblem {
  id: string;
  platform: 'leetcode' | 'gfg';
  platformName: string;
  subtitle: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solveUrl: string;
  reward: string;
  solved: boolean;
  accuracy: string;
  submissions: string;
}

export const ProblemOfTheDayPage: React.FC = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number>(user?.currentStreak ?? 0);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  // Dynamic live countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await api.get<{ currentStreak: number }>('/dashboard/stats');
        if (res.data && res.data.currentStreak !== undefined) {
          setStreak(res.data.currentStreak);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats for streak:', err);
      }
    };
    fetchUserStats();
  }, []);

  const [problems, setProblems] = useState<PotdProblem[]>([
    {
      id: 'lc-potd',
      platform: 'leetcode',
      platformName: 'LeetCode',
      subtitle: 'Daily Challenge',
      title: 'LeetCode Problem of the Day',
      difficulty: 'Medium',
      category: 'Algorithms · Problem Solving',
      solveUrl: 'https://leetcode.com/problemset/',
      reward: '+10 LeetCoins & Badge',
      solved: false,
      accuracy: '65.2%',
      submissions: '150.4K Today',
    },
    {
      id: 'gfg-potd',
      platform: 'gfg',
      platformName: 'GeeksForGeeks',
      subtitle: 'Geek Bits',
      title: 'GFG Problem of the Day',
      difficulty: 'Medium',
      category: 'Data Structures & Algorithms',
      solveUrl: 'https://www.geeksforgeeks.org/problem-of-the-day',
      reward: '+8 GFG Coins & Streak',
      solved: false,
      accuracy: '58.7%',
      submissions: '95.1K Today',
    },
  ]);

  const toggleSolve = (id: string) => {
    setProblems(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextSolved = !p.solved;
          if (nextSolved) setStreak(s => s + 1);
          else setStreak(s => Math.max(0, s - 1));
          return { ...p, solved: nextSolved };
        }
        return p;
      })
    );
  };

  const getDiffBadgeStyle = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (diff === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const padZero = (n: number) => String(n).padStart(2, '0');

  return (
  return (
    <div className="min-h-[calc(100vh-64px)] select-none bg-dash-bg text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#0284C7]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1140px] mx-auto px-5 py-6 space-y-5 relative z-10">

        {/* ── COMPACT HERO BANNER ── */}
        <div className="relative overflow-hidden dash-card border border-dash-border rounded-2xl p-5 lg:p-6 shadow-sm">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Column: Title & Live Clock */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-1.5 bg-[#0284C7]/10 border border-[#0284C7]/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#0284C7]">
                  <Calendar className="w-3 h-3 text-[#0284C7]" />
                  <span>{todayDateStr}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-dash-textMuted">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>Resets in: <span className="font-mono font-bold text-amber-500">{padZero(timeLeft.hours)}h {padZero(timeLeft.minutes)}m</span></span>
                </div>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                Problem of The Day
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </h1>
            </div>

            {/* Right Column: Compact Streak Badge */}
            <div className="dash-card border border-dash-border rounded-xl p-3 px-4 flex items-center gap-3 self-start sm:self-center shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{streak} <span className="text-xs font-bold text-orange-500">Days</span></div>
                <div className="text-[9px] font-extrabold text-dash-textMuted uppercase tracking-wider mt-1">Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SLEEK & COMPACT POTD CARDS GRID (Exactly 2 Cards) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {problems.map(p => {
            const isLeetCode = p.platform === 'leetcode';
            const cardGlow = isLeetCode 
              ? 'hover:border-amber-500/30 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)]' 
              : 'hover:border-emerald-500/30 hover:shadow-[0_10px_30px_-10px_rgba(47,141,70,0.15)]';
            const brandAccentBg = isLeetCode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

            return (
              <div
                key={p.id}
                className={`dash-card border rounded-2xl p-5 flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm relative group overflow-hidden ${cardGlow}`}
              >
                <div className="space-y-4 relative z-10">
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl dash-card border border-dash-border flex items-center justify-center p-2 shadow-sm">
                        {isLeetCode ? <LeetCodeLogo className="w-5.5 h-5.5" /> : <GfgLogo className="w-7.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{p.platformName}</h3>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${brandAccentBg}`}>
                            {p.subtitle}
                          </span>
                        </div>
                        <span className="text-[10px] text-dash-textMuted font-medium flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-[#0284C7]" />
                          Official Daily Problem
                        </span>
                      </div>
                    </div>

                    {/* Solve Toggle Button */}
                    <button
                      onClick={() => toggleSolve(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        p.solved
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          : 'dash-card text-dash-textSecondary border border-dash-border hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${p.solved ? 'fill-emerald-500 text-slate-950' : ''}`} />
                      <span>{p.solved ? 'Solved' : 'Mark Solved'}</span>
                    </button>
                  </div>

                  {/* Problem Title & Category */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border tracking-wide ${getDiffBadgeStyle(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] font-semibold text-dash-textSecondary bg-white/[0.04] px-2.5 py-0.5 rounded-lg border border-dash-border">
                        {p.category}
                      </span>
                    </div>

                    <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-[#0284C7] transition-colors">
                      {p.title}
                    </h2>
                  </div>

                  {/* Compact Metrics Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="dash-card border border-dash-border rounded-xl p-2.5 px-3">
                      <div className="text-[9px] font-extrabold text-dash-textMuted uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-[#0284C7]" />
                        Acceptance
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{p.accuracy}</div>
                    </div>
                    <div className="dash-card border border-dash-border rounded-xl p-2.5 px-3">
                      <div className="text-[9px] font-extrabold text-dash-textMuted uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Submissions
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{p.submissions}</div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Reward & Solve Action */}
                <div className="pt-3.5 border-t border-dash-border flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    <Award className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{p.reward}</span>
                  </div>

                  <a
                    href={p.solveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md ${
                      isLeetCode
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/15'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-500/15'
                    }`}
                  >
                    <span>Solve Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── COMPACT FOOTER STRIP ── */}
        <div className="dash-card border border-dash-border rounded-xl p-3.5 px-4 flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
          <p className="text-xs text-dash-textSecondary font-medium">
            <strong className="text-slate-900 dark:text-white font-semibold">Pro tip:</strong> Solving daily challenges keeps your streak alive and builds consistent problem-solving habits!
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProblemOfTheDayPage;
