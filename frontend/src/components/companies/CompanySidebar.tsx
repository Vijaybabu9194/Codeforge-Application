import React from 'react';
import { Search } from 'lucide-react';

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
  return (
    <aside className="w-64 border-r border-[#E5E7EB] bg-white flex flex-col">
      <div className="p-4 border-b border-border">
        <span className="text-xs font-bold text-secondaryText tracking-wide block mb-3">COMPANIES</span>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-transparent focus:bg-white focus:border-primary rounded-premium text-xs outline-none transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loadingList ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-premium animate-pulse m-1" />
          ))
        ) : companies.length === 0 ? (
          <p className="text-xs text-secondaryText text-center mt-6">No companies found</p>
        ) : (
          companies.map((c) => (
            <button
              key={c.id}
              onClick={() => onCompanySelect(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-premium text-sm font-semibold flex items-center justify-between transition ${
                selectedCompanyId === c.id 
                  ? 'bg-indigo-50 text-primary' 
                  : 'text-secondaryText hover:bg-secondaryBg hover:text-text'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-base">{c.logoUrl ? c.logoUrl : '🏢'}</span>
                <span className="truncate">{c.name}</span>
              </div>
              <span className="text-[10px] bg-secondaryBg text-muted px-2 py-0.5 rounded-full font-medium">
                {c.totalQuestions}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
export default CompanySidebar;
