import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'
import type { FormStep } from '../../types/form'
import FormStepCard from '../FormStepCard'
import { multiStepFormStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'
import { isEmailValid, isNationalIdValid, normalizePhone } from '../../common/utils'

type Props = {
  steps: FormStep[]
  stepLabel: string
  backLabel: string
  nextLabel: string
  submitLabel: string
  previewLabel: string
}

export default function MultiStepForm({
  steps,
  stepLabel,
  backLabel,
  nextLabel,
  submitLabel,
  previewLabel,
}: Props) {
  const { isRtl } = useLanguage()
  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({})

  const step = useMemo(() => steps[stepIndex], [steps, stepIndex])

  useEffect(() => {
    if (typeof formData.country === 'undefined') {
      setFormData((prev) => ({
        ...prev,
        country: t('fields.countryAE'),
        countryCode: 'AE',
      }))
    }
  }, [formData.country, t])

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev))
  }, [])

  const validateField = useCallback((name: string, value: string | boolean | undefined, required?: boolean) => {
    if (required && (!value || String(value).trim() === '')) {
      return 'Required'
    }
    if (name === 'nationalId' && typeof value === 'string' && value) {
      return isNationalIdValid(value) ? null : 'Invalid document number'
    }
    if (name === 'email' && typeof value === 'string' && value) {
      return isEmailValid(value) ? null : 'Invalid email'
    }
    if (name === 'phone' && typeof value === 'string' && value) {
      const normalized = normalizePhone(value)
      return normalized && isValidPhoneNumber(normalized) ? null : 'Invalid phone'
    }
    return null
  }, [])

  const handleFieldBlur = useCallback(
    (element: FormStep['elements'][number], value: string | boolean | undefined) => {
      const error = validateField(element.name, value, element.required)
      setFormErrors((prev) => ({ ...prev, [element.name]: error }))
    },
    [validateField],
  )

  const handleSubmit = useCallback(() => {
    const errors: Record<string, string> = {}
    steps.forEach((step) => {
      step.elements.forEach((element) => {
        const error = validateField(element.name, formData[element.name], element.required)
        if (error) {
          errors[element.name] = error
        }
      })
    })
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      alert('Submitted!')
    }
  }, [formData, steps, validateField])

  return (
    <>
      <FormStepCard
        step={step}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        formData={formData}
        formErrors={formErrors}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        stepLabel={stepLabel}
      />

      <Box sx={{ ...styles.formActions, ...(isRtl ? styles.formActionsRtl : {}) }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            ...styles.button,
            ...(stepIndex === 0 ? styles.buttonDisabled : {}),
          }}
          onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
          disabled={stepIndex === 0}
        >
          {backLabel}
        </Button>
        {stepIndex < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={() => setStepIndex((prev) => prev + 1)}
          >
            {nextLabel}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleSubmit}
          >
            {submitLabel}
          </Button>
        )}
      </Box>

      <Paper
        variant="outlined"
        sx={{ ...styles.preview, ...(isRtl ? styles.previewRtl : {}) }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="h6" sx={styles.previewTitle}>
          {previewLabel}
        </Typography>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </Paper>
    </>
  )
}
