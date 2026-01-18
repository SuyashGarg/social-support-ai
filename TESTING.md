# Testing Guide

This project uses **Vitest** and **React Testing Library** for unit and component testing.

## Quick Start

### Running Tests

```bash
# Run tests in watch mode (recommended during development)
yarn test

# Run tests once
yarn test:run

# Run tests with UI (interactive)
yarn test:ui

# Run tests with coverage report
yarn test:coverage
```

## Test Structure

Tests are located next to the files they test, using the `.test.ts` or `.test.tsx` extension:

```
src/
  common/
    utils.ts
    utils.test.ts          ← Test file
  components/
    PageHeader.tsx
    PageHeader.test.tsx    ← Test file
```

## Writing Tests

### Unit Tests (Pure Functions)

Example: Testing utility functions (`src/common/utils.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { formatNationalId, isEmailValid } from './utils'

describe('formatNationalId', () => {
  it('should format a valid 15-digit national ID', () => {
    expect(formatNationalId('123456789012345')).toBe('123-4567-8901234-5')
  })

  it('should handle edge cases', () => {
    expect(formatNationalId('')).toBe('')
  })
})
```

### Component Tests

Example: Testing React components (`src/components/PageHeader.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'
import AppThemeProvider from '../providers/AppThemeProvider'
import MyComponent from './MyComponent'

// Mock dependencies if needed
vi.mock('./ChildComponent', () => ({
  default: () => <div data-testid="child">Child</div>,
}))

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <AppThemeProvider>
            <MyComponent />
          </AppThemeProvider>
        </LanguageProvider>
      </MemoryRouter>
    )
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it('should do something', () => {
  // Arrange: Set up test data
  const input = 'test@example.com'
  
  // Act: Execute the function
  const result = isEmailValid(input)
  
  // Assert: Check the result
  expect(result).toBe(true)
})
```

### 2. Descriptive Test Names

✅ Good:
```typescript
it('should format phone number with country code when no + prefix', () => {
  // ...
})
```

❌ Bad:
```typescript
it('works', () => {
  // ...
})
```

### 3. Test One Thing at a Time

Each test should verify a single behavior or edge case.

### 4. Use Appropriate Queries

Prefer queries that reflect how users interact with your app:

```typescript
// ✅ Good - accessible queries
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// ❌ Avoid - implementation details
screen.getByTestId('submit-btn')  // Use sparingly
```

### 5. Mock External Dependencies

Mock API calls, localStorage, and other external dependencies:

```typescript
// Mock a module
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
global.localStorage = localStorageMock as any
```

### 6. Clean Up After Tests

Vitest automatically cleans up after each test, but if you need manual cleanup:

```typescript
afterEach(() => {
  vi.clearAllMocks()
  cleanup() // From @testing-library/react
})
```

## Common Testing Scenarios

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event'

it('should handle button click', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const button = screen.getByRole('button', { name: 'Click me' })
  await user.click(button)
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

### Testing Form Submissions

```typescript
it('should submit form with valid data', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  
  render(<Form onSubmit={onSubmit} />)
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})
```

### Testing Async Operations

```typescript
it('should load data on mount', async () => {
  render(<DataComponent />)
  
  // Wait for async content
  expect(await screen.findByText('Loaded data')).toBeInTheDocument()
})
```

### Testing Router Navigation

```typescript
import { MemoryRouter } from 'react-router-dom'

it('should navigate on link click', () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  )
  
  // Test navigation behavior
})
```

## Configuration

### Vitest Config (`vite.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,              // Use global test functions
    environment: 'jsdom',       // Browser-like environment
    setupFiles: './src/test/setup.ts',
    css: true,                  // Process CSS files
  },
})
```

### Test Setup (`src/test/setup.ts`)

This file runs before each test and sets up:
- `@testing-library/jest-dom` matchers (`.toBeInTheDocument()`, etc.)
- Global cleanup

## Coverage

Generate coverage reports:

```bash
yarn test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Debugging Tests

### Using VS Code

1. Install the "Vitest" extension
2. Set breakpoints in your test files
3. Run tests in debug mode

### Using Browser DevTools

Run tests with UI mode:

```bash
yarn test:ui
```

This opens an interactive interface where you can:
- See test results in real-time
- Filter tests
- Debug individual tests
- View coverage

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [User Event](https://testing-library.com/docs/user-event/intro/)

## Example Test Files

- `src/common/utils.test.ts` - Unit tests for utility functions
- `src/components/PageHeader.test.tsx` - Component tests with providers
- `src/common/storage.test.ts` - Storage utility tests with SSR scenarios
- `src/context/LanguageContext.test.tsx` - Context provider tests
- `src/providers/AppThemeProvider.test.tsx` - Theme provider tests

## Pre-commit Hooks

This project uses **Husky** to run tests automatically before commits. When you commit code:

1. **lint-staged** runs ESLint on staged files and auto-fixes issues
2. **Full lint check** ensures no linting errors exist
3. **Tests** run to ensure nothing is broken

If any check fails, the commit will be blocked. This helps maintain code quality and prevents broken code from being committed.

To manually run the same checks:
```bash
yarn lint-staged  # Lint staged files
yarn lint         # Full lint check
yarn test:run     # Run all tests
```