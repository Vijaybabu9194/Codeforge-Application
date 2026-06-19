import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustedBySection from '../components/landing/TrustedBySection';
import ScrollIndicator from '../components/landing/ScrollIndicator';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTABanner from '../components/landing/CTABanner';
import LandingFooter from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (showAuthModal === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setShowAuthModal(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your inputs.');
    }
  };

  const autofillDemo = () => {
    setEmail('vijay@codeforge.dev');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white relative overflow-hidden select-none">
      {/* ====== AMBIENT BACKGROUND EFFECTS ====== */}
      {/* Top-right blue nebula glow */}
      <div className="fixed top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#4A6CF7]/[0.04] blur-[120px] pointer-events-none" />
      {/* Center subtle glow */}
      <div className="fixed top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#3B50D4]/[0.02] blur-[100px] pointer-events-none" />
      {/* Bottom-left purple glow */}
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-700/[0.02] blur-[100px] pointer-events-none" />

      {/* NAVBAR */}
      <LandingNavbar
        isScrolled={isScrolled}
        onLoginClick={() => setShowAuthModal('login')}
        onSignupClick={() => setShowAuthModal('signup')}
      />

      {/* HERO SECTION */}
      <HeroSection
        onSignupClick={() => setShowAuthModal('signup')}
        onDemoClick={() => {
          setShowAuthModal('login');
          autofillDemo();
        }}
      />

      {/* TRUSTED BY */}
      <TrustedBySection />

      {/* SCROLL INDICATOR */}
      <ScrollIndicator />

      {/* FEATURES */}
      <FeaturesSection />

      {/* CTA BANNER */}
      <CTABanner onSignupClick={() => setShowAuthModal('signup')} />

      {/* FOOTER */}
      <LandingFooter />

      {/* ====== AUTH MODAL ====== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B1026] rounded-2xl border border-white/[0.08] p-8 w-full max-w-md shadow-[0_16px_64px_rgba(0,0,0,0.5)] relative mx-4" style={{ animation: 'fadeInScale 0.3s ease-out' }}>
            <button 
              onClick={() => setShowAuthModal(null)} 
              className="absolute top-4 right-4 text-[#7B8AB8] hover:text-white font-bold text-lg transition-colors"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A6CF7] to-[#6B8AFF] flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-[0_0_28px_rgba(74,108,247,0.3)]">
                <span className="text-sm">&lt;/&gt;</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {showAuthModal === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-sm text-[#7B8AB8] mt-1">
                {showAuthModal === 'login' ? 'Login to continue your preparation' : 'Start your prep journey with Codeforge'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl text-xs mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {showAuthModal === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#7B8AB8] mb-1.5">FULL NAME</label>
                  <input 
                    type="text" required placeholder="Vijay Babu"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-[#4A6CF7] focus:ring-0 rounded-xl text-sm text-white outline-none transition placeholder:text-[#4A5580]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#7B8AB8] mb-1.5">EMAIL ADDRESS</label>
                <input 
                  type="email" required placeholder="vijay@codeforge.dev"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-[#4A6CF7] focus:ring-0 rounded-xl text-sm text-white outline-none transition placeholder:text-[#4A5580]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7B8AB8] mb-1.5">PASSWORD</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-[#4A6CF7] focus:ring-0 rounded-xl text-sm text-white outline-none transition placeholder:text-[#4A5580]"
                />
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#4A6CF7] hover:bg-[#3B5BEB] text-white font-semibold rounded-xl shadow-[0_0_24px_rgba(74,108,247,0.2)] hover:shadow-[0_0_32px_rgba(74,108,247,0.35)] transition duration-200 mt-2 flex items-center justify-center text-[15px]"
              >
                {loading ? 'Processing...' : (showAuthModal === 'login' ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-[#7B8AB8]">
              {showAuthModal === 'login' ? (
                <p>New to Codeforge?{' '}<button onClick={() => { setShowAuthModal('signup'); setError(''); }} className="text-[#4A6CF7] font-semibold hover:underline">Create an account</button></p>
              ) : (
                <p>Already have an account?{' '}<button onClick={() => { setShowAuthModal('login'); setError(''); }} className="text-[#4A6CF7] font-semibold hover:underline">Login here</button></p>
              )}
            </div>

            {showAuthModal === 'login' && (
              <div className="mt-3 text-center">
                <button onClick={autofillDemo} className="text-xs text-[#4A6CF7] font-medium hover:underline" type="button">
                  Autofill Demo Account credentials
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
export default LandingPage;
