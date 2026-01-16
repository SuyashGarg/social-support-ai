import { InputAdornment, TextField } from '@mui/material'
import { getLabelSx } from './styles'
import { getTextAlign } from '../../common/utils'
import type { TextFieldElementProps } from './types'

export default function TextInputElement({
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
    onFocus,
}: TextFieldElementProps) {
    return (
        <div dir={dir}>
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
                    dir,
                    style: { textAlign: getTextAlign(isRtl) },
                }}
                InputLabelProps={{
                    shrink: element.type === 'date' ? true : undefined,
                    required,
                    sx: getLabelSx(isRtl),
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
                sx={{
                    '& .MuiInputBase-input': { textAlign: getTextAlign(isRtl) },
                }}
                error={Boolean(errorMessage)}
                helperText={errorMessage ?? ' '}
                fullWidth
                size="small"
            />
        </div>
    )
}
