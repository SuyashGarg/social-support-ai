import { InputAdornment, TextField } from '@mui/material'
import type { TextFieldElementProps } from './types'

// Fields that should always be LTR regardless of language (numeric/standard formats)
const LTR_FIELDS = ['phone', 'id', 'email']

export default function TextInputElement({
    element,
    value,
    label,
    placeholder,
    isRtl,
    required,
    errorMessage,
    onChange,
    onBlur,
    onFocus,
}: TextFieldElementProps) {
    const shouldForceLtr = LTR_FIELDS.includes(element.type)
    const inputDir = shouldForceLtr ? 'ltr' : undefined
    const inputAlign = shouldForceLtr && isRtl ? 'right' : undefined

    return (
        <TextField
            id={element.id}
            name={element.name}
            type={element.type === 'phone' ? 'tel' : element.type === 'id' ? 'text' : element.type}
            value={value}
            label={label}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            inputProps={{
                pattern: element.pattern,
                inputMode: element.inputMode,
                dir: inputDir,
                style: inputAlign ? { textAlign: inputAlign } : undefined,
            }}
            InputLabelProps={{
                required,
            }}
            InputProps={
                element.prefix
                    ? {
                        startAdornment: (
                            <InputAdornment position="start">{element.prefix}</InputAdornment>
                        ),
                    }
                    : undefined
            }
            error={Boolean(errorMessage)}
            helperText={errorMessage ?? ' '}
            fullWidth
            size="small"
        />
    )
}
