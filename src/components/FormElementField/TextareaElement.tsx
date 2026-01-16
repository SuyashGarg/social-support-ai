import { TextField } from '@mui/material'
import { getLabelSx } from './styles'
import { getTextAlign } from '../../common/utils'
import type { TextareaFieldElementProps } from './types'

export default function TextareaElement({
    element,
    value,
    label,
    placeholder,
    isRtl,
    dir,
    required,
    errorMessage,
    onChange,
    onBlur,
}: TextareaFieldElementProps) {
    return (
        <TextField
            id={element.id}
            name={element.name}
            value={value}
            label={label}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            multiline
            minRows={4}
            inputProps={{
                dir,
                style: { textAlign: getTextAlign(isRtl) },
            }}
            InputLabelProps={{ sx: getLabelSx(isRtl), required }}
            sx={{
                '& .MuiInputBase-input': { textAlign: getTextAlign(isRtl) },
            }}
            error={Boolean(errorMessage)}
            helperText={errorMessage ?? ' '}
            fullWidth
            size="small"
        />
    )
}
