import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustedBySection from '../components/landing/TrustedBySection';
import ScrollIndicator from '../components/landing/ScrollIndicator';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTABanner from '../components/landing/CTABanner';
import LandingFooter from '../components/landing/LandingFooter';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (authView === 'login') {
    return (
      <LoginPage
        onSwitchToSignup={() => setAuthView('signup')}
        onBackToLanding={() => setAuthView(null)}
      />
    );
  }

  if (authView === 'signup') {
    return (
      <SignupPage
        onSwitchToLogin={() => setAuthView('login')}
        onBackToLanding={() => setAuthView(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#020205] text-white' : 'bg-[#F8FAFC] text-slate-900'} relative overflow-hidden select-none transition-colors duration-300`}>
      {/* ====== AMBIENT BACKGROUND EFFECTS ====== */}
      <div className={`fixed top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none ${dark ? 'bg-sky-500/[0.05]' : 'bg-sky-500/[0.08]'}`} />
      <div className={`fixed top-[30%] left-[20%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${dark ? 'bg-indigo-500/[0.03]' : 'bg-indigo-500/[0.05]'}`} />
      <div className={`fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${dark ? 'bg-purple-700/[0.03]' : 'bg-purple-500/[0.05]'}`} />

      {/* NAVBAR */}
      <LandingNavbar
        isScrolled={isScrolled}
        onLoginClick={() => setAuthView('login')}
        onSignupClick={() => setAuthView('signup')}
      />

      {/* HERO SECTION */}
      <HeroSection
        onSignupClick={() => setAuthView('signup')}
        onDemoClick={() => setAuthView('login')}
      />

      {/* TRUSTED BY */}
      <TrustedBySection />

      {/* SCROLL INDICATOR */}
      <ScrollIndicator />

      {/* FEATURES */}
      <FeaturesSection />

      {/* CTA BANNER */}
      <CTABanner onSignupClick={() => setAuthView('signup')} />

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
