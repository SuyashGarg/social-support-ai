import React, { useMemo } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { List } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { LISTBOX_PADDING } from '../../common/constants'
import { getLabelSx } from '../../common/styles'
import { getTextAlign } from '../../common/utils'
import { getInputStyles } from './styles'

type Option = {
    value: string
    label: string
}

type Props = {
    id: string
    name: string
    label: string
    placeholder: string
    value: string
    options: Option[]
    required?: boolean
    errorMessage?: string | null
    isRtl: boolean
    dir: string
    onChange: (value: string) => void
    onBlur: () => void
}

export default function VirtualizedSelect({
    id,
    name,
    label,
    placeholder,
    value,
    options,
    required,
    errorMessage,
    isRtl,
    dir,
    onChange,
    onBlur,
}: Props) {
    const selectedOption = options.find((option) => option.value === value) ?? null

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
            getOptionLabel={(option) => option.label}
            value={selectedOption}
            onChange={(_event, option) => onChange(option?.value ?? '')}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            slots={{ listbox: ListboxComponent }}
            renderOption={(props, option) => (
                <li {...props} key={option.value}>
                    {option.label}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={Boolean(errorMessage)}
                    helperText={errorMessage ?? ' '}
                    slotProps={{
                        inputLabel: {
                            ...params.InputLabelProps,
                            required,
                            sx: getLabelSx(isRtl),
                        },
                        htmlInput: {
                            ...params.inputProps,
                            dir,
                            style: { textAlign: getTextAlign(isRtl) },
                        },
                    }}
                    onBlur={onBlur}
                    size="small"
                    fullWidth
                />
            )}
            openOnFocus
            clearOnEscape
            sx={getInputStyles(isRtl)}
        />
    )
}
