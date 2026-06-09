import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Home, Code2, Building2, User, Bell, LogOut, Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/problems', label: 'Problems', icon: Code2 },
  { path: '/companies', label: 'Company Questions', icon: Building2 },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <NavLink to="/home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">Codeforge</span>
          </NavLink>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#6366F1] card-shadow'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: User */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg transition-colors" style={{ '--hover': 'var(--color-bg-secondary)' } as any}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-danger)' }} />
            </button>
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-7 h-7 rounded-full"
                style={{ backgroundColor: '#EEF2FF' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              title="Logout"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2'; (e.currentTarget as HTMLElement).style.color = '#EF4444'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
            >
              <LogOut className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <button
              className="md:hidden p-2 rounded-lg border-none bg-transparent cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-1"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-[#6366F1]'
                      : 'text-[#64748B]'
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#EEF2FF' : '',
                })}
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="pt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
