import React from 'react';
import { 
  CheckCircle, 
  Flame, 
  Trophy, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onSignupClick: () => void;
  onDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSignupClick,
  onDemoClick,
}) => {
  return (
    <section className="pt-32 pb-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center min-h-[90vh]">
      <div className="space-y-8">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE NEXT-GEN DSA PREPARATION PLATFORM</span>
        </div>
        <h1 className="text-5xl lg:text-[64px] font-bold tracking-tight leading-[1.1] text-[#111827]">
          MASTER DSA.<br />
          CRACK INTERVIEWS.<br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TRACK EVERYTHING.</span>
        </h1>
        <p className="text-lg text-secondaryText leading-relaxed max-w-xl">
          The complete platform for topic-wise DSA practice, company interview preparation, coding profile analytics, contest tracking, and placement readiness.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button 
            onClick={onSignupClick}
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-premium shadow-glow hover:scale-[1.02] transition duration-200 flex items-center justify-center space-x-2"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onDemoClick}
            className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E5E7EB] hover:border-gray-300 font-medium rounded-premium shadow-card hover:scale-[1.02] transition duration-200 flex items-center justify-center text-secondaryText hover:text-text"
          >
            Demo Account
          </button>
        </div>

        <div className="pt-8 border-t border-[#E5E7EB] grid grid-cols-3 gap-6 max-w-lg">
          <div>
            <p className="text-3xl font-bold text-text">10,000+</p>
            <p className="text-xs text-secondaryText mt-1">Developers Active</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text">200+</p>
            <p className="text-xs text-secondaryText mt-1">Companies Covered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text">1,500+</p>
            <p className="text-xs text-secondaryText mt-1">Premium Questions</p>
          </div>
        </div>
      </div>

      {/* HERO RIGHT: ANIMATED FLOATING CARDS */}
      <div className="relative h-[480px] hidden md:flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/30 to-purple-100/30 rounded-3xl blur-2xl pointer-events-none" />
        
        {/* Main Visual Core Grid */}
        <div className="w-[380px] h-[260px] bg-white rounded-premium border border-border shadow-card p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold text-secondaryText">PREPARATION PROGRESS</span>
            <span className="text-xs font-semibold text-primary">76% Complete</span>
          </div>
          <div className="w-full bg-[#F5F7FA] h-2.5 rounded-full overflow-hidden mb-6">
            <div className="bg-primary h-full w-[76%] rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F5F7FA] p-3 rounded-premium">
              <span className="text-[10px] font-semibold text-secondaryText block">EASY PROBLEMS</span>
              <span className="text-lg font-bold text-success">184 / 220</span>
            </div>
            <div className="bg-[#F5F7FA] p-3 rounded-premium">
              <span className="text-[10px] font-semibold text-secondaryText block">MEDIUM PROBLEMS</span>
              <span className="text-lg font-bold text-warning">242 / 480</span>
            </div>
          </div>
        </div>

        {/* Floating Card 1: Problems Solved */}
        <div className="absolute top-4 left-6 bg-white p-4 rounded-premium border border-border shadow-card flex items-center space-x-3 hover:scale-105 transition-all duration-300 animate-float cursor-default">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-secondaryText block">PROBLEMS SOLVED</span>
            <span className="text-base font-bold text-text">487 / 1500</span>
          </div>
        </div>

        {/* Floating Card 2: Contest Rating */}
        <div className="absolute bottom-4 right-6 bg-white p-4 rounded-premium border border-border shadow-card flex items-center space-x-3 hover:scale-105 transition-all duration-300 animate-float cursor-default" style={{ animationDelay: '2s' }}>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-accent">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-secondaryText block">CONTEST RATING</span>
            <span className="text-base font-bold text-text">2,142 <span className="text-[10px] text-success font-medium">(Top 1.5%)</span></span>
          </div>
        </div>

        {/* Floating Card 3: Streak Counter */}
        <div className="absolute top-12 right-10 bg-white p-4 rounded-premium border border-border shadow-card flex items-center space-x-3 hover:scale-105 transition-all duration-300 animate-float cursor-default" style={{ animationDelay: '4s' }}>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-warning">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-secondaryText block">STREAK</span>
            <span className="text-base font-bold text-text">42 Days</span>
          </div>
        </div>

        {/* Floating Card 4: Mini Heatmap */}
        <div className="absolute bottom-8 left-4 bg-white p-4 rounded-premium border border-border shadow-card hover:scale-105 transition-all duration-300 animate-float cursor-default" style={{ animationDelay: '1s' }}>
          <span className="text-[9px] font-semibold text-secondaryText block mb-2">WEEKLY ACTIVITY</span>
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {[...Array(5)].map((_, j) => {
                  const level = (i + j) % 4;
                  const colors = ['bg-gray-100', 'bg-indigo-100', 'bg-indigo-300', 'bg-primary'];
                  return <div key={j} className={`w-2 h-2 rounded-sm ${colors[level]}`} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
