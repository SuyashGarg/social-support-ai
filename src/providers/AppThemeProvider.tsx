/**
 * AppThemeProvider - MUI Theme and RTL Support Provider
 * 
 * ARCHITECTURE DECISION: Separate Emotion cache for RTL/LTR
 * 
 * Rationale:
 * - MUI requires separate Emotion cache instances for RTL/LTR
 * - RTL plugin must be configured at cache creation time
 * - Theme direction must match cache direction
 * - Provides consistent styling across language switches
 * 
 * Implementation:
 * - Creates separate caches for RTL and LTR
 * - Switches cache based on language direction
 * - Updates theme direction to match
 * - Caches are memoized to avoid recreation
 */
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { createMuiTheme } from '../theme'

const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
})

const ltrCache = createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
})

export default function AppThemeProvider({ children }: { children: ReactNode }) {
    const { isRtl } = useLanguage()
    const direction = isRtl ? 'rtl' : 'ltr'
    const theme = useMemo(() => createMuiTheme(direction), [direction])
    const cache = isRtl ? rtlCache : ltrCache

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}
