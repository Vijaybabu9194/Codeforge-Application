/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFBFC',
        secondaryBg: '#F5F7FA',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        accent: '#8B5CF6',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#111827',
        secondaryText: '#6B7280',
        muted: '#94A3B8',
        border: '#E5E7EB',
        // Landing page dark theme
        landing: {
          bg: '#020205',
          card: '#0B1026',
          blue: '#4A6CF7',
          blueLight: '#6B8AFF',
          textMuted: '#7B8AB8',
          textDim: '#4A5580',
          border: 'rgba(255,255,255,0.07)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'premium': '20px',
      },
      boxShadow: {
        'card': '0px 10px 30px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-gentle': 'floatGentle 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      }
    },
  },
  plugins: [],
}
