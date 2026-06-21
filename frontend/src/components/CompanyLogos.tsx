import React, { useState } from 'react';

// Hash color generator for custom fallback letters to look premium
export const getHashColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-600 text-white border-red-700/50',
    'bg-blue-600 text-white border-blue-700/50',
    'bg-green-600 text-white border-green-700/50',
    'bg-yellow-600 text-white border-yellow-700/50',
    'bg-purple-600 text-white border-purple-700/50',
    'bg-pink-600 text-white border-pink-700/50',
    'bg-indigo-600 text-white border-indigo-700/50',
    'bg-teal-600 text-white border-teal-700/50',
    'bg-orange-600 text-white border-orange-700/50',
  ];
  return colors[Math.abs(hash) % colors.length];
};

// LeetCode Logo SVG - Original Multi-colored Brand Version
export const LeetCodeLogo: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg 
    viewBox="0 0 94 110.92" 
    className={`w-5 h-5.5 ${disabled ? 'cursor-not-allowed opacity-30 grayscale' : 'hover:scale-115 cursor-pointer'} transition-all duration-200`} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path d="M67.5068339,83.0664138 C70.0005384,80.5763786 74.0371402,80.5828822 76.5228362,83.0809398 C79.0085322,85.5789975 79.00204,89.6226456 76.5083355,92.1126808 L65.4351451,103.169577 C55.2192332,113.370744 38.5604663,113.518673 28.1722578,103.513204 C28.112217,103.455678 23.486583,98.9201326 8.22702585,83.9570195 C-1.92478479,74.0028895 -2.93614945,58.0748736 6.61697549,47.8463644 L24.4286944,28.7745461 C33.9100043,18.6218594 51.3874487,17.5122246 62.2279907,26.2789232 L78.4052912,39.3620235 C81.1448956,41.5776292 81.5728103,45.5984975 79.3610655,48.3428842 C77.1493207,51.0872709 73.1354592,51.5159327 70.3958548,49.300327 L54.2186634,36.2173149 C48.5492813,31.6325105 38.631911,32.2621597 33.7398535,37.5006265 L15.9279056,56.5726899 C11.2772073,61.552182 11.7865613,69.5740156 17.1461283,74.8292186 C28.3515339,85.8169393 36.9874071,94.2846214 36.9973988,94.294225 C42.3981571,99.4959838 51.130862,99.418438 56.43358,94.1233737 L67.5068339,83.0664138 Z" fill={disabled ? "#52525B" : "#FFA116"} />
      <path d="M40.6069914,72.0014117 C37.086019,72.0014117 34.2317068,69.142117 34.2317068,65.6149982 C34.2317068,62.0878794 37.086019,59.2285847 40.6069914,59.2285847 L87.6247154,59.2285847 C91.1456879,59.2285847 94,62.0878794 94,65.6149982 C94,69.142117 91.1456879,72.0014117 87.6247154,72.0014117 L40.6069914,72.0014117 Z" fill={disabled ? "#3F3F46" : "#B3B3B3"} />
      <path d="M49.4124315,2.02335002 C51.8178981,-0.552320454 55.852269,-0.686893945 58.4234511,1.72277172 C60.9946333,4.13243738 61.1289722,8.17385083 58.7235056,10.7495213 L15.9282277,56.5728697 C11.2773659,61.551984 11.7867168,69.5737689 17.1459309,74.8291832 L36.9094236,94.2091099 C39.4255514,96.6764051 39.4686234,100.719828 37.0056277,103.240348 C34.5426319,105.760868 30.5062548,105.804016 27.990127,103.33672 L8.22654289,83.9567041 C-1.92467414,74.0021005 -2.93603527,58.0741402 6.61751533,47.846311 L49.4124315,2.02335002 Z" fill={disabled ? "#71717A" : "#ECEFF1"} />
    </g>
  </svg>
);

