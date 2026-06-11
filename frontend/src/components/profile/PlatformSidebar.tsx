import React from 'react';

interface PlatformItem {
  platform: string;
  username: string;
  problemsSolved: number;
  contestRating: number;
  connected: boolean;
}

interface PlatformSidebarProps {
  platforms: PlatformItem[];
  selectedPlatform: string;
  onPlatformSelect: (name: string) => void;
  loadingList: boolean;
}

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  loadingList,
}) => {
  const getPlatformIcon = (name: string) => {
    switch (name) {
      case 'LeetCode': return '🟡';
      case 'Codeforces': return '🔴';
      case 'CodeChef': return '🟤';
      case 'GeeksForGeeks': return '🟢';
      default: return '💻';
    }
  };

  return (
    <aside className="w-64 border-r border-[#E5E7EB] bg-white p-4 space-y-4">
      <div>
        <span className="text-xs font-bold text-secondaryText tracking-wide block mb-3">CODING PLATFORMS</span>
        <div className="space-y-1.5">
          {loadingList ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-premium animate-pulse" />
            ))
          ) : (
            platforms.map((p) => (
              <button
                key={p.platform}
                onClick={() => onPlatformSelect(p.platform)}
                className={`w-full text-left px-3 py-2.5 rounded-premium text-sm font-semibold flex items-center justify-between border transition ${
                  selectedPlatform === p.platform 
                    ? 'bg-indigo-50 border-indigo-100 text-primary' 
                    : 'bg-white border-transparent text-secondaryText hover:bg-secondaryBg hover:text-text'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-lg">{getPlatformIcon(p.platform)}</span>
                  <span className="truncate">{p.platform}</span>
                </div>
                {p.connected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                ) : (
                  <span className="text-[10px] text-muted">Disconnect</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
export default PlatformSidebar;
