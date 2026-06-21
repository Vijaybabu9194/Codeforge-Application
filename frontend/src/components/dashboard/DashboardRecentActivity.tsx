import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  difficulty: string;
  createdAt: string;
}

interface DashboardRecentActivityProps {
  activityItems?: ActivityItem[];
}

const formatRelativeTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  } catch (e) {
    return 'Recently';
  }
};

const capitalizeWord = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({ activityItems = [] }) => {
  // Use first 5 items for display
  const displayActivities = activityItems.slice(0, 5);

  return (
    <div className="dash-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Recent Activity</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">See all</button>
      </div>

      <div className="space-y-4 flex-1">
        {displayActivities.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-[13px] text-dash-textSecondary font-medium">
            No recent submissions found
          </div>
        ) : (
          displayActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle className="w-4 h-4 text-dash-green flex-shrink-0" />
                <span className="text-[13px] text-white font-medium truncate">{act.description}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`dash-badge ${
                  act.difficulty?.toLowerCase() === 'easy' ? 'dash-badge-easy' :
                  act.difficulty?.toLowerCase() === 'medium' ? 'dash-badge-medium' :
                  'dash-badge-hard'
                }`}>
                  {capitalizeWord(act.difficulty)}
                </span>
                <span className="text-[11px] text-dash-textMuted font-medium min-w-[70px] text-right">
                  {formatRelativeTime(act.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardRecentActivity;
