import { theme } from '../theme'

export const appStyles = {
  app: {
    maxWidth: 720,
    width: '100%',
    margin: '0 auto',
    padding: '16px 16px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    color: theme.colors.textPrimary,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap' as const,
    width: '100%',
  },
  toolbarRtl: {
    flexDirection: { xs: 'column', sm: 'row-reverse' } as const,
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 1, sm: 16 },
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: '0 1 auto',
    maxWidth: '70%',
    minWidth: 0,
    width: { xs: '100%', sm: 'auto' },
  },
  titleRtl: {
    textAlign: 'right' as const,
  },
}
