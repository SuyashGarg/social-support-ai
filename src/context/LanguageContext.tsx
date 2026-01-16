import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../types/form'
import i18n from '../i18n'

type LanguageContextValue = {
  language: Language
  isRtl: boolean
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>((i18n.language as Language) || 'en')

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const isRtl = language === 'ar'
  const value = useMemo(() => ({ language, isRtl, setLanguage }), [language, isRtl])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
