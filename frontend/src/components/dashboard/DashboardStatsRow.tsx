import React from 'react';
import { Flame } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
  sparkline?: number[];
  sparklineColor?: string;
  borderColorClass?: string;
  glowColorClass?: string;
  isStreakCard?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  subtitleColor = '#4ADE80',
  sparkline,
  sparklineColor = '#4A6CF7',
  borderColorClass = 'border-white/[0.05]',
  glowColorClass = 'rgba(255,255,255,0)',
  isStreakCard = false,
}) => {
  const sparklinePath = sparkline
    ? sparkline.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sparkline.length - 1)) * 100} ${100 - v}`).join(' ')
    : '';

  return (
    <div 
      className={`dash-card relative z-10 p-5 flex flex-col justify-between min-h-[130px] group hover:translate-y-[-2px] transition-all duration-300 border ${borderColorClass}`}
      style={{ boxShadow: `0 0 15px ${glowColorClass}` }}
    >
      {/* Glossy sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] pointer-events-none rounded-xl" />

      {/* Top row: Label */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-[13px] text-dash-textSecondary font-semibold">{label}</span>
      </div>
      
      {/* Bottom row: Value/Subtitle on left, Sparkline/Flame on right */}
      <div className="flex items-end justify-between relative z-10 mt-1">
        <div>
          <div className="text-[28px] font-extrabold text-white leading-none tracking-tight">{value}</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-semibold" style={{ color: subtitleColor }}>{subtitle}</span>
          </div>
        </div>
        
        {isStreakCard ? (
          <div className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)] flex items-center justify-center pr-1 pb-1">
            <Flame className="w-8 h-8 fill-current" />
          </div>
        ) : (
          sparkline && (
            <svg className="w-[80px] h-[35px] flex-shrink-0 opacity-85" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={sparklinePath} fill="none" stroke={sparklineColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        )}
      </div>
    </div>
  );
};

interface DashboardStatsRowProps {
  stats: {
    problemsSolved: number;
    contestRating: number;
    companiesCovered: number;
    currentStreak: number;
  } | null;
  progress?: {
    contestTrend: { label: string; value: number }[];
    questionsTrend: { label: string; value: number }[];
  } | null;
}

export const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({ stats, progress }) => {
  const problems = stats?.problemsSolved ?? 0;
  const rating = stats?.contestRating ?? 0;
  const companies = stats?.companiesCovered ?? 0;
  const streak = stats?.currentStreak ?? 0;

  // Process sparklines dynamically from trend data
  let solvedSparkline = Array(10).fill(0);
  let ratingSparkline = Array(10).fill(0);
  
  if (progress?.questionsTrend && progress.questionsTrend.length > 0) {
    const vals = progress.questionsTrend.map(p => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    solvedSparkline = vals.map(v => ((v - min) / range) * 70 + 15);
  }
  
  if (progress?.contestTrend && progress.contestTrend.length > 0) {
    const vals = progress.contestTrend.map(p => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    ratingSparkline = vals.map(v => ((v - min) / range) * 70 + 15);
  }

  const companiesSparkline = Array(10).fill(0);

  // Dynamic Subtitles based on progress trends
  let solvedSubtitle = 'Solved this week';
  let solvedSubtitleColor = '#4ADE80';
  if (progress?.questionsTrend && progress.questionsTrend.length >= 2) {
    const len = progress.questionsTrend.length;
    const latest = progress.questionsTrend[len - 1].value;
    const prev = progress.questionsTrend[len - 2].value;
    const diff = latest - prev;
    solvedSubtitle = diff >= 0 ? `↑ ${diff} this week` : `↓ ${Math.abs(diff)} this week`;
    solvedSubtitleColor = diff >= 0 ? '#4ADE80' : '#EF4444';
  } else if (problems > 0) {
    solvedSubtitle = 'Active solver';
  }

  let ratingSubtitle = 'Contest level';
  let ratingSubtitleColor = '#818CF8';
  if (progress?.contestTrend && progress.contestTrend.length >= 2) {
    const len = progress.contestTrend.length;
    const latest = progress.contestTrend[len - 1].value;
    const prev = progress.contestTrend[len - 2].value;
    const diff = latest - prev;
    ratingSubtitle = diff >= 0 ? `↑ ${diff} rating` : `↓ ${Math.abs(diff)} rating`;
    ratingSubtitleColor = diff >= 0 ? '#4ADE80' : '#EF4444';
  } else if (rating > 0) {
    ratingSubtitle = 'Top 10%';
  }

  const companiesSubtitle = companies > 0 ? `${companies} target list` : 'No active companies';
  const companiesSubtitleColor = '#A78BFA';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Problems Solved"
        value={problems.toLocaleString()}
        subtitle={solvedSubtitle}
        subtitleColor={solvedSubtitleColor}
        sparkline={solvedSparkline}
        sparklineColor="#22D3EE"
        borderColorClass="border-[#22D3EE]/25 hover:border-[#22D3EE]/50"
        glowColorClass="rgba(34, 211, 238, 0.12)"
      />
      <StatCard
        label="Contest Rating"
        value={rating.toLocaleString()}
        subtitle={ratingSubtitle}
        subtitleColor={ratingSubtitleColor}
        sparkline={ratingSparkline}
        sparklineColor="#818CF8"
        borderColorClass="border-[#818CF8]/25 hover:border-[#818CF8]/50"
        glowColorClass="rgba(129, 140, 248, 0.12)"
      />
      <StatCard
        label="Companies Covered"
        value={companies}
        subtitle={companiesSubtitle}
        subtitleColor={companiesSubtitleColor}
        sparkline={companiesSparkline}
        sparklineColor="#A78BFA"
        borderColorClass="border-[#A78BFA]/25 hover:border-[#A78BFA]/50"
        glowColorClass="rgba(167, 139, 250, 0.12)"
      />
      <StatCard
        label="Current Streak"
        value={streak}
        subtitle="Days"
        borderColorClass="border-[#FB923C]/25 hover:border-[#FB923C]/50"
        glowColorClass="rgba(251, 146, 60, 0.12)"
        isStreakCard={true}
      />
    </div>
  );
};

export default DashboardStatsRow;
