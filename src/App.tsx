/**
 * App - Root Component with Provider Hierarchy
 * 
 * ARCHITECTURE DECISION: Provider composition pattern
 * 
 * Provider Order (outer to inner):
 * 1. BrowserRouter - Enables routing
 * 2. LanguageProvider - Provides language context (needed by theme)
 * 3. AppThemeProvider - Provides MUI theme (depends on language for RTL)
 * 4. ContentContainer - Main application content
 * 
 * Rationale:
 * - LanguageProvider must wrap AppThemeProvider (theme depends on language)
 * - BrowserRouter wraps everything (routing needed throughout)
 * - Clear separation of concerns
 * - Easy to add new providers
 */
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
