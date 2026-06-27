import React from 'react';
import { FileText, Check, Plus } from 'lucide-react';
import { LeetCodeLogo, GfgLogo, CompanyLogo } from '../CompanyLogos';

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
  onSolve: (problem: Problem) => void;
  onEditNote: (problem: Problem) => void;
  problemNotes: Record<number, string>;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  problems,
  onSolveToggle,
  onSolve,
  onEditNote,
  problemNotes,
}) => {
  if (problems.length === 0) {
    return (
      <div className="py-6 text-center text-[#6B7280]">
        <p className="font-semibold text-xs text-[#111827]">No Problems Found</p>
        <p className="text-[11px] mt-1 text-[#6B7280]">No questions match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="dash-card border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-dash-border bg-white/[0.02] text-[10px] font-extrabold text-dash-textMuted uppercase tracking-wider select-none">
              <th className="py-2.5 px-2 w-10 text-center">Status</th>
              <th className="py-2.5 px-2 text-left max-w-[240px]">Problem</th>
              <th className="py-2.5 px-2 w-16 text-center">Solve</th>
              <th className="py-2.5 px-2 w-16 text-center">Resource</th>
              <th className="py-2.5 px-2 w-20 text-center">Practice</th>
              <th className="py-2.5 px-2 w-12 text-center">Note</th>
              <th className="py-2.5 px-2 w-32">Companies</th>
              <th className="py-2.5 px-2 w-20 text-center">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border text-[11.5px] font-semibold text-slate-900 dark:text-white">
            {problems.map((prob) => {
              return (
                <tr key={prob.id} className="hover:bg-white/[0.04] transition group">
                  {/* Status Checkbox */}
                  <td className="py-1.5 px-2 text-center align-middle w-10">
                    <button
                      onClick={() => onSolveToggle(prob.id)}
                      className={`w-4.5 h-4.5 mx-auto rounded-md border flex items-center justify-center transition hover:scale-105 active:scale-95 ${
                        prob.solved
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                          : 'border-slate-300 dark:border-white/20 text-transparent hover:border-emerald-500 hover:text-emerald-500/50'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                    </button>
                  </td>

                  {/* Problem Title */}
                  <td className="py-1.5 px-2 align-middle text-left font-extrabold text-slate-900 dark:text-white group-hover:text-[#4A6CF7] dark:group-hover:text-[#38BDF8] cursor-pointer transition max-w-[240px]">
                    <span onClick={() => onSolve(prob)} className="truncate block" title={prob.title}>
                      {prob.title}
                    </span>
                  </td>

                  {/* Solve Button */}
                  <td className="py-1.5 px-2 text-center align-middle w-16">
                    <button
                      onClick={() => onSolve(prob)}
                      className="px-2.5 py-0.5 bg-primary hover:bg-primary-hover text-white rounded-full text-[8.5px] font-black uppercase tracking-wider transition-all duration-200"
                    >
                      Solve
                    </button>
                  </td>

                  {/* Resource Column */}
                  <td className="py-1.5 px-2 text-center align-middle w-16">
                    <button
                      onClick={() => onSolve(prob)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all mx-auto block"
                      title="Open Scratchpad & Resources"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Practice Platforms Column */}
                  <td className="py-1.5 px-2 text-center align-middle w-20">
                    <div className="flex items-center justify-center gap-4">
                      {prob.leetcodeUrl ? (
                        <a href={prob.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="block scale-[0.8] origin-center">
                          <LeetCodeLogo />
                        </a>
                      ) : (
                        <LeetCodeLogo disabled />
                      )}
                      {prob.gfgUrl ? (
                        <a href={prob.gfgUrl} target="_blank" rel="noopener noreferrer" className="block scale-[0.8] origin-center">
                          <GfgLogo />
                        </a>
                      ) : (
                        <GfgLogo disabled />
                      )}
                    </div>
                  </td>

                  {/* Note Column Cell */}
                  <td className="py-1.5 px-2 text-center align-middle w-12">
                    <button
                      onClick={() => onEditNote(prob)}
                      className={`w-5.5 h-5.5 mx-auto rounded-full flex items-center justify-center border transition-all duration-200 ${
                        problemNotes[prob.id]
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.15)]'
                          : 'bg-slate-50 border-slate-300 text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-slate-100'
                      }`}
                      title={problemNotes[prob.id] ? "View/Edit Note" : "Add Note"}
                    >
                      <Plus className="w-2.5 h-2.5 stroke-[3]" />
                    </button>
                  </td>

                  {/* Companies Logos */}
                  <td className="py-1.5 px-2 w-32 align-middle">
                    <div className="flex items-center gap-3 flex-wrap">
                      {prob.companyInfo && prob.companyInfo.length > 0 ? (
                        prob.companyInfo.slice(0, 4).map((comp, cIdx) => (
                          <div key={cIdx} className="tooltip-trigger relative">
                            <CompanyLogo name={comp.name} logoUrl={comp.logoUrl} className="w-5.5 h-5.5" />
                            <div className="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-black/95 text-[9px] font-bold px-2 py-0.5 rounded border border-white/20 whitespace-nowrap opacity-0 pointer-events-none transition duration-150 z-20 shadow-lg" style={{ color: '#FFFFFF' }}>
                              {comp.name}
                            </div>
                          </div>
                        ))
                      ) : prob.companies && prob.companies.length > 0 ? (
                        prob.companies.slice(0, 4).map((cName, cIdx) => (
                          <div key={cIdx} className="tooltip-trigger relative">
                            <CompanyLogo name={cName} className="w-5.5 h-5.5" />
                            <div className="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-black/95 text-[9px] font-bold px-2 py-0.5 rounded border border-white/20 whitespace-nowrap opacity-0 pointer-events-none transition duration-150 z-20 shadow-lg" style={{ color: '#FFFFFF' }}>
                              {cName}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic font-medium pl-1">General</span>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-1.5 px-2 text-center border border-slate-100 align-middle w-20">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      prob.difficulty === 'EASY' 
                        ? 'bg-green-50 text-success border border-success/20' 
                        : prob.difficulty === 'MEDIUM' 
                        ? 'bg-amber-50 text-warning border border-warning/20' 
                        : 'bg-red-50 text-danger border border-danger/20'
                    }`}>
                      {prob.difficulty === 'EASY' ? 'Easy' : prob.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
