/**
 * MultiStepFormContext - Form State Management
 * 
 * ARCHITECTURE DECISION: Using React Context API instead of Redux/Recoil
 * 
 * Rationale:
 * - Simpler mental model for form state
 * - Less boilerplate code
 * - Better TypeScript integration
 * - Sufficient for application complexity
 * 
 * Key Features:
 * - Form data persistence to localStorage (survives page refresh)
 * - Real-time validation on blur
 * - Step-level validation before progression
 * - Automatic error message translation on language change
 * - Country-dependent field clearing (state/address when country changes)
 * 
 * State Management Pattern:
 * - Single source of truth for form data
 * - Optimistic updates with validation
 * - Auto-save on every change
 * - Error state separate from form data
 */
import { createContext, useContext, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useLanguage } from '../../context/LanguageContext'
import { isEmailValid, isNationalIdValid, normalizePhoneForValidation } from '../../common/utils'
import { mockSubmitForm } from '../../api/axios'
import { addHistoryEntry } from '../../common/history'
import { getFormData, setFormData as saveFormData, setFormResponse } from '../../common/storage'
import type { FormStep, FormElement } from '../../types/form'

type FormValue = string | boolean
type FormErrors = Record<string, string | null>

type FormContextValue = {
    formData: Record<string, FormValue>
    formErrors: FormErrors
    isSubmitting: boolean
    onChange: (name: string, value: FormValue) => void
    onMetaChange?: (name: string, meta: Record<string, string | null>) => void
    onBlur: (element: FormElement, value: FormValue | undefined) => void
    validateCurrentStep: (step: FormStep) => boolean
    handleSubmit: () => Promise<void>
    isStepComplete: (step: FormStep, data: Record<string, string | boolean>) => boolean
    getLastCompletedStepIndex: (data: Record<string, string | boolean>) => number
}

const FormContext = createContext<FormContextValue | null>(null)

