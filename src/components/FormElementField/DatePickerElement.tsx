import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ar'
import 'dayjs/locale/en'
import type { FormElement } from '../../types/form'

type Props = {
    element: FormElement
    value: string
    label: string
    placeholder: string
    isRtl: boolean
    required?: boolean
    errorMessage?: string | null
    onChange: (value: string) => void
    onBlur: () => void
}

export default function DatePickerElement({
    element,
    value,
    label,
    placeholder,
    isRtl,
    required,
    errorMessage,
    onChange,
    onBlur,
}: Props) {
    const locale = isRtl ? 'ar' : 'en'
    const maxDate = element.allowFuture === false ? dayjs() : undefined
    const dateValue = value ? dayjs(value) : null

    const handleChange = (newValue: Dayjs | null) => {
        onChange(newValue ? newValue.format('YYYY-MM-DD') : '')
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
            <DatePicker
                label={label}
                value={dateValue}
                onChange={handleChange}
                maxDate={maxDate}
                format={isRtl ? 'DD/MM/YYYY' : 'DD/MM/YYYY'}
                slotProps={{
                    textField: {
                        id: element.id,
                        name: element.name,
                        placeholder: placeholder,
                        required: required,
                        error: Boolean(errorMessage),
                        helperText: errorMessage ?? ' ',
                        fullWidth: true,
                        size: 'small',
                        onBlur: onBlur,
                        InputLabelProps: {
                            required,
                        },
                    },
                    actionBar: {
                        actions: ['clear', 'today'],
                    },
                }}
            />
        </LocalizationProvider>
    )
}
