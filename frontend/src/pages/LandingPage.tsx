import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
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
    <div className="min-h-screen bg-[#FAFBFC] text-[#111827] relative overflow-hidden select-none">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-50 blur-[100px] pointer-events-none" />

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

      {/* FEATURES SECTION */}
      <FeaturesSection />

      {/* FOOTER */}
      <LandingFooter />

      {/* AUTH MODAL OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-premium border border-border p-8 w-full max-w-md shadow-card relative mx-4 animate-float" style={{ animationIterationCount: 1, animationDuration: '0.4s' }}>
            <button 
              onClick={() => setShowAuthModal(null)} 
              className="absolute top-4 right-4 text-secondaryText hover:text-text font-bold text-lg"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-glow">
                CF
              </div>
              <h3 className="text-2xl font-bold text-text">
                {showAuthModal === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-sm text-secondaryText mt-1">
                {showAuthModal === 'login' ? 'Login to continue your preparation' : 'Start your prep journey with Codeforge'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-danger border border-red-100 p-3 rounded-premium text-xs mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {showAuthModal === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-secondaryText mb-1.5">FULL NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Vijay Babu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-premium text-sm outline-none transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-secondaryText mb-1.5">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required 
                  placeholder="vijay@codeforge.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-premium text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondaryText mb-1.5">PASSWORD</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-premium text-sm outline-none transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-premium shadow-glow hover:scale-[1.01] active:scale-[0.99] transition duration-200 mt-2 flex items-center justify-center"
              >
                {loading ? 'Processing...' : (showAuthModal === 'login' ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center text-xs text-secondaryText">
              {showAuthModal === 'login' ? (
                <p>
                  New to Codeforge?{' '}
                  <button 
                    onClick={() => { setShowAuthModal('signup'); setError(''); }} 
                    className="text-primary font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setShowAuthModal('login'); setError(''); }} 
                    className="text-primary font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>

            {showAuthModal === 'login' && (
              <div className="mt-3 text-center">
                <button 
                  onClick={autofillDemo}
                  className="text-xs text-primary font-medium hover:underline"
                  type="button"
                >
                  Autofill Demo Account credentials
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default LandingPage;
