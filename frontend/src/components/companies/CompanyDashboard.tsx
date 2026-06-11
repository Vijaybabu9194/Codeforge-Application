import React from 'react';
import { TrendingUp, BarChart3, Target } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
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

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyDetail }) => {
  const getChartData = () => {
    if (!companyDetail.difficultyDistribution) return [];
    return Object.entries(companyDetail.difficultyDistribution).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case 'EASY': return '#22C55E';
      case 'MEDIUM': return '#F59E0B';
      case 'HARD': return '#EF4444';
      default: return '#6366F1';
    }
  };

  return (
    <div className="space-y-8">
      {/* COMPANY OVERVIEW HEADER */}
      <div className="bg-white border border-border rounded-premium p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-premium border border-border bg-[#FAFBFC] flex items-center justify-center overflow-hidden flex-shrink-0">
            {companyDetail.logoUrl && (companyDetail.logoUrl.startsWith('http') || companyDetail.logoUrl.includes('/')) ? (
              <img src={companyDetail.logoUrl} alt={companyDetail.name} className="w-12 h-12 object-contain" />
            ) : (
              <span className="text-3xl">{companyDetail.logoUrl || '🏢'}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">{companyDetail.name} Questions</h1>
            <p className="text-sm text-secondaryText mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Hiring Status: <span className="font-semibold text-text">{companyDetail.hiringTrend}</span></span>
            </p>
          </div>
        </div>

        {/* Stats Counters */}
        <div className="flex gap-8">
          <div>
            <span className="text-[10px] font-bold text-secondaryText tracking-wide uppercase">TOTAL QUESTIONS</span>
            <span className="text-2xl font-bold text-text block mt-0.5">{companyDetail.totalQuestions}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-secondaryText tracking-wide uppercase">INTERVIEW REQ</span>
            <span className="text-2xl font-bold text-primary block mt-0.5">{companyDetail.interviewFrequency}%</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD CHARTS */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Difficulty Distribution Bar Chart */}
        <div className="bg-white border border-border rounded-premium p-5 shadow-card md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Difficulty Distribution</span>
          </h2>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Asked Topics */}
        <div className="bg-white border border-border rounded-premium p-5 shadow-card space-y-4 flex flex-col">
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Most Asked Topics</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {companyDetail.topTopics?.map((topic, i) => (
              <div key={i} className="flex justify-between items-center bg-[#F5F7FA] border border-border p-2.5 rounded-premium text-xs">
                <span className="font-semibold text-text">{topic.topic}</span>
                <span className="bg-indigo-50 text-primary font-bold px-2 py-0.5 rounded-full">{topic.count} questions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyDashboard;
