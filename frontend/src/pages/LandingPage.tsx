import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import LandingFooter from '@/components/landing/LandingFooter';
import { X } from 'lucide-react';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    background: '#F8F9FC',
    color: '#0F172A',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    outline: 'none',
  } as React.CSSProperties;

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#0F172A',
    marginBottom: '6px',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <LandingNavbar onLogin={() => { setShowLogin(true); setIsSignUp(false); }} onSignUp={() => { setShowLogin(true); setIsSignUp(true); }} />
      <HeroSection onGetStarted={() => { setShowLogin(true); setIsSignUp(true); }} />
      <FeaturesSection />
      <LandingFooter />

      {/* Auth Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowLogin(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }} />

          {/* Modal card */}
          <div
            className="relative bg-white rounded-2xl p-8 w-full max-w-md animate-scale-in"
            style={{ boxShadow: '0 24px 64px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F4F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              <X className="w-4 h-4 text-[#64748B]" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-[#64748B]">
                {isSignUp ? 'Start your DSA journey today' : 'Sign in to continue your progress'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isSignUp && (
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    placeholder="Your name"
                    required
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="you@example.com"
                  required
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <p style={{ fontSize: '13px', color: '#EF4444' }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer border-none gradient-primary hover:scale-[1.01] active:scale-[0.99] shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: '#64748B' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="font-semibold cursor-pointer bg-transparent border-none"
                style={{ color: '#6366F1' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
