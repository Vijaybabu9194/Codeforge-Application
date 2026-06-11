import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Topic {
  id: number;
  name: string;
  icon: string;
  problemCount: number;
}

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopic: number | null;
  onTopicSelect: (id: number | null) => void;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
  sidebarOpen,
  onSidebarClose,
}) => {
  return (
    <aside className={`border-r border-[#E5E7EB] bg-white transition-all duration-300 ${
      sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
    }`}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <span className="text-xs font-bold text-secondaryText tracking-wide">DSA TOPICS</span>
        <button 
          onClick={onSidebarClose}
          className="text-secondaryText hover:text-text md:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => onTopicSelect(t.id)}
            className={`w-full text-left px-3 py-2 rounded-premium text-sm font-semibold flex items-center justify-between transition-colors duration-150 ${
              selectedTopic === t.id ? 'bg-indigo-50 text-primary' : 'text-secondaryText hover:bg-secondaryBg hover:text-text'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base">{t.icon || '💻'}</span>
              <span className="truncate">{t.name}</span>
            </div>
            <span className="text-[10px] bg-secondaryBg text-muted px-2 py-0.5 rounded-full font-medium">{t.problemCount}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default TopicSidebar;
