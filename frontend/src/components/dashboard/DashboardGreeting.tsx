import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardGreetingProps {
  name?: string;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ name = 'Vijay' }) => {
  const { theme } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const isLight = theme === 'light';
  const fadeColor = isLight ? '#F8FAFC' : '#030712';

  return (
    <div className="relative bg-transparent border-0 select-none py-4 min-h-[90px]">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-dash-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[60%]">
        <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-tight leading-tight" style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>
          {greeting}, {name}! 👋
        </h1>
        <p className="text-[15px] mt-2 font-medium" style={{ color: isLight ? '#475569' : '#7B8AB8' }}>
          Consistency is the forge. Discipline is the fuel.
        </p>
      </div>

      {/* Developer illustration (perfectly matched to light/dark background) */}
      <div className="hidden md:block absolute right-0 top-[-100px] w-[400px] h-[400px] rounded-2xl overflow-hidden pointer-events-none z-0">
        <img
          src={isLight ? "/images/dashboard_developer_light_seamless.png" : "/images/dashboard_developer.png"}
          alt="Developer working"
          className="w-full h-full object-cover"
        />
        {/* Dynamic blend gradients matching exact background */}
        <div 
          className="absolute inset-y-0 left-0 w-16 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${fadeColor} 0%, ${fadeColor}88 40%, transparent 100%)` }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor}88 40%, transparent 100%)` }}
        />
        <div 
          className="absolute inset-x-0 top-0 h-12 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${fadeColor}44 0%, transparent 100%)` }}
        />
      </div>
    </div>
  );
};

export default DashboardGreeting;
