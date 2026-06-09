import { Bookmark, BookmarkCheck, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

const difficultyColor: Record<string, { text: string; bg: string }> = {
  EASY: { text: '#22C55E', bg: '#22C55E10' },
  MEDIUM: { text: '#F59E0B', bg: '#F59E0B10' },
  HARD: { text: '#EF4444', bg: '#EF444410' },
};

interface Problem {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  acceptanceRate: number;
  companies: string[];
  solved: boolean;
  bookmarked: boolean;
}

interface QuestionTableProps {
  problems: {
    problems: Problem[];
    totalPages: number;
    totalElements: number;
  } | null;
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  onBookmark: (id: number) => void;
  onSolve: (id: number) => void;
}

export default function QuestionTable({
  problems,
  loading,
  page,
  setPage,
  onBookmark,
  onSolve,
}: QuestionTableProps) {
  return (
    <div>
      <div className="bg-surface rounded-2xl card-shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-10">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Problem</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-24">Difficulty</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-28">Acceptance</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Companies</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider w-10"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td colSpan={6} className="px-5 py-4">
                    <div className="h-4 bg-bg-secondary rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : problems?.problems?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-text-secondary">
                  No problems found.
                </td>
              </tr>
            ) : (
              problems?.problems?.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-bg/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onSolve(p.id)}
                      className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                    >
                      {p.solved ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted group-hover:text-text-secondary transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-text">{p.title}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
                      style={{
                        color: difficultyColor[p.difficulty]?.text,
                        backgroundColor: difficultyColor[p.difficulty]?.bg,
                      }}
                    >
                      {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-text-secondary">{p.acceptanceRate?.toFixed(1)}%</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {p.companies?.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2 py-0.5 rounded-md bg-bg-secondary text-text-secondary font-medium"
                        >
                          {c}
                        </span>
                      ))}
                      {p.companies?.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-bg-secondary text-muted">
                          +{p.companies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onBookmark(p.id)}
                      className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                    >
                      {p.bookmarked ? (
                        <BookmarkCheck className="w-4.5 h-4.5 text-primary" />
                      ) : (
                        <Bookmark className="w-4.5 h-4.5 text-muted group-hover:text-text-secondary transition-colors" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {problems && problems.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-text-secondary">
            Showing {page * 20 + 1}–{Math.min((page + 1) * 20, problems.totalElements)} of {problems.totalElements}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded-xl border border-border bg-surface hover:bg-bg-secondary disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(problems.totalPages - 1, page + 1))}
              disabled={page >= problems.totalPages - 1}
              className="p-2 rounded-xl border border-border bg-surface hover:bg-bg-secondary disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
