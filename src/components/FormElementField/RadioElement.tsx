import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { FormElement } from '../../types/form'

type Props = {
    element: FormElement
    label: string
    value: string
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
    required,
    errorMessage,
    onChange,
    onBlur,
    renderOptionLabel,
}: Props) {
    return (
        <FormControl component="fieldset" required={required} error={Boolean(errorMessage)}>
            <FormLabel component="legend" required={required} sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                {label}
            </FormLabel>
            <RadioGroup
                row
                name={element.name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            >
                {element.options?.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={renderOptionLabel(option.labelKey)}
                        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    />
                ))}
            </RadioGroup>
            {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
        </FormControl>
    )
}
