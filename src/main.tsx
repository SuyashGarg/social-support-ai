import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LanguageProvider> */}
    {/* <AppThemeProvider> */}
    <App />
    {/* </AppThemeProvider>1 */}
    {/* </LanguageProvider> */}
  </StrictMode>,
)
