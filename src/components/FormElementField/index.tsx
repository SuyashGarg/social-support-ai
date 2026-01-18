import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormElement } from '../../types/form';
import { formatNationalId } from '../../common/utils';
import TextInputElement from './TextInputElement';
import TextareaElement from './TextareaElement';
import TextareaAssistElement from './TextareaAssistElement';
import SelectElement from './SelectElement';
import CheckboxElement from './CheckboxElement';
import RadioElement from './RadioElement';
import AutocompleteElement from './AutocompleteElement';
import DatePickerElement from './DatePickerElement';
import { useLanguage } from '../../context/LanguageContext';
import { useForm } from '../MultiStepForm/MultiStepFormContext';

type Props = {
  element: FormElement
  value: string | boolean | undefined
  errorMessage?: string | null
}

export default function FormElementField({
  element,
  value,
  errorMessage,
}: Props) {
  const { formData, onChange, onBlur } = useForm();
  const { t } = useTranslation();
  const { isRtl } = useLanguage();
  const label = t(element.labelKey);
  const placeholder = element.placeholderKey ? t(element.placeholderKey) : '';
  const renderOptionLabel = (labelKey: string) => t(labelKey);
  const handleBlur = (nextValue?: string | boolean) =>
    onBlur?.(element, typeof nextValue === 'undefined' ? value : nextValue);
  const handleTextFocus = useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (event) => {
      if (element.inputMode !== 'numeric') return;
      const target = event.currentTarget;
      window.setTimeout(() => target.select(), 0);
    },
    [element.inputMode],
  );
  const handleTextInputChange = (nextValue: string) => {
    const formatted = element.type === 'id' ? formatNationalId(nextValue) : nextValue;
    onChange(element.name, formatted);
  };
  const handleTextareaValueChange = useCallback(
    (nextValue: string) => {
      onChange(element.name, nextValue);
    },
    [element.name, onChange],
  );
  const handleTextareaChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      onChange(element.name, event.target.value);
    },
    [element.name, onChange],
  );

  switch (element.type) {
    case 'date':
      return (
        <DatePickerElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          isRtl={isRtl}
          required={element.required}
          errorMessage={errorMessage}
          onChange={(nextValue) => onChange(element.name, nextValue)}
          onBlur={() => handleBlur(typeof value === 'string' ? value : '')}
        />
      );
    case 'text':
    case 'email':
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
          required={element.required}
          errorMessage={errorMessage}
          onChange={(event) => handleTextInputChange(event.target.value)}
          onBlur={(event) => handleBlur(event.currentTarget.value)}
          onFocus={handleTextFocus}
        />
      );
    case 'textarea':
      return element.assist ? (
        <TextareaAssistElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
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
          required={element.required}
          errorMessage={errorMessage}
          onChange={handleTextareaChange}
          onBlur={(event) => handleBlur(event.currentTarget.value)}
        />
      );
    case 'select':
    case 'dropdown':
      return (
        <SelectElement
          element={element}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          onChange={(nextValue) => onChange(element.name, nextValue)}
          onBlur={() => handleBlur(typeof value === 'string' ? value : '')}
          required={element.required}
          errorMessage={errorMessage}
          renderOptionLabel={renderOptionLabel}
        />
      );
    case 'country':
    case 'state':
    case 'address':
      return (
        <AutocompleteElement
          element={element}
          fieldType={element.type as 'country' | 'state' | 'address'}
          value={typeof value === 'string' ? value : null}
          countryCode={
            (element.type === 'state' || element.type === 'address') && typeof formData.countryCode === 'string'
              ? formData.countryCode
              : null
          }
          required={element.required}
          errorMessage={errorMessage}
        />
      );
    case 'checkbox':
      return (
        <CheckboxElement
          element={element}
          label={label}
          checked={Boolean(value)}
          required={element.required}
          errorMessage={errorMessage}
          onChange={(event) => onChange(element.name, event.target.checked)}
          onBlur={() => handleBlur(Boolean(value))}
        />
      );
    case 'radio':
      return (
        <RadioElement
          element={element}
          label={label}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(element.name, event.target.value)}
          onBlur={() => handleBlur(typeof value === 'string' ? value : '')}
          required={element.required}
          errorMessage={errorMessage}
          renderOptionLabel={renderOptionLabel}
        />
      );
    default:
      return null;
  }
}
