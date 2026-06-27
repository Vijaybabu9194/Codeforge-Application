import React from 'react';
import { Search, Building2 } from 'lucide-react';

interface CompanyListItem {
  id: number;
  name: string;
  logoUrl: string;
  totalQuestions: number;
  hiringTrend: string;
}

interface CompanySidebarProps {
  companies: CompanyListItem[];
  selectedCompanyId: number | null;
  onCompanySelect: (id: number) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  loadingList: boolean;
}

export const CompanySidebar: React.FC<CompanySidebarProps> = ({
  companies,
  selectedCompanyId,
  onCompanySelect,
  searchQuery,
  onSearchChange,
  loadingList,
}) => {
  const getTrendColor = (trend: string) => {
    if (!trend) return 'text-[#4A5580]';
    const t = trend.toLowerCase();
    if (t.includes('high') || t.includes('active') || t.includes('rising')) return 'text-[#4ADE80]';
    if (t.includes('medium') || t.includes('moderate')) return 'text-[#F59E0B]';
    return 'text-[#7B8AB8]';
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#090D1A] border-r border-white/[0.05] flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#4A6CF7]/15 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-[#4A6CF7]" />
          </div>
          <span className="text-[10px] font-extrabold text-[#4A5580] uppercase tracking-widest">
            Companies
          </span>
          <span className="ml-auto text-[10px] font-black text-[#4A5580] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
            {companies.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4A5580] pointer-events-none" />
          <input
            type="text"
            placeholder="Search company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0F1526] border border-white/[0.06] rounded-xl text-xs text-white placeholder-[#4A5580] focus:outline-none focus:border-[#4A6CF7]/40 transition-all"
          />
        </div>
      </div>

      {/* Company List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {loadingList ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-11 bg-white/[0.03] rounded-xl animate-pulse mx-1 my-1" />
          ))
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#4A5580]" />
            </div>
            <p className="text-xs text-[#4A5580] font-semibold">No companies found</p>
          </div>
        ) : (
          companies.map((c) => {
            const isSelected = selectedCompanyId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onCompanySelect(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2.5 group ${
                  isSelected
                    ? 'bg-[#4A6CF7]/10 border border-[#4A6CF7]/25 text-white'
                    : 'border border-transparent text-[#7B8AB8] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {/* Logo */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  isSelected ? 'bg-[#4A6CF7]/10 border border-[#4A6CF7]/30' : 'bg-white/[0.04] border border-white/[0.06]'
                }`}>
                  {c.logoUrl && (c.logoUrl.startsWith('http') || c.logoUrl.includes('/')) ? (
                    <img src={c.logoUrl} alt={c.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-sm">{c.logoUrl || '🏢'}</span>
                  )}
                </div>

                {/* Name + trend */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{c.name}</div>
                  {c.hiringTrend && (
                    <div className={`text-[9px] font-semibold truncate ${getTrendColor(c.hiringTrend)}`}>
                      {c.hiringTrend}
                    </div>
                  )}
                </div>

                {/* Count badge */}
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#4A6CF7]/20 text-[#818CF8]'
                    : 'bg-white/[0.04] text-[#4A5580] group-hover:bg-white/[0.06]'
                }`}>
                  {c.totalQuestions}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default CompanySidebar;