// GFG Logo SVG - Original Green Brace Design
export const GfgLogo: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg 
    viewBox="0 0 76.533 39.026" 
    className={`w-9 h-4.5 ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-115 cursor-pointer'} transition-all duration-200`} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2380.7,6597.866a12.252,12.252,0,0,0-.261-1.513l-30.726-.027a12.545,12.545,0,0,1,.908-3.443,12.337,12.337,0,0,1,2.739-4.044,12.151,12.151,0,0,1,4.018-2.581,12.634,12.634,0,0,1,14.3,3.051l4.852-4.748a18.176,18.176,0,0,0-6.131-4.331,20.037,20.037,0,0,0-8.112-1.564,20.25,20.25,0,0,0-7.671,1.459,19.158,19.158,0,0,0-6.261,4.07,19.584,19.584,0,0,0-4.226,6.184,18.7,18.7,0,0,0-1.487,5.947h-.2a18.674,18.674,0,0,0-1.489-5.947,19.544,19.544,0,0,0-4.226-6.184,19.133,19.133,0,0,0-6.261-4.07,21.354,21.354,0,0,0-15.783.1,18.2,18.2,0,0,0-6.131,4.331l4.853,4.748a13.264,13.264,0,0,1,14.3-3.051,12.131,12.131,0,0,1,4.017,2.581,12.323,12.323,0,0,1,2.74,4.044,12.527,12.527,0,0,1,.908,3.443l-30.726.027a12.256,12.256,0,0,0-.261,1.513,15,15,0,0,0-.1,1.773,20.713,20.713,0,0,0,1.1,6.783,15.709,15.709,0,0,0,3.443,5.686,17.309,17.309,0,0,0,6,4.123,20.587,20.587,0,0,0,7.983,1.46,20.226,20.226,0,0,0,7.669-1.46,19.086,19.086,0,0,0,6.261-4.07,19.506,19.506,0,0,0,4.226-6.184,18.163,18.163,0,0,0,1.153-3.629h.871a18.27,18.27,0,0,0,1.151,3.629,19.545,19.545,0,0,0,4.226,6.184,19.111,19.111,0,0,0,6.261,4.07,20.241,20.241,0,0,0,7.671,1.46,20.572,20.572,0,0,0,7.981-1.46,17.282,17.282,0,0,0,6-4.123,15.717,15.717,0,0,0,3.445-5.686,20.726,20.726,0,0,0,1.1-6.783A15.259,15.259,0,0,0,2380.7,6597.866Zm-46.245,5.608a12.1,12.1,0,0,1-2.766,4.043,12.467,12.467,0,0,1-4.043,2.583,14.378,14.378,0,0,1-9.939.052,11.776,11.776,0,0,1-3.522-2.218,8.459,8.459,0,0,1-1.8-2.374,13.476,13.476,0,0,1-1.173-3.208l23.658,0A11.487,11.487,0,0,1,2334.457,6603.475Zm38.236,2.086a8.466,8.466,0,0,1-1.8,2.374,11.771,11.771,0,0,1-3.522,2.218,14.378,14.378,0,0,1-9.939-.052,12.491,12.491,0,0,1-4.044-2.583,12.088,12.088,0,0,1-2.765-4.043,11.427,11.427,0,0,1-.415-1.126h11.92v0h11.739A13.509,13.509,0,0,1,2372.692,6605.561Z" 
      transform="translate(-2304.273 -6578.666)" 
      fill={disabled ? "#4B5563" : "#2f8d46"}
    />
  </svg>
);

// Map tech brands to circular backgrounds and border choices
const brandStyleMap: Record<string, { bg: string; border: string }> = {
  google: { bg: 'bg-white', border: 'border-transparent' },
  amazon: { bg: 'bg-[#131921]', border: 'border-white/10' },
  microsoft: { bg: 'bg-white', border: 'border-transparent' },
  apple: { bg: 'bg-black', border: 'border-white/10' },
  facebook: { bg: 'bg-transparent', border: 'border-transparent' },
  meta: { bg: 'bg-transparent', border: 'border-transparent' },
  goldman: { bg: 'bg-[#003366]', border: 'border-transparent' },
  sachs: { bg: 'bg-[#003366]', border: 'border-transparent' },
  paytm: { bg: 'bg-white', border: 'border-transparent' },
  netflix: { bg: 'bg-black', border: 'border-white/10' },
  uber: { bg: 'bg-black', border: 'border-white/10' },
  swiggy: { bg: 'bg-[#FC8019]', border: 'border-transparent' },
  zomato: { bg: 'bg-[#CB202D]', border: 'border-transparent' },
  flipkart: { bg: 'bg-[#FFE11B]', border: 'border-transparent' },
  adobe: { bg: 'bg-[#FA0F00]', border: 'border-transparent' },
  salesforce: { bg: 'bg-white', border: 'border-transparent' },
  linkedin: { bg: 'bg-[#0A66C2]', border: 'border-transparent' },
  paypal: { bg: 'bg-white', border: 'border-transparent' },
  samsung: { bg: 'bg-[#0A47A3]', border: 'border-transparent' },
  oracle: { bg: 'bg-[#F80000]', border: 'border-transparent' },
  atlassian: { bg: 'bg-[#0052CC]', border: 'border-transparent' },
  bloomberg: { bg: 'bg-black', border: 'border-white/10' },
  bytedance: { bg: 'bg-[#24292E]', border: 'border-white/10' },
  deshaw: { bg: 'bg-[#002E6E]', border: 'border-transparent' },
  'de shaw': { bg: 'bg-[#002E6E]', border: 'border-transparent' },
  intuit: { bg: 'bg-[#0077C5]', border: 'border-transparent' },
  'morgan stanley': { bg: 'bg-[#002A54]', border: 'border-transparent' },
  myntra: { bg: 'bg-white', border: 'border-transparent' },
  ola: { bg: 'bg-green-400', border: 'border-transparent' },
  phonepe: { bg: 'bg-[#5f259f]', border: 'border-transparent' },
  zoho: { bg: 'bg-white', border: 'border-transparent' },
  walmart: { bg: 'bg-[#0071CE]', border: 'border-transparent' },
  sumo: { bg: 'bg-[#002D62]', border: 'border-transparent' },
  'sumo logic': { bg: 'bg-[#002D62]', border: 'border-transparent' }
};

