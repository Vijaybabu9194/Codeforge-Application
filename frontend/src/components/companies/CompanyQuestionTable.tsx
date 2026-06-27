import React from 'react';
import { Check, Search, Zap } from 'lucide-react';
import { LeetCodeLogo, GfgLogo } from '../CompanyLogos';

interface CompanyQuestion {
  id: number;
  title: string;
  difficulty: string;
  timesAsked: number;
  frequency: string;
  acceptanceRate: number;
  solved: boolean;
  leetcodeUrl?: string;
  gfgUrl?: string;
}

interface CompanyQuestionTableProps {
  questions: CompanyQuestion[];
  onSolveToggle: (id: number) => void;
}

export const CompanyQuestionTable: React.FC<CompanyQuestionTableProps> = ({
  questions,
  onSolveToggle,
}) => {
  const getDiffBadge = (diff: string) => {
    const d = diff.toUpperCase();
    if (d === 'EASY') return 'text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20';
    if (d === 'MEDIUM') return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20';
    return 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20';
  };

  const getFreqBadge = (freq: string) => {
    if (!freq) return 'text-[#7B8AB8] bg-white/[0.04] border border-white/[0.06]';
    const f = freq.replace(/_/g, ' ').toLowerCase();
    if (f.includes('very high')) return 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20';
    if (f.includes('high')) return 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20';
    if (f.includes('medium')) return 'text-[#4A6CF7] bg-[#4A6CF7]/10 border border-[#4A6CF7]/20';
    return 'text-[#7B8AB8] bg-white/[0.04] border border-white/[0.06]';
  };

  const getFreqLabel = (freq: string) => {
    if (!freq) return 'Normal';
    return freq.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getFreqIcon = (freq: string) => {
    if (!freq) return null;
    const f = freq.toLowerCase();
    if (f.includes('very_high') || f.includes('very high')) return '🔥';
    if (f.includes('high')) return '⚡';
    return null;
  };

  return (
    <div className="bg-[#0F1526] border border-white/[0.05] rounded-2xl overflow-hidden">
      {/* Table header section */}
      <div className="px-5 py-3.5 flex items-center justify-between bg-white/[0.015] border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 rounded-full bg-[#4A6CF7] flex-shrink-0" />
          <h2 className="text-[13px] font-bold text-white">Questions List</h2>
          <span className="text-[10px] font-black text-[#4A5580] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
            {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#4A5580]" />
          <span className="text-[10px] text-[#4A5580] font-semibold">Sorted by frequency</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-dash-border bg-slate-100/60 dark:bg-white/[0.01]">
              <th className="py-2.5 px-3 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-12 border-r border-dash-border">
                Status
              </th>
              <th className="py-2.5 px-4 text-left text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider border-r border-dash-border">
                Question
              </th>
              <th className="py-2.5 px-4 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-24 border-r border-dash-border">
                Practice
              </th>
              <th className="py-2.5 px-4 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-28 border-r border-dash-border">
                Times Asked
              </th>
              <th className="py-2.5 px-4 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-32 border-r border-dash-border">
                Frequency
              </th>
              <th className="py-2.5 px-4 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-28 border-r border-dash-border">
                Difficulty
              </th>
              <th className="py-2.5 px-4 text-center text-[10px] font-black text-slate-900 dark:text-[#7B8AB8] uppercase tracking-wider w-24">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center">
                      <Search className="w-5 h-5 text-[#4A5580]" />
                    </div>
                    <p className="text-[#7B8AB8] font-bold text-sm">No questions available</p>
                    <p className="text-[#4A5580] text-xs font-medium">This company has no questions yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              questions.map((q, idx) => (
                <tr
                  key={q.id}
                  className={`border-b border-dash-border hover:bg-slate-100/50 dark:hover:bg-white/[0.025] transition-colors duration-150 group ${
                    idx === questions.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {/* Status */}
                  <td className="py-3 px-3 text-center align-middle w-12 border-r border-dash-border">
                    <button
                      onClick={() => onSolveToggle(q.id)}
                      className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                        q.solved
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                          : 'border-slate-700 dark:border-white/20 bg-slate-100 dark:bg-transparent text-transparent hover:border-emerald-500 hover:text-emerald-500'
                      }`}
                      title={q.solved ? 'Mark as unsolved' : 'Mark as solved'}
                    >
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </button>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4 align-middle border-r border-dash-border">
                    <span className="text-[13px] font-medium text-slate-900 dark:text-[#C8D1E8] group-hover:text-[#0284C7] dark:group-hover:text-white transition-colors duration-150 block leading-snug">
                      {q.title}
                    </span>
                  </td>

                  {/* Practice — LeetCode + GFG icons */}
                  <td className="py-3 px-4 text-center align-middle w-24 border-r border-white/[0.05]">
                    <div className="flex items-center justify-center gap-5 scale-75 origin-center">
                      {q.leetcodeUrl ? (
                        <a
                          href={q.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Solve on LeetCode"
                          className="block hover:scale-110 active:scale-95 transition-transform duration-200"
                        >
                          <LeetCodeLogo />
                        </a>
                      ) : (
                        <span title="Not on LeetCode" className="opacity-25 cursor-not-allowed">
                          <LeetCodeLogo disabled />
                        </span>
                      )}
                      {q.gfgUrl ? (
                        <a
                          href={q.gfgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Solve on GeeksForGeeks"
                          className="block hover:scale-110 active:scale-95 transition-transform duration-200"
                        >
                          <GfgLogo />
                        </a>
                      ) : (
                        <span title="Not on GFG" className="opacity-25 cursor-not-allowed">
                          <GfgLogo disabled />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Times Asked */}
                  <td className="py-3 px-4 text-center align-middle w-28 border-r border-white/[0.05]">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-[#4A5580]" />
                      <span className="text-sm font-black text-white">{q.timesAsked}</span>
                    </div>
                  </td>

                  {/* Frequency */}
                  <td className="py-3 px-4 text-center align-middle w-32 border-r border-white/[0.05]">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${getFreqBadge(q.frequency)}`}>
                      {getFreqIcon(q.frequency) && <span>{getFreqIcon(q.frequency)}</span>}
                      {getFreqLabel(q.frequency)}
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3 px-4 text-center align-middle w-28 border-r border-white/[0.05]">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide ${getDiffBadge(q.difficulty)}`}>
                      {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase()}
                    </span>
                  </td>

                  {/* Acceptance */}
                  <td className="py-3 px-4 text-center align-middle w-24">
                    <span className="text-[12px] font-bold text-[#7B8AB8] group-hover:text-[#C8D1E8] transition-colors">
                      {q.acceptanceRate != null ? `${q.acceptanceRate.toFixed(1)}%` : '—'}
                    </span>
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

export default CompanyQuestionTable;
