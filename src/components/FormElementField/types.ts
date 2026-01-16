import type { FormElement } from '../../types/form'

export type BaseFieldProps = {
    element: FormElement
    label: string
    isRtl: boolean
    dir: string
    required?: boolean
    errorMessage?: string | null
}

export type TextFieldElementProps = BaseFieldProps & {
    value: string
    placeholder: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    onFocus: React.FocusEventHandler<HTMLInputElement>
}

export type TextareaFieldElementProps = BaseFieldProps & {
    value: string
    placeholder: string
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
    onBlur: React.FocusEventHandler<HTMLTextAreaElement>
}
