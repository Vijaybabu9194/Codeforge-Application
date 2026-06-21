import React from 'react';
import { Search, Bell, Command, Menu } from 'lucide-react';

export const DashboardTopbar: React.FC = () => {
  return (
    <header className="h-[68px] bg-dash-sidebar border-b border-dash-border flex items-center justify-between px-8 sticky top-0 z-20 select-none">
      {/* Left side: Hamburger + Search Bar */}
      <div className="flex items-center gap-4 w-full max-w-[520px]">
        <button className="p-2 rounded-lg hover:bg-white/[0.04] text-dash-textSecondary hover:text-white transition">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-textMuted" />
          <input
            type="text"
            placeholder="Search problems, topics or companies..."
            className="w-full h-10 pl-11 pr-16 rounded-xl bg-[#111827] border border-dash-border text-[13px] text-white placeholder-dash-textMuted focus:outline-none focus:border-dash-blue/30 transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/[0.05] px-2 py-0.5 rounded-md">
            <Command className="w-3 h-3 text-dash-textMuted" />
            <span className="text-[11px] text-dash-textMuted font-medium">K</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/[0.05] transition">
          <Bell className="w-5 h-5 text-dash-textSecondary" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-dash-red text-[9px] text-white font-bold flex items-center justify-center border-2 border-dash-sidebar">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-dash-border">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dash-blue to-dash-purple flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="url(#avatarDash)" />
              <defs>
                <linearGradient id="avatarDash" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4A6CF7" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <path d="M 10 32 C 10 25 14 21 20 21 C 26 21 30 25 30 32 Z" fill="#FFFFFF" fillOpacity="0.85" />
              <circle cx="20" cy="15" r="6" fill="#FFFFFF" fillOpacity="0.85" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[13px] font-bold text-white leading-tight">Vijay_07</div>
            <div className="text-[10px] text-dash-amber font-semibold">Premium</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
