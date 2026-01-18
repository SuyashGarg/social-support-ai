import { useCallback } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import type { FormElement } from '../../types/form';
import { formatNationalId, isEmailValid, isNationalIdValid, normalizePhoneForValidation } from '../../common/utils';

export const useFieldValidation = (
    element: FormElement,
    formData: Record<string, string | boolean | null>,
    setError: (name: string, error: string | null) => void,
) => {
    const { t } = useTranslation();
    const validateField = useCallback(
        (name: string, nextValue: string | boolean | null, required?: boolean) => {
            if (required) {
                if (nextValue === null || nextValue === undefined || String(nextValue).trim() === '') {
                    return t('validation.required');
                }
            }

            if (name === 'nationalId' && typeof nextValue === 'string' && nextValue) {
                return isNationalIdValid(nextValue) ? null : t('validation.invalidDocumentNumber');
            }

            if (name === 'email' && typeof nextValue === 'string' && nextValue) {
                return isEmailValid(nextValue) ? null : t('validation.invalidEmail');
            }

            if (name === 'phone' && typeof nextValue === 'string' && nextValue) {
                const countryCode = formData.countryCode as string | undefined;
                const normalized = normalizePhoneForValidation(nextValue, countryCode);
                return normalized && isValidPhoneNumber(normalized) ? null : t('validation.invalidPhone');
            }

            return null;
        },
        [t],
    );

    const handleBlur = useCallback(() => {
        const currentValue = formData[element.name] ?? null;
        const error = validateField(element.name, currentValue, element.required);
        setError(element.name, error);
    }, [element.name, element.required, formData, setError, validateField]);

    return { handleBlur };
};

export const useFieldHandlers = (
    element: FormElement,
    formErrors: Record<string, string | null>,
    setValue: (name: string, value: string | boolean | null) => void,
    setError: (name: string, error: string | null) => void,
) => {
    const clearFieldError = useCallback(
        (name: string) => {
            if (formErrors[name]) {
                setError(name, null);
            }
        },
        [formErrors, setError],
    );

    const updateFieldValue = useCallback(
        (nextValue: string | boolean | null) => {
            setValue(element.name, nextValue);
            clearFieldError(element.name);
        },
        [clearFieldError, element.name, setValue],
    );

    const handleTextChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const raw = event.target.value;
            const nextValue = element.type === 'id' ? formatNationalId(raw) : raw;
            updateFieldValue(nextValue);
        },
        [element.type, updateFieldValue],
    );

    const handleTextareaChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
        (event) => {
            updateFieldValue(event.target.value);
        },
        [updateFieldValue],
    );

    const handleSelectChange = useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) => {
            updateFieldValue(String(event.target.value));
        },
        [updateFieldValue],
    );

    const handleCheckboxChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            updateFieldValue(event.target.checked);
        },
        [updateFieldValue],
    );

    const handleRadioChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            updateFieldValue(event.target.value);
        },
        [updateFieldValue],
    );

    const handleAutocompleteChange = useCallback(
        (_name: string, nextValue: string | null) => {
            updateFieldValue(nextValue ?? null);
        },
        [updateFieldValue],
    );

    const handleCountryMeta = useCallback(
        (meta: Record<string, string | null>) => {
            setValue('countryCode', meta.countryCode ?? null);
            setValue('countryPlaceId', meta.placeId ?? null);
        },
        [setValue],
    );

    const handleStateMeta = useCallback(
        (meta: Record<string, string | null>) => {
            setValue('stateCode', meta.stateCode ?? null);
            setValue('statePlaceId', meta.placeId ?? null);
        },
        [setValue],
    );

    const handleAddressMeta = useCallback(
        (meta: Record<string, string | null>) => {
            setValue('addressPlaceId', meta.placeId ?? null);
        },
        [setValue],
    );

    return {
        handleTextChange,
        handleTextareaChange,
        handleSelectChange,
        handleCheckboxChange,
        handleRadioChange,
        handleAutocompleteChange,
        handleCountryMeta,
        handleStateMeta,
        handleAddressMeta,
    };
};

export const useFormElementHandlers = (
    element: FormElement,
    formData: Record<string, string | boolean | null>,
    formErrors: Record<string, string | null>,
    setValue: (name: string, value: string | boolean | null) => void,
    setError: (name: string, error: string | null) => void,
) => {
    const { handleBlur } = useFieldValidation(element, formData, setError);
    const handlers = useFieldHandlers(element, formErrors, setValue, setError);

    return { handleBlur, ...handlers };
};
