import React from 'react';
import { MessageSquare, Sparkles, Bell } from 'lucide-react';

export const DiscussPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center select-none bg-[#060912]">
      <div className="flex flex-col items-center gap-6 text-center px-6">

        {/* Animated icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#4A6CF7] to-[#A78BFA] flex items-center justify-center shadow-2xl shadow-[#4A6CF7]/40 animate-pulse">
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Discuss
          </h1>
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 border border-[#4A6CF7]/20 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#4A6CF7] animate-pulse" />
            <span className="text-[#818CF8] text-sm font-bold tracking-wide">Coming Soon</span>
          </div>
        </div>

        <p className="text-[#4A5580] text-base font-medium max-w-md leading-relaxed">
          A community space to ask questions, share solutions, and discuss coding patterns with other developers. We're building something special — stay tuned!
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 w-full max-w-xl">
          {[
            { icon: '💬', title: 'Q&A Threads', desc: 'Ask and answer questions' },
            { icon: '🧠', title: 'Solution Reviews', desc: 'Share & critique approaches' },
            { icon: '🏆', title: 'Top Contributors', desc: 'Community leaderboard' },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#0F1526] border border-white/[0.05] rounded-2xl p-4 flex flex-col items-center gap-2 opacity-60"
            >
              <span className="text-2xl">{f.icon}</span>
              <p className="text-white text-xs font-bold">{f.title}</p>
              <p className="text-[#4A5580] text-[10px] font-medium">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Notify button */}
        <button className="flex items-center gap-2 px-6 py-3 bg-[#4A6CF7] hover:bg-[#5A7CF8] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg hover:shadow-[#4A6CF7]/30 active:scale-95 mt-2">
          <Bell className="w-4 h-4" />
          Notify Me When It Launches
        </button>
      </div>
    </div>
  );
};

export default DiscussPage;
