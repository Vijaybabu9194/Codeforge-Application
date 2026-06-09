import { ArrowRight, Sparkles, Users, Building2, BookOpen } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: Props) {
  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
      {/* Dot-grid background */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[560px]">
        {/* Left: Text */}
        <div className="flex-1 max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0E7FF] text-[#6366F1] text-sm font-medium mb-8 card-shadow">
            <Sparkles className="w-4 h-4" />
            The #1 platform for interview prep
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.06] tracking-tight mb-6">
            <span className="block text-[#0F172A]">Master DSA.</span>
            <span className="block text-gradient">Crack Interviews.</span>
            <span className="block text-[#0F172A]">Track Everything.</span>
          </h1>

          <p className="text-lg text-[#64748B] leading-relaxed mb-10 max-w-lg">
            The complete platform for topic-wise DSA practice, company interview preparation,
            coding profile analytics, contest tracking, and placement readiness.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="group px-7 py-3.5 gradient-primary text-white font-semibold rounded-2xl text-sm transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2 cursor-pointer shadow-primary"
            >
              Start Practicing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold rounded-2xl text-sm transition-all hover:border-[#6366F1]/30 hover:bg-[#F8F9FF] cursor-pointer card-shadow"
            >
              Explore Questions
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-8">
            {[
              { Icon: Users, color: '#6366F1', bg: '#EEF2FF', value: '10,000+', label: 'Developers' },
              { Icon: Building2, color: '#8B5CF6', bg: '#F5F3FF', value: '200+', label: 'Companies' },
              { Icon: BookOpen, color: '#22C55E', bg: '#F0FDF4', value: '1,500+', label: 'Questions' },
            ].map(({ Icon, color, bg, value, label }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <div className="w-px h-10 bg-[#E2E8F0] mr-5" />}
                <div className="p-2 rounded-xl" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#0F172A]">{value}</p>
                  <p className="text-xs text-[#64748B]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Floating cards */}
        <div className="flex-1 relative hidden lg:flex items-center justify-center" style={{ minHeight: 520 }}>
          {/* Problems Solved Card */}
          <div className="absolute top-0 right-8 bg-white rounded-2xl p-5 card-shadow animate-float w-56 border border-[#F1F4F9]">
            <p className="text-xs font-medium text-[#64748B] mb-1">Problems Solved</p>
            <p className="text-3xl font-bold text-[#0F172A]">247</p>
            <div className="flex gap-1 mt-3 items-end h-8">
              {[65, 40, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm overflow-hidden" style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: `rgba(99,102,241,${0.3 + h / 200})`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contest Rating Card */}
          <div className="absolute top-28 left-0 bg-white rounded-2xl p-5 card-shadow animate-float-delay-1 w-52 border border-[#F1F4F9]">
            <p className="text-xs font-medium text-[#64748B] mb-1">Contest Rating</p>
            <p className="text-3xl font-bold text-[#6366F1]">1847</p>
            <p className="text-xs text-[#22C55E] font-semibold mt-1.5">↑ 42 this week</p>
            <div className="mt-3 h-1.5 bg-[#F1F4F9] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#6366F1]" style={{ width: '72%' }} />
            </div>
          </div>

          {/* Streak Card */}
          <div className="absolute top-64 right-0 bg-white rounded-2xl p-5 card-shadow animate-float-delay-2 w-48 border border-[#F1F4F9]">
            <p className="text-xs font-medium text-[#64748B] mb-1">Current Streak</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#F59E0B]">23</span>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">Best: 45 days</p>
          </div>

          {/* Activity Heatmap Mini Card */}
          <div className="absolute bottom-16 left-4 bg-white rounded-2xl p-5 card-shadow animate-float w-64 border border-[#F1F4F9]">
            <p className="text-xs font-medium text-[#64748B] mb-3">Activity</p>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 48 }, (_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: intensity < 0.2 ? '#E2E8F0'
                        : intensity < 0.4 ? '#C7D2FE'
                        : intensity < 0.6 ? '#A5B4FC'
                        : intensity < 0.8 ? '#818CF8'
                        : '#6366F1',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Difficulty Card */}
          <div className="absolute bottom-0 right-16 bg-white rounded-2xl p-4 card-shadow animate-float-delay-1 w-44 border border-[#F1F4F9]">
            <p className="text-xs font-medium text-[#64748B] mb-2">Difficulty</p>
            <div className="space-y-2">
              {[
                { label: 'Easy', color: '#22C55E', count: 89, pct: 72 },
                { label: 'Medium', color: '#F59E0B', count: 128, pct: 55 },
                { label: 'Hard', color: '#EF4444', count: 30, pct: 25 },
              ].map(({ label, color, count, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-semibold" style={{ color }}>{label}</span>
                    <span className="text-[#94A3B8]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F4F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
