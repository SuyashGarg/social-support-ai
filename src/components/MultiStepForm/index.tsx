import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { FormStep } from '../../types/form'
import FormStepCard from '../FormStepCard'
import { multiStepFormStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'
import { isEmailValid, isNationalIdValid, normalizePhone } from '../../common/utils'
import { mockSubmitForm } from '../../api/axios'
import { addHistoryEntry } from '../../common/history'

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
  const { isRtl, language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stepIndex: stepParam } = useParams<{ stepIndex: string }>();
  const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = window.localStorage.getItem('socialSupportFormData');
      return stored ? (JSON.parse(stored) as Record<string, string | boolean>) : {};
    } catch {
      return {};
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevCountryCodeRef = useRef<string | boolean | undefined>(undefined);

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

  // Clear state and address when countryCode changes
  useEffect(() => {
    const currentCountryCode = formData.countryCode
    const prevCountryCode = prevCountryCodeRef.current

    if (currentCountryCode !== prevCountryCode && currentCountryCode !== undefined && prevCountryCode !== undefined) {
      setFormData((prev) => ({
        ...prev,
        state: '',
        stateCode: '',
        statePlaceId: '',
        address: '',
        addressPlaceId: '',
        city: '',
      }))
    }

    prevCountryCodeRef.current = currentCountryCode
  }, [formData.countryCode])

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
      navigate('/step/0', { replace: true });
    }
  }, [formData, navigate, stepIndex]);

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      debugger;

      // When country changes, clear state and address fields
      if (name === 'country') {
        // Clear state field and related metadata
        next.state = '';
        next.stateCode = '';
        next.statePlaceId = '';

        // Clear address field and related metadata
        next.address = '';
        next.addressPlaceId = '';
        next.city = '';
      }

      return next;
    });
    setFormErrors((prev) => {
      const next = prev[name] ? { ...prev, [name]: null } : prev;

      // Clear errors for state and address when country changes
      if (name === 'country') {
        if (prev.state) next.state = null;
        if (prev.address) next.address = null;
      }

      return next;
    });
  }, []);

  const handleMetaChange = useCallback((name: string, meta: Record<string, string | null>) => {
    setFormData((prev) => {
      const next = { ...prev };

      // Update metadata fields based on field type
      if (name === 'country') {
        next.countryCode = meta.countryCode ?? '';
        next.countryPlaceId = meta.placeId ?? '';

        // When country metadata changes (countryCode updates), clear state and address
        if (meta.countryCode !== prev.countryCode) {
          next.state = '';
          next.stateCode = '';
          next.statePlaceId = '';
          next.address = '';
          next.addressPlaceId = '';
          next.city = '';
        }
      } else if (name === 'state') {
        next.stateCode = meta.stateCode ?? '';
        next.statePlaceId = meta.placeId ?? '';
      } else if (name === 'address') {
        next.addressPlaceId = meta.placeId ?? '';

        // Populate city and state fields if available from address
        if (meta.city) {
          next.city = meta.city;
        }
        if (meta.state) {
          next.state = meta.state;
          // Also update state metadata if stateCode is available
          if (meta.stateCode) {
            next.stateCode = meta.stateCode;
          }
        }
      }

      return next;
    });
  }, []);

  const validateField = useCallback((name: string, value: string | boolean | undefined, required?: boolean) => {
    if (required && (!value || String(value).trim() === '')) {
      return t('validation.required');
    }
    if (name === 'nationalId' && typeof value === 'string' && value) {
      return isNationalIdValid(value) ? null : t('validation.invalidDocumentNumber');
    }
    if (name === 'email' && typeof value === 'string' && value) {
      return isEmailValid(value) ? null : t('validation.invalidEmail');
    }
    if (name === 'phone' && typeof value === 'string' && value) {
      const normalized = normalizePhone(value);
      return normalized && isValidPhoneNumber(normalized) ? null : t('validation.invalidPhone');
    }
    return null;
  }, [t])

  // Re-translate existing error messages when language changes
  useEffect(() => {
    setFormErrors((prev) => {
      // Only update fields that already have errors
      const fieldsWithErrors = Object.keys(prev).filter((name) => prev[name] !== null);
      if (fieldsWithErrors.length === 0) return prev;

      const updated = { ...prev };
      let hasChanges = false;

      steps.forEach((step) => {
        step.elements.forEach((element) => {
          // Only re-validate fields that already have errors
          if (fieldsWithErrors.includes(element.name)) {
            const currentValue = formData[element.name];
            const error = validateField(element.name, currentValue, element.required);
            if (updated[element.name] !== error) {
              updated[element.name] = error;
              hasChanges = true;
            }
          }
        });
      });

      return hasChanges ? updated : prev;
    });
  }, [language, validateField, steps, formData]);

  const handleFieldBlur = useCallback(
    (element: FormStep['elements'][number], value: string | boolean | undefined) => {
      const error = validateField(element.name, value, element.required);
      setFormErrors((prev) => ({ ...prev, [element.name]: error }));
    },
    [validateField],
  );

  const buildHistoryEntry = useCallback(
    (data: Record<string, string | boolean>) => ({
      id: `${Date.now()}`,
      submittedAt: new Date().toISOString(),
      data,
    }),
    [],
  );

  const handleSubmit = useCallback(async () => {
    const errors: Record<string, string> = {};
    steps.forEach((step) => {
      step.elements.forEach((element) => {
        const error = validateField(element.name, formData[element.name], element.required);
        if (error) {
          errors[element.name] = error;
        }
      });
    });
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await mockSubmitForm(formData);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('socialSupportFormResponse', JSON.stringify(response.data));
      }
      addHistoryEntry(buildHistoryEntry(response.data));
      navigate('/review');
    } finally {
      setIsSubmitting(false);
    }
  }, [buildHistoryEntry, formData, navigate, steps, validateField]);

  const handleBackClick = useCallback(() => {
    if (!hasSessionData) {
      navigate('/step/0');
      return;
    }
    navigate(`/step/${Math.max(stepIndex - 1, 0)}`);
  }, [hasSessionData, navigate, stepIndex]);

  const validateCurrentStep = useCallback(() => {
    const errors: Record<string, string | null> = {};
    let hasErrors = false;

    step.elements.forEach((element) => {
      const error = validateField(element.name, formData[element.name], element.required);
      if (error) {
        errors[element.name] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
    }

    return !hasErrors;
  }, [formData, step.elements, validateField]);

  const handleNextClick = useCallback(() => {
    if (!hasSessionData) {
      navigate('/step/0');
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    navigate(`/step/${stepIndex + 1}`);
  }, [hasSessionData, navigate, stepIndex, validateCurrentStep]);

  return (
    <>
      <FormStepCard
        step={step}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        formData={formData}
        formErrors={formErrors}
        onChange={handleChange}
        onMetaChange={handleMetaChange}
        onBlur={handleFieldBlur}
        stepLabel={stepLabel}
      />

      <Box sx={styles.formActions}>
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
            endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          >
            {nextLabel}
          </Button>
        )}
      </Box>
    </>
  )
}
