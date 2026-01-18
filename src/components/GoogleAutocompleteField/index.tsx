import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { List } from 'react-window';
import type { RowComponentProps } from 'react-window';
import { useTranslation } from 'react-i18next';
import { loadGoogleMaps } from '../../google/loader';
import { LISTBOX_PADDING } from '../../common/constants';
import { getDir, getTextAlign } from '../../common/utils';

const getRowBaseStyles = (isRtl: boolean) => ({
    padding: '4px 12px',
    paddingLeft: isRtl ? '12px' : '16px',
    paddingRight: isRtl ? '16px' : '12px',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    textAlign: getTextAlign(isRtl),
    direction: getDir(isRtl),
});

type Option = {
    description: string
    placeId: string
    types: string[]
}

type FieldType = 'country' | 'state' | 'address'

type Props = {
    id: string
    name: string
    labelKey: string
    placeholderKey?: string
    fieldType: FieldType
    value: string | null
    countryCode?: string | null
    required?: boolean
    errorMessage?: string | null
    onBlur?: () => void
    onValueChange: (name: string, value: string | null) => void
    onMetaChange?: (meta: Record<string, string | null>) => void
    isRtl: boolean
}

const getCountryCodeFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    const country = place?.address_components?.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('country'),
    );
    return country?.short_name ?? null;
};

const getAdminAreaFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    const state = place?.address_components?.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('administrative_area_level_1'),
    );
    return state?.short_name ?? null;
};

const getCityFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    // Try different city types in order of preference
    const cityTypes = [
        'locality', // City name
        'administrative_area_level_2', // County/City level
        'administrative_area_level_3', // Sub-county level
    ];

    for (const type of cityTypes) {
        const city = place?.address_components?.find(
            (component: google.maps.GeocoderAddressComponent) =>
                component.types.includes(type),
        );
        if (city) {
            return city.long_name ?? null;
        }
    }

    return null;
};

const getStateNameFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    const state = place?.address_components?.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('administrative_area_level_1'),
    );
    return state?.long_name ?? null;
};

const getStreetAddressFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    if (!place?.address_components) return null;

    const streetNumber = place.address_components.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('street_number'),
    );

    const route = place.address_components.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('route'),
    );

    const parts: string[] = [];
    if (streetNumber?.long_name) {
        parts.push(streetNumber.long_name);
    }
    if (route?.long_name) {
        parts.push(route.long_name);
    }

    return parts.length > 0 ? parts.join(' ') : null;
};

const filterPrediction = (option: Option, fieldType: FieldType) => {
    if (fieldType === 'country') {
        return option.types.includes('country');
    }
    if (fieldType === 'state') {
        return option.types.includes('administrative_area_level_1');
    }
    return true;
};

