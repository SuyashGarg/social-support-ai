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

export const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isNationalIdValid = (value: string) => /^\d{3}-\d{4}-\d{7}-\d$/.test(value)
