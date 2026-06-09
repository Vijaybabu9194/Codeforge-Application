import { Search } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  totalQuestions: number;
}

interface CompanySidebarProps {
  companies: Company[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  companySearch: string;
  setCompanySearch: (search: string) => void;
}

export default function CompanySidebar({
  companies,
  selectedId,
  setSelectedId,
  companySearch,
  setCompanySearch,
}: CompanySidebarProps) {
  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border p-5">
      <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-4">Companies</h3>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <div className="space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-xs text-text-secondary text-center py-4">No companies found</p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-none text-left ${
                selectedId === c.id
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-xs text-muted">{c.totalQuestions}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
