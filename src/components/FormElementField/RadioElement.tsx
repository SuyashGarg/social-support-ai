import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { FormElement } from '../../types/form'
import { getLabelSx } from './styles'

type Props = {
    element: FormElement
    label: string
    value: string
    isRtl: boolean
    dir: string
    required?: boolean
    errorMessage?: string | null
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLElement>
    renderOptionLabel: (labelKey: string) => string
}

export default function RadioElement({
    element,
    label,
    value,
    isRtl,
    dir,
    required,
    errorMessage,
    onChange,
    onBlur,
    renderOptionLabel,
}: Props) {
    return (
        <FormControl component="fieldset" dir={dir} required={required} error={Boolean(errorMessage)}>
            <FormLabel component="legend" sx={getLabelSx(isRtl)} required={required}>
                {label}
            </FormLabel>
            <RadioGroup
                row
                name={element.name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                sx={{ justifyContent: isRtl ? 'flex-end' : 'flex-start' }}
            >
                {element.options?.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={renderOptionLabel(option.labelKey)}
                    />
                ))}
            </RadioGroup>
            {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
        </FormControl>
    )
}
