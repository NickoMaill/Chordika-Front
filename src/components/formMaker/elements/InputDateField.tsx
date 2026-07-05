import { useEffect, useState } from 'react';
import { DateView } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { frFR } from '@mui/x-date-pickers/locales';
import { JSX } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export default function InputDateField({ id, disabled, required, onChange, value = '', openTo = 'day', error, mode = 'date' }: IInputDateField): JSX.Element {
    const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value as string) : null);
    const [isError, setIsError] = useState<boolean>(error);

    const handleDateChange = (newValue: Dayjs | null): void => {
        if (!newValue || !newValue.isValid()) {
            return;
        }

        setDate(newValue);

        if (required && !newValue) {
            setIsError(true);
        } else {
            setIsError(false);
        }
    };

    const handleDateError = (reason: string | null): void => {
        if (required && !date) {
            setIsError(true);
        } else if (reason) {
            setIsError(true);
        } else {
            setIsError(false);
        }
    };

    useEffect(() => {
        if (value) {
            if (mode === 'time') {
                null;
            } else {
                setDate(value ? dayjs(value as string) : null);
            }
        }
    }, [value]);

    return (
        <>
            <LocalizationProvider localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs}>
                {mode === 'date' ? (
                    <DatePicker sx={{ marginTop: '8px', marginBottom: '4px' }} value={date} onChange={handleDateChange} onError={handleDateError} slotProps={{ textField: { required: required, placeholder: 'JJ/MM/AAAA', className: isError ? 'border border-danger border-1 rounded' : '' } }} openTo={openTo} views={['day', 'month', 'year']} format="DD/MM/YYYY" disabled={disabled} />
                ) : mode === 'datetime' ? (
                    <DateTimePicker
                        views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                        ampm={false}
                        format="DD/MM/YYYY HH:mm:ss"
                        displayWeekNumber
                        className="mt-1"
                        slotProps={{
                            textField: {
                                sx: {
                                    '&& .MuiPickersSectionList-root': {
                                        padding: '10px 0!important',
                                    },
                                },
                                required: required,
                                className: isError ? 'border border-danger border-2 rounded' : '',
                                error: isError,
                            },
                        }}
                        value={date}
                        onChange={handleDateChange}
                        onError={handleDateError}
                        disabled={disabled}
                    />
                ) : (
                    <TimePicker
                        slotProps={{ textField: { slotProps: { input: { required } }, required, placeholder: 'JJ/MM/AAAA hh:mm', className: isError ? 'border border-danger border-2 rounded' : '' } }}
                        ampm={false} // 12h or 24h format
                        sx={{ marginTop: '8px', marginBottom: '4px' }}
                        value={date}
                        onChange={handleDateChange}
                        onError={handleDateError}
                        disabled={disabled}
                    />
                )}
                <input type="hidden" id={id as string} name={id as string} value={date ? (mode === 'time' ? date.format('HH:mm') : date.format()) : ''} onChange={onChange} />
            </LocalizationProvider>
        </>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputDateField extends InputBaseType {
    format?: string;
    views?: DateView[];
    openTo?: DateView;
    mode?: 'date' | 'datetime' | 'time';
}
// #endregion IPROPS --> //////////////////////////////////
