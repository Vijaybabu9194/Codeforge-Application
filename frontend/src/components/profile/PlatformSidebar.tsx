import { CheckCircle2 } from 'lucide-react';

const PLATFORM_ICONS: Record<string, string> = {
  LEETCODE: '🟡',
  GEEKSFORGEEKS: '🟢',
  CODECHEF: '⭐',
  HACKERRANK: '🟩',
  CODEFORCES: '🔵',
};

const PLATFORM_NAMES: Record<string, string> = {
  LEETCODE: 'LeetCode',
  GEEKSFORGEEKS: 'GeeksForGeeks',
  CODECHEF: 'CodeChef',
  HACKERRANK: 'HackerRank',
  CODEFORCES: 'Codeforces',
};

interface Platform {
  platform: string;
  connected: boolean;
}

interface PlatformSidebarProps {
  platforms: Platform[];
  selected: string;
  setSelected: (platform: string) => void;
}

export default function PlatformSidebar({
  platforms,
  selected,
  setSelected,
}: PlatformSidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border p-5">
      <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-4">Platforms</h3>
      <div className="space-y-0.5">
        {platforms.map((p) => (
          <button
            key={p.platform}
            onClick={() => setSelected(p.platform)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border-none text-left ${
              selected === p.platform
                ? 'bg-primary/5 text-primary'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{PLATFORM_ICONS[p.platform] || '💻'}</span>
              {PLATFORM_NAMES[p.platform] || p.platform}
            </span>
            {p.connected && <CheckCircle2 className="w-4 h-4 text-success" />}
          </button>
        ))}
      </div>
    </aside>
  );
}
