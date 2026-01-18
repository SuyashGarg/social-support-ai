export const textareaAssistStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 1,
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: { xs: '0.5rem 0', md: '0' },
    },
    helpLink: {
        color: 'primary.main',
        textDecoration: 'none',
        fontSize: '0.875rem',
        '&:hover': {
            textDecoration: 'underline',
        },
        '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
            borderRadius: '2px',
        },
    },
    dialogField: {
        marginTop: 2,
    },
    errorText: {
        marginTop: 8,
    },
};
