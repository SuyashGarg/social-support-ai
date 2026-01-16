import { createTheme } from '@mui/material/styles'

export const theme = {
  colors: {
    appBackground: '#f3f4f6',
    surface: '#ffffff',
    surfaceMuted: '#f9fafb',
    textPrimary: '#111827',
    textMuted: '#6b7280',
    border: '#d1d5db',
    borderMuted: '#e5e7eb',
    primary: '#111827',
    onPrimary: '#ffffff',
    success: '#16a34a',
    disabledBackground: '#d1d5db',
    disabledText: '#4b5563',
  },
  fonts: {
    base: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shadows: {
    soft: '0 10px 25px rgba(15, 23, 42, 0.05)',
  },
} as const

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary,
      contrastText: theme.colors.onPrimary,
    },
    background: {
      default: theme.colors.appBackground,
      paper: theme.colors.surface,
    },
    text: {
      primary: theme.colors.textPrimary,
      secondary: theme.colors.textMuted,
    },
  },
  typography: {
    fontFamily: theme.fonts.base,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&.Mui-disabled': {
            cursor: 'not-allowed',
          },
        },
      },
    },
  },
})
