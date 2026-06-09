import { Code2 } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-[#0F172A]">Codeforge</span>
        </div>
        <div className="flex items-center gap-8">
          {['Features', 'Pricing', 'Roadmap', 'About', 'Contact'].map((link) => (
            <a key={link} href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
              {link}
            </a>
          ))}
        </div>
        <p className="text-sm text-[#94A3B8]">© 2025 Codeforge. All rights reserved.</p>
      </div>
    </footer>
  );
}
