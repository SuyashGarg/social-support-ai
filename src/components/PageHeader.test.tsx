import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PageHeader from './PageHeader';
import { LanguageProvider } from '../context/LanguageContext';
import AppThemeProvider from '../providers/AppThemeProvider';
import * as storage from '../common/storage';

// Mock child components
vi.mock('./LanguageSwitch', () => ({
    default: () => <div data-testid="language-switch">Language Switch</div>,
}));

vi.mock('./ProfileMenu', () => ({
    default: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

// Mock storage
vi.mock('../common/storage', () => ({
    clearSessionData: vi.fn(),
}));

// Helper function to render component with all providers
const renderWithProviders = (initialPath = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <LanguageProvider>
                <AppThemeProvider>
                    <PageHeader />
                </AppThemeProvider>
            </LanguageProvider>
        </MemoryRouter>
    );
};

describe('PageHeader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the logo and title', () => {
        renderWithProviders();

        expect(screen.getByAltText('Social Support logo')).toBeInTheDocument();
        expect(screen.getByText('Social Support')).toBeInTheDocument();
    });

    it('should render language switch and profile menu', () => {
        renderWithProviders();

        expect(screen.getByTestId('language-switch')).toBeInTheDocument();
        expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
    });

    it('should have accessible brand button', () => {
        renderWithProviders();

        const brandButton = screen.getByLabelText('Social Support - Go to home');
        expect(brandButton).toBeInTheDocument();
        expect(brandButton.tagName).toBe('BUTTON');
    });

    it('should render header element', () => {
        renderWithProviders();

        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('should clear session data when clicking brand from non-home path', async () => {
        const user = userEvent.setup();
        renderWithProviders('/step/1');

        const brandButton = screen.getByLabelText('Social Support - Go to home');
        await user.click(brandButton);

        expect(storage.clearSessionData).toHaveBeenCalledTimes(1);
    });

    it('should not clear session data when clicking brand from home path', async () => {
        const user = userEvent.setup();
        renderWithProviders('/');

        const brandButton = screen.getByLabelText('Social Support - Go to home');
        await user.click(brandButton);

        expect(storage.clearSessionData).not.toHaveBeenCalled();
    });

    it('should not clear session data when clicking brand from step/0 path', async () => {
        const user = userEvent.setup();
        renderWithProviders('/step/0');

        const brandButton = screen.getByLabelText('Social Support - Go to home');
        await user.click(brandButton);

        expect(storage.clearSessionData).not.toHaveBeenCalled();
    });
});
