import { theme } from '../../theme'

export const formStepCardStyles = {
  formCard: {
    border: `1px solid ${theme.colors.borderMuted}`,
    borderRadius: 6,
    padding: 10,
    boxShadow: theme.shadows.soft,
  },
  stepHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    marginBottom: 10,
  },
  stepHeaderRtl: {
    alignItems: 'flex-end',
  },
  stepTitle: {
    fontWeight: 600,
    color: theme.colors.textMuted,
  },
  sectionTitle: {
    fontWeight: 600,
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
    gap: 3,
  },
}
