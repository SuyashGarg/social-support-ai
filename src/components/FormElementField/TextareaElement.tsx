import { TextField } from '@mui/material'
import type { TextareaFieldElementProps } from './types'

export default function TextareaElement({
    element,
    value,
    label,
    placeholder,
    required,
    errorMessage,
    onChange,
    onBlur,
}: TextareaFieldElementProps) {
    const errorId = errorMessage ? `${element.id}-error` : undefined

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
            inputProps={{
                'aria-describedby': errorId,
                'aria-required': required || undefined,
                'aria-invalid': Boolean(errorMessage) || undefined,
            }}
            error={Boolean(errorMessage)}
            helperText={errorMessage || undefined}
            FormHelperTextProps={{
                id: errorId,
                role: errorMessage ? 'alert' : undefined,
            }}
            fullWidth
            size="small"
            aria-label={label}
        />
    )
}
