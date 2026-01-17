import { theme } from '../../theme'

export const formStepCardStyles = {
  formCard: {
    border: `1px solid ${theme.colors.borderMuted}`,
    borderRadius: 6,
    padding: { xs: 2, md: 10 },
    boxShadow: theme.shadows.soft,
  },
  stepHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    marginBottom: { xs: 3, md: 10 },
  },
  stepHeaderRtl: {
    alignItems: 'flex-end',
  },
  stepTitle: {
    fontWeight: 600,
    color: theme.colors.textMuted,
    fontSize: { xs: '0.75rem', md: '0.875rem' },
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: { xs: '1rem', md: '1.5rem' },
  },
  stepProgress: {
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.borderMuted,
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: { xs: 0.5, md: 3 },
  },
}
