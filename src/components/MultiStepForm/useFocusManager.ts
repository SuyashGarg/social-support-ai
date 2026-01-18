import { useEffect, useRef } from 'react'
import type { FormStep } from '../../types/form'

type FocusManagerOptions = {
    step: FormStep
    formErrors: Record<string, string | null>
    stepIndex: number
    enabled?: boolean
}

/**
 * Focus manager hook for form steps
 * - Focuses on first error field if errors exist
 * - Otherwise focuses on section heading
 */
export function useFocusManager({ step, formErrors, stepIndex, enabled = true }: FocusManagerOptions) {
    const hasFocusedRef = useRef(false)

    useEffect(() => {
        if (!enabled) return

        // Reset focus flag when step changes
        hasFocusedRef.current = false
    }, [stepIndex, enabled])

    const focusOnStep = (force = false) => {
        if (!enabled) return

        // If already focused and not forcing, skip
        if (hasFocusedRef.current && !force) return

        // Find first field with error
        const firstErrorField = step.elements.find((element) => formErrors[element.name])

        if (firstErrorField) {
            // Focus on first error field
            const errorFieldElement = document.getElementById(firstErrorField.id)
            if (errorFieldElement) {
                // For input fields, focus directly
                if (errorFieldElement.tagName === 'INPUT' || errorFieldElement.tagName === 'TEXTAREA') {
                    ; (errorFieldElement as HTMLElement).focus()
                    hasFocusedRef.current = true
                    return
                }
                // For other field types (select, autocomplete), try to find the input within
                const inputElement = errorFieldElement.querySelector('input') as HTMLInputElement | null
                if (inputElement) {
                    inputElement.focus()
                    hasFocusedRef.current = true
                    return
                }
                // If no input found, focus on the field container itself
                errorFieldElement.focus()
                hasFocusedRef.current = true
                return
            }
        }

        // No errors, focus on section heading
        const sectionHeading = document.getElementById(`step-title-${step.id}`)
        if (sectionHeading) {
            sectionHeading.focus()
            hasFocusedRef.current = true
        }
    }

    return { focusOnStep }
}
