import { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LandingNavbar({ onLogin, onSignUp }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Features', 'Roadmap', 'Companies', 'Success Stories', 'Pricing'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">Codeforge</span>
        </div>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors bg-transparent border-none cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={onSignUp}
            className="px-5 py-2 text-sm font-semibold text-white gradient-primary rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-primary"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
