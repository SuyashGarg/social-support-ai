import { theme } from '../../theme'

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
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        fontWeight: 700,
        marginBottom: 2,
        marginTop: 2,
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
    },
    rowValue: {
        color: theme.colors.textPrimary,
        fontWeight: 600,
    },
    sectionDivider: {
        marginTop: 8,
        marginBottom: 4,
        borderColor: theme.colors.textPrimary,
    },
}

export const getRowStyles = (isLast: boolean) => ({
    ...reviewPageStyles.row,
    ...(isLast ? reviewPageStyles.rowLast : {}),
})
