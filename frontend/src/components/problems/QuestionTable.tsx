import React from 'react';
import { Code, FileText, ExternalLink, Check, Star } from 'lucide-react';

interface CompanyInfo {
  name: string;
  logoUrl: string;
}

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  acceptanceRate: number;
  topics: string[];
  companies: string[];
  companyInfo?: CompanyInfo[];
  solved: boolean;
  bookmarked: boolean;
  leetcodeUrl?: string;
  gfgUrl?: string;
}

interface QuestionTableProps {
  problems: Problem[];
  onSolveToggle: (id: number) => void;
  onBookmarkToggle: (id: number) => void;
  onSolve: (problem: Problem) => void;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  problems,
  onSolveToggle,
  onBookmarkToggle,
  onSolve,
}) => {
  if (problems.length === 0) {
    return (
      <div className="py-8 text-center text-[#6B7280]">
        <p className="font-semibold text-sm text-text">No Problems Found</p>
        <p className="text-xs mt-1">No questions match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-premium shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-bold text-secondaryText uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Problem Name & Companies</th>
              <th className="py-3 px-4 w-28 text-center">Difficulty</th>
              <th className="py-3 px-4 w-24 text-center">Solve</th>
              <th className="py-3 px-4 w-48">Platforms</th>
              <th className="py-3 px-4 w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
            {problems.map((prob) => (
              <tr key={prob.id} className="hover:bg-[#FAFBFC] transition group">
                {/* Status Checkbox */}
                <td className="py-4 px-4 text-center align-middle">
                  <button
                    onClick={() => onSolveToggle(prob.id)}
                    className={`w-5.5 h-5.5 mx-auto rounded-md border flex items-center justify-center transition hover:scale-105 active:scale-95 ${
                      prob.solved
                        ? 'bg-success/15 border-success text-success'
                        : 'border-slate-300 hover:border-success text-transparent hover:text-success/50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </button>
                </td>

                {/* Name & Company Logos */}
                <td className="py-4 px-4 align-middle">
                  <div className="flex flex-col">
                    <span 
                      onClick={() => onSolve(prob)}
                      className="font-semibold text-text hover:text-primary cursor-pointer transition text-sm"
                    >
                      {prob.title}
                    </span>
                    
                    {/* Company info with logos */}
                    {prob.companyInfo && prob.companyInfo.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {prob.companyInfo.map((comp, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                          >
                            {comp.logoUrl ? (
                              <img
                                src={comp.logoUrl}
                                className="w-3.5 h-3.5 object-contain"
                                alt={comp.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            )}
                            <span>{comp.name}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      prob.companies && prob.companies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {prob.companies.map((c, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </td>

                {/* Difficulty */}
                <td className="py-4 px-4 text-center align-middle">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    prob.difficulty === 'EASY' ? 'bg-green-50 text-success' :
                    prob.difficulty === 'MEDIUM' ? 'bg-amber-50 text-warning' :
                    'bg-red-50 text-danger'
                  }`}>
                    {prob.difficulty}
                  </span>
                </td>

                {/* Solve Button */}
                <td className="py-4 px-4 text-center align-middle">
                  <button
                    onClick={() => onSolve(prob)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-premium shadow-sm transition active:scale-95"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Solve</span>
                  </button>
                </td>

                {/* Platform Links */}
                <td className="py-4 px-4 align-middle">
                  <div className="flex items-center gap-2">
                    {prob.leetcodeUrl && (
                      <a
                        href={prob.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FEE2E2] hover:text-[#DC2626] border border-[#FED7AA] rounded-premium text-[11px] font-bold transition"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {prob.gfgUrl && (
                      <a
                        href={prob.gfgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] hover:text-[#15803D] border border-[#BBF7D0] rounded-premium text-[11px] font-bold transition"
                      >
                        <span>GFG</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-center align-middle">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onSolve(prob)}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition"
                      title="Open Scratchpad / Notes"
                    >
                      <FileText className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => onBookmarkToggle(prob.id)}
                      className={`p-1.5 hover:bg-slate-100 rounded-lg transition ${
                        prob.bookmarked ? 'text-[#8B5CF6]' : 'text-slate-400 hover:text-[#8B5CF6]'
                      }`}
                      title={prob.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                    >
                      <Star className={`w-4.5 h-4.5 ${prob.bookmarked ? 'fill-accent text-accent' : ''}`} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
