import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  iconColor: string;
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  iconColor,
  iconBg,
  icon,
  title,
  description,
  items,
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
    <div className="space-y-2.5 mt-auto pt-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-[13px] text-slate-700 dark:text-slate-300 font-semibold">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

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
