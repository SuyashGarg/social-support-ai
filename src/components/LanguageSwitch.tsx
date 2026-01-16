import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import { useLanguage } from '../context/LanguageContext'

const LABEL = 'Language'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <Box
      role="group"
      aria-label={LABEL}
      display="flex"
      alignItems="center"
      gap={1}
      dir="ltr"
    >
      <Typography variant="body2" fontWeight={600}>
        {LABEL}
      </Typography>
      <ButtonGroup size="small" aria-label={LABEL}>
        <Button
          variant={language === 'en' ? 'contained' : 'outlined'}
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
        >
          EN
        </Button>
        <Button
          variant={language === 'ar' ? 'contained' : 'outlined'}
          onClick={() => setLanguage('ar')}
          aria-pressed={language === 'ar'}
        >
          AR
        </Button>
      </ButtonGroup>
    </Box>
  )
}