export default function GoogleAutocompleteField({
    id,
    name,
    labelKey,
    placeholderKey,
    fieldType,
    value,
    countryCode,
    required,
    errorMessage,
    onBlur,
    onValueChange,
    onMetaChange,
    isRtl,
}: Props) {
    const { t } = useTranslation();
    const [options, setOptions] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState(value ?? '');
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);
    const mounted = useRef(true);
    const rowBaseStyles = useMemo(() => getRowBaseStyles(isRtl), [isRtl]);
    const shouldVirtualize = options.length > 100;

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        loadGoogleMaps().then((googleInstance) => {
            if (cancelled) return;
            if (!googleInstance) return;
            if (!autocompleteService.current) {
                autocompleteService.current = new googleInstance.maps.places.AutocompleteService();
            }
            if (!placesService.current) {
                const container = document.createElement('div');
                placesService.current = new googleInstance.maps.places.PlacesService(container);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setInputValue(value ?? '');
    }, [value]);

    useEffect(() => {
        const service = autocompleteService.current;
        if (!service) return;
        if (!inputValue) {
            setOptions([]);
            return;
        }

        const request: google.maps.places.AutocompletionRequest = {
            input: inputValue,
            types: fieldType === 'address' ? ['address'] : ['(regions)'],
            componentRestrictions: countryCode ? { country: countryCode } : undefined,
        };

        service.getPlacePredictions(request, (predictions: google.maps.places.AutocompletePrediction[] | null) => {
            if (!mounted.current) return;
            const normalized =
                predictions?.map((prediction: google.maps.places.AutocompletePrediction) => ({
                    description: prediction.description,
                    placeId: prediction.place_id,
                    types: prediction.types ?? [],
                })) ?? [];
            setOptions(normalized.filter((option) => filterPrediction(option, fieldType)));
        });
    }, [inputValue, fieldType, countryCode]);

    const handleSelect = useCallback((option: Option | null) => {
        const service = placesService.current;
        if (!option || !service) {
            onValueChange(name, null);
            onMetaChange?.({
                countryCode: null,
                stateCode: null,
                placeId: null,
            });
            setInputValue('');
            setOptions([]);
            return;
        }

        // For address fields, wait for place details to get street address
        // For other fields, use description immediately
        if (fieldType !== 'address') {
            onValueChange(name, option.description ?? null);
        }

        service.getDetails(
            { placeId: option.placeId, fields: ['address_components'] },
            (place: google.maps.places.PlaceResult | null) => {
                if (!mounted.current) return;

                const meta: Record<string, string | null> = {
                    countryCode: getCountryCodeFromPlace(place),
                    stateCode: getAdminAreaFromPlace(place),
                    placeId: option.placeId,
                };

                // For address fields, extract street address, city and state names
                if (fieldType === 'address') {
                    const streetAddress = getStreetAddressFromPlace(place);
                    // Use street address if available, otherwise fall back to description
                    const addressValue = streetAddress ?? option.description ?? null;
                    onValueChange(name, addressValue);
                    meta.city = getCityFromPlace(place);
                    meta.state = getStateNameFromPlace(place);
                }

                onMetaChange?.(meta);
            },
        );
    }, [name, fieldType, onMetaChange, onValueChange]);

    const getOptionLabel = useCallback(
        (option: string | Option) => (typeof option === 'string' ? option : option.description),
        [],
    );

    const handleAutocompleteChange = useCallback(
        (_: React.SyntheticEvent, option: Option | string | null, reason: string) => {
            if (reason === 'clear') {
                handleSelect(null);
                return;
            }
            if (typeof option === 'string') {
                onValueChange(name, option);
                return;
            }
            handleSelect(option);
        },
        [handleSelect, name, onValueChange],
    );

    const handleInputChange = useCallback(
        (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
            if (reason === 'clear') {
                setInputValue('');
                return;
            }
            setInputValue(newInputValue);
        },
        [],
    );

    const renderInput = useCallback(
        (params: React.ComponentProps<typeof TextField>) => {
            const errorId = errorMessage ? `${id}-error` : undefined;
            return (
                <TextField
                    {...params}
                    label={t(labelKey)}
                    placeholder={placeholderKey ? t(placeholderKey) : ''}
                    required={required}
                    error={Boolean(errorMessage)}
                    helperText={errorMessage ?? ' '}
                    slotProps={{
                        inputLabel: {
                            ...params.InputLabelProps,
                            required,
                        },
                        htmlInput: {
                            ...params.inputProps,
                            dir: getDir(isRtl),
                            'aria-describedby': errorId,
                            'aria-required': required || undefined,
                            'aria-invalid': Boolean(errorMessage) || undefined,
                        },
                    }}
                    size="small"
                    fullWidth
                />
            );
        },
        [id, isRtl, labelKey, placeholderKey, required, errorMessage, t],
    );

    const ListboxComponent = useMemo(() => {
        if (!shouldVirtualize) return undefined;
        type RowProps = {
            data: React.ReactElement[]
        }

        const Row = ({ index, style, ariaAttributes, data }: RowComponentProps<RowProps>) => {
            const row = data[index];
            if (!row) return null;
            const existingStyle = (row.props as React.HTMLAttributes<HTMLElement>)?.style || {};
            const existingProps = row.props as React.HTMLAttributes<HTMLElement>;
            return React.cloneElement(
                row,
                {
                    ...existingProps,
                    style: {
                        ...existingStyle,
                        ...style,
                        top: (style.top as number) + LISTBOX_PADDING,
                        ...rowBaseStyles,
                    },
                    ...ariaAttributes,
                    tabIndex: existingProps.tabIndex ?? -1,
                } as React.HTMLAttributes<HTMLElement>,
            );
        };

        const Inner = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLElement>>(
            function ListboxComponent(props, ref) {
                const { children, ...other } = props;
                const itemData = React.Children.toArray(children) as React.ReactElement[];

                const itemCount = itemData.length;
                const itemSize = 36;
                const height = Math.min(8, itemCount) * itemSize + 2 * LISTBOX_PADDING;

                return (
                    <ul
                        ref={ref as React.Ref<HTMLUListElement>}
                        {...other}
                        role="listbox"
                        tabIndex={-1}
                        dir={getDir(isRtl)}
                        style={{ margin: 0, padding: 0, listStyle: 'none', ...other.style }}
                    >
                        <List<RowProps>
                            rowCount={itemCount}
                            rowHeight={itemSize}
                            rowComponent={Row}
                            rowProps={{ data: itemData }}
                            overscanCount={5}
                            style={{ height, width: '100%' }}
                        />
                    </ul>
                );
            },
        );

        return Inner;
    }, [isRtl, rowBaseStyles, shouldVirtualize]);

    const errorId = errorMessage ? `${id}-error` : undefined;
    const selectedOption = options.find((option) => option.description === value) ?? null;

    return (
        <Autocomplete
            id={id}
            options={options}
            getOptionLabel={getOptionLabel}
            value={selectedOption}
            onChange={handleAutocompleteChange}
            freeSolo
            openOnFocus
            clearOnEscape
            clearOnBlur={false}
            onBlur={onBlur}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            filterOptions={(x) => x}
            disableListWrap={false}
            slots={shouldVirtualize ? { listbox: ListboxComponent } : undefined}
            renderOption={(props, option) => {
                const index = options.findIndex((opt) => opt.placeId === option.placeId);
                const optionStyles = shouldVirtualize
                    ? rowBaseStyles
                    : { textAlign: getTextAlign(isRtl) as 'left' | 'right', direction: getDir(isRtl) as 'ltr' | 'rtl' };
                return (
                    <Box
                        component="li"
                        {...props}
                        key={option.placeId}
                        id={`${id}-option-${index}`}
                        sx={optionStyles}
                        dir={getDir(isRtl)}
                        role="option"
                        aria-selected={selectedOption?.placeId === option.placeId}
                        tabIndex={-1}
                    >
                        {option.description}
                    </Box>
                );
            }}
            sx={{
                '& .MuiInputBase-input': { textAlign: getTextAlign(isRtl) },
            }}
            renderInput={renderInput}
            aria-label={t(labelKey)}
            aria-describedby={errorId}
            ListboxProps={{
                role: 'listbox',
                dir: getDir(isRtl),
            }}
        />
    );
}
