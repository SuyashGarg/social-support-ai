import { describe, it, expect } from 'vitest';
import {
    getTextAlign,
    getDir,
    formatNationalId,
    normalizePhone,
    normalizePhoneForValidation,
    isEmailValid,
    isNationalIdValid,
} from './utils';

describe('utils', () => {
    describe('getTextAlign', () => {
        it('should return "right" for RTL', () => {
            expect(getTextAlign(true)).toBe('right');
        });

        it('should return "left" for LTR', () => {
            expect(getTextAlign(false)).toBe('left');
        });
    });

    describe('getDir', () => {
        it('should return "rtl" for RTL', () => {
            expect(getDir(true)).toBe('rtl');
        });

        it('should return "ltr" for LTR', () => {
            expect(getDir(false)).toBe('ltr');
        });
    });

    describe('formatNationalId', () => {
        it('should format a valid 15-digit national ID', () => {
            expect(formatNationalId('123456789012345')).toBe('123-4567-8901234-5');
        });

        it('should format partial national ID', () => {
            expect(formatNationalId('1234567')).toBe('123-4567');
        });

        it('should handle empty string', () => {
            expect(formatNationalId('')).toBe('');
        });

        it('should remove non-digit characters', () => {
            expect(formatNationalId('123-456-789')).toBe('123-4567-89');
        });

        it('should limit to 15 digits', () => {
            expect(formatNationalId('1234567890123456789')).toBe('123-4567-8901234-5');
        });
    });

    describe('normalizePhone', () => {
        it('should remove spaces and non-digit characters except +', () => {
            expect(normalizePhone('+1 234 567 8900')).toBe('+12345678900');
        });

        it('should trim whitespace', () => {
            expect(normalizePhone('  1234567890  ')).toBe('1234567890');
        });

        it('should remove all non-digit characters except +', () => {
            expect(normalizePhone('(123) 456-7890')).toBe('1234567890');
        });
    });

    describe('normalizePhoneForValidation', () => {
        it('should keep phone number starting with +', () => {
            expect(normalizePhoneForValidation('+1234567890')).toBe('+1234567890');
        });

        it('should convert 00 prefix to +', () => {
            expect(normalizePhoneForValidation('001234567890')).toBe('+1234567890');
        });

        it('should prepend UAE country code for local number', () => {
            expect(normalizePhoneForValidation('501234567')).toBe('+971501234567');
        });

        it('should prepend specified country code', () => {
            expect(normalizePhoneForValidation('501234567', 'SA')).toBe('+966501234567');
        });

        it('should handle empty string', () => {
            expect(normalizePhoneForValidation('')).toBe('');
        });

        it('should handle whitespace-only string', () => {
            expect(normalizePhoneForValidation('   ')).toBe('');
        });

        it('should remove non-digit characters before processing', () => {
            expect(normalizePhoneForValidation('(50) 123-4567')).toBe('+971501234567');
        });
    });

    describe('isEmailValid', () => {
        it('should validate correct email addresses', () => {
            expect(isEmailValid('test@example.com')).toBe(true);
            expect(isEmailValid('user.name@domain.co.uk')).toBe(true);
            expect(isEmailValid('user+tag@example.com')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(isEmailValid('invalid')).toBe(false);
            expect(isEmailValid('invalid@')).toBe(false);
            expect(isEmailValid('@example.com')).toBe(false);
            expect(isEmailValid('invalid@.com')).toBe(false);
            expect(isEmailValid('invalid@com')).toBe(false);
            expect(isEmailValid('')).toBe(false);
        });
    });

    describe('isNationalIdValid', () => {
        it('should validate correctly formatted national ID', () => {
            expect(isNationalIdValid('123-4567-8901234-5')).toBe(true);
        });

        it('should reject invalid formats', () => {
            expect(isNationalIdValid('123456789012345')).toBe(false);
            expect(isNationalIdValid('123-4567-8901234')).toBe(false);
            expect(isNationalIdValid('123-456-78901234-5')).toBe(false);
            expect(isNationalIdValid('')).toBe(false);
            expect(isNationalIdValid('abc-defg-hijklmn-o')).toBe(false);
        });
    });
});
