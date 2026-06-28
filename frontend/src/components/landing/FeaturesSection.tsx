import React from 'react';
import { CheckCircle, Code, Building2, BarChart3, Trophy, ArrowUpRight } from 'lucide-react';

/* =========================================================
   AUTHENTIC MINI UI MOCK ILLUSTRATIONS (Glassmorphic Design)
   ========================================================= */

const FeatureIllustrationContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-[150px] flex items-center justify-center overflow-hidden pointer-events-none select-none rounded-xl bg-slate-950/20 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 p-3">
    <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
      {children}
    </div>
  </div>
);

/* Card 1 UI Mock: Topic-wise Practice */
const TopicUIMock: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between p-1">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-extrabold text-sky-400 flex items-center gap-1">
        <Code className="w-3 h-3" /> Topic Mastery
      </span>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">4 Modules</span>
    </div>
    <div className="space-y-1.5 my-auto">
      <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
        <span className="font-semibold text-slate-200">Arrays & Hashing</span>
        <span className="text-[10px] font-bold text-emerald-400">100% Solved</span>
      </div>
      <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
        <span className="font-semibold text-slate-200">Dynamic Programming</span>
        <span className="text-[10px] font-bold text-sky-400">42 / 50</span>
      </div>
    </div>
  </div>
);

/* Card 2 UI Mock: Company Questions */
const CompanyUIMock: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between p-1">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-extrabold text-indigo-400 flex items-center gap-1">
        <Building2 className="w-3 h-3" /> Top Companies
      </span>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Real Questions</span>
    </div>
    <div className="grid grid-cols-2 gap-1.5 my-auto">
      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-red-400">Google</span>
        <span className="text-[9px] font-bold text-slate-400">140+ Qs</span>
      </div>
      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-amber-400">Amazon</span>
        <span className="text-[9px] font-bold text-slate-400">210+ Qs</span>
      </div>
      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-sky-400">Meta</span>
        <span className="text-[9px] font-bold text-slate-400">95+ Qs</span>
      </div>
      <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-emerald-400">Uber</span>
        <span className="text-[9px] font-bold text-slate-400">65+ Qs</span>
      </div>
    </div>
  </div>
);

/* Card 3 UI Mock: Track & Analyze */
const AnalyticsUIMock: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between p-1">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-extrabold text-cyan-400 flex items-center gap-1">
        <BarChart3 className="w-3 h-3" /> Performance Insights
      </span>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Live Sync</span>
    </div>
    <div className="flex items-center justify-between gap-2 my-auto p-2 rounded-lg bg-slate-900/80 border border-slate-800">
      <div className="flex-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase">Accuracy Rate</p>
        <p className="text-[14px] font-black text-white">88.4% <span className="text-[9px] text-emerald-400 font-bold">+4.2%</span></p>
      </div>
      <div className="flex gap-1 items-end h-7">
        <div className="w-2 bg-sky-500/40 rounded-t h-3" />
        <div className="w-2 bg-sky-500/60 rounded-t h-5" />
        <div className="w-2 bg-cyan-400 rounded-t h-7 animate-pulse" />
      </div>
    </div>
  </div>
);

/* Card 4 UI Mock: Contest & Compete */
const ContestUIMock: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-between p-1">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1">
        <Trophy className="w-3 h-3" /> Global Leaderboard
      </span>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Weekly #42</span>
    </div>
    <div className="space-y-1.5 my-auto">
      <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center">1</span>
          <span className="font-extrabold text-amber-200">Alex_Dev</span>
        </div>
        <span className="font-bold text-amber-400">2,450 pts</span>
      </div>
      <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 font-bold text-[9px] flex items-center justify-center">2</span>
          <span className="font-semibold text-slate-300">CodeNinja</span>
        </div>
        <span className="font-bold text-slate-400">2,180 pts</span>
      </div>
    </div>
  </div>
);

/* =========================================================
   FEATURE CARD COMPONENT
   ========================================================= */
interface FeatureCardProps {
  iconColor: string;
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  illustration: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  iconColor,
  iconBg,
  icon,
  title,
  description,
  items,
  illustration,
}) => (
  <div className="group p-6 rounded-2xl border flex flex-col h-full select-none transition-all duration-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-sky-500/40 bg-white border-slate-200 hover:border-sky-400/50 shadow-md hover:shadow-xl">
    {/* Icon */}
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    {/* Title */}
    <h3 className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-2.5">{title}</h3>
    {/* Description */}
    <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{description}</p>
    {/* Checklist */}
    <div className="space-y-2.5 mb-6">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-[13px] text-slate-700 dark:text-slate-300 font-semibold">{item}</span>
        </div>
      ))}
    </div>
    {/* Mini UI Illustration */}
    <div className="mt-auto pt-2">{illustration}</div>
  </div>
);

/* =========================================================
   FEATURES SECTION
   ========================================================= */
export const FeaturesSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      iconColor: '#38BDF8',
      iconBg: 'rgba(56, 189, 248, 0.12)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
        </svg>
      ),
      title: 'Topic-wise Practice',
      description: 'Structured DSA topics from basic to advanced with a beautiful learning experience.',
      items: ['Arrays', 'Linked List', 'Dynamic Programming', 'Graphs & more'],
      illustration: <FeatureIllustrationContainer><TopicUIMock /></FeatureIllustrationContainer>,
    },
    {
      iconColor: '#818CF8',
      iconBg: 'rgba(129, 140, 248, 0.12)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
        </svg>
      ),
      title: 'Company Questions',
      description: 'Access previous year interview questions from top product companies.',
      items: ['Google', 'Amazon', 'Microsoft', 'Meta & more'],
      illustration: <FeatureIllustrationContainer><CompanyUIMock /></FeatureIllustrationContainer>,
    },
    {
      iconColor: '#38BDF8',
      iconBg: 'rgba(56, 189, 248, 0.12)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
      ),
      title: 'Track & Analyze',
      description: 'Track your progress, solve rate, accuracy and identify your strengths & weaknesses.',
      items: ['Detailed Analytics', 'Contest Performance', 'Progress Heatmaps', 'Smart Insights'],
      illustration: <FeatureIllustrationContainer><AnalyticsUIMock /></FeatureIllustrationContainer>,
    },
    {
      iconColor: '#818CF8',
      iconBg: 'rgba(129, 140, 248, 0.12)',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/>
          <path d="M4 22h16"/><path d="M10 22V8h4v14"/><path d="M8 9h8"/>
        </svg>
      ),
      title: 'Contest & Compete',
      description: 'Participate in contests, climb rankings and compete with thousands of developers.',
      items: ['Weekly Contests', 'Global Rankings', 'Real-time Leaderboard', 'Exciting Rewards'],
      illustration: <FeatureIllustrationContainer><ContestUIMock /></FeatureIllustrationContainer>,
    },
  ];

  return (
    <section id="features" className="py-16 relative z-10 select-none">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        {/* Section Heading — 100% Highlighted Entire Line */}
        <div className="text-center mb-14">
          <h2 className="text-[30px] lg:text-[38px] font-black tracking-tight">
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Everything you need to ace your next interview
            </span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
