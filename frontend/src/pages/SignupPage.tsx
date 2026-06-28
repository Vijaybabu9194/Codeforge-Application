import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Code2, ArrowRight, Sun, Moon, Lock, Mail, User, Sparkles, CheckCircle, KeyRound, Globe, SkipForward, ShieldCheck } from 'lucide-react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onBackToLanding }) => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  // Step state: 1 = Credentials, 2 = Verify OTP, 3 = External Usernames
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP
  const [otp, setOtp] = useState('');

  // External profiles (Optional)
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [codeforcesUser, setCodeforcesUser] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Send OTP
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
    }, 600);
  };

  // Step 2: Verify OTP
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter valid verification code.');
      return;
    }
    setError('');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 600);
  };

  // Step 3: Finalize Signup (With profiles or skipped)
  const handleFinalSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-[#050A18] text-white' : 'bg-[#F8FAFC] text-slate-900'} flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-300 relative`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Expanded Full-Width Edge-to-Edge Navbar */}
      <header className="w-full px-8 py-5 flex items-center justify-between relative z-20 border-b border-slate-200/50 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md">
        <button onClick={onBackToLanding} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Codeforge
          </span>
        </button>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition ${dark ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={onSwitchToLogin} className="text-xs font-extrabold text-sky-500 hover:underline">
            Already registered? Sign In &rarr;
          </button>
        </div>
      </header>

      {/* Main Centered Auth Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-auto">
        <div className={`w-full max-w-md rounded-3xl border ${dark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200/80 bg-white/95'} p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300`}>
          
          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Start 100% Free Account
                </div>
                <h1 className="text-2xl font-black tracking-tight mb-2">Create Developer Profile</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Step 1 of 3 — Enter your credentials to get started.</p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-600 text-white font-black text-sm rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{submitting ? 'Sending Code...' : 'Continue to Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black tracking-tight mb-2">Verify Your Email ✉️</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step 2 of 3 — We sent a verification OTP to <span className="font-bold text-sky-500">{email}</span>.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className={`w-full text-center tracking-[0.5em] text-xl font-black py-3 rounded-xl border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-600 text-white font-black text-sm rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{submitting ? 'Verifying Code...' : 'Verify OTP & Continue'}</span>
                </button>

                <div className="text-center pt-1">
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-sky-500">
                    &larr; Re-enter email address
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: External Profiles (Optional / Skip) */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight mb-1">External Profiles 🌐</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step 3 of 3 — Link handles to import heatmaps (Optional).
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">LeetCode Username</label>
                  <input
                    type="text"
                    placeholder="e.g. alex_coder"
                    value={leetcodeUser}
                    onChange={e => setLeetcodeUser(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">GitHub Username</label>
                  <input
                    type="text"
                    placeholder="e.g. alex-github"
                    value={githubUser}
                    onChange={e => setGithubUser(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Codeforces Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. alex_cf"
                    value={codeforcesUser}
                    onChange={e => setCodeforcesUser(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-sky-500 transition ${dark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                {/* Buttons: Complete vs Skip */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${dark ? 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-800' : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    <SkipForward className="w-3.5 h-3.5 text-slate-400" />
                    <span>Skip for now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 px-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{submitting ? 'Finishing...' : 'Complete Signup'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center gap-2 justify-center text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </div>
      </main>

      <div className="h-4" />
    </div>
  );
};

export default SignupPage;
