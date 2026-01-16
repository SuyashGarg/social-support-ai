export const textareaAssistStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 1,
    },
    buttonRow: (isRtl: boolean) => ({
        display: 'flex',
        justifyContent: 'flex-end',
        direction: isRtl ? 'rtl' : 'ltr',
    }),
    helpButton: {
        cursor: 'pointer',
    },
    dialogField: {
        marginTop: 8,
    },
    errorText: {
        marginTop: 8,
    },
}
