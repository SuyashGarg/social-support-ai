import { Box } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { appStyles } from './App/styles'
import PageHeader from './components/PageHeader'
import AppThemeProvider from './providers/AppThemeProvider'
import ContentContainer from './components/ContentContainer'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Box sx={appStyles.page}>
          <PageHeader />
          <AppThemeProvider>
            <ContentContainer />
          </AppThemeProvider>
        </Box>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
