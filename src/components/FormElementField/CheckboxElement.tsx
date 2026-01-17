import { Checkbox, FormControlLabel } from '@mui/material'
import type { FormElement } from '../../types/form'

type Props = {
    element: FormElement
    label: string
    checked: boolean
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLButtonElement>
}

export default function CheckboxElement({ element, label, checked, onChange, onBlur }: Props) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    id={element.id}
                    name={element.name}
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            }
            label={label}
        />
    )
}