export function FormProvider({
    children,
    steps,
}: {
    children: React.ReactNode
    steps: FormStep[]
}) {
    const { t } = useTranslation()
    const { language } = useLanguage()
    const [formData, setFormData] = useState<Record<string, string | boolean>>(() => {
        return getFormData() ?? {}
    })
    const [formErrors, setFormErrors] = useState<Record<string, string | null>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const prevCountryCodeRef = useRef<string | boolean | undefined>(undefined)

    // Initialize default values
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

    // Persist form data to localStorage
    useEffect(() => {
        saveFormData(formData)
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

    // Re-translate existing error messages when language changes
    useEffect(() => {
        setFormErrors((prev) => {
            // Only update fields that already have errors
            const fieldsWithErrors = Object.keys(prev).filter((name) => prev[name] !== null)
            if (fieldsWithErrors.length === 0) return prev

            const updated = { ...prev }
            let hasChanges = false

            steps.forEach((step) => {
                step.elements.forEach((element) => {
                    // Only re-validate fields that already have errors
                    if (fieldsWithErrors.includes(element.name)) {
                        const currentValue = formData[element.name]
                        const error = validateField(element.name, currentValue, element.required)
                        if (updated[element.name] !== error) {
                            updated[element.name] = error
                            hasChanges = true
                        }
                    }
                })
            })

            return hasChanges ? updated : prev
        })
    }, [language, steps, formData])

    const validateField = useCallback(
        (name: string, value: string | boolean | undefined, required?: boolean) => {
            if (required && (!value || String(value).trim() === '')) {
                return t('validation.required')
            }
            if (name === 'nationalId' && typeof value === 'string' && value) {
                return isNationalIdValid(value) ? null : t('validation.invalidDocumentNumber')
            }
            if (name === 'email' && typeof value === 'string' && value) {
                return isEmailValid(value) ? null : t('validation.invalidEmail')
            }
            if (name === 'phone' && typeof value === 'string' && value) {
                const countryCode = formData.countryCode as string | undefined
                const normalized = normalizePhoneForValidation(value, countryCode)
                return normalized && isValidPhoneNumber(normalized) ? null : t('validation.invalidPhone')
            }
            return null
        },
        [t, formData],
    )

    const handleChange = useCallback((name: string, value: string | boolean) => {
        setFormData((prev) => {
            const next = { ...prev, [name]: value }

            // When country changes, clear state and address fields
            if (name === 'country') {
                // Clear state field and related metadata
                next.state = ''
                next.stateCode = ''
                next.statePlaceId = ''

                // Clear address field and related metadata
                next.address = ''
                next.addressPlaceId = ''
                next.city = ''
            }

            return next
        })
        setFormErrors((prev) => {
            const next = prev[name] ? { ...prev, [name]: null } : prev

            // Clear errors for state and address when country changes
            if (name === 'country') {
                if (prev.state) next.state = null
                if (prev.address) next.address = null
            }

            return next
        })
    }, [])

    const handleMetaChange = useCallback((name: string, meta: Record<string, string | null>) => {
        setFormData((prev) => {
            const next = { ...prev }

            // Update metadata fields based on field type
            if (name === 'country') {
                next.countryCode = meta.countryCode ?? ''
                next.countryPlaceId = meta.placeId ?? ''

                // When country metadata changes (countryCode updates), clear state and address
                if (meta.countryCode !== prev.countryCode) {
                    next.state = ''
                    next.stateCode = ''
                    next.statePlaceId = ''
                    next.address = ''
                    next.addressPlaceId = ''
                    next.city = ''
                }
            } else if (name === 'state') {
                next.stateCode = meta.stateCode ?? ''
                next.statePlaceId = meta.placeId ?? ''
            } else if (name === 'address') {
                next.addressPlaceId = meta.placeId ?? ''

                // Populate city and state fields if available from address
                if (meta.city) {
                    next.city = meta.city
                }
                if (meta.state) {
                    next.state = meta.state
                    // Also update state metadata if stateCode is available
                    if (meta.stateCode) {
                        next.stateCode = meta.stateCode
                    }
                }
            }

            return next
        })
    }, [])

    const handleFieldBlur = useCallback(
        (element: FormStep['elements'][number], value: string | boolean | undefined) => {
            const error = validateField(element.name, value, element.required)
            setFormErrors((prev) => ({ ...prev, [element.name]: error }))
        },
        [validateField],
    )

    const isStepComplete = useCallback((step: FormStep, data: Record<string, string | boolean>) => {
        return step.elements.every((element) => {
            if (!element.required) return true
            const value = data[element.name]
            if (value === undefined || value === null) return false
            if (typeof value === 'string' && value.trim() === '') return false
            return true
        })
    }, [])

    const getLastCompletedStepIndex = useCallback(
        (data: Record<string, string | boolean>) => {
            for (let i = steps.length - 1; i >= 0; i--) {
                if (isStepComplete(steps[i], data)) {
                    return i
                }
            }
            return -1 // No steps completed
        },
        [steps, isStepComplete],
    )

    const validateCurrentStep = useCallback(
        (step: FormStep) => {
            const errors: Record<string, string | null> = {}
            let hasErrors = false

            step.elements.forEach((element) => {
                const error = validateField(element.name, formData[element.name], element.required)
                if (error) {
                    errors[element.name] = error
                    hasErrors = true
                }
            })

            if (hasErrors) {
                setFormErrors((prev) => ({ ...prev, ...errors }))
            }

            return !hasErrors
        },
        [formData, validateField],
    )

    const buildHistoryEntry = useCallback(
        (data: Record<string, string | boolean>) => ({
            id: `${Date.now()}`,
            submittedAt: new Date().toISOString(),
            data,
        }),
        [],
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
            setFormResponse(response.data)
            addHistoryEntry(buildHistoryEntry(response.data))
        } finally {
            setIsSubmitting(false)
        }
    }, [buildHistoryEntry, formData, steps, validateField])

    const value = useMemo(
        () => ({
            formData,
            formErrors,
            isSubmitting,
            onChange: handleChange,
            onMetaChange: handleMetaChange,
            onBlur: handleFieldBlur,
            validateCurrentStep,
            handleSubmit,
            isStepComplete,
            getLastCompletedStepIndex,
        }),
        [
            formData,
            formErrors,
            isSubmitting,
            handleChange,
            handleMetaChange,
            handleFieldBlur,
            validateCurrentStep,
            handleSubmit,
            isStepComplete,
            getLastCompletedStepIndex,
        ],
    )

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useForm() {
    const context = useContext(FormContext)
    if (!context) {
        throw new Error('useForm must be used within FormProvider')
    }
    return context
}

// Alias for backward compatibility
export function useMultiStepForm() {
    return useForm()
}

// Alias for backward compatibility
export const MultiStepFormProvider = FormProvider
