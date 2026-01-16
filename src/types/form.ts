export type Language = 'en' | 'ar'

export type TranslationKey = string

export type ElementType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'tel'
  | 'phone'
  | 'select'
  | 'dropdown'
  | 'id'

export type FormOption = {
  value: string
  labelKey: TranslationKey
}

export type FormElement = {
  id: string
  type: ElementType
  name: string
  labelKey: TranslationKey
  placeholderKey?: TranslationKey
  options?: FormOption[]
  pattern?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
}

export type FormStep = {
  id: string
  titleKey: TranslationKey
  elements: FormElement[]
}
