/**
 * Storage Utilities - LocalStorage Abstraction for Form Data
 * 
 * ARCHITECTURE DECISION: Client-side persistence via localStorage
 * 
 * Rationale:
 * - No backend required for session management
 * - Form data survives page refresh
 * - Better UX for long forms
 * - Simple implementation
 * 
 * Trade-offs:
 * - Data only available on same browser/device
 * - Limited storage capacity (~5-10MB)
 * - Not suitable for sensitive data (no encryption)
 * - Can be cleared by user
 * 
 * Future Consideration: Could migrate to IndexedDB for larger datasets
 */
/**
 * LocalStorage keys for form session data
 */
export const STORAGE_KEYS = {
    FORM_DATA: 'socialSupportFormData',
    FORM_RESPONSE: 'socialSupportFormResponse',
} as const

/**
 * Clears all form session data from localStorage
 */
export const clearSessionData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.FORM_DATA)
        localStorage.removeItem(STORAGE_KEYS.FORM_RESPONSE)
    }
}

/**
 * Gets form data from localStorage
 */
export const getFormData = (): Record<string, string | boolean> | null => {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA)
        return stored ? (JSON.parse(stored) as Record<string, string | boolean>) : null
    } catch {
        return null
    }
}

/**
 * Sets form data in localStorage
 */
export const setFormData = (data: Record<string, string | boolean>) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(data))
    }
}

/**
 * Gets form response from localStorage
 */
export const getFormResponse = (): Record<string, string | boolean> | null => {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FORM_RESPONSE)
        return stored ? (JSON.parse(stored) as Record<string, string | boolean>) : null
    } catch {
        return null
    }
}

/**
 * Sets form response in localStorage
 */
export const setFormResponse = (data: Record<string, string | boolean>) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FORM_RESPONSE, JSON.stringify(data))
    }
}
