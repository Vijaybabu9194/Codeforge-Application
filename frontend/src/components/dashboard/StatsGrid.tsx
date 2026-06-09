import { useEffect, useRef } from 'react';
import { Code2, Flame, Trophy, Building2, Clock, Bookmark } from 'lucide-react';

interface Stats {
  problemsSolved: number;
  contestRating: number;
  currentStreak: number;
  companiesCovered: number;
  studyHours: number;
  bookmarks: number;
}

const cardConfigs = [
  { key: 'problemsSolved', label: 'Problems Solved', icon: Code2, color: '#6366F1', format: (v: number) => v.toString() },
  { key: 'contestRating', label: 'Contest Rating', icon: Trophy, color: '#8B5CF6', format: (v: number) => v.toString() },
  { key: 'currentStreak', label: 'Current Streak', icon: Flame, color: '#F59E0B', format: (v: number) => `${v} days` },
  { key: 'companiesCovered', label: 'Companies Covered', icon: Building2, color: '#22C55E', format: (v: number) => v.toString() },
  { key: 'studyHours', label: 'Study Hours', icon: Clock, color: '#6366F1', format: (v: number) => `${v}h` },
  { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, color: '#EF4444', format: (v: number) => v.toString() },
];

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let start = 0;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el!.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target, duration]);

  return <span ref={ref}>0</span>;
}

export default function StatsGrid({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cardConfigs.map(({ key, label, icon: Icon, color, format }) => {
        const value = stats[key as keyof Stats] as number;
        return (
          <div
            key={key}
            className="bg-surface rounded-2xl p-5 card-shadow hover:translate-y-[-4px] transition-all duration-300 cursor-default group border border-transparent hover:border-primary/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${color}10` }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">
              <AnimatedCounter target={typeof value === 'number' ? Math.round(value) : 0} />
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
