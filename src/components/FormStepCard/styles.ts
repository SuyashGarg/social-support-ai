import { theme } from '../../theme'

export const formStepCardStyles = {
  formCard: {
    border: `1px solid ${theme.colors.borderMuted}`,
    borderRadius: 16,
    padding: 14,
    boxShadow: theme.shadows.soft,
  },
  formCardRtl: {
    textAlign: 'right' as const,
  },
  stepHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    marginBottom: 10,
  },
  stepTitle: {
    fontWeight: 600,
    color: theme.colors.textMuted,
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
}
