export const getTextAlign = (isRtl: boolean) => (isRtl ? 'right' : 'left')

export const getDir = (isRtl: boolean) => (isRtl ? 'rtl' : 'ltr')

export const formatNationalId = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 15)
    const parts = []
    if (digits.length > 0) parts.push(digits.slice(0, 3))
    if (digits.length > 3) parts.push(digits.slice(3, 7))
    if (digits.length > 7) parts.push(digits.slice(7, 14))
    if (digits.length > 14) parts.push(digits.slice(14, 15))
    return parts.join('-')
}

export const normalizePhone = (value: string) => value.trim().replace(/[^\d+]/g, '')

/**
 * Normalizes phone number for validation based on format:
 * - If starts with '+', keep as-is
 * - If starts with '00', convert '00' to '+'
 * - Otherwise, treat as local number and prepend country code
 */
export const normalizePhoneForValidation = (value: string, countryCode?: string | null): string => {
    const cleaned = value.trim().replace(/[^\d+]/g, '')

    if (!cleaned) return ''

    // If starts with '+', return as-is
    if (cleaned.startsWith('+')) {
        return cleaned
    }

    // If starts with '00', replace '00' with '+'
    if (cleaned.startsWith('00')) {
        return '+' + cleaned.slice(2)
    }

    // Otherwise, treat as local number and prepend country code
    // Default to UAE (+971) if country code not provided
    const defaultCountryCode = countryCode || 'AE'
    const countryCodeMap: Record<string, string> = {
        'AE': '971', // UAE
        'SA': '966', // Saudi Arabia
        'EG': '20',  // Egypt
        'JO': '962', // Jordan
        'KW': '965', // Kuwait
        'QA': '974', // Qatar
        'BH': '973', // Bahrain
        'OM': '968', // Oman
    }

    const countryDialCode = countryCodeMap[defaultCountryCode] || '971' // Default to UAE
    return '+' + countryDialCode + cleaned
}

export const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isNationalIdValid = (value: string) => /^\d{3}-\d{4}-\d{7}-\d$/.test(value)
