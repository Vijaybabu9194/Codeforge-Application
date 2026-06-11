import React from 'react';
import { BookOpen, Building2, BarChart3 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#F5F7FA] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Engineered for Placement Excellence
          </h2>
          <p className="text-secondaryText">
            Everything you need to level up your programming, organize your learning paths, and confidently pass technical interview loops.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-premium border border-border shadow-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Topic-wise DSA Practice</h3>
            <p className="text-sm text-secondaryText leading-relaxed mb-6">
              Structured topics matching the industry standard. Clear, progressive roadmaps starting from arrays and linked lists to dynamic programming and graphs.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Greedy'].map((t) => (
                <span key={t} className="text-xs bg-[#F5F7FA] text-secondaryText px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-premium border border-border shadow-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition duration-300">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Company-wise Questions</h3>
            <p className="text-sm text-secondaryText leading-relaxed mb-6">
              Direct targeted search for questions asked in FAANG and top-tier product startups. Filter problems by interview frequency, hiring trends, and difficulty.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Google', 'Amazon', 'Microsoft', 'Netflix', 'Uber', 'Atlassian'].map((c) => (
                <span key={c} className="text-xs bg-[#F5F7FA] text-secondaryText px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-premium border border-border shadow-card hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Coding Profile Analytics</h3>
            <p className="text-sm text-secondaryText leading-relaxed mb-6">
              Sync and aggregate external platforms (LeetCode, Codeforces) directly onto a unified dashboard. Live status updates, rating projections, and streak tracking.
            </p>
            <div className="flex flex-wrap gap-2">
              {['LeetCode', 'Codeforces', 'CodeChef', 'GFG', 'HackerRank'].map((p) => (
                <span key={p} className="text-xs bg-[#F5F7FA] text-secondaryText px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
