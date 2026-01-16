import { getTextAlign } from '../../common/utils'

export const getInputStyles = (isRtl: boolean) => ({
    '& .MuiInputBase-input': { textAlign: getTextAlign(isRtl) },
    '& .MuiInputBase-root': { cursor: 'pointer' },
    '& .MuiInputBase-input::placeholder': { cursor: 'pointer' },
})
