import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { muiTheme } from './theme'
import './global.css'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
