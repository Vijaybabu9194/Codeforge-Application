import React from 'react';

export const TrustedBySection: React.FC = () => {
  return (
    <section id="companies" className="pt-4 pb-14 w-full max-w-full px-6 md:px-12 relative z-10 select-none">
      <div className="flex flex-col text-left">
        {/* Trusted by label */}
        <p className="text-[13px] text-[#7B8AB8]/60 mb-5 font-semibold tracking-wider uppercase">
          Trusted by developers from
        </p>

        {/* Company logos */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {/* Google */}
          <svg width="90" height="24" viewBox="0 0 90 24" fill="currentColor" className="text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer">
            <path d="M12.2 21.6c-6.2 0-11.2-5-11.2-11.2S6 1.6 12.2 1.6c3.4 0 5.9 1.3 7.8 3.1l-2.2 2.2c-1.3-1.3-3.1-2.2-5.6-2.2-4.5 0-8.2 3.6-8.2 8.2s3.7 8.2 8.2 8.2c2.9 0 4.5-1.2 5.6-2.2.9-.9 1.4-2.2 1.6-3.9h-7.2v-3.1h10.3c.1.5.2 1.1.2 1.8 0 2.2-.6 4.7-2.6 6.7-2 2-4.5 3-7.7 3zm19.8-1.5c-4.4 0-7.8-3.4-7.8-7.8s3.4-7.8 7.8-7.8c4.4 0 7.8 3.4 7.8 7.8s-3.4 7.8-7.8 7.8zm0-3.1c2.4 0 4.3-2 4.3-4.7s-1.9-4.7-4.3-4.7c-2.4 0-4.3 2-4.3 4.7s1.9 4.7 4.3 4.7zm17-1.6c-4.4 0-7.8-3.4-7.8-7.8s3.4-7.8 7.8-7.8c4.4 0 7.8 3.4 7.8 7.8s-3.4 7.8-7.8 7.8zm0-3.1c2.4 0 4.3-2 4.3-4.7s-1.9-4.7-4.3-4.7c-2.4 0-4.3 2-4.3 4.7s1.9 4.7 4.3 4.7zm16 6.2c-4.4 0-7.5-3.4-7.5-7.8s3.1-7.8 7.5-7.8c2.1 0 3.7.8 4.7 1.8v-1.3h3.3v14.4c0 5.9-3.5 8.3-7.6 8.3-3.8 0-6.1-2.6-7-4.7l2.9-1.2c.5 1.2 1.8 2.8 4.1 2.8 2.7 0 4.3-1.7 4.3-4.8v-1.2c-1 .9-2.6 1.7-4.7 1.7zm.3-11.4c-2.3 0-4.3 2-4.3 4.7s2 4.7 4.3 4.7 4.3-2 4.3-4.7-2-4.7-4.3-4.7zm11.3-4v19.4h-3.4V2.2h3.4zm10.7 15.4c-1.9 0-3.4-1-4.2-2.6l9.6-4-0.3-.8c-.7-1.8-2.7-5-6.9-5-4.2 0-7.7 3.3-7.7 7.8 0 4.1 3.4 7.8 8 7.8 3.7 0 5.9-2.3 6.8-3.6l-2.7-1.8c-1 1.2-2.3 2.2-3.8 2.2zm-.5-11.4c1.5 0 2.8.8 3.2 1.9l-6.5 2.7c0-2.3 1.7-4.6 3.3-4.6z" />
          </svg>
          
          {/* Amazon */}
          <div className="flex flex-col text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer pt-0.5">
            <svg width="74" height="24" viewBox="0 0 74 24" fill="currentColor">
              {/* amazon wordmark using clean bold-italic text */}
              <text x="0" y="14" className="font-sans font-bold text-[18px] tracking-tight italic" fill="currentColor">amazon</text>
              {/* smile arrow */}
              <path d="M4 18.5c8 4 17.5 5 25 1.7.7-.3 1.4-.8.9-1.5-.4-.4-1.1-.3-1.7 0-6.4 2.6-15 2-22.2-1.3-.7-.3-1.6-.1-1.9 0s-.8.6-.5 1.1z" fill="#F59E0B" />
              <path d="M30 16.5c-.3-.2-.8-.4-1 0s-.2.8.2 1.2c.8.8 1.8 1 2.3.8.5-.2.4-1.2.2-1.6s-1.2-.2-1.7-.4z" fill="#F59E0B" />
            </svg>
          </div>
          
          {/* Microsoft */}
          <div className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 23 23" fill="currentColor">
              <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
              <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
              <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
              <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
            </svg>
            <span className="font-semibold text-[17px] tracking-tight">Microsoft</span>
          </div>
          
          {/* Adobe */}
          <div className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M14.548 1.376h9.452V22.5L14.548 1.376zM0 1.376h9.452L0 22.5V1.376zM13.966 22.624l-1.69-4.281H20L13.966 22.624z" />
            </svg>
            <span className="font-bold text-[17px] tracking-tight">Adobe</span>
          </div>
          
          {/* Uber */}
          <div className="flex items-center text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer">
            <svg width="55" height="18" viewBox="0 0 55 18" fill="currentColor">
              <text x="0" y="15" className="font-sans font-extrabold text-[19px] tracking-tight" fill="currentColor">Uber</text>
            </svg>
          </div>
          
          {/* Atlassian */}
          <div className="flex items-center gap-2.5 text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0052CC">
              <path d="M7.12 11.084a.683.683 0 00-1.155.096L.573 22.244a.683.683 0 00.607.993h7.752a.683.683 0 00.607-.369c1.618-3.207.557-8.785-2.42-11.784zM11.871 1.395a15.56 15.56 0 00-.756 15.624l3.478 6.837a.685.685 0 00.608.381h7.752a.683.683 0 00.607-.993L12.966 1.491a.683.683 0 00-1.095-.096z" />
            </svg>
            <span className="font-bold text-[14px] tracking-wider uppercase">Atlassian</span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrustedBySection;
