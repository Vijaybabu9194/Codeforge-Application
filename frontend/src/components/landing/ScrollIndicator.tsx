import React from 'react';

export const ScrollIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-10 relative z-10">
      <div className="scroll-mouse" />
      <span className="text-[12px] text-landing-textMuted/50 font-medium">
        Scroll to explore
      </span>
    </div>
  );
};
export default ScrollIndicator;
