import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { FormStep } from '../../types/form'
import FormElementField from '../FormElementField'
import { formStepCardStyles as styles } from './styles'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  step: FormStep
  stepIndex: number
  totalSteps: number
  formData: Record<string, string | boolean>
  onChange: (name: string, value: string | boolean) => void
  stepLabel: string
}

export default function FormStepCard({
  step,
  stepIndex,
  totalSteps,
  stepLabel,
  formData,
  onChange,
}: Props) {
  const { t } = useTranslation()
  const { isRtl } = useLanguage()

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{ ...styles.formCard, ...(isRtl ? styles.formCardRtl : {}) }}
    >
      <Box sx={styles.stepHeader}>
        <Typography variant="body2" sx={styles.stepTitle} aria-live="polite">
          {stepLabel} {stepIndex + 1} / {totalSteps}
        </Typography>
        <Typography variant="h5" component="h2" id={`step-title-${step.id}`}>
          {t(step.titleKey)}
        </Typography>
      </Box>

      <Box component="form" sx={styles.formBody} aria-labelledby={`step-title-${step.id}`}>
        {step.elements.map((element) => (
          <FormElementField
            key={element.id}
            element={element}
            value={formData[element.name]}
            onChange={onChange}
          />
        ))}
      </Box>
    </Paper>
  )
}
