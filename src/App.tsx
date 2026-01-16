import { Box, Container, Typography } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MultiStepForm from './components/MultiStepForm'
import ReviewPage from './components/ReviewPage/ReviewPage'
import { useLanguage } from './context/LanguageContext'
import { formSteps } from './data/formMock'
import { appStyles } from './App/styles'
import PageHeader from './components/PageHeader'

function App() {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <BrowserRouter>
      <Box sx={appStyles.page} dir={dir} lang={language}>
        <PageHeader />

        <Container disableGutters sx={appStyles.main}>
          <Typography component="h2" sx={appStyles.sectionTitle}>
            {t('app.submitRequestTitle')}
          </Typography>

          <Routes>
            <Route path="/" element={<Navigate to="/step/0" replace />} />
            <Route
              path="/step/:stepIndex"
              element={
                <MultiStepForm
                  steps={formSteps}
                  stepLabel={t('app.step')}
                  backLabel={t('app.back')}
                  nextLabel={t('app.next')}
                  submitLabel={t('app.submit')}
                  previewLabel={t('app.preview')}
                />
              }
            />
            <Route path="/review" element={<ReviewPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  )
}

export default App
