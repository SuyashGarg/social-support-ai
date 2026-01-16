import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FormElement } from '../../types/form'
import { formatNationalId, getDir } from '../../common/utils'
import { useLanguage } from '../../context/LanguageContext'
import TextInputElement from './TextInputElement'
import TextareaElement from './TextareaElement'
import TextareaAssistElement from './TextareaAssistElement'
import SelectElement from './SelectElement'
import CheckboxElement from './CheckboxElement'
import RadioElement from './RadioElement'
import AutocompleteElement from './AutocompleteElement'

type Props = {
  element: FormElement
  value: string | boolean | undefined
  formData: Record<string, string | boolean>
  errorMessage?: string | null
  onChange: (name: string, value: string | boolean) => void
  onBlur?: (element: FormElement, value: string | boolean | undefined) => void
}

export default function FormElementField({
  element,
  value,
  formData,
  errorMessage,
  onChange,
  onBlur,
}: Props) {
  const { t } = useTranslation()
  const { isRtl } = useLanguage()
  const label = t(element.labelKey)
  const placeholder = element.placeholderKey ? t(element.placeholderKey) : ''
  const dir = getDir(isRtl)
  const renderOptionLabel = (labelKey: string) => t(labelKey)
  const handleBlur = (nextValue?: string | boolean) =>
    onBlur?.(element, typeof nextValue === 'undefined' ? value : nextValue)
  const handleTextFocus = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (event) => {
      if (element.inputMode !== 'numeric') return
      const target = event.currentTarget
      window.setTimeout(() => target.select(), 0)
    },
    [element.inputMode],
  )
  const handleTextInputChange = (nextValue: string) => {
    const formatted = element.type === 'id' ? formatNationalId(nextValue) : nextValue
    onChange(element.name, formatted)
  }
  const handleTextareaValueChange = useCallback(
    (nextValue: string) => {
      onChange(element.name, nextValue)
    },
    [element.name, onChange],
  )
  const handleTextareaChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      onChange(element.name, event.target.value)
    },
    [element.name, onChange],
  )

  switch (element.type) {
    case 'text':
    case 'email':
    case 'date':
    case 'tel':
    case 'phone':
    case 'id':
      return (
        <TextInputElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          isRtl={isRtl}
          dir={dir}
          required={element.required}
          errorMessage={errorMessage}
          onChange={(event) => handleTextInputChange(event.target.value)}
          onBlur={(event) => handleBlur(event.currentTarget.value)}
          onFocus={handleTextFocus}
        />
      )
    case 'textarea':
      return element.assist ? (
        <TextareaAssistElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          isRtl={isRtl}
          dir={dir}
          required={element.required}
          errorMessage={errorMessage}
          onValueChange={handleTextareaValueChange}
          onBlur={(event) => handleBlur(event.currentTarget.value)}
        />
      ) : (
        <TextareaElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          isRtl={isRtl}
          dir={dir}
          required={element.required}
          errorMessage={errorMessage}
          onChange={handleTextareaChange}
          onBlur={(event) => handleBlur(event.currentTarget.value)}
        />
      )
    case 'select':
    case 'dropdown':
      return (
        <SelectElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          isRtl={isRtl}
          dir={dir}
          onChange={(nextValue) => onChange(element.name, nextValue)}
          onBlur={() => handleBlur(typeof value === 'string' ? value : '')}
          required={element.required}
          errorMessage={errorMessage}
          renderOptionLabel={renderOptionLabel}
        />
      )
    case 'country':
      return (
        <AutocompleteElement
          element={element}
          fieldType="country"
          value={typeof value === 'string' ? value : null}
          isRtl={isRtl}
          required={element.required}
          errorMessage={errorMessage}
          onValueChange={(name, nextValue) => onChange(name, nextValue ?? '')}
          onBlur={() => handleBlur()}
        />
      )
    case 'state':
      return (
        <AutocompleteElement
          element={element}
          fieldType="state"
          value={typeof value === 'string' ? value : null}
          countryCode={typeof formData.countryCode === 'string' ? formData.countryCode : null}
          isRtl={isRtl}
          required={element.required}
          errorMessage={errorMessage}
          onValueChange={(name, nextValue) => onChange(name, nextValue ?? '')}
          onBlur={() => handleBlur()}
        />
      )
    case 'address':
      return (
        <AutocompleteElement
          element={element}
          fieldType="address"
          value={typeof value === 'string' ? value : null}
          countryCode={typeof formData.countryCode === 'string' ? formData.countryCode : null}
          isRtl={isRtl}
          required={element.required}
          errorMessage={errorMessage}
          onValueChange={(name, nextValue) => onChange(name, nextValue ?? '')}
          onBlur={() => handleBlur()}
        />
      )
    case 'checkbox':
      return (
        <CheckboxElement
          element={element}
          label={label}
          checked={Boolean(value)}
          isRtl={isRtl}
          onChange={(event) => onChange(element.name, event.target.checked)}
          onBlur={() => handleBlur(Boolean(value))}
        />
      )
    case 'radio':
      return (
        <RadioElement
          element={element}
          label={label}
          value={typeof value === 'string' ? value : ''}
          isRtl={isRtl}
          dir={dir}
          onChange={(event) => onChange(element.name, event.target.value)}
          onBlur={() => handleBlur(typeof value === 'string' ? value : '')}
          required={element.required}
          errorMessage={errorMessage}
          renderOptionLabel={renderOptionLabel}
        />
      )
    default:
      return null
  }
}
