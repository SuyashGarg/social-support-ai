import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { List } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { useTranslation } from 'react-i18next'
import { loadGoogleMaps } from '../../google/loader'
import { LISTBOX_PADDING } from '../../common/constants'
import { getDir, getTextAlign } from '../../common/utils'

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
    )
    return country?.short_name ?? null
}

const getAdminAreaFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    const state = place?.address_components?.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('administrative_area_level_1'),
    )
    return state?.short_name ?? null
}

const getCityFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    // Try different city types in order of preference
    const cityTypes = [
        'locality', // City name
        'administrative_area_level_2', // County/City level
        'administrative_area_level_3', // Sub-county level
    ]

    for (const type of cityTypes) {
        const city = place?.address_components?.find(
            (component: google.maps.GeocoderAddressComponent) =>
                component.types.includes(type),
        )
        if (city) {
            return city.long_name ?? null
        }
    }

    return null
}

const getStateNameFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    const state = place?.address_components?.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('administrative_area_level_1'),
    )
    return state?.long_name ?? null
}

const getStreetAddressFromPlace = (place?: google.maps.places.PlaceResult | null) => {
    if (!place?.address_components) return null

    const streetNumber = place.address_components.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('street_number'),
    )

    const route = place.address_components.find(
        (component: google.maps.GeocoderAddressComponent) =>
            component.types.includes('route'),
    )

    const parts: string[] = []
    if (streetNumber?.long_name) {
        parts.push(streetNumber.long_name)
    }
    if (route?.long_name) {
        parts.push(route.long_name)
    }

    return parts.length > 0 ? parts.join(' ') : null
}

const filterPrediction = (option: Option, fieldType: FieldType) => {
    if (fieldType === 'country') {
        return option.types.includes('country')
    }
    if (fieldType === 'state') {
        return option.types.includes('administrative_area_level_1')
    }
    return true
}

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
    const { t } = useTranslation()
    const [options, setOptions] = useState<Option[]>([])
    const [inputValue, setInputValue] = useState(value ?? '')
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
    const placesService = useRef<google.maps.places.PlacesService | null>(null)
    const mounted = useRef(true)

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        loadGoogleMaps().then((googleInstance) => {
            if (cancelled) return
            if (!googleInstance) return
            if (!autocompleteService.current) {
                autocompleteService.current = new googleInstance.maps.places.AutocompleteService()
            }
            if (!placesService.current) {
                const container = document.createElement('div')
                placesService.current = new googleInstance.maps.places.PlacesService(container)
            }
        })

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        setInputValue(value ?? '')
    }, [value])

    useEffect(() => {
        const service = autocompleteService.current
        if (!service) return
        if (!inputValue) {
            setOptions([])
            return
        }

        const request: google.maps.places.AutocompletionRequest = {
            input: inputValue,
            types: fieldType === 'address' ? ['address'] : ['(regions)'],
            componentRestrictions: countryCode ? { country: countryCode } : undefined,
        }

        service.getPlacePredictions(request, (predictions: google.maps.places.AutocompletePrediction[] | null) => {
            if (!mounted.current) return
            const normalized =
                predictions?.map((prediction: google.maps.places.AutocompletePrediction) => ({
                    description: prediction.description,
                    placeId: prediction.place_id,
                    types: prediction.types ?? [],
                })) ?? []
            setOptions(normalized.filter((option) => filterPrediction(option, fieldType)))
        })
    }, [inputValue, fieldType, countryCode])

    const handleSelect = useCallback((option: Option | null) => {
        const service = placesService.current
        if (!option || !service) {
            onValueChange(name, null)
            onMetaChange?.({
                countryCode: null,
                stateCode: null,
                placeId: null,
            })
            setInputValue('')
            setOptions([])
            return
        }

        // For address fields, wait for place details to get street address
        // For other fields, use description immediately
        if (fieldType !== 'address') {
            onValueChange(name, option.description ?? null)
        }

        service.getDetails(
            { placeId: option.placeId, fields: ['address_components'] },
            (place: google.maps.places.PlaceResult | null) => {
                if (!mounted.current) return

                const meta: Record<string, string | null> = {
                    countryCode: getCountryCodeFromPlace(place),
                    stateCode: getAdminAreaFromPlace(place),
                    placeId: option.placeId,
                }

                // For address fields, extract street address, city and state names
                if (fieldType === 'address') {
                    const streetAddress = getStreetAddressFromPlace(place)
                    // Use street address if available, otherwise fall back to description
                    const addressValue = streetAddress ?? option.description ?? null
                    onValueChange(name, addressValue)
                    meta.city = getCityFromPlace(place)
                    meta.state = getStateNameFromPlace(place)
                }

                onMetaChange?.(meta)
            },
        )
    }, [name, fieldType, onMetaChange, onValueChange])

    const getOptionLabel = useCallback(
        (option: string | Option) => (typeof option === 'string' ? option : option.description),
        [],
    )

    const handleAutocompleteChange = useCallback(
        (_: React.SyntheticEvent, option: Option | string | null, reason: string) => {
            if (reason === 'clear') {
                handleSelect(null)
                return
            }
            if (typeof option === 'string') {
                onValueChange(name, option)
                return
            }
            handleSelect(option)
        },
        [handleSelect, name, onValueChange],
    )

    const handleInputChange = useCallback(
        (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
            if (reason === 'clear') {
                setInputValue('')
                return
            }
            setInputValue(newInputValue)
        },
        [],
    )

    const renderInput = useCallback(
        (params: React.ComponentProps<typeof TextField>) => (
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
                    },
                }}
                size="small"
                fullWidth
            />
        ),
        [isRtl, labelKey, placeholderKey, required, t],
    )

    const ListboxComponent = useMemo(() => {
        type RowProps = {
            data: React.ReactElement[]
        }

        const Row = ({ index, style, ariaAttributes, data }: RowComponentProps<RowProps>) => {
            const row = data[index]
            if (!row) return null
            return React.cloneElement(
                row,
                {
                    style: { ...style, top: (style.top as number) + LISTBOX_PADDING },
                    ...ariaAttributes,
                } as React.HTMLAttributes<HTMLElement>,
            )
        }

        const Inner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
            function ListboxComponent(props, ref) {
                const { children, ...other } = props
                const itemData = React.Children.toArray(children) as React.ReactElement[]

                const itemCount = itemData.length
                const itemSize = 48
                const height = Math.min(8, itemCount) * itemSize + 2 * LISTBOX_PADDING

                return (
                    <div ref={ref} {...other}>
                        <List<RowProps>
                            rowCount={itemCount}
                            rowHeight={itemSize}
                            rowComponent={Row}
                            rowProps={{ data: itemData }}
                            overscanCount={5}
                            style={{ height, width: '100%' }}
                        />
                    </div>
                )
            },
        )

        return Inner
    }, [])

    return (
        <Autocomplete
            id={id}
            options={options}
            getOptionLabel={getOptionLabel}
            value={options.find((option) => option.description === value) ?? null}
            onChange={handleAutocompleteChange}
            freeSolo
            openOnFocus
            clearOnEscape
            clearOnBlur={false}
            onBlur={onBlur}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            filterOptions={(x) => x}
            slots={{ listbox: ListboxComponent }}
            sx={{
                '& .MuiInputBase-input': { textAlign: getTextAlign(isRtl) },
            }}
            renderInput={renderInput}
        />
    )
}
