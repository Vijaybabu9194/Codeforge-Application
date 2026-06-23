import React from 'react';
import {
  Home, Code2, Building2, Trophy, MessageSquare, Map, User
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'problems', label: 'Problems', icon: Code2 },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'contests', label: 'Contests', icon: Trophy },
  { id: 'discuss', label: 'Discuss', icon: MessageSquare },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-[240px] h-screen bg-dash-sidebar flex flex-col border-r border-dash-border fixed left-0 top-0 z-30 select-none">
      {/* Logo */}
      <div className="flex items-center px-6 h-[68px] border-b border-dash-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-dash-blue flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 8l-4 4 4 4" />
              <path d="M17 8l4 4-4 4" />
              <path d="M14 4l-4 16" />
            </svg>
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight">Codeforge</span>
        </div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto dash-scroll flex flex-col pb-4">
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`dash-nav-item w-full py-2 px-3 text-[13px] ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-[17px] h-[17px] flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
