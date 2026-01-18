import { theme } from '../../theme';

export const reviewPageStyles = {
    spacing: {
        xs: 8,
        sm: 12,
        md: 16,
    },
    container: {
        padding: { xs: 2, md: 8 },
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 1,
    },
    title: {
        fontWeight: 700,
        fontSize: { xs: '1rem', md: '1.5rem' },
    },
    titleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        marginBottom: 5,
    },
    titleIcon: {
        color: theme.colors.success,
    },
    empty: {
        color: theme.colors.textMuted,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        fontWeight: 700,
        marginBottom: 2,
        marginTop: 2,
        fontSize: { xs: '0.875rem', md: '1.25rem' },
    },
    sectionRows: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 2,
    },
    row: {
        paddingBottom: 0,
        borderBottom: 'none',
    },
    rowLast: {
        borderBottom: 'none',
        paddingBottom: 0,
    },
    rowLabel: {
        color: theme.colors.textMuted,
        fontWeight: 500,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    rowValue: {
        color: theme.colors.textPrimary,
        fontWeight: 600,
        fontSize: { xs: '0.75rem', md: '0.875rem' },
    },
    sectionDivider: {
        marginTop: 8,
        marginBottom: 4,
        borderColor: theme.colors.textPrimary,
    },
};

export const getRowStyles = (isLast: boolean) => ({
    ...reviewPageStyles.row,
    ...(isLast ? reviewPageStyles.rowLast : {}),
});
