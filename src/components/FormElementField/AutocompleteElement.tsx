import type { FormElement } from '../../types/form';
import GoogleAutocompleteField from '../GoogleAutocompleteField';
import { useForm } from '../MultiStepForm/MultiStepFormContext';

type Props = {
    element: FormElement
    fieldType: 'country' | 'state' | 'address'
    value: string | null
    countryCode?: string | null
    required?: boolean
    errorMessage?: string | null
}

export default function AutocompleteElement({
    element,
    fieldType,
    value,
    countryCode,
    required,
    errorMessage,
}: Props) {
    const { onChange, onMetaChange, onBlur } = useForm();

    return (
        <GoogleAutocompleteField
            id={element.id}
            name={element.name}
            labelKey={element.labelKey}
            placeholderKey={element.placeholderKey}
            fieldType={fieldType}
            value={value}
            countryCode={countryCode}
            required={required}
            errorMessage={errorMessage}
            onValueChange={(name, nextValue) => onChange(name, nextValue ?? '')}
            onMetaChange={(meta) => onMetaChange?.(element.name, meta)}
            onBlur={() => onBlur(element, value ?? undefined)}
        />
    );
}
