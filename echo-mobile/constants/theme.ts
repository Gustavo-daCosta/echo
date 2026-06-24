export const Accent = {
  primary: '#0050EF',
  primaryLight: '#3373F2',
  primaryDark: '#003EC4',
  primaryBg: '#E8F0FE',
} as const;

export const Neutral = {
  white: '#FFFFFF',
  bg: '#F8F9FA',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F0F0F0',
  text: '#11181C',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.06)',
} as const;

export const Semantic = {
  success: '#00D26A',
  warning: '#F59E0B',
  error: '#EF4444',
  match: '#0050EF',
} as const;

export const Chart = {
  danceability: '#0050EF',
  energy: '#00D26A',
  valence: '#F59E0B',
  acousticness: '#8B5CF6',
  instrumentalness: '#EC4899',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  hero: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '600' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
  badge: { fontSize: 10, fontWeight: '700' as const },
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const Colors = {
  light: {
    text: Neutral.text,
    background: Neutral.bg,
    tint: Accent.primary,
    icon: Neutral.textSecondary,
    tabIconDefault: Neutral.textTertiary,
    tabIconSelected: Accent.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: Accent.primaryLight,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: Accent.primaryLight,
  },
};
