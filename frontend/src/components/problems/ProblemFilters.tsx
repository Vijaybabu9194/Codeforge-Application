import { Search, PanelLeft } from 'lucide-react';

interface ProblemFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  difficulty: string;
  setDifficulty: (diff: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPage: (page: number) => void;
}

export default function ProblemFilters({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  sidebarOpen,
  setSidebarOpen,
  setPage,
}: ProblemFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-bg-secondary rounded-xl transition-colors border-none bg-transparent cursor-pointer"
        >
          <PanelLeft className="w-5 h-5 text-text-secondary" />
        </button>
      )}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <div className="flex gap-2">
        {['', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              difficulty === d
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-secondary border-border hover:border-primary/30'
            }`}
          >
            {d || 'All'}
          </button>
        ))}
      </div>
    </div>
  );
}