// Custom Company Logo renderer with dynamic DB URL loading + responsive inline SVG fallback wrapped in circular badge
export const CompanyLogo: React.FC<{ name: string; logoUrl?: string; className?: string }> = ({ name, logoUrl, className = "w-9 h-9" }) => {
  const lowercaseName = name.toLowerCase();
  const [imageFailed, setImageFailed] = useState(false);

  // Identify brand match in our style map
  const getBrandKey = (): string | null => {
    for (const key of Object.keys(brandStyleMap)) {
      if (lowercaseName.includes(key)) {
        return key;
      }
    }
    return null;
  };

  const brandKey = getBrandKey();

  const renderInnerLogo = () => {
    // 1. Prioritize fallback high-visibility vector SVGs for matched brands
    if (brandKey) {
      if (brandKey === 'google') {
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-6.03-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        );
      }

      if (brandKey === 'amazon') {
        return (
          <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* White letter "a" */}
            <path d="M12.2 6.3c-2.2 0-3.8 1.2-3.8 3.5 0 1.8 1.2 2.8 2.8 2.8.7 0 1.4-.3 2-.9v.9h2.4v-6.3c0-2.4-1.6-3.6-4-3.6-2 0-3.6.8-4 1.8l1.8 1c.3-.5.7-.8 1.4-.8 1 0 1.4.6 1.4 1.6V8c-.5-.2-1-.4-1.8-.4zm.6 3.4c.6 0 1 .3 1 1v.5c-.3.4-.7.6-1.2.6-.6 0-1-.4-1-1s.4-1.1 1.2-1.1z" fill="#FFFFFF"/>
            {/* Orange smile/arrow under it */}
            <path d="M18.8 17.85c-1.95 1.55-4.85 2.35-7.75 2.35-4.25 0-8.05-1.7-10.45-4.55-.25-.3-.05-.65.25-.45 2.85 1.8 6.55 2.9 10.2 2.9 2.55 0 5.15-.6 7.4-1.75.45-.25.8.15.35.5z" fill="#FF9900"/>
            <path d="M19.9 16.5c-.2-.25-.5-.15-.4.15.2.75.1 1.8-.3 2.5-.15.3.1.55.35.35 1.05-.8 1.4-2 1.15-3.15-.1-.4-.6-.1-.8.15z" fill="#FF9900"/>
          </svg>
        );
      }

      if (brandKey === 'microsoft') {
        return (
          <svg className="w-4.5 h-4.5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="11" height="11" fill="#F25022"/>
            <rect x="12" width="11" height="11" fill="#7FBA00"/>
            <rect y="12" width="11" height="11" fill="#00A4EF"/>
            <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
          </svg>
        );
      }

      if (brandKey === 'apple') {
        return (
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 170 170" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.36-6.08-3.69-2.91-7.54-7.63-11.56-14.16-6.69-11.04-11.39-23.71-14.11-38.01-2.73-14.3-1.85-26.96 2.63-38 4.48-11.04 11.26-17.75 20.35-18.13 4.23-.13 9.47 1.58 15.7 5.13 6.23 3.54 11.05 5.32 14.43 5.32 2.85 0 7.42-1.65 13.72-4.94 6.3-3.3 11.43-4.82 15.39-4.56 10.48.51 18.66 4.31 24.54 11.41-8.5 5.19-14.16 11.91-16.99 20.15-2.83 8.24-2.18 16.59 1.95 25.07 4.13 8.48 9.87 13.88 17.2 16.22-2.18 6.08-4.63 11.66-7.37 16.74zM119.22 30c0-7.35 2.67-14.16 8.02-20.43 5.35-6.27 11.96-9.57 19.82-9.57.11.87-.22 7.61-2.94 14.77-2.72 7.16-7.07 13.1-13.06 17.81-5.99 4.71-11.86 7.42-17.61 7.42-.65-3.37-1.44-6.7-1.44-10z"/>
          </svg>
        );
      }

      if (brandKey === 'facebook' || brandKey === 'meta') {
        return (
          <svg className="w-9 h-9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12z" fill="#1877F2"/>
            <path d="M15.83 9.43h-2.796v-2.25c0-.949.465-1.874 1.956-1.874h1.312V2.353s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.25H7.078v3.47h3.047v8.385a12.09 12.09 0 003.71-.001v-8.385h3.328l-.532-3.47z" fill="#FFFFFF"/>
          </svg>
        );
      }

      if (brandKey === 'goldman' || brandKey === 'sachs') {
        return (
          <span className="text-[14px] font-bold text-white tracking-tighter select-none" style={{ fontFamily: 'Georgia, serif' }}>GS</span>
        );
      }

      if (brandKey === 'paytm') {
        return (
          <span className="text-[9px] font-black tracking-tight text-[#00b9f5] select-none">paytm</span>
        );
      }

      if (brandKey === 'netflix') {
        return (
          <svg className="w-4 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.998 0V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.998 0z" fill="#B20710" />
            <path d="M15.489 0v9.172l4.715 13.33V0h-4.715z" fill="#B20710" />
            <path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398z" fill="#E50914" />
          </svg>
        );
      }

      if (brandKey === 'uber') {
        return (
          <span className="text-[9px] font-black tracking-tight text-white uppercase select-none">UBER</span>
        );
      }

      if (brandKey === 'swiggy') {
        return (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.034 24c-.376-.411-2.075-2.584-3.95-5.513-.547-.916-.901-1.63-.833-1.814.178-.48 3.355-.743 4.333-.308.298.132.29.307.29.409 0 .44-.022 1.619-.022 1.619a.441.441 0 1 0 .883-.002l-.005-2.939c0-.255-.278-.319-.331-.329-.511-.002-1.548-.006-2.661-.006-2.457 0-3.006.101-3.423-.172-.904-.591-2.383-4.577-2.417-6.819C3.849 4.964 5.723 2.225 8.362.868A8.13 8.13 0 0 1 12.026 0c4.177 0 7.617 3.153 8.075 7.209l.001.011c.084.981-5.321 1.189-6.39.904-.164-.044-.206-.212-.206-.284L13.5 4.996a.442.442 0 0 0-.884.002l.009 3.866a.33.33 0 0 0 .268.32l3.354-.001c1.79 0 2.542.207 3.042.588.333.254.461.739.349 1.37C18.633 16.755 12.273 23.71 12.034 24z"/>
          </svg>
        );
      }

      if (brandKey === 'zomato') {
        return (
          <span className="text-[7.5px] font-black tracking-tight text-white select-none">zomato</span>
        );
      }

      if (brandKey === 'flipkart') {
        return (
          <span className="text-[9px] font-black text-[#1f74ba] italic select-none">F</span>
        );
      }

      if (brandKey === 'adobe') {
        return (
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 10.22 16.86 14.94" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94"/>
          </svg>
        );
      }

      if (brandKey === 'salesforce') {
        return (
          <svg className="w-5.5 h-5.5" viewBox="0 0 256 180" xmlns="http://www.w3.org/2000/svg">
            <path fill="#00a1e0" d="M106.553 19.651c8.248-8.594 19.731-13.924 32.43-13.924c16.883 0 31.612 9.414 39.455 23.389a54.5 54.5 0 0 1 22.3-4.74c30.449 0 55.134 24.9 55.134 55.615c0 30.719-24.685 55.62-55.134 55.62a54.7 54.7 0 0 1-10.86-1.083c-6.908 12.321-20.07 20.645-35.178 20.645a40.1 40.1 0 0 1-17.632-4.058c-7.002 16.47-23.316 28.019-42.33 28.019c-19.8 0-36.674-12.529-43.152-30.1c-2.83.602-5.763.915-8.772.915c-23.574 0-42.686-19.308-42.686-43.13a43.2 43.2 0 0 1 21.345-37.36a49.4 49.4 0 0 1-4.088-19.727C17.385 22.336 39.626.128 67.06.128c16.106 0 30.42 7.658 39.494 19.523"/>
          </svg>
        );
      }

      if (brandKey === 'linkedin') {
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.7c-.97 0-1.75-.79-1.75-1.75S5.53 3.2 6.5 3.2s1.75.79 1.75 1.75S7.47 6.7 6.5 6.7zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.76c1.4-2.58 7-2.77 7 2.48V19z"/>
          </svg>
        );
      }

      if (brandKey === 'paypal') {
        return (
          <span className="text-[10px] font-black text-[#003087] italic select-none">P</span>
        );
      }

      if (brandKey === 'samsung') {
        return (
          <span className="text-[8px] font-bold text-white tracking-tighter select-none">SAMSUNG</span>
        );
      }

      if (brandKey === 'oracle') {
        return (
          <span className="text-[8px] font-extrabold text-white tracking-tighter select-none">ORACLE</span>
        );
      }

      if (brandKey === 'atlassian') {
        return (
          <span className="text-[8px] font-extrabold text-white tracking-tight select-none">A</span>
        );
      }

      if (brandKey === 'bloomberg') {
        return (
          <span className="text-[8px] font-black text-white select-none">B</span>
        );
      }

      if (brandKey === 'bytedance') {
        return (
          <span className="text-[8px] font-black text-teal-400 select-none">BD</span>
        );
      }

      if (brandKey === 'deshaw' || brandKey === 'de shaw') {
        return (
          <span className="text-[8px] font-extrabold text-white select-none">DES</span>
        );
      }

      if (brandKey === 'intuit') {
        return (
          <span className="text-[8px] font-black text-white select-none">intuit</span>
        );
      }

      if (brandKey === 'morgan stanley') {
        return (
          <span className="text-[8px] font-extrabold text-white select-none">MS</span>
        );
      }

      if (brandKey === 'myntra') {
        return (
          <span className="text-[9px] font-black text-pink-600 select-none">M</span>
        );
      }

      if (brandKey === 'ola') {
        return (
          <span className="text-[9px] font-black text-black select-none">OLA</span>
        );
      }

      if (brandKey === 'phonepe') {
        return (
          <span className="text-[12px] font-bold text-white select-none" style={{ fontFamily: 'Georgia, serif' }}>Pe</span>
        );
      }

      if (brandKey === 'zoho') {
        return (
          <span className="text-[9px] font-black text-blue-600 select-none">Z</span>
        );
      }

      if (brandKey === 'walmart') {
        return (
          <span className="text-[8px] font-black text-white select-none">W</span>
        );
      }

      if (brandKey === 'sumo' || brandKey === 'sumo logic') {
        return (
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 16.5l-6-3V9.5l6 3v6zm8-3l-6 3v-6l6-3v6z"/>
          </svg>
        );
      }
    }

    // 2. Try rendering image URL if it exists and hasn't failed
    if (logoUrl && !imageFailed) {
      return (
        <img 
          src={logoUrl} 
          alt={name} 
          className="w-full h-full object-cover rounded-full bg-white" 
          onError={() => setImageFailed(true)}
        />
      );
    }

    // 3. General default letter fallback
    return (
      <span className="text-xs font-black uppercase select-none">
        {name[0]}
      </span>
    );
  };

  // Resolve background classes
  let bgClass = getHashColor(name);
  let borderClass = 'border-white/10';

  if (brandKey) {
    const matchedStyle = brandStyleMap[brandKey];
    bgClass = matchedStyle.bg;
    borderClass = matchedStyle.border;
  } else if (logoUrl && !imageFailed) {
    bgClass = 'bg-white';
    borderClass = 'border-white/10';
  }

  return (
    <span className={`${className} rounded-full flex items-center justify-center p-1 overflow-hidden flex-shrink-0 hover:scale-110 transition-all duration-200 border ${bgClass} ${borderClass}`}>
      {renderInnerLogo()}
    </span>
  );
};
