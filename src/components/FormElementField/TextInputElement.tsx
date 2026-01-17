import { InputAdornment, TextField } from '@mui/material'
import type { TextFieldElementProps } from './types'

// Fields that should always be LTR regardless of language (numeric/standard formats)
const LTR_FIELDS = ['phone', 'id', 'email']

// Get today's date in YYYY-MM-DD format for max date restriction
const getTodayDate = () => new Date().toISOString().split('T')[0]

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
    const isDateField = element.type === 'date'
    const shouldForceLtr = LTR_FIELDS.includes(element.type)
    const inputDir = shouldForceLtr ? 'ltr' : undefined
    const inputAlign = shouldForceLtr && isRtl ? 'right' : undefined
    const maxDate = isDateField && element.allowFuture === false ? getTodayDate() : undefined

    return (
        <TextField
            id={element.id}
            name={element.name}
            type={element.type === 'phone' ? 'tel' : element.type === 'id' ? 'text' : element.type}
            value={value}
            label={label}
            placeholder={isDateField ? undefined : placeholder}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            inputProps={{
                pattern: element.pattern,
                inputMode: element.inputMode,
                placeholder: isDateField ? placeholder : undefined,
                dir: inputDir,
                style: inputAlign ? { textAlign: inputAlign } : undefined,
                max: maxDate,
            }}
            InputLabelProps={{
                shrink: isDateField ? true : undefined,
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
            sx={isDateField ? {
                '& input[type="date"]': {
                    textAlign: isRtl ? 'right' : 'left',
                    paddingRight: isRtl ? '32px' : undefined,
                    paddingLeft: isRtl ? undefined : '32px',
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    position: 'absolute',
                    left: isRtl ? 'auto' : '8px',
                    right: isRtl ? '8px' : 'auto',
                    cursor: 'pointer',
                },
            } : undefined}
            error={Boolean(errorMessage)}
            helperText={errorMessage ?? ' '}
            fullWidth
            size="small"
        />
    )
}
