import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TestimonialsSection: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer @ Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'CodeForge completely transformed my interview preparation. The company-wise question analytics and real-time heatmap allowed me to target exact patterns asked at Google.',
      solved: '420+ Problems Solved',
    },
    {
      name: 'David Miller',
      role: 'Full Stack Dev @ Amazon',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'The 3D analytics dashboard and instant solution execution are unmatched. I went from struggling on Mediums to cracking Amazon SDE-2 in 8 weeks.',
      solved: '310+ Problems Solved',
    },
    {
      name: 'Priya Sharma',
      role: 'Backend Engineer @ Microsoft',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'The topic-wise roadmap and contest leaderboards kept me accountable daily. CodeForge is hands down the best DSA platform available today.',
      solved: '550+ Problems Solved',
    },
  ];

  return (
    <section id="testimonials" className="py-20 relative z-10 select-none">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 mb-3">
            <Star className="w-3.5 h-3.5 fill-current" /> Loved by Engineers
          </div>
          <h2 className={`text-[32px] lg:text-[40px] font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Hear from warriors who{' '}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              cracked top tech offers
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                dark 
                  ? 'bg-slate-900/60 border-slate-800 hover:border-sky-500/40 shadow-xl' 
                  : 'bg-white border-slate-200 hover:border-sky-400/50 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className={`text-[15px] leading-relaxed mb-6 font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{t.text}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-sky-500" />
                  <div>
                    <h4 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" /> {t.solved.split(' ')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
