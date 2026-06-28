import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const TrustedBySection: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const textStyle = dark 
    ? 'text-slate-100 hover:text-white font-extrabold' 
    : 'text-slate-900 hover:text-black font-extrabold';

  return (
    <section id="companies" className="pt-0 pb-2 -mt-10 md:-mt-14 w-full max-w-full px-6 md:px-12 relative z-30 select-none">
      <div className="flex flex-col text-left">
        {/* Trusted by label */}
        <p className={`text-[12px] mb-3 font-bold tracking-wider uppercase ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Trusted by developers from
        </p>

        {/* Company logos with official vector brand icons */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {/* Google */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight">Google</span>
          </div>
          
          {/* Amazon */}
          <div className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M13.4 17.6c-3.2 2.2-7.8 3.3-11.8 1.4-.6-.3-1.2.2-.9.8.9 1.7 5.7 4 10.8 2.6 4.5-1.2 8.7-4.6 9.4-5.3.4-.4.1-1.1-.4-.8-.8.5-4.1 2.3-7.1 1.3z" fill="#FF9900" />
              <path d="M21.2 14.8c-.3-.4-1.9-.2-2.6 0-.3.1-.3-.2 0-.4 1.7-1.2 4.4-.8 4.7-.4.3.4-.2 3.1-1.8 4.4-.3.2-.5.1-.4-.2.3-.7.9-2.7.1-3.4z" fill="#FF9900" />
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight italic">amazon</span>
          </div>
          
          {/* Microsoft */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="20" height="20" viewBox="0 0 23 23">
              <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
              <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
              <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
              <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight">Microsoft</span>
          </div>
          
          {/* Adobe */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M14.548 1.376h9.452V22.5L14.548 1.376zM0 1.376h9.452L0 22.5V1.376zM13.966 22.624l-1.69-4.281H20L13.966 22.624z" fill="#FF0000" />
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight">Adobe</span>
          </div>
          
          {/* Uber */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill={dark ? '#FFFFFF' : '#0F172A'} />
              <rect x="8" y="8" width="8" height="8" fill={dark ? '#050A18' : '#FFFFFF'} rx="1.5" />
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight">Uber</span>
          </div>
          
          {/* Atlassian */}
          <div className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer ${textStyle}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0052CC">
              <path d="M7.12 11.084a.683.683 0 00-1.155.096L.573 22.244a.683.683 0 00.607.993h7.752a.683.683 0 00.607-.369c1.618-3.207.557-8.785-2.42-11.784zM11.871 1.395a15.56 15.56 0 00-.756 15.624l3.478 6.837a.685.685 0 00.608.381h7.752a.683.683 0 00.607-.993L12.966 1.491a.683.683 0 00-1.095-.096z" />
            </svg>
            <span className="font-extrabold text-[19px] tracking-tight">ATLASSIAN</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
