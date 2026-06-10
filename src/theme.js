export const theme = {
  colors: {
    primary: '#00C853',
    primaryContainer: '#E8F5E9',
    secondary: '#2962FF',
    secondaryContainer: '#E3F2FD',
    tertiary: '#FF6D00',
    tertiaryContainer: '#FFF3E0',
    surface: '#FFFFFF',
    surfaceVariant: '#ECEFF1',
    background: '#F5F7FA',
    error: '#D50000',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#263238',
    onSurfaceVariant: '#546E7A',
    onBackground: '#263238',
    outline: '#CFD8DC',
    outlineVariant: '#E0E0E0',
  },
  roundness: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  sm: {
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#263238',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const typography = {
  hero: { fontSize: 32, fontWeight: '800', lineHeight: 38, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: '700', lineHeight: 32, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
};
