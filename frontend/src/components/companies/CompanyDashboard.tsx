import React from 'react';
import { TrendingUp, BarChart3, Target, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CompanyDetail {
  id: number;
  name: string;
  logoUrl: string;
  totalQuestions: number;
  hiringTrend: string;
  interviewFrequency: number;
  difficultyDistribution: Record<string, number>;
  topTopics: { topic: string; count: number }[];
}

interface CompanyDashboardProps {
  companyDetail: CompanyDetail;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F1526] border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl shadow-black/50">
        <p className="text-[10px] font-bold text-[#7B8AB8] uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-extrabold text-white">{payload[0].value} problems</p>
      </div>
    );
  }
  return null;
};

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyDetail }) => {
  const getChartData = () => {
    if (!companyDetail.difficultyDistribution) return [];
    return Object.entries(companyDetail.difficultyDistribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      value,
    }));
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case 'EASY': return '#4ADE80';
      case 'MEDIUM': return '#F59E0B';
      case 'HARD': return '#EF4444';
      default: return '#4A6CF7';
    }
  };

  const getTrendBadge = (trend: string) => {
    if (!trend) return { color: 'text-[#7B8AB8]', bg: 'bg-white/[0.04] border-white/[0.08]', icon: '📊' };
    const t = trend.toLowerCase();
    if (t.includes('high') || t.includes('active') || t.includes('rising'))
      return { color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10 border-[#4ADE80]/20', icon: '🔥' };
    if (t.includes('medium') || t.includes('moderate'))
      return { color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20', icon: '📈' };
    return { color: 'text-[#7B8AB8]', bg: 'bg-white/[0.04] border-white/[0.08]', icon: '📊' };
  };

  const trendStyle = getTrendBadge(companyDetail.hiringTrend);
  const easy = companyDetail.difficultyDistribution?.['EASY'] ?? 0;
  const medium = companyDetail.difficultyDistribution?.['MEDIUM'] ?? 0;
  const hard = companyDetail.difficultyDistribution?.['HARD'] ?? 0;

  return (
    <div className="space-y-5">
      {/* ── COMPANY HEADER ── */}
      <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Logo + Name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
            {companyDetail.logoUrl && (companyDetail.logoUrl.startsWith('http') || companyDetail.logoUrl.includes('/')) ? (
              <img src={companyDetail.logoUrl} alt={companyDetail.name} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-3xl">{companyDetail.logoUrl || '🏢'}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {companyDetail.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#4A5580]" />
              <span className="text-xs text-[#4A5580] font-semibold">Hiring Status:</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${trendStyle.bg} ${trendStyle.color}`}>
                {trendStyle.icon} {companyDetail.hiringTrend || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-3">
          {/* Total Questions */}
          <div className="flex flex-col items-center bg-[#4A6CF7]/10 border border-[#4A6CF7]/20 rounded-xl px-4 py-2.5 min-w-[80px]">
            <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-widest mb-0.5">Total</span>
            <span className="text-xl font-black text-white">{companyDetail.totalQuestions}</span>
            <span className="text-[9px] text-[#4A5580] font-semibold">Questions</span>
          </div>
          {/* Interview Frequency */}
          <div className="flex flex-col items-center bg-[#A78BFA]/10 border border-[#A78BFA]/20 rounded-xl px-4 py-2.5 min-w-[80px]">
            <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-widest mb-0.5">Interview</span>
            <span className="text-xl font-black text-[#A78BFA]">{companyDetail.interviewFrequency}%</span>
            <span className="text-[9px] text-[#4A5580] font-semibold">Frequency</span>
          </div>
          {/* Easy */}
          <div className="flex flex-col items-center bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-xl px-4 py-2.5 min-w-[60px]">
            <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-widest mb-0.5">Easy</span>
            <span className="text-xl font-black text-[#4ADE80]">{easy}</span>
          </div>
          {/* Medium */}
          <div className="flex flex-col items-center bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl px-4 py-2.5 min-w-[60px]">
            <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-widest mb-0.5">Med</span>
            <span className="text-xl font-black text-[#F59E0B]">{medium}</span>
          </div>
          {/* Hard */}
          <div className="flex flex-col items-center bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl px-4 py-2.5 min-w-[60px]">
            <span className="text-[9px] font-extrabold text-[#4A5580] uppercase tracking-widest mb-0.5">Hard</span>
            <span className="text-xl font-black text-[#EF4444]">{hard}</span>
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Difficulty Distribution Chart */}
        <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#4A6CF7]/10 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-[#4A6CF7]" />
            </div>
            <h2 className="text-[12px] font-extrabold text-white uppercase tracking-wider">
              Difficulty Distribution
            </h2>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#4A5580" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#7B8AB8" fontSize={10} tickLine={false} axisLine={false} width={50} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Asked Topics */}
        <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#0284C7]/10 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-[#0284C7]" />
            </div>
            <h2 className="text-[12px] font-black text-white uppercase tracking-wider">
              Top Topics
            </h2>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto">
            {companyDetail.topTopics?.length > 0 ? (
              companyDetail.topTopics.map((topic, i) => {
                const maxCount = Math.max(...(companyDetail.topTopics?.map(t => t.count) ?? [1]));
                const pct = Math.round((topic.count / maxCount) * 100);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-black text-slate-900 dark:text-[#C8D1E8] truncate">{topic.topic}</span>
                      <span className="text-[11px] font-black text-slate-600 dark:text-[#4A5580] ml-2 flex-shrink-0">{topic.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Award className="w-8 h-8 text-[#4A5580]" />
                <p className="text-xs text-[#4A5580] font-semibold">No topics data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
