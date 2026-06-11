import React from 'react';
import { Search, Bookmark } from 'lucide-react';

interface ProblemFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  onDifficultyChange: (val: 'All' | 'Easy' | 'Medium' | 'Hard') => void;
  showBookmarkedOnly: boolean;
  onBookmarkedToggle: () => void;
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  showBookmarkedOnly,
  onBookmarkedToggle,
}) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-premium p-4 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
        <input
          type="text"
          placeholder="Search problem title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-transparent focus:bg-white focus:border-primary rounded-premium text-sm outline-none transition"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
        {/* Difficulty Pills */}
        <div className="flex bg-[#F5F7FA] p-1 rounded-premium border border-transparent">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-premium text-xs transition ${
                difficulty === d 
                  ? 'bg-white text-text shadow-card font-bold' 
                  : 'text-secondaryText hover:text-text'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Bookmarks Toggle */}
        <button
          onClick={onBookmarkedToggle}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-premium border transition ${
            showBookmarkedOnly 
              ? 'border-red-200 bg-red-50 text-danger' 
              : 'border-border bg-white text-secondaryText hover:text-text'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${showBookmarkedOnly ? 'fill-danger text-danger' : ''}`} />
          <span>Bookmarks Only</span>
        </button>
      </div>
    </div>
  );
};
export default ProblemFilters;
