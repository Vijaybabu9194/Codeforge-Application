import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  detail: string;
  difficulty: string;
  createdAt: string;
}

interface RecentActivityProps {
  activityItems: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activityItems }) => {
  return (
    <div className="bg-white border border-border rounded-premium p-6 shadow-card flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-text flex items-center gap-2 mb-6">
          <Layers className="w-4 h-4 text-primary" />
          <span>Recent Submissions</span>
        </h2>

        <div className="space-y-6 overflow-y-auto max-h-[340px] pr-2">
          {activityItems.map((act) => (
            <div key={act.id} className="flex gap-4 relative group">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-semibold ${
                  act.difficulty === 'Easy' ? 'bg-green-50 text-success' :
                  act.difficulty === 'Medium' ? 'bg-amber-50 text-warning' :
                  act.difficulty === 'Hard' ? 'bg-red-50 text-danger' :
                  'bg-indigo-50 text-primary'
                }`}>
                  {act.difficulty ? act.difficulty[0] : 'C'}
                </div>
                <div className="w-[1px] h-full bg-border mt-2 group-last:hidden" />
              </div>
              <div className="space-y-1 py-0.5">
                <p className="text-sm font-semibold text-text">{act.description}</p>
                <p className="text-xs text-secondaryText">{act.detail}</p>
                <span className="text-[10px] text-muted block">
                  {new Date(act.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#E5E7EB] mt-4">
        <button className="w-full flex items-center justify-between text-xs text-secondaryText hover:text-text font-semibold group transition">
          <span>View All Solved Problems</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
};
export default RecentActivity;
