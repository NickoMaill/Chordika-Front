import { useEffect, useMemo, useState } from 'react';
import { DateOrTimeView, DateValidationError, DateView, TimeValidationError, DateTimeValidationError } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { frFR } from '@mui/x-date-pickers/locales';
import { JSX } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_PICKER_LOCALE } from './datePickerLocale';

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const DEFAULT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
const DEFAULT_TIME_FORMAT = 'HH:mm';
const DEFAULT_DATE_VIEWS: DateView[] = ['day', 'month', 'year'];
const DEFAULT_TIME_VIEWS: DateOrTimeView[] = ['hours', 'minutes', 'seconds'];

type PickerValidationError = DateValidationError | TimeValidationError | DateTimeValidationError;

export default function InputDateField({
    id,
    disabled,
    required,
    onChange,
    value = '',
    openTo = 'day',
    error,
    success,
    warning,
    format,
    views,
    mode = 'date',
    placeholder,
    readOnly,
}: IInputDateField): JSX.Element {
    const pickerFormat = useMemo(() => format ?? getDefaultFormat(mode), [format, mode]);
    const dateViews = useMemo(() => (views?.length ? views : DEFAULT_DATE_VIEWS), [views]);
    const dateTimeViews = useMemo<DateOrTimeView[]>(() => [...dateViews, ...DEFAULT_TIME_VIEWS], [dateViews]);
    const [date, setDate] = useState<Dayjs | null>(() => parseDateValue(value, mode, pickerFormat));
    const [internalError, setInternalError] = useState<boolean>(() => Boolean(value) && !parseDateValue(value, mode, pickerFormat));

    const hasError = Boolean(error) || internalError;
    const statusSx = getStatusSx(hasError, success, warning);
    const serializedValue = serializeDateValue(date, mode);

    const handleDateChange = (newValue: Dayjs | null, context?: { validationError?: PickerValidationError }): void => {
        setDate(newValue);

        const isInvalid = !isValidDate(newValue);
        setInternalError(Boolean(context?.validationError) || (required && isInvalid));

        if (onChange) {
            onChange(serializeDateValue(newValue, mode));
        }
    };

    const handleDateError = (reason: PickerValidationError | null, currentValue?: Dayjs | null): void => {
        setInternalError(Boolean(reason) || (required && !isValidDate(currentValue ?? date)));
    };

    useEffect(() => {
        const nextDate = parseDateValue(value, mode, pickerFormat);
        setDate(nextDate);
        setInternalError(Boolean(value) && !nextDate);
    }, [mode, pickerFormat, value]);

    const commonTextFieldProps = {
        id,
        required,
        error: hasError,
        placeholder: placeholder ?? getDefaultPlaceholder(mode),
        sx: statusSx,
    };

    return (
        <>
            <LocalizationProvider localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs} adapterLocale={DATE_PICKER_LOCALE}>
                {mode === 'date' ? (
                    <DatePicker
                        sx={{ width: '100%', marginTop: '8px', marginBottom: '4px' }}
                        value={date}
                        onChange={handleDateChange}
                        onError={handleDateError}
                        slotProps={{ textField: commonTextFieldProps }}
                        openTo={openTo}
                        views={dateViews}
                        format={pickerFormat}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                ) : mode === 'datetime' ? (
                    <DateTimePicker
                        views={dateTimeViews}
                        ampm={false}
                        format={pickerFormat}
                        displayWeekNumber
                        slotProps={{
                            textField: {
                                ...commonTextFieldProps,
                                sx: {
                                    ...statusSx,
                                    '&& .MuiPickersSectionList-root': {
                                        padding: '10px 0!important',
                                    },
                                },
                            },
                        }}
                        value={date}
                        onChange={handleDateChange}
                        onError={handleDateError}
                        disabled={disabled}
                        readOnly={readOnly}
                        sx={{ width: '100%', marginTop: '8px', marginBottom: '4px' }}
                    />
                ) : (
                    <TimePicker
                        slotProps={{ textField: commonTextFieldProps }}
                        ampm={false}
                        format={pickerFormat}
                        sx={{ width: '100%', marginTop: '8px', marginBottom: '4px' }}
                        value={date}
                        onChange={handleDateChange}
                        onError={handleDateError}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                )}
                <input type="hidden" id={`${id as string}-value`} name={id as string} value={serializedValue} readOnly />
            </LocalizationProvider>
        </>
    );
}

function getDefaultFormat(mode: IInputDateField['mode']): string {
    switch (mode) {
        case 'datetime':
            return DEFAULT_DATETIME_FORMAT;
        case 'time':
            return DEFAULT_TIME_FORMAT;
        default:
            return DEFAULT_DATE_FORMAT;
    }
}

function getDefaultPlaceholder(mode: IInputDateField['mode']): string {
    switch (mode) {
        case 'datetime':
            return 'JJ/MM/AAAA HH:mm:ss';
        case 'time':
            return 'HH:mm';
        default:
            return 'JJ/MM/AAAA';
    }
}

function parseDateValue(value: unknown, mode: IInputDateField['mode'], format: string): Dayjs | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (dayjs.isDayjs(value)) {
        return value.isValid() ? value : null;
    }

    if (value instanceof Date || typeof value === 'number') {
        const parsed = dayjs(value);
        return parsed.isValid() ? parsed : null;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const trimmedValue = value.trim();
    const strictFormats = getParseFormats(mode, format);

    for (const strictFormat of strictFormats) {
        const parsed = dayjs(trimmedValue, strictFormat, DATE_PICKER_LOCALE, true);
        if (parsed.isValid()) {
            return parsed;
        }
    }

    const parsed = dayjs(trimmedValue);
    return parsed.isValid() ? parsed : null;
}

function getParseFormats(mode: IInputDateField['mode'], format: string): string[] {
    const formats = [format];

    switch (mode) {
        case 'datetime':
            formats.push(DEFAULT_DATETIME_FORMAT, 'DD/MM/YYYY HH:mm', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD HH:mm:ss');
            break;
        case 'time':
            formats.push(DEFAULT_TIME_FORMAT, 'HH:mm:ss');
            break;
        default:
            formats.push(DEFAULT_DATE_FORMAT, 'YYYY-MM-DD');
            break;
    }

    return [...new Set(formats)];
}

function serializeDateValue(value: Dayjs | null, mode: IInputDateField['mode']): string {
    if (!isValidDate(value)) {
        return '';
    }

    switch (mode) {
        case 'datetime':
            return value.format('YYYY-MM-DDTHH:mm:ss');
        case 'time':
            return value.format(DEFAULT_TIME_FORMAT);
        default:
            return value.format('YYYY-MM-DD');
    }
}

function isValidDate(value: Dayjs | null): value is Dayjs {
    return Boolean(value?.isValid());
}

function getStatusSx(hasError: boolean, success?: boolean, warning?: boolean): SxProps<Theme> {
    if (hasError) {
        return {};
    }

    if (!success && !warning) {
        return {};
    }

    return {
        '& .MuiPickersInputBase-root': (theme) => ({
            borderColor: success ? theme.palette.success.main : theme.palette.warning.main,
        }),
        '& .MuiPickersInputBase-root.Mui-focused': (theme) => ({
            borderColor: success ? theme.palette.success.main : theme.palette.warning.main,
            outline: `3px solid ${success ? theme.palette.success.light : theme.palette.warning.light}`,
        }),
    };
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputDateField extends InputBaseType {
    format?: string;
    views?: DateView[];
    openTo?: DateView;
    mode?: 'date' | 'datetime' | 'time';
}
// #endregion IPROPS --> //////////////////////////////////
