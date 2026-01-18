import { theme } from '../theme';

export const historyPageStyles = {
    container: {
        padding: { xs: 2, md: 8 },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: { xs: 2, md: 4 },
    },
    backButton: {
        minWidth: 0,
        padding: 0,
        textTransform: 'none' as const,
    },
    title: {
        fontWeight: 700,
        fontSize: { xs: '1rem', md: '1.5rem' },
    },
    empty: {
        color: theme.colors.textMuted,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    tableCellHeader: {
        color: theme.colors.textMuted,
        fontWeight: 600,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    linkButton: {
        minWidth: 0,
        padding: 0,
        textTransform: 'none' as const,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    tableCell: {
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
};
