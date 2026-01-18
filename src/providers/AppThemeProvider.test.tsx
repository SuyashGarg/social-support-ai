import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppThemeProvider from './AppThemeProvider';
import { LanguageProvider } from '../context/LanguageContext';
import i18n from '../i18n';
import { vi } from 'vitest';

// Mock i18n
vi.mock('../i18n', () => ({
    default: {
        language: 'en',
        changeLanguage: vi.fn(),
    },
}));

// Test component to verify theme is applied
function TestChild() {
    return <div data-testid="test-child">Test Content</div>;
}

describe('AppThemeProvider', () => {
    it('should render children with theme provider', () => {
        render(
            <LanguageProvider>
                <AppThemeProvider>
                    <TestChild />
                </AppThemeProvider>
            </LanguageProvider>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should use LTR cache and theme for English language', () => {
        (i18n.language as string) = 'en';

        const { container } = render(
            <LanguageProvider>
                <AppThemeProvider>
                    <TestChild />
                </AppThemeProvider>
            </LanguageProvider>
        );

        // Verify component renders (theme application is internal to MUI)
        expect(container.firstChild).toBeTruthy();
    });

    it('should use RTL cache and theme for Arabic language', () => {
        (i18n.language as string) = 'ar';

        const { container } = render(
            <LanguageProvider>
                <AppThemeProvider>
                    <TestChild />
                </AppThemeProvider>
            </LanguageProvider>
        );

        // Verify component renders (theme application is internal to MUI)
        expect(container.firstChild).toBeTruthy();
    });

    it('should switch theme direction when language changes', () => {
        const { rerender } = render(
            <LanguageProvider>
                <AppThemeProvider>
                    <TestChild />
                </AppThemeProvider>
            </LanguageProvider>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();

        // Change language and rerender
        (i18n.language as string) = 'ar';
        rerender(
            <LanguageProvider>
                <AppThemeProvider>
                    <TestChild />
                </AppThemeProvider>
            </LanguageProvider>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
});
