import React from 'react';

interface Contest {
  name: string;
  inDays: string;
  date: string;
  iconColors: [string, string];
  iconType: 'weekly' | 'biweekly' | 'codeforces' | 'atcoder';
}

const contests: Contest[] = [
  { name: 'Weekly Contest 389', inDays: 'In 2 days', date: 'Aug 17, 08:30 PM', iconColors: ['#4A6CF7', '#6B8AFF'], iconType: 'weekly' },
  { name: 'Biweekly Contest 121', inDays: 'In 9 days', date: 'Aug 24, 08:30 PM', iconColors: ['#A78BFA', '#8B5CF6'], iconType: 'biweekly' },
  { name: 'Codeforces Round #952', inDays: 'In 16 days', date: 'Aug 31, 05:35 PM', iconColors: ['#EF4444', '#F59E0B'], iconType: 'codeforces' },
  { name: 'AtCoder Beginner Contest 345', inDays: 'In 23 days', date: 'Sep 7, 07:00 PM', iconColors: ['#22D3EE', '#4A6CF7'], iconType: 'atcoder' },
];

const ContestIcon: React.FC<{ colors: [string, string]; type: string }> = ({ colors, type }) => (
  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}10)` }}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      {type === 'weekly' && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke={colors[0]} strokeWidth="2" />
          <path d="M8 12h8M12 8v8" stroke={colors[1]} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === 'biweekly' && (
        <>
          <rect x="3" y="6" width="8" height="12" rx="2" stroke={colors[0]} strokeWidth="1.5" />
          <rect x="13" y="6" width="8" height="12" rx="2" stroke={colors[1]} strokeWidth="1.5" />
        </>
      )}
      {type === 'codeforces' && (
        <>
          <rect x="4" y="14" width="4" height="6" rx="1" fill={colors[0]} />
          <rect x="10" y="8" width="4" height="12" rx="1" fill={colors[1]} />
          <rect x="16" y="4" width="4" height="16" rx="1" fill={colors[0]} />
        </>
      )}
      {type === 'atcoder' && (
        <>
          <circle cx="12" cy="12" r="8" stroke={colors[0]} strokeWidth="2" />
          <path d="M12 8v4l3 3" stroke={colors[1]} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  </div>
);

export const DashboardUpcomingContests: React.FC = () => {
  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-white">Upcoming Contests</h2>
        <button className="text-[12px] text-dash-blue font-semibold hover:text-[#6B8AFF] transition">View all</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contests.map((contest) => (
          <div key={contest.name} className="p-4 rounded-xl bg-white/[0.02] border border-dash-border hover:border-dash-blue/15 transition group flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 mb-3">
                <ContestIcon colors={contest.iconColors} type={contest.iconType} />
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-white truncate">{contest.name}</h3>
                  <span className="text-[11px] text-dash-textSecondary font-medium">{contest.inDays}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-dash-border/40">
              <span className="text-[11px] text-dash-textMuted font-medium">{contest.date}</span>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#4A6CF7] text-[11px] text-white font-bold hover:bg-[#3B5BEB] transition shadow-sm active:scale-95">
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUpcomingContests;
