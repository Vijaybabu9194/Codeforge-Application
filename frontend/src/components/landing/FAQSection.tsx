import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FAQSection: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is CodeForge completely free to use?',
      a: 'Yes! CodeForge provides 100% free access to all 1,500+ DSA problems, company question tags, interactive code editor, and progress heatmaps.',
    },
    {
      q: 'Which programming languages are supported?',
      a: 'CodeForge supports high-speed execution for Java 17, Python 3, and C++ 17 with real-time testcase validation and execution profiling.',
    },
    {
      q: 'How are company-wise questions updated?',
      a: 'Our database is synchronized with recent interview experiences reported at top product companies including Google, Amazon, Microsoft, Meta, Uber, and Atlassian.',
    },
    {
      q: 'Can I track my submission history and notes?',
      a: 'Absolutely! Every submission saves your source code, runtime percentiles, memory benchmarks, and personal notes directly to your encrypted profile database.',
    },
  ];

  return (
    <section id="faqs" className="py-20 relative z-10 select-none">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className={`text-[32px] lg:text-[40px] font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Got questions? We've got{' '}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              answers
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  dark 
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-sky-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
