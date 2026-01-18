import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { FormStep } from '../../types/form';
import FormElementField from '../FormElementField';
import { formStepCardStyles as styles } from './styles';
import { useLanguage } from '../../context/LanguageContext';
import { useForm } from '../MultiStepForm/MultiStepFormContext';

type Props = {
  step: FormStep
  stepIndex: number
  totalSteps: number
  stepLabel: string
}

export default function FormStepCard({
  step,
  stepIndex,
  totalSteps,
  stepLabel,
}: Props) {
  const { formData, formErrors } = useForm();
  const { t } = useTranslation();
  const { isRtl } = useLanguage();

  return (
    <Paper
      component="section"
      elevation={0}
      sx={styles.formCard}
    >
      <Box sx={{ ...styles.stepHeader, ...(isRtl ? styles.stepHeaderRtl : {}) }}>
        <Typography
          variant="body2"
          sx={{ ...styles.stepTitle, textAlign: 'start', width: '100%' }}
          aria-live="polite"
        >
          {stepLabel} {stepIndex + 1} / {totalSteps}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((stepIndex + 1) / totalSteps) * 100}
          sx={{
            ...styles.stepProgress,
            width: '100%',
            '& .MuiLinearProgress-bar': {
              ...styles.stepProgress['& .MuiLinearProgress-bar'],
              transformOrigin: isRtl ? 'right' : 'left',
            },
          }}
          aria-label={`${stepLabel} ${stepIndex + 1} / ${totalSteps}`}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={{ ...styles.sectionTitle, textAlign: 'start', width: '100%' }}
          id={`step-title-${step.id}`}
          tabIndex={-1}
        >
          {t(step.titleKey)}
        </Typography>
      </Box>

      <Box component="form" sx={styles.formBody} aria-labelledby={`step-title-${step.id}`}>
        {step.elements.map((element) => (
          <FormElementField
            key={element.id}
            element={element}
            value={formData[element.name]}
            errorMessage={formErrors[element.name]}
          />
        ))}
      </Box>
    </Paper>
  );
}
