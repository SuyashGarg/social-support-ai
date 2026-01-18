import type { FormElement } from '../../types/form';
import VirtualizedSelect from '../VirtualizedSelect';

type Props = {
    element: FormElement
    value: string
    label: string
    placeholder: string
    required?: boolean
    errorMessage?: string | null
    onChange: (value: string) => void
    onBlur: () => void
    renderOptionLabel: (labelKey: string) => string
}

export default function SelectElement({
    element,
    value,
    label,
    placeholder,
    required,
    errorMessage,
    onChange,
    onBlur,
    renderOptionLabel,
}: Props) {
    const options =
        element.options?.map((option) => ({
            value: option.value,
            label: renderOptionLabel(option.labelKey),
        })) ?? [];

    return (
        <VirtualizedSelect
            id={element.id}
            name={element.name}
            label={label}
            placeholder={placeholder}
            value={value}
            options={options}
            required={required}
            errorMessage={errorMessage}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
