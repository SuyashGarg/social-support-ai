import { theme } from '../theme'

export const historyPageStyles = {
    container: {
        padding: 8,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    backButton: {
        minWidth: 0,
        padding: 0,
        textTransform: 'none' as const,
    },
    title: {
        fontWeight: 700,
    },
    empty: {
        color: theme.colors.textMuted,
    },
    tableCellHeader: {
        color: theme.colors.textMuted,
        fontWeight: 600,
    },
    linkButton: {
        minWidth: 0,
        padding: 0,
        textTransform: 'none' as const,
    },
}
