import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import type { FormElement } from '../../types/form';

type Props = {
    element: FormElement
    label: string
    checked: boolean
    required?: boolean
    errorMessage?: string | null
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLButtonElement>
}

export default function CheckboxElement({ element, label, checked, required, errorMessage, onChange, onBlur }: Props) {
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
            <FormControlLabel
                control={
                    <Checkbox
                        id={element.id}
                        name={element.name}
                        checked={checked}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-labelledby={labelId}
                        aria-describedby={errorId}
                        aria-required={required || undefined}
                    />
                }
                label={<span id={labelId}>{label}</span>}
            />
            {errorMessage ? (
                <FormHelperText id={errorId} role="alert">
                    {errorMessage}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}
