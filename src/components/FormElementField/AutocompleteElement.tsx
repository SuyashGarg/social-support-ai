import type { FormElement } from '../../types/form'
import GoogleAutocompleteField from '../GoogleAutocompleteField'

type Props = {
    element: FormElement
    fieldType: 'country' | 'state' | 'address'
    value: string | null
    countryCode?: string | null
    required?: boolean
    errorMessage?: string | null
    onValueChange: (name: string, nextValue: string | null) => void
    onMetaChange?: (meta: Record<string, string | null>) => void
    onBlur: () => void
}

export default function AutocompleteElement({
    element,
    fieldType,
    value,
    countryCode,
    required,
    errorMessage,
    onValueChange,
    onMetaChange,
    onBlur,
}: Props) {
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
            onValueChange={onValueChange}
            onMetaChange={onMetaChange}
            onBlur={onBlur}
        />
    )
}
