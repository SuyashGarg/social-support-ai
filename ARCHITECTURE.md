# Architecture Documentation

## Overview

Social Support AI is a React-based single-page application (SPA) designed to help users generate financial hardship statements through a multi-step form process. The application uses OpenAI's API for AI-powered text generation and supports bilingual (English/Arabic) interfaces with RTL (Right-to-Left) layout support.

## Technology Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite (with Rolldown for faster builds)
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **State Management**: React Context API
- **Internationalization**: i18next with react-i18next
- **Styling**: Emotion (CSS-in-JS) with MUI theming
- **Form Validation**: Custom validation with libphonenumber-js
- **API Client**: Axios
- **Deployment**: Vercel (serverless functions)

## Architecture Decisions

### 1. Component-Based Architecture

**Decision**: Use functional components with React Hooks and Context API instead of Redux or other state management libraries.

**Rationale**:
- Simpler mental model for form state management
- Less boilerplate code
- Better TypeScript integration
- Sufficient for the application's complexity level

**Implementation**:
- `MultiStepFormContext` manages form state, validation, and submission
- `LanguageContext` handles language switching and RTL detection
- `AppThemeProvider` manages MUI theme and RTL styling

### 2. Multi-Step Form Pattern

**Decision**: Implement a step-based form with URL-based navigation (`/step/:stepIndex`).

**Rationale**:
- Enables deep linking to specific steps
- Allows browser back/forward navigation
- Better UX for long forms
- Enables progress tracking and validation per step

**Key Features**:
- Step validation before progression
- Automatic redirection to last completed step
- Session persistence via localStorage
- Focus management for accessibility

### 3. Internationalization (i18n)

**Decision**: Use i18next with JSON translation files and support RTL layouts.

**Rationale**:
- Industry-standard i18n solution
- Supports complex translation scenarios
- Easy to add new languages
- RTL support is critical for Arabic users

**Implementation**:
- Translation keys stored in `src/i18n/en.json` and `src/i18n/ar.json`
- Language context provides `language`, `isRtl`, and `setLanguage`
- MUI theme and Emotion cache switch based on direction
- Form validation messages re-translate on language change

### 4. Form State Persistence

**Decision**: Persist form data to localStorage for session recovery.

**Rationale**:
- Users can refresh the page without losing progress
- Better UX for long forms
- No backend required for session management

**Implementation**:
- Form data automatically saved on every change
- Cleared when starting a new form (navigating to step 0)
- Separate storage for form response data

### 5. Serverless API Architecture

**Decision**: Use Vercel serverless functions for OpenAI API calls.

**Rationale**:
- Keeps API keys secure (server-side only)
- No backend infrastructure to maintain
- Scales automatically
- Easy deployment with frontend

**Implementation**:
- API endpoint: `/api/openAi.ts`
- Handles POST requests with situation text
- Returns generated financial hardship statements
- Error handling for rate limits and API failures

### 6. Type Safety

**Decision**: Use TypeScript throughout the application.

**Rationale**:
- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

**Key Types**:
- `FormStep`, `FormElement`, `FormOption` in `src/types/form.ts`
- Strong typing for form data, errors, and validation
- Type-safe translation keys

## Component Structure

### Core Components

```
src/
├── App.tsx                    # Root component with providers
├── components/
│   ├── ContentContainer.tsx   # Main routing container
│   ├── MultiStepForm/         # Multi-step form implementation
│   │   ├── index.tsx          # Form UI and navigation
│   │   ├── MultiStepFormContext.tsx  # Form state management
│   │   └── useFocusManager.ts # Accessibility focus management
│   ├── FormStepCard/          # Individual step display
│   ├── FormElementField/      # Reusable form field components
│   ├── ReviewPage/            # Form submission review
│   └── HistoryPage/           # Submission history
├── context/
│   └── LanguageContext.tsx    # Language and RTL management
└── providers/
    └── AppThemeProvider.tsx   # MUI theme and RTL cache
```

### Form Field Components

The `FormElementField` directory contains specialized components for different input types:
- `TextInputElement` - Text, email, tel inputs
- `TextareaElement` - Multi-line text with optional AI assist
- `SelectElement` - Dropdown selections
- `CheckboxElement` - Boolean inputs
- `RadioElement` - Radio button groups
- `DatePickerElement` - Date selection
- `GoogleAutocompleteField` - Address autocomplete

## State Management Flow

### Form State (`MultiStepFormContext`)

1. **Initialization**: Loads from localStorage or initializes empty
2. **Updates**: `onChange` handler updates state and clears errors
3. **Validation**: `onBlur` validates individual fields; `validateCurrentStep` validates entire step
4. **Persistence**: Auto-saves to localStorage on every change
5. **Submission**: Validates all steps, calls API, saves response, adds to history

### Language State (`LanguageContext`)

1. **Initialization**: Reads from i18next or defaults to 'en'
2. **Updates**: `setLanguage` updates state and i18next
3. **RTL Detection**: Computes `isRtl` based on language
4. **Theme Update**: `AppThemeProvider` reacts to language changes

## Key Features

