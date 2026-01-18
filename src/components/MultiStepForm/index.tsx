/**
 * MultiStepForm - Multi-Step Form Component with URL-based Navigation
 * 
 * ARCHITECTURE DECISION: URL-based step navigation (/step/:stepIndex)
 * 
 * Rationale:
 * - Enables deep linking to specific steps
 * - Browser back/forward navigation works naturally
 * - Better UX for long forms
 * - Progress tracking and validation per step
 * 
 * Navigation Logic:
 * - Validates current step before allowing progression
 * - Redirects to last completed step if navigating directly to later step
 * - Clears session data when starting fresh (navigating to step 0)
 * - Tracks navigation source to avoid clearing on back button
 * 
 * Session Management:
 * - Form data persists in localStorage
 * - Cleared only when explicitly starting new form
 * - Survives page refresh
 */
import { useEffect, useMemo, useRef } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate, useParams } from 'react-router-dom'
import type { FormStep } from '../../types/form'
import FormStepCard from '../FormStepCard'
import { multiStepFormStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'
import { FormProvider, useMultiStepForm } from './MultiStepFormContext'
import { useFocusManager } from './useFocusManager'
import { clearSessionData } from '../../common/storage'

type Props = {
  steps: FormStep[]
  stepLabel: string
  backLabel: string
  nextLabel: string
  submitLabel: string
}

function MultiStepFormContent({
  steps,
  stepLabel,
  backLabel,
  nextLabel,
  submitLabel,
}: Props) {
  const { isRtl } = useLanguage()
  const navigate = useNavigate()
  const { stepIndex: stepParam } = useParams<{ stepIndex: string }>()
  const {
    formData,
    formErrors,
    isSubmitting,
    validateCurrentStep,
    handleSubmit,
    isStepComplete,
    getLastCompletedStepIndex,
  } = useMultiStepForm()

  // Track navigation source to avoid clearing storage on back button or redirect
  const isBackNavigationRef = useRef(false)
  const isRedirectNavigationRef = useRef(false)
  const previousStepIndexRef = useRef<number | null>(null)
  const isInitialMountRef = useRef(true)

  const stepIndex = useMemo(() => {
    const parsed = Number(stepParam)
    if (Number.isNaN(parsed) || parsed < 0) return 0
    if (parsed >= steps.length) return steps.length - 1
    return parsed
  }, [stepParam, steps.length])

  const step = useMemo(() => steps[stepIndex], [steps, stepIndex])

  const { focusOnStep } = useFocusManager({
    step,
    formErrors,
    stepIndex,
    enabled: true,
  })
  const isLastStep = stepIndex === steps.length - 1
  const isConsentChecked = Boolean(formData.consent)
  const hasSessionData = useMemo(() => Object.keys(formData).length > 0, [formData])
  const previousStepIndexForScrollRef = useRef<number | null>(null)

  useEffect(() => {
    // Only scroll to top when step actually changes, not on every render
    const prevStep = previousStepIndexForScrollRef.current
    if (prevStep !== null && prevStep !== stepIndex) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    previousStepIndexForScrollRef.current = stepIndex

    // Focus on step after navigation
    // Use setTimeout to ensure DOM is updated after navigation
    const timeoutId = setTimeout(() => {
      focusOnStep()
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [stepIndex, focusOnStep])

  useEffect(() => {
    const parsed = Number(stepParam)
    if (Number.isNaN(parsed) || parsed < 0 || parsed >= steps.length) {
      navigate(`/step/${stepIndex}`, { replace: true })
    }
  }, [navigate, stepIndex, stepParam, steps.length])

  // Check if previous steps are complete when navigating directly to a step
  useEffect(() => {
    if (stepIndex > 0 && Object.keys(formData).length === 0) {
      isRedirectNavigationRef.current = true
      navigate('/step/0', { replace: true })
      return
    }

    // Check if previous steps are complete when navigating directly to a step
    if (stepIndex > 0) {
      // Check all previous steps
      for (let i = 0; i < stepIndex; i++) {
        if (!isStepComplete(steps[i], formData)) {
          // Find the last completed step and redirect there
          const lastCompletedStep = getLastCompletedStepIndex(formData)
          const redirectStep = lastCompletedStep >= 0 ? lastCompletedStep : 0
          isRedirectNavigationRef.current = true
          navigate(`/step/${redirectStep}`, { replace: true })
          return
        }
      }
    }
  }, [formData, navigate, stepIndex, steps, isStepComplete, getLastCompletedStepIndex])

  // Clear storage when navigating to step 0 directly (not from back button or redirect)
  useEffect(() => {
    const prevStep = previousStepIndexRef.current
    const isInitialMount = isInitialMountRef.current

    // Skip on initial mount - let the redirect logic handle it
    if (isInitialMount) {
      isInitialMountRef.current = false
      previousStepIndexRef.current = stepIndex
      return
    }

    // Clear storage only when:
    // 1. Navigating to step 0
    // 2. Not from back button
    // 3. Not from redirect
    // 4. Coming from outside (prevStep is null) or from a different step
    if (
      stepIndex === 0 &&
      !isBackNavigationRef.current &&
      !isRedirectNavigationRef.current &&
      prevStep !== 0 // Only clear if coming from a different step (not already on step 0)
    ) {
      clearSessionData()
    }

    // Update previous step index
    previousStepIndexRef.current = stepIndex

    // Reset flags after checking (use setTimeout to ensure navigation completes)
    setTimeout(() => {
      isBackNavigationRef.current = false
      isRedirectNavigationRef.current = false
    }, 0)
  }, [stepIndex])

  const handleBackClick = () => {
    isBackNavigationRef.current = true
    if (!hasSessionData) {
      navigate('/step/0')
      return
    }
    navigate(`/step/${Math.max(stepIndex - 1, 0)}`)
  }

  const handleNextClick = () => {
    if (!hasSessionData) {
      navigate('/step/0')
      return
    }

    if (!validateCurrentStep(step)) {
      // If validation fails, focus on first error field (force focus)
      setTimeout(() => {
        focusOnStep(true)
      }, 100)
      return
    }

    navigate(`/step/${stepIndex + 1}`)
  }

  const handleSubmitClick = async () => {
    await handleSubmit()
    navigate('/review')
  }

  return (
    <>
      <FormStepCard
        step={step}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        stepLabel={stepLabel}
      />

      <Box sx={styles.formActions} role="group" aria-label={stepLabel}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            ...styles.button,
            ...(stepIndex === 0 ? styles.buttonDisabled : {}),
          }}
          onClick={handleBackClick}
          disabled={stepIndex === 0}
          startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          aria-label={stepIndex === 0 ? undefined : `${backLabel} - ${stepLabel} ${stepIndex} / ${steps.length}`}
        >
          {backLabel}
        </Button>
        {isLastStep ? (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleSubmitClick}
            disabled={!isConsentChecked || isSubmitting}
            aria-label={isSubmitting ? undefined : submitLabel}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" aria-hidden="true" />
            ) : null}
            {submitLabel}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleNextClick}
            endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            aria-label={`${nextLabel} - ${stepLabel} ${stepIndex + 2} / ${steps.length}`}
          >
            {nextLabel}
          </Button>
        )}
      </Box>
    </>
  )
}

export default function MultiStepForm(props: Props) {
  return (
    <FormProvider steps={props.steps}>
      <MultiStepFormContent {...props} />
    </FormProvider>
  )
}
