import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Command, Menu, Sun, Moon, LogOut, User, Settings, CheckCheck, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface DashboardTopbarProps {
  onNavigateTab: (tab: string) => void;
  onOpenAccountModal: (modal: 'edit' | 'settings') => void;
}

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'streak' | 'solved' | 'welcome';
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ onNavigateTab, onOpenAccountModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const dark = theme === 'dark';

  // State for Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Daily Streak Active! 🔥', desc: 'You have maintained a 12-day problem solving streak.', time: '10m ago', read: false, type: 'streak' },
    { id: 2, title: 'Submission Accepted ⚡', desc: 'Two Sum solved with 98.4% runtime speed percentile.', time: '1h ago', read: false, type: 'solved' },
    { id: 3, title: 'Welcome to CodeForge 🎉', desc: 'Your workspace environment is fully configured.', time: '1d ago', read: true, type: 'welcome' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click Outside Listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-[68px] bg-dash-sidebar border-b border-dash-border flex items-center justify-between px-8 sticky top-0 z-40 select-none">
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

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-white/[0.08] text-dash-textSecondary hover:text-white transition-all duration-200 flex items-center justify-center border border-transparent hover:border-white/[0.08]"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600/20" />
          )}
        </button>

        {/* Dynamic Notification Bell & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl hover:bg-white/[0.08] text-dash-textSecondary hover:text-white transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-dash-red text-[9px] text-white font-bold flex items-center justify-center border-2 border-dash-sidebar animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border ${dark ? 'border-slate-800 bg-[#090D1A]/95' : 'border-slate-200 bg-white/95'} shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-fadeIn`}>
              <div className={`p-4 border-b ${dark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-bold">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition flex gap-3 ${n.read ? 'opacity-70' : 'bg-sky-500/[0.03]'}`}>
                    <div className="mt-0.5">
                      {n.type === 'streak' && <Flame className="w-4 h-4 text-amber-500" />}
                      {n.type === 'solved' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {n.type === 'welcome' && <Sparkles className="w-4 h-4 text-sky-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-xs font-bold">{n.title}</h4>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Interactive Dropdown */}
        <div className="relative pl-3 border-l border-dash-border" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/[0.06] transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dash-blue to-dash-purple flex items-center justify-center overflow-hidden shadow-md">
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
            <div className="text-left hidden sm:block">
              <div className="text-[13px] font-bold text-white leading-tight">{user?.name || 'Vijay_07'}</div>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-3 w-56 rounded-2xl border ${dark ? 'border-slate-800 bg-[#090D1A]/95 text-white' : 'border-slate-200 bg-white text-slate-900'} shadow-2xl backdrop-blur-xl z-50 p-2 animate-fadeIn`}>
              <div className={`px-3 py-2.5 border-b mb-1 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="text-xs font-black truncate">{user?.name || 'Vijay_07'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'user@codeforge.dev'}</div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateTab('profile');
                  onOpenAccountModal('edit');
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-sky-500/10 hover:text-sky-500 transition cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-sky-500" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateTab('profile');
                  onOpenAccountModal('settings');
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-sky-500/10 hover:text-sky-500 transition cursor-pointer text-left"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Settings</span>
              </button>

              <div className={`my-1 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`} />

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
