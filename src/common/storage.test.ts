import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    STORAGE_KEYS,
    clearSessionData,
    getFormData,
    setFormData,
    getFormResponse,
    setFormResponse,
} from './storage';

describe('storage', () => {
    const originalWindow = globalThis.window;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Ensure window is defined
        if (originalWindow) {
            Object.defineProperty(globalThis, 'window', {
                value: originalWindow,
                writable: true,
                configurable: true,
            });
        }
    });

    afterEach(() => {
        if (originalWindow) {
            Object.defineProperty(globalThis, 'window', {
                value: originalWindow,
                writable: true,
                configurable: true,
            });
        }
    });

    describe('STORAGE_KEYS', () => {
        it('should have correct keys', () => {
            expect(STORAGE_KEYS.FORM_DATA).toBe('socialSupportFormData');
            expect(STORAGE_KEYS.FORM_RESPONSE).toBe('socialSupportFormResponse');
        });
    });

    describe('clearSessionData', () => {
        it('should remove form data and response from localStorage', () => {
            localStorage.setItem(STORAGE_KEYS.FORM_DATA, '{"test": "data"}');
            localStorage.setItem(STORAGE_KEYS.FORM_RESPONSE, '{"test": "response"}');

            clearSessionData();

            expect(localStorage.getItem(STORAGE_KEYS.FORM_DATA)).toBeNull();
            expect(localStorage.getItem(STORAGE_KEYS.FORM_RESPONSE)).toBeNull();
        });

        it('should handle when items do not exist', () => {
            expect(() => clearSessionData()).not.toThrow();
        });
    });

    describe('getFormData', () => {
        it('should return parsed form data from localStorage', () => {
            const testData = { name: 'John', email: 'john@example.com' };
            localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(testData));

            const result = getFormData();

            expect(result).toEqual(testData);
        });

        it('should return null when no data exists', () => {
            const result = getFormData();
            expect(result).toBeNull();
        });

        it('should return null when data is invalid JSON', () => {
            localStorage.setItem(STORAGE_KEYS.FORM_DATA, 'invalid json');

            const result = getFormData();

            expect(result).toBeNull();
        });
    });

    describe('setFormData', () => {
        it('should store form data in localStorage', () => {
            const testData = { name: 'John', email: 'john@example.com', active: true };

            setFormData(testData);

            const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
            expect(stored).toBe(JSON.stringify(testData));
        });

        it('should overwrite existing form data', () => {
            localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify({ old: 'data' }));
            const newData = { new: 'data' };

            setFormData(newData);

            const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
            expect(JSON.parse(stored!)).toEqual(newData);
        });
    });

    describe('getFormResponse', () => {
        it('should return parsed form response from localStorage', () => {
            const testResponse = { id: '123', status: 'success' };
            localStorage.setItem(STORAGE_KEYS.FORM_RESPONSE, JSON.stringify(testResponse));

            const result = getFormResponse();

            expect(result).toEqual(testResponse);
        });

        it('should return null when no response exists', () => {
            const result = getFormResponse();
            expect(result).toBeNull();
        });

        it('should return null when response is invalid JSON', () => {
            localStorage.setItem(STORAGE_KEYS.FORM_RESPONSE, 'invalid json');

            const result = getFormResponse();

            expect(result).toBeNull();
        });
    });

    describe('setFormResponse', () => {
        it('should store form response in localStorage', () => {
            const testResponse = { id: '123', status: 'success', submitted: true };

            setFormResponse(testResponse);

            const stored = localStorage.getItem(STORAGE_KEYS.FORM_RESPONSE);
            expect(stored).toBe(JSON.stringify(testResponse));
        });

        it('should overwrite existing form response', () => {
            localStorage.setItem(STORAGE_KEYS.FORM_RESPONSE, JSON.stringify({ old: 'response' }));
            const newResponse = { new: 'response' };

            setFormResponse(newResponse);

            const stored = localStorage.getItem(STORAGE_KEYS.FORM_RESPONSE);
            expect(JSON.parse(stored!)).toEqual(newResponse);
        });
    });

    describe('SSR scenarios', () => {
        it('should handle getFormData when window is undefined', () => {
            // Mock SSR scenario by removing window
            Object.defineProperty(globalThis, 'window', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = getFormData();
            expect(result).toBeNull();
        });

        it('should handle getFormResponse when window is undefined', () => {
            // Mock SSR scenario by removing window
            Object.defineProperty(globalThis, 'window', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = getFormResponse();
            expect(result).toBeNull();
        });

        it('should handle clearSessionData when window is undefined', () => {
            // Mock SSR scenario by removing window
            Object.defineProperty(globalThis, 'window', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(() => clearSessionData()).not.toThrow();
        });

        it('should handle setFormData when window is undefined', () => {
            // Mock SSR scenario by removing window
            Object.defineProperty(globalThis, 'window', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(() => setFormData({ test: 'data' })).not.toThrow();
        });

        it('should handle setFormResponse when window is undefined', () => {
            // Mock SSR scenario by removing window
            Object.defineProperty(globalThis, 'window', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(() => setFormResponse({ test: 'response' })).not.toThrow();
        });
    });
});
