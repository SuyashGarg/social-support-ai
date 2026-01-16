import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  label: string
}

export default function LanguageSwitch({ label }: Props) {
  const { language, setLanguage } = useLanguage()

  return (
    <Box role="group" aria-label={label} display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
      <ButtonGroup size="small" aria-label={label}>
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
