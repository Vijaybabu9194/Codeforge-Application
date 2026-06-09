import { CheckCircle2 } from 'lucide-react';

const COLORS = { EASY: '#22C55E', MEDIUM: '#F59E0B', HARD: '#EF4444' };
const frequencyColor: Record<string, { text: string; bg: string }> = {
  VERY_HIGH: { text: '#EF4444', bg: '#EF444410' },
  HIGH: { text: '#F59E0B', bg: '#F59E0B10' },
  MEDIUM: { text: '#6366F1', bg: '#6366F110' },
  LOW: { text: '#6B7280', bg: '#6B728010' },
};

interface Question {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timesAsked: number;
  frequency: string;
  acceptanceRate: number;
  solved: boolean;
}

interface CompanyQuestionTableProps {
  questions: Question[];
  loading: boolean;
}

export default function CompanyQuestionTable({ questions, loading }: CompanyQuestionTableProps) {
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl card-shadow overflow-hidden mt-6">
        <table className="w-full">
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="px-5 py-4">
                  <div className="h-4 bg-bg-secondary rounded-lg animate-pulse w-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-surface rounded-2xl card-shadow p-8 text-center text-text-secondary mt-6">
        No questions found for this company.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl card-shadow overflow-hidden mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase w-10">✓</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase">Problem</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase w-24">Difficulty</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase w-24">Asked</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase w-24">Frequency</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-secondary uppercase w-28">Acceptance</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border-b border-border/50 hover:bg-bg/50 transition-colors">
              <td className="px-5 py-3.5">
                {q.solved ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
              </td>
              <td className="px-5 py-3.5 text-sm font-medium text-text">{q.title}</td>
              <td className="px-5 py-3.5">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
                  style={{
                    color: COLORS[q.difficulty as keyof typeof COLORS],
                    backgroundColor: `${COLORS[q.difficulty as keyof typeof COLORS]}10`,
                  }}
                >
                  {q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-text-secondary">{q.timesAsked}×</td>
              <td className="px-5 py-3.5">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
                  style={{
                    color: frequencyColor[q.frequency]?.text,
                    backgroundColor: frequencyColor[q.frequency]?.bg,
                  }}
                >
                  {q.frequency.replace('_', ' ')}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-text-secondary">{q.acceptanceRate?.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
