import { CheckCircle2, BookOpen, Trophy, Flame, Bookmark } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  detail: string;
  difficulty: string | null;
  createdAt: string;
}

const iconMap: Record<string, typeof CheckCircle2> = {
  SOLVED: CheckCircle2,
  COMPLETED: BookOpen,
  PARTICIPATED: Trophy,
  ACHIEVED: Flame,
  BOOKMARKED: Bookmark,
};

const colorMap: Record<string, string> = {
  SOLVED: '#22C55E',
  COMPLETED: '#6366F1',
  PARTICIPATED: '#8B5CF6',
  ACHIEVED: '#F59E0B',
  BOOKMARKED: '#EF4444',
};

const difficultyColor: Record<string, string> = {
  EASY: '#22C55E',
  MEDIUM: '#F59E0B',
  HARD: '#EF4444',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-surface rounded-2xl p-6 card-shadow h-full">
      <h3 className="text-base font-semibold text-text mb-5">Recent Activity</h3>
      <div className="space-y-0 relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        {activities.map((activity, i) => {
          const Icon = iconMap[activity.type] || CheckCircle2;
          const color = colorMap[activity.type] || '#6B7280';
          return (
            <div key={activity.id || i} className="flex gap-4 py-3 relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text font-medium leading-snug">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {activity.difficulty && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{
                        color: difficultyColor[activity.difficulty],
                        backgroundColor: `${difficultyColor[activity.difficulty]}10`,
                      }}
                    >
                      {activity.difficulty.charAt(0) + activity.difficulty.slice(1).toLowerCase()}
                    </span>
                  )}
                  {activity.detail && !activity.difficulty && (
                    <span className="text-xs text-text-secondary">{activity.detail}</span>
                  )}
                  <span className="text-xs text-muted">{timeAgo(activity.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
