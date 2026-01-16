export const getLabelSx = (isRtl: boolean) => ({
    textAlign: isRtl ? 'right' : 'left',
    right: isRtl ? 0 : 'auto',
    left: isRtl ? 'auto' : 0,
    transformOrigin: isRtl ? 'top right' : 'top left',
})
