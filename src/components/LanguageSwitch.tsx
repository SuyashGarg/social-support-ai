import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import { useLanguage } from '../context/LanguageContext'
import { theme } from '../theme'

const LABEL = 'Language'

const buttonBaseStyles = {
  fontSize: { xs: '0.6rem', md: '0.875rem' },
  padding: { xs: '2px 8px', md: '4px 12px' },
  minWidth: 'auto',
  lineHeight: 1.5,
  borderColor: theme.colors.primary,
}

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
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        {LABEL}
      </Typography>
      <ButtonGroup size="small" aria-label={LABEL}>
        <Button
          variant={language === 'en' ? 'contained' : 'outlined'}
          sx={{
            ...buttonBaseStyles,
            backgroundColor: language === 'en' ? theme.colors.primary : 'transparent',
            color: language === 'en' ? theme.colors.surface : theme.colors.textPrimary,
          }}
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
        >
          EN
        </Button>
        <Button
          variant={language === 'ar' ? 'contained' : 'outlined'}
          sx={{
            ...buttonBaseStyles,
            backgroundColor: language === 'ar' ? theme.colors.primary : 'transparent',
            color: language === 'ar' ? theme.colors.surface : theme.colors.textPrimary,
          }}
          onClick={() => setLanguage('ar')}
          aria-pressed={language === 'ar'}
        >
          AR
        </Button>
      </ButtonGroup>
    </Box>
  )
}
