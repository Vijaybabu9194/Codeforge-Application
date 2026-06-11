import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface CompanyQuestion {
  id: number;
  title: string;
  difficulty: string;
  timesAsked: number;
  frequency: string;
  acceptanceRate: number;
  solved: boolean;
}

interface CompanyQuestionTableProps {
  questions: CompanyQuestion[];
  onSolveToggle: (id: number) => void;
}

export const CompanyQuestionTable: React.FC<CompanyQuestionTableProps> = ({
  questions,
  onSolveToggle,
}) => {
  return (
    <div className="bg-white border border-border rounded-premium shadow-card overflow-hidden">
      <div className="p-4 border-b border-border bg-[#F5F7FA]">
        <h2 className="text-sm font-bold text-text">Questions List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#FAFBFC] text-xs font-bold text-secondaryText uppercase tracking-wider">
              <th className="py-4 px-6 w-16 text-center">Status</th>
              <th className="py-4 px-6">Question Name</th>
              <th className="py-4 px-6 w-32 text-center">Times Asked</th>
              <th className="py-4 px-6 w-32">Frequency</th>
              <th className="py-4 px-6 w-32">Difficulty</th>
              <th className="py-4 px-6 w-32">Acceptance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#111827]">
            {questions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                  <HelpCircle className="w-10 h-10 text-muted mx-auto mb-2" />
                  <p className="font-bold text-text">No company questions available</p>
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="hover:bg-[#FAFBFC] transition">
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onSolveToggle(q.id)}
                      className={`focus:outline-none transition hover:scale-110 ${
                        q.solved ? 'text-success' : 'text-[#94A3B8] hover:text-[#22C55E]'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 ${q.solved ? 'fill-green-50' : ''}`} />
                    </button>
                  </td>
                  <td className="py-4 px-6 font-semibold text-text">
                    {q.title}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-text">
                    {q.timesAsked}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      q.frequency === 'Very High' ? 'bg-red-50 text-danger border-red-100' :
                      q.frequency === 'High' ? 'bg-orange-50 text-warning border-orange-100' :
                      'bg-indigo-50 text-primary border-indigo-100'
                    }`}>
                      {q.frequency}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      q.difficulty.toUpperCase() === 'EASY' ? 'bg-green-50 text-success' :
                      q.difficulty.toUpperCase() === 'MEDIUM' ? 'bg-amber-50 text-warning' :
                      'bg-red-50 text-danger'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-secondaryText">
                    {q.acceptanceRate?.toFixed(1)}%
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