### 1. Step Validation & Navigation

- **Progressive Disclosure**: Users can only proceed if current step is valid
- **Smart Redirects**: Direct navigation to a step redirects to last completed step
- **Back Navigation**: Preserves form data when going back
- **Session Management**: Clears data when starting fresh (navigating to step 0)

### 2. Field Validation

- **Real-time**: Errors shown on blur
- **Step-level**: All fields validated before proceeding
- **Custom Validators**: 
  - Email format validation
  - Phone number validation (country-aware)
  - National ID validation
  - Required field checks

### 3. Accessibility

- **Focus Management**: Auto-focuses on first error or step title
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Semantic HTML**: Proper form structure

### 4. RTL Support

- **Dynamic Theme**: MUI theme switches direction based on language
- **Emotion Cache**: Separate RTL cache with stylis RTL plugin
- **Icon Direction**: Navigation icons flip based on direction
- **Layout Direction**: Container `dir` attribute updates

## API Integration

### OpenAI Integration

**Endpoint**: `/api/openAi`

**Flow**:
1. User enters situation text in textarea
2. Clicks "Assist" button
3. Frontend calls `/api/openAi` with situation
4. Serverless function calls OpenAI API
5. Returns generated text
6. Populates textarea with generated text

**Error Handling**:
- Rate limit errors (429) return user-friendly message
- Missing API key returns 500 error
- Invalid requests return 400 error

## Data Flow

```
User Input
    ↓
FormElementField Component
    ↓
MultiStepFormContext.onChange
    ↓
Update formData state
    ↓
Auto-save to localStorage
    ↓
Validate on blur/submit
    ↓
Navigate to next step (if valid)
    ↓
Submit form
    ↓
API call (mockSubmitForm)
    ↓
Save response to localStorage
    ↓
Add to history
    ↓
Navigate to review page
```

## Improvements & Future Considerations

### Completed Improvements

1. **React Compiler**: Using babel-plugin-react-compiler for automatic optimizations
2. **TypeScript Strict Mode**: Full type safety throughout
3. **Modular Components**: Reusable form field components
4. **Error Boundaries**: Graceful error handling
5. **Session Persistence**: Form data survives page refreshes
6. **Code Quality Tools**: Husky pre-commit hooks with lint-staged for automated code quality checks
7. **Testing Infrastructure**: Vitest with React Testing Library, achieving 97.82% code coverage

### Future Considerations

- **Backend Integration**: Real backend with authentication, database storage, and submission tracking
- **Performance**: Code splitting, lazy loading, and memoization optimizations
- **Testing**: Integration tests, E2E tests, and accessibility testing
- **Features**: Offline support, PDF export, email notifications, form analytics
- **Developer Experience**: Storybook, better error logging, translation key validation
- **Security**: Input sanitization, XSS protection, CSRF tokens, rate limiting
- **Accessibility**: Screen reader announcements, high contrast mode, reduced motion support

## File Organization Principles

1. **Feature-Based**: Components grouped by feature (FormElementField, MultiStepForm)
2. **Separation of Concerns**: Context, providers, components, and utilities separated
3. **Co-location**: Styles and components in same directory when possible
4. **Type Definitions**: Centralized in `src/types/`
5. **Constants**: Shared constants in `src/common/constants.ts`
6. **Utilities**: Reusable functions in `src/common/utils.ts`

## Code Quality & Testing

### Pre-commit Hooks (Husky)

The project uses **Husky** to enforce code quality before commits:

- **lint-staged**: Automatically lints and fixes staged TypeScript/TSX files
- **Full Lint Check**: Ensures no linting errors exist in the codebase
- **Test Suite**: Runs all tests to prevent regressions

**Configuration**: `.husky/pre-commit` hook runs:
1. `yarn lint-staged` - Lint staged files
2. `yarn lint` - Full lint check
3. `yarn test:run` - Run test suite

If any check fails, the commit is blocked.

### Testing

- **Framework**: Vitest with React Testing Library
- **Coverage**: 97.82% statements, 93.02% branches, 100% functions
- **Test Location**: Tests co-located with source files (`.test.ts`/`.test.tsx`)
- **Setup**: `src/test/setup.ts` configures testing-library matchers

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### Code Standards

- **Semicolons**: Enforced via ESLint (`semi: ['error', 'always']`)
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript ESLint rules
- **Auto-fix**: `yarn lint:fix` automatically fixes linting issues

## Build & Deployment

- **Development**: Vite dev server on port 3001
- **Production**: Vite build outputs to `dist/`
- **Deployment**: Vercel handles both frontend and serverless functions
- **Environment Variables**: `OPENAI_API_KEY` required for OpenAI integration

## Dependencies Rationale

- **@mui/material**: Comprehensive component library with accessibility built-in
- **react-router-dom**: Industry-standard routing solution
- **i18next**: Robust internationalization framework
- **axios**: Promise-based HTTP client
- **libphonenumber-js**: Phone number validation
- **dayjs**: Lightweight date manipulation
- **@emotion/react**: Required for MUI styling system
- **stylis-plugin-rtl**: RTL support for Emotion styles
