export const multiStepFormStyles = {
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  button: {
    padding: '7px 12px',
    fontWeight: 600,
    cursor: 'pointer',
    gap: 1,
  },
  buttonDisabled: {
    cursor: 'not-allowed',
  },
  preview: {
    borderRadius: 12,
    padding: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'divider',
    backgroundColor: 'background.default',
  },
  previewRtl: {
    textAlign: 'right' as const,
  },
  previewTitle: {
    marginTop: 0,
  },
}
