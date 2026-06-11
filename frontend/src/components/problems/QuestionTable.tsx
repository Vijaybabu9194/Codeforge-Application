import React from 'react';
import { Bookmark, CheckCircle, HelpCircle } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  acceptanceRate: number;
  topics: string[];
  companies: string[];
  solved: boolean;
  bookmarked: boolean;
}

interface QuestionTableProps {
  problems: Problem[];
  loading: boolean;
  onSolveToggle: (id: number) => void;
  onBookmarkToggle: (id: number) => void;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  problems,
  loading,
  onSolveToggle,
  onBookmarkToggle,
}) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-premium shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F5F7FA] text-xs font-bold text-secondaryText uppercase tracking-wider">
              <th className="py-4 px-6 w-16 text-center">Status</th>
              <th className="py-4 px-6">Problem Name</th>
              <th className="py-4 px-6 w-32">Difficulty</th>
              <th className="py-4 px-6 w-32">Acceptance</th>
              <th className="py-4 px-6">Company Tags</th>
              <th className="py-4 px-6 w-20 text-center">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6 text-center"><div className="w-5 h-5 bg-gray-100 rounded-full mx-auto" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-2/3" /></td>
                  <td className="py-4 px-6"><div className="h-6 bg-gray-100 rounded-premium w-16" /></td>
                  <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                  <td className="py-4 px-6 flex gap-1.5"><div className="h-6 bg-gray-100 rounded-premium w-16" /><div className="h-6 bg-gray-100 rounded-premium w-16" /></td>
                  <td className="py-4 px-6 text-center"><div className="w-4 h-4 bg-gray-100 rounded mx-auto" /></td>
                </tr>
              ))
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                  <HelpCircle className="w-12 h-12 text-muted mx-auto mb-3" />
                  <p className="font-bold text-base text-text">No Problems Found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or search keywords.</p>
                </td>
              </tr>
            ) : (
              problems.map((prob) => (
                <tr key={prob.id} className="hover:bg-[#FAFBFC] transition group">
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onSolveToggle(prob.id)}
                      className={`focus:outline-none transition hover:scale-110 ${
                        prob.solved ? 'text-success' : 'text-[#94A3B8] hover:text-[#22C55E]'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 ${prob.solved ? 'fill-green-50' : ''}`} />
                    </button>
                  </td>
                  <td className="py-4 px-6 font-semibold text-text">
                    <a 
                      href={`https://leetcode.com/problems/${prob.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline transition"
                    >
                      {prob.title}
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      prob.difficulty === 'EASY' ? 'bg-green-50 text-success' :
                      prob.difficulty === 'MEDIUM' ? 'bg-amber-50 text-warning' :
                      'bg-red-50 text-danger'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-secondaryText">
                    {prob.acceptanceRate?.toFixed(1)}%
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {prob.companies?.slice(0, 3).map((c, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] bg-secondaryBg text-secondaryText px-2 py-0.5 rounded-premium border border-border"
                        >
                          {c}
                        </span>
                      ))}
                      {prob.companies?.length > 3 && (
                        <span className="text-[10px] text-muted px-1.5 py-0.5">+{prob.companies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onBookmarkToggle(prob.id)}
                      className={`focus:outline-none transition hover:scale-110 ${
                        prob.bookmarked ? 'text-danger' : 'text-[#94A3B8] hover:text-[#EF4444]'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${prob.bookmarked ? 'fill-danger text-danger' : ''}`} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default QuestionTable;
