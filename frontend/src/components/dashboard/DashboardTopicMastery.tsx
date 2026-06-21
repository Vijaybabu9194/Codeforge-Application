import React from 'react';
import { Braces, GitBranch, TreePine, Type } from 'lucide-react';

interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
  percentage: number;
}

interface DashboardTopicMasteryProps {
  progress?: {
    topicMastery: TopicProgress[];
  } | null;
}

const defaultTopics = [
  { topic: 'Arrays', percentage: 85, solved: 17, total: 20 },
  { topic: 'Dynamic Programming', percentage: 72, solved: 18, total: 25 },
  { topic: 'Graphs', percentage: 68, solved: 17, total: 25 },
  { topic: 'Trees', percentage: 64, solved: 16, total: 25 },
  { topic: 'String', percentage: 60, solved: 12, total: 20 },
];

const getIconAndColor = (topicName: string, index: number) => {
  const colors = ['#4A6CF7', '#22D3EE', '#A78BFA', '#4ADE80', '#F59E0B'];
  const color = colors[index % colors.length];
  
  let icon = Braces;
  const name = topicName.toLowerCase();
  if (name.includes('tree') || name.includes('trie')) icon = TreePine;
  else if (name.includes('graph') || name.includes('dfs') || name.includes('bfs') || name.includes('path')) icon = GitBranch;
  else if (name.includes('string') || name.includes('text') || name.includes('pattern')) icon = Type;
  
  return { icon, color };
};

export const DashboardTopicMastery: React.FC<DashboardTopicMasteryProps> = ({ progress }) => {
  const topicData = progress?.topicMastery && progress.topicMastery.length > 0
    ? progress.topicMastery.slice(0, 5) // Show top 5 topics
    : defaultTopics;

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Topic Mastery</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">View all</button>
      </div>

      <div className="space-y-4">
        {topicData.map((topic, index) => {
          const { icon: Icon, color } = getIconAndColor(topic.topic, index);
          return (
            <div key={topic.topic} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-white font-medium truncate">{topic.topic}</span>
                  <span className="text-[11px] text-dash-textMuted font-medium">{topic.solved}/{topic.total} Solved</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[12px] text-dash-textSecondary font-semibold w-[36px] text-right">{topic.percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTopicMastery;
