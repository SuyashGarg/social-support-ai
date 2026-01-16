import { useMemo, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import type { FormStep } from '../../types/form'
import FormStepCard from '../FormStepCard'
import { multiStepFormStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  steps: FormStep[]
  stepLabel: string
  backLabel: string
  nextLabel: string
  submitLabel: string
  previewLabel: string
}

export default function MultiStepForm({
  steps,
  stepLabel,
  backLabel,
  nextLabel,
  submitLabel,
  previewLabel,
}: Props) {
  const { isRtl } = useLanguage()
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})

  const step = useMemo(() => steps[stepIndex], [steps, stepIndex])

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <FormStepCard
        step={step}
        isRtl={isRtl}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        formData={formData}
        onChange={handleChange}
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
          onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
          disabled={stepIndex === 0}
        >
          {backLabel}
        </Button>
        {stepIndex < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={() => setStepIndex((prev) => prev + 1)}
          >
            {nextLabel}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={() => alert('Submitted!')}
          >
            {submitLabel}
          </Button>
        )}
      </Box>

      <Paper
        variant="outlined"
        sx={{ ...styles.preview, ...(isRtl ? styles.previewRtl : {}) }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="h6" sx={styles.previewTitle}>
          {previewLabel}
        </Typography>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </Paper>
    </>
  )
}
