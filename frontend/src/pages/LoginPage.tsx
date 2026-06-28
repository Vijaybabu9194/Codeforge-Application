import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Code2, ArrowRight, Sun, Moon, Lock, Mail, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onBackToLanding }) => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('vijay@codeforge.dev');
    setPassword('password123');
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#050A18] text-white' : 'bg-[#F8FAFC] text-slate-900'} relative flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-300`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="px-6 py-5 flex items-center justify-between relative z-20 max-w-7xl mx-auto w-full">
        <button onClick={onBackToLanding} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Codeforge
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={`p-2 rounded-xl border transition ${dark ? 'border-slate-800 bg-slate-900/60 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={onSwitchToSignup} className="text-xs font-bold text-sky-600 hover:underline px-3 py-2">
            Don't have an account? Sign Up
          </button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className={`w-full max-w-md rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'} p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back Warrior
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Sign in to Codeforge</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Master DSA problems & ace your upcoming product interviews.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold text-center animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                <button type="button" onClick={handleDemoLogin} className="text-[11px] font-bold text-sky-600 hover:underline">Autofill Demo Account</button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted Authentication
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400">
        © 2026 Codeforge Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
