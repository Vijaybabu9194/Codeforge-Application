import { PanelLeftClose } from 'lucide-react';

const TOPIC_ICONS: Record<string, string> = {
  'Arrays': '📊', 'Strings': '🔤', 'Linked List': '🔗', 'Stack': '📚', 'Queue': '📋',
  'Trees': '🌳', 'BST': '🌲', 'Heap': '⛰️', 'Graph': '🕸️', 'Dynamic Programming': '💡',
  'Greedy': '🎯', 'Backtracking': '↩️', 'Bit Manipulation': '⚡', 'Math': '🔢',
  'Sorting': '📈', 'Searching': '🔍',
};

interface Topic {
  id: number;
  name: string;
  problemCount: number;
}

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopic: number | null;
  setSelectedTopic: (id: number | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setPage: (page: number) => void;
}

export default function TopicSidebar({
  topics,
  selectedTopic,
  setSelectedTopic,
  sidebarOpen,
  setSidebarOpen,
  setPage,
}: TopicSidebarProps) {
  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border transition-all duration-300">
      <div className="p-5 h-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Topics</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-bg-secondary rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <div className="space-y-0.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 custom-scrollbar">
          <button
            onClick={() => {
              setSelectedTopic(null);
              setPage(0);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-none text-left ${
              !selectedTopic
                ? 'bg-primary/5 text-primary'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
            }`}
          >
            <span>📋</span>
            All Problems
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTopic(t.id);
                setPage(0);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-none text-left ${
                selectedTopic === t.id
                  ? 'bg-primary/5 text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text'
              }`}
            >
              <span className="flex items-center gap-3">
                <span>{TOPIC_ICONS[t.name] || '📌'}</span>
                {t.name}
              </span>
              <span className="text-xs text-muted">{t.problemCount}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
