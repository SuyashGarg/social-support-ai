import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LanguageSwitch from './components/LanguageSwitch'
import MultiStepForm from './components/MultiStepForm'
import { useLanguage } from './context/LanguageContext'
import { formSteps } from './data/formMock'
import { appStyles } from './App/styles'

function App() {
  const { language, isRtl } = useLanguage()
  const { t } = useTranslation()
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <Container disableGutters sx={appStyles.app} dir={dir} lang={language}>
      <Box
        component="header"
        sx={{ ...appStyles.toolbar, ...(isRtl ? appStyles.toolbarRtl : {}) }}
      >
        <Typography component="h1" sx={{ ...appStyles.title, ...(isRtl ? appStyles.titleRtl : {}) }}>
          {t('app.title')}
        </Typography>
        <LanguageSwitch label={t('app.language')} />
      </Box>

      <MultiStepForm
        steps={formSteps}
        stepLabel={t('app.step')}
        backLabel={t('app.back')}
        nextLabel={t('app.next')}
        submitLabel={t('app.submit')}
        previewLabel={t('app.preview')}
      />
    </Container>
  )
}

export default App
