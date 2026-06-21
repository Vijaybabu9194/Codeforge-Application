import React from 'react';

interface DashboardGreetingProps {
  name?: string;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ name = 'Vijay' }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative bg-transparent border-0 select-none py-4 min-h-[90px]">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-dash-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[60%]">
        <h1 className="text-[28px] md:text-[34px] font-extrabold text-white tracking-tight leading-tight">
          {greeting}, {name}! 👋
        </h1>
        <p className="text-[15px] text-dash-textSecondary mt-2 font-medium">
          Consistency is the forge. Discipline is the fuel.
        </p>
      </div>

      {/* Developer illustration (absolute positioned in the background, extending down) */}
      <div className="hidden md:block absolute right-0 top-[-100px] w-[400px] h-[400px] rounded-2xl overflow-hidden pointer-events-none z-0">
        <img
          src="/images/dashboard_developer.png"
          alt="Developer working"
          className="w-full h-full object-cover"
        />
        {/* Blend gradients to fade image left and bottom edges to transparent space */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#030712] via-[#030712]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#030712]/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default DashboardGreeting;
