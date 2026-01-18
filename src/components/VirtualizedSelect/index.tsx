import React, { useMemo } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { List } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { LISTBOX_PADDING } from '../../common/constants'
import { useLanguage } from '../../context/LanguageContext'
import { getDir, getTextAlign } from '../../common/utils'

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
    onChange: (value: string) => void
    onBlur: () => void
}

const getRowBaseStyles = (isRtl: boolean) => ({
    padding: '4px 12px',
    paddingLeft: isRtl ? '12px' : '16px',
    paddingRight: isRtl ? '16px' : '12px',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    textAlign: getTextAlign(isRtl) as 'left' | 'right',
    direction: getDir(isRtl) as 'ltr' | 'rtl',
})

export default function VirtualizedSelect({
    id,
    name,
    label,
    placeholder,
    value,
    options,
    required,
    errorMessage,
    onChange,
    onBlur,
}: Props) {
    const selectedOption = options.find((option) => option.value === value) ?? null
    const { isRtl } = useLanguage()
    const rowBaseStyles = useMemo(() => getRowBaseStyles(isRtl), [isRtl])
    const shouldVirtualize = options.length > 100

    const ListboxComponent = useMemo(() => {
        if (!shouldVirtualize) return undefined
        type RowProps = {
            data: React.ReactElement[]
        }

        const Row = ({ index, style, ariaAttributes, data }: RowComponentProps<RowProps>) => {
            const row = data[index]
            if (!row) return null
            const existingStyle = (row.props as React.HTMLAttributes<HTMLElement>)?.style || {}
            const existingProps = row.props as React.HTMLAttributes<HTMLElement>
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
            )
        }

        const Inner = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLElement>>(
            function ListboxComponent(props, ref) {
                const { children, ...other } = props
                const itemData = React.Children.toArray(children) as React.ReactElement[]
                const itemCount = itemData.length
                const itemSize = 36
                const height = Math.min(8, itemCount) * itemSize + 2 * LISTBOX_PADDING

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
                )
            },
        )

        return Inner
    }, [isRtl, rowBaseStyles, shouldVirtualize])

    const errorId = errorMessage ? `${id}-error` : undefined

    return (
        <Autocomplete
            id={id}
            options={options}
            getOptionLabel={(option) => option.label}
            value={selectedOption}
            onChange={(_event, option) => onChange(option?.value ?? '')}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            slots={shouldVirtualize ? { listbox: ListboxComponent } : undefined}
            renderOption={(props, option) => {
                const index = options.findIndex((opt) => opt.value === option.value)
                const optionStyles = shouldVirtualize
                    ? rowBaseStyles
                    : { textAlign: getTextAlign(isRtl) as 'left' | 'right', direction: getDir(isRtl) as 'ltr' | 'rtl' }
                return (
                    <li
                        {...props}
                        key={option.value}
                        id={`${id}-option-${index}`}
                        style={optionStyles}
                        dir={getDir(isRtl)}
                        role="option"
                        aria-selected={selectedOption?.value === option.value}
                        tabIndex={-1}
                    >
                        {option.label}
                    </li>
                )
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={Boolean(errorMessage)}
                    helperText={errorMessage ?? ' '}
                    FormHelperTextProps={{
                        id: errorId,
                        role: errorMessage ? 'alert' : undefined,
                    }}
                    slotProps={{
                        inputLabel: {
                            ...params.InputLabelProps,
                            required,
                        },
                    }}
                    inputProps={{
                        ...params.inputProps,
                        'aria-describedby': errorId,
                        'aria-required': required || undefined,
                        'aria-invalid': Boolean(errorMessage) || undefined,
                    }}
                    onBlur={onBlur}
                    size="small"
                    fullWidth
                />
            )}
            openOnFocus
            clearOnEscape
            disableListWrap={false}
            aria-label={label}
            aria-describedby={errorId}
            ListboxProps={{
                role: 'listbox',
                dir: getDir(isRtl),
            }}
        />
    )
}
