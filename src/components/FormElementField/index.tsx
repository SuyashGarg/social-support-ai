import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { FormElement } from '../../types/form'
import { getLabelSx } from './styles'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  element: FormElement
  value: string | boolean | undefined
  onChange: (name: string, value: string | boolean) => void
}

export default function FormElementField({ element, value, onChange }: Props) {
  const { t } = useTranslation()
  const { isRtl } = useLanguage()
  const label = t(element.labelKey)
  const placeholder = element.placeholderKey ? t(element.placeholderKey) : ''

  switch (element.type) {
    case 'text':
    case 'email':
    case 'date':
    case 'tel':
    case 'phone':
    case 'id':
      return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
          <TextField
            id={element.id}
            name={element.name}
            type={element.type === 'phone' ? 'tel' : element.type === 'id' ? 'text' : element.type}
            value={typeof value === 'string' ? value : ''}
            label={label}
            placeholder={placeholder}
            onChange={(event) => onChange(element.name, event.target.value)}
            inputProps={{
              pattern: element.pattern,
              inputMode: element.inputMode,
              dir: isRtl ? 'rtl' : 'ltr',
              style: { textAlign: isRtl ? 'right' : 'left' },
            }}
            InputLabelProps={{
              shrink: element.type === 'date' ? true : undefined,
              sx: getLabelSx(isRtl),
            }}
            sx={{
              '& .MuiInputBase-input': { textAlign: isRtl ? 'right' : 'left' },
            }}
            fullWidth
            size="small"
          />
        </div>
      )
    case 'textarea':
      return (
        <TextField
          id={element.id}
          name={element.name}
          value={typeof value === 'string' ? value : ''}
          label={label}
          placeholder={placeholder}
          onChange={(event) => onChange(element.name, event.target.value)}
          multiline
          minRows={4}
          inputProps={{
            dir: isRtl ? 'rtl' : 'ltr',
            style: { textAlign: isRtl ? 'right' : 'left' },
          }}
          InputLabelProps={{ sx: getLabelSx(isRtl) }}
          sx={{
            '& .MuiInputBase-input': { textAlign: isRtl ? 'right' : 'left' },
          }}
          fullWidth
          size="small"
        />
      )
    case 'select':
    case 'dropdown':
      return (
        <FormControl fullWidth size="small" dir={isRtl ? 'rtl' : 'ltr'}>
          <InputLabel id={`${element.id}-label`} sx={getLabelSx(isRtl)}>
            {label}
          </InputLabel>
          <Select
            labelId={`${element.id}-label`}
            id={element.id}
            name={element.name}
            value={typeof value === 'string' ? value : ''}
            label={label}
            onChange={(event) => onChange(element.name, event.target.value)}
            sx={{
              textAlign: isRtl ? 'right' : 'left',
              '& .MuiSelect-select': { textAlign: isRtl ? 'right' : 'left' },
            }}
          >
            {element.options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ textAlign: isRtl ? 'right' : 'left' }}
              >
                {t(option.labelKey)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              id={element.id}
              name={element.name}
              checked={Boolean(value)}
              onChange={(event) => onChange(element.name, event.target.checked)}
            />
          }
          label={label}
          sx={{ justifyContent: isRtl ? 'flex-end' : 'flex-start' }}
        />
      )
    case 'radio':
      return (
        <FormControl component="fieldset" dir={isRtl ? 'rtl' : 'ltr'}>
          <FormLabel component="legend" sx={getLabelSx(isRtl)}>
            {label}
          </FormLabel>
          <RadioGroup
            row
            name={element.name}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(element.name, event.target.value)}
            sx={{ justifyContent: isRtl ? 'flex-end' : 'flex-start' }}
          >
            {element.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={t(option.labelKey)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )
    default:
      return null
  }
}
