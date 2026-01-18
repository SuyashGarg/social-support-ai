import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import i18n from '../i18n';

// Mock i18n
vi.mock('../i18n', () => ({
    default: {
        language: 'en',
        changeLanguage: vi.fn(),
    },
}));

// Test component that uses the hook
function TestComponent() {
    const { language, isRtl, setLanguage } = useLanguage();
    return (
        <div>
            <div data-testid="language">{language}</div>
            <div data-testid="isRtl">{isRtl.toString()}</div>
            <button onClick={() => setLanguage('ar')}>Set Arabic</button>
            <button onClick={() => setLanguage('en')}>Set English</button>
        </div>
    );
}

// Component to test error case
function ComponentWithoutProvider() {
    useLanguage();
    return <div>Should not render</div>;
}

describe('LanguageContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (i18n.language as string) = 'en';
    });

    describe('LanguageProvider', () => {
        it('should provide default language from i18n', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('language')).toHaveTextContent('en');
        });

        it('should set isRtl to false for English', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('isRtl')).toHaveTextContent('false');
        });

        it('should update language when setLanguage is called', async () => {
            const user = await import('@testing-library/user-event');
            const userEvent = user.default.setup();

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('language')).toHaveTextContent('en');

            const arabicButton = screen.getByText('Set Arabic');
            await userEvent.click(arabicButton);

            expect(screen.getByTestId('language')).toHaveTextContent('ar');
            expect(i18n.changeLanguage).toHaveBeenCalledWith('ar');
        });

        it('should update isRtl when language changes to Arabic', async () => {
            const user = await import('@testing-library/user-event');
            const userEvent = user.default.setup();

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('isRtl')).toHaveTextContent('false');

            const arabicButton = screen.getByText('Set Arabic');
            await userEvent.click(arabicButton);

            expect(screen.getByTestId('isRtl')).toHaveTextContent('true');
        });

        it('should call i18n.changeLanguage when language changes', async () => {
            const user = await import('@testing-library/user-event');
            const userEvent = user.default.setup();

            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            const englishButton = screen.getByText('Set English');
            await userEvent.click(englishButton);

            expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
        });
    });

    describe('useLanguage', () => {
        it('should throw error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            expect(() => {
                render(<ComponentWithoutProvider />);
            }).toThrow('useLanguage must be used within LanguageProvider');

            consoleSpy.mockRestore();
        });
    });
});
