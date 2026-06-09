import { BookOpen, Building2, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Topic-wise DSA Practice',
    description: 'Structured learning paths from beginner to advanced with curated problems for every topic.',
    color: '#6366F1',
    bg: '#EEF2FF',
    tags: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP', 'Greedy', 'Stack', 'Backtracking'],
  },
  {
    icon: Building2,
    title: 'Company-wise Questions',
    description: 'Real interview questions asked at top tech companies worldwide, curated and updated regularly.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    tags: ['Amazon', 'Google', 'Microsoft', 'Adobe', 'Uber', 'Netflix', 'Goldman Sachs'],
  },
  {
    icon: BarChart3,
    title: 'Coding Profile Analytics',
    description: 'Track your profiles across LeetCode, GFG, CodeChef, HackerRank & Codeforces in one place.',
    color: '#22C55E',
    bg: '#F0FDF4',
    tags: ['Heatmaps', 'Rankings', 'Badges', 'Contest Ratings', 'Difficulty Stats'],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-[#6366F1] tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">
            Everything you need to crack interviews
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto leading-relaxed">
            A comprehensive platform designed by developers, for developers preparing for coding interviews.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl p-8 card-shadow hover-lift border border-[#F1F4F9] hover:border-[#C7D2FE] cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: feature.bg }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-5">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg"
                    style={{ backgroundColor: feature.bg, color: feature.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
