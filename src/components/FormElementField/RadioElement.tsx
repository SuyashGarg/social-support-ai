import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import type { FormElement } from '../../types/form';

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
    const errorId = errorMessage ? `${element.id}-error` : undefined;
    const labelId = `${element.id}-label`;

    return (
        <FormControl
            component="fieldset"
            required={required}
            error={Boolean(errorMessage)}
            aria-describedby={errorId}
            aria-required={required || undefined}
        >
            <FormLabel
                component="legend"
                id={labelId}
                required={required}
                sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}
            >
                {label}
            </FormLabel>
            <RadioGroup
                row
                name={element.name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                aria-labelledby={labelId}
                aria-describedby={errorId}
                aria-required={required || undefined}
            >
                {element.options?.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio aria-label={renderOptionLabel(option.labelKey)} />}
                        label={renderOptionLabel(option.labelKey)}
                        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    />
                ))}
            </RadioGroup>
            {errorMessage ? (
                <FormHelperText id={errorId} role="alert">
                    {errorMessage}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}
