import { TextField } from '@mui/material'
import type { TextareaFieldElementProps } from './types'

export default function TextareaElement({
    element,
    value,
    label,
    placeholder,
    isRtl,
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
            InputLabelProps={{ required }}
            error={Boolean(errorMessage)}
            helperText={errorMessage ?? ' '}
            fullWidth
            size="small"
        />
    )
}
