import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { FormStep } from '../../types/form'
import FormStepCard from '../FormStepCard'
import { multiStepFormStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'
import { isEmailValid, isNationalIdValid, normalizePhone } from '../../common/utils'
import { mockSubmitForm } from '../../api/axios'

type Props = {
  steps: FormStep[]
  stepLabel: string
  backLabel: string
  nextLabel: string
  submitLabel: string
}

export default function MultiStepForm({
  steps,
  stepLabel,
  backLabel,
  nextLabel,
  submitLabel,
}: Props) {
  const { isRtl } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { stepIndex: stepParam } = useParams<{ stepIndex: string }>()
  const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = window.localStorage.getItem('socialSupportFormData')
      return stored ? (JSON.parse(stored) as Record<string, string | boolean>) : {}
    } catch {
      return {}
    }
  })
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stepIndex = useMemo(() => {
    const parsed = Number(stepParam)
    if (Number.isNaN(parsed) || parsed < 0) return 0
    if (parsed >= steps.length) return steps.length - 1
    return parsed
  }, [stepParam, steps.length])

  const step = useMemo(() => steps[stepIndex], [steps, stepIndex])
  const isLastStep = stepIndex === steps.length - 1
  const isConsentChecked = Boolean(formData.consent)
  const hasSessionData = useMemo(() => Object.keys(formData).length > 0, [formData])

  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const next = { ...prev }

      if (typeof prev.country === 'undefined') {
        next.country = t('fields.profile.countryAE')
        next.countryCode = 'AE'
        changed = true
      }

      if (typeof prev.dependents === 'undefined') {
        next.dependents = '0'
        changed = true
      }

      return changed ? next : prev
    })
  }, [t])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('socialSupportFormData', JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIndex])

  useEffect(() => {
    const parsed = Number(stepParam)
    if (Number.isNaN(parsed) || parsed < 0 || parsed >= steps.length) {
      navigate(`/step/${stepIndex}`, { replace: true })
    }
  }, [navigate, stepIndex, stepParam, steps.length])

  useEffect(() => {
    if (stepIndex > 0 && Object.keys(formData).length === 0) {
      navigate('/step/0', { replace: true })
    }
  }, [formData, navigate, stepIndex])

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

  const handleSubmit = useCallback(async () => {
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
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await mockSubmitForm(formData)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('socialSupportFormResponse', JSON.stringify(response.data))
      }
      navigate('/review')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, navigate, steps, validateField])

  const handleBackClick = useCallback(() => {
    if (!hasSessionData) {
      navigate('/step/0')
      return
    }
    navigate(`/step/${Math.max(stepIndex - 1, 0)}`)
  }, [hasSessionData, navigate, stepIndex])

  const handleNextClick = useCallback(() => {
    if (!hasSessionData) {
      navigate('/step/0')
      return
    }
    navigate(`/step/${stepIndex + 1}`)
  }, [hasSessionData, navigate, stepIndex])

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
          onClick={handleBackClick}
          disabled={stepIndex === 0}
        >
          {backLabel}
        </Button>
        {isLastStep ? (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleSubmit}
            disabled={!isConsentChecked || isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : null}
            {submitLabel}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleNextClick}
          >
            {nextLabel}
          </Button>
        )}
      </Box>
    </>
  )
}
