import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Enforce semicolons at the end of all statements (standard for this project)
      'semi': ['error', 'always'],
      // Allow React Compiler memoization warnings (these are optimization suggestions, not errors)
      'react-hooks/preserve-manual-memoization': 'warn',
      // Allow setState in effects for controlled components (needed for some MUI components)
      'react-hooks/set-state-in-effect': 'warn',
      // Allow fast refresh warnings (non-blocking for development)
      'react-refresh/only-export-components': 'warn',
    },
  },
])
