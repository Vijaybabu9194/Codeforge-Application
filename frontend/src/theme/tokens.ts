export const tokens = {
  colors: {
    background: '#FAFBFC',
    'secondary-bg': '#F5F7FA',
    surface: '#FFFFFF',
    primary: '#6366F1',
    'primary-hover': '#4F46E5',
    accent: '#8B5CF6',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: '#111827',
    'secondary-text': '#6B7280',
    muted: '#94A3B8',
    border: '#E5E7EB',
  },
  shadows: {
    card: '0px 10px 30px rgba(15,23,42,0.06)',
    glow: '0 0 0 4px rgba(99,102,241,0.08)',
  },
  typography: {
    'hero-heading': { size: '72px', weight: 700 },
    'section-heading': { size: '40px', weight: 700 },
    subheading: { size: '24px', weight: 600 },
    body: { size: '16px', weight: 500 },
    small: { size: '14px', weight: 500 },
  },
} as const

export type Tokens = typeof tokens
