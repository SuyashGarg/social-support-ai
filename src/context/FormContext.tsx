import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type FormValue = string | boolean | null
type FormErrors = Record<string, string | null>

type FormContextValue = {
  formData: Record<string, FormValue>
  formErrors: FormErrors
  setValue: (name: string, value: FormValue) => void
  setError: (name: string, error: string | null) => void
}

const FormContext = createContext<FormContextValue | null>(null)

export function FormProvider({
  value,
  children,
}: {
  value: FormContextValue
  children: ReactNode
}) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within FormProvider')
  }
  return context
}
