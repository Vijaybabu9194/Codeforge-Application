import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const TrustedBySection: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const textStyle = dark 
    ? 'text-slate-400 hover:text-white' 
    : 'text-slate-500 hover:text-slate-900';

  return (
    <section id="companies" className="pt-4 pb-14 w-full max-w-full px-6 md:px-12 relative z-10 select-none">
      <div className="flex flex-col text-left">
        {/* Trusted by label */}
        <p className={`text-[13px] mb-5 font-bold tracking-wider uppercase ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
          Trusted by developers from
        </p>

        {/* Company logos */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {/* Google */}
          <div className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <span className="font-extrabold text-[20px] tracking-tight">Google</span>
          </div>
          
          {/* Amazon */}
          <div className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <span className="font-extrabold text-[20px] tracking-tight italic">amazon</span>
          </div>
          
          {/* Microsoft */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="18" height="18" viewBox="0 0 23 23" fill="currentColor">
              <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
              <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
              <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
              <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
            </svg>
            <span className="font-extrabold text-[20px] tracking-tight">Microsoft</span>
          </div>
          
          {/* Adobe */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M14.548 1.376h9.452V22.5L14.548 1.376zM0 1.376h9.452L0 22.5V1.376zM13.966 22.624l-1.69-4.281H20L13.966 22.624z" />
            </svg>
            <span className="font-extrabold text-[20px] tracking-tight">Adobe</span>
          </div>
          
          {/* Uber */}
          <div className={`flex items-center transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <span className="font-extrabold text-[20px] tracking-tight">Uber</span>
          </div>
          
          {/* Atlassian */}
          <div className={`flex items-center gap-2.5 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0052CC">
              <path d="M7.12 11.084a.683.683 0 00-1.155.096L.573 22.244a.683.683 0 00.607.993h7.752a.683.683 0 00.607-.369c1.618-3.207.557-8.785-2.42-11.784zM11.871 1.395a15.56 15.56 0 00-.756 15.624l3.478 6.837a.685.685 0 00.608.381h7.752a.683.683 0 00.607-.993L12.966 1.491a.683.683 0 00-1.095-.096z" />
            </svg>
            <span className="font-extrabold text-[20px] tracking-tight">ATLASSIAN</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
