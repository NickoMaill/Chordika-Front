// #region IMPORTS -> /////////////////////////////////////
import { DatePicker, DateView, LocalizationProvider, pickersInputBaseClasses } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import AppGridContainer from '~/components/common/AppGridContainer';
import { frFR } from '@mui/x-date-pickers/locales';
import { JSX } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DATE_PICKER_LOCALE } from './datePickerLocale';
// #endregion IMPORTS -> //////////////////////////////////

const opt = [
    { label: 'Égal à (=)', value: '' },
    { label: 'Supérieur à (>)', value: '|' },
    { label: 'Inférieur à (<)', value: '$' },
    { label: 'Du ... au ...', value: 'd' },
];

const presets = [
    { label: "Aujourd'hui", value: 'now' },
    { label: '7 derniers jours', value: 'last7' },
    { label: 'Ce mois-ci', value: 'month' },
    { label: 'Le mois dernier', value: 'lastMonth' },
    { label: 'Cette année', value: 'year' },
    { label: "L'année dernière", value: 'lastYear' },
];

const styles: SxProps<Theme> = { marginTop: '8px', width: '100%' };

export default function RangeDateField({ id, required, value = '', openTo = 'day', onChange }: IRangeDateField): JSX.Element {
    const [date1, setDate1] = useState<Dayjs | null>(value && (value as string).split(',').length > 0 ? dayjs((value as string).replace(/^[|$d]/, '').split(',')[0]) : null);
    const [date2, setDate2] = useState<Dayjs | null>(value && (value as string).split(',').length > 1 ? dayjs((value as string).replace(/^[|$d]/, '').split(',')[1]) : null);
    const [rangeType, setRangeType] = useState<string>((value as string)?.match(/^[|$d]/)?.[0] ?? '');

    const theme = useTheme();
    const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

    const handleRangeChange = (nextValue: string): void => {
        if (opt.findIndex((o) => o.value === nextValue) > -1) {
            setRangeType(nextValue);
            if (nextValue === '') {
                setDate2(null);
            }
        } else if (nextValue === 'del') {
            setDate1(null);
            setDate2(null);
            setRangeType('');
        } else {
            setPreset(nextValue);
        }
    };

    const handleDateChange = (nextDate: Dayjs | null, last: boolean): void => {
        if (last) {
            if (rangeType === 'd') {
                setDate2(nextDate);
            }
        } else {
            setDate1(nextDate);
        }
    };

    const setPreset = (preset: string): void => {
        switch (preset) {
            case 'now':
                setDate1(dayjs());
                setDate2(null);
                setRangeType('');
                break;
            case 'last7':
                setDate1(dayjs().subtract(7, 'day'));
                setDate2(dayjs());
                setRangeType('d');
                break;
            case 'month':
                setDate1(dayjs().startOf('month'));
                setDate2(dayjs().endOf('month'));
                setRangeType('d');
                break;
            case 'lastMonth':
                setDate1(dayjs().subtract(1, 'month').startOf('month'));
                setDate2(dayjs().subtract(1, 'month').endOf('month'));
                setRangeType('d');
                break;
            case 'year':
                setDate1(dayjs().startOf('year'));
                setDate2(dayjs().endOf('year'));
                setRangeType('d');
                break;
            case 'lastYear':
                setDate1(dayjs().subtract(1, 'year').startOf('year'));
                setDate2(dayjs().subtract(1, 'year').endOf('year'));
                setRangeType('d');
                break;
        }
    };

    const renderValue = (current: string): JSX.Element => {
        switch (current) {
            case 'd':
                return <b className="text-center">Du</b>;
            case '|':
                return <b className="text-center">{'>'}</b>;
            case '$':
                return <b className="text-center">{'<'}</b>;
            default:
                return <b className="text-center">=</b>;
        }
    };

    const buildValue = (): string => {
        const range = [date1, date2].filter((d): d is Dayjs => Boolean(d));
        return rangeType + range.map((d) => d.format('YYYY-MM-DD')).join(',');
    };

    useEffect(() => {
        if (rangeType !== 'd') {
            setDate2(null);
        }
    }, [rangeType]);

    useEffect(() => {
        if (!value || value === '') {
            setDate1(null);
            setDate2(null);
            setRangeType('');
            return;
        }

        const rawValue = value as string;
        const nextRangeType = rawValue.match(/^[|$d]/)?.[0] ?? '';
        const dates = rawValue.replace(/^[|$d]/, '').split(',');
        setRangeType(nextRangeType);
        setDate1(dates[0] ? dayjs(dates[0]) : null);
        setDate2(dates[1] ? dayjs(dates[1]) : null);
    }, [value]);

    useEffect(() => {
        if (onChange) {
            onChange(buildValue());
        }
    }, [date1, date2, rangeType]);

    return (
        <LocalizationProvider localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs} adapterLocale={DATE_PICKER_LOCALE}>
            <>
                <AppGridContainer spacing={0}>
                    <Grid size={{ xs: 12, sm: 12, md: rangeType === 'd' ? 6 : 12 }} className="ps-0">
                        <DatePicker
                            sx={{ ...styles }}
                            value={date1}
                            onChange={(nextDate) => handleDateChange(nextDate, false)}
                            slotProps={{
                                textField: {
                                    required,
                                    className: 'w-100',
                                    sx: {
                                        margin: 0,
                                        [`& .MuiPickersInputBase-root`]: {
                                            padding: '0px 14px 0px 0px',
                                        },
                                        [`& .${pickersInputBaseClasses.root} .${pickersInputBaseClasses.root.replace('root', 'sectionsContainer')}`]: {
                                            padding: '0px 9px 0px 9px',
                                        },
                                    },
                                    startAdornment: (
                                        <Select
                                            renderValue={renderValue}
                                            displayEmpty
                                            className="d-flex m-0 border-0 border-end"
                                            slotProps={{ input: { className: 'd-flex justify-content-center' } }}
                                            value={rangeType}
                                            onChange={(e) => handleRangeChange(e.target.value)}
                                            sx={{ borderEndEndRadius: 0, borderTopRightRadius: 0 }}
                                        >
                                            {opt.map((o, i) => (
                                                <MenuItem key={i} value={o.value}>
                                                    {o.label}
                                                </MenuItem>
                                            ))}
                                            <Divider sx={{ marginBlock: 1 }} />
                                            {presets.map((p, i) => (
                                                <MenuItem key={i} value={p.value}>
                                                    {p.label}
                                                </MenuItem>
                                            ))}
                                            <Divider sx={{ marginBlock: 1 }} />
                                            <MenuItem value="del">Effacer</MenuItem>
                                        </Select>
                                    ),
                                    InputProps: {
                                        sx: {
                                            borderStartEndRadius: rangeType?.includes('d') && isOverMdViewport ? 0 : null,
                                            borderEndEndRadius: rangeType?.includes('d') && isOverMdViewport ? 0 : null,
                                        },
                                    },
                                },
                            }}
                            openTo={openTo}
                            views={['day', 'month', 'year']}
                            format="DD/MM/YYYY"
                        />
                    </Grid>
                    {rangeType?.includes('d') && (
                        <Grid size={{ xs: 12, sm: 12, md: 6 }} className="ps-0">
                            <DatePicker
                                sx={styles}
                                onChange={(nextDate) => handleDateChange(nextDate, true)}
                                value={date2}
                                slotProps={{
                                    textField: {
                                        required,
                                        placeholder: 'JJ/MM/AAAA',
                                        className: 'w-100',
                                        sx: {
                                            [`& .${pickersInputBaseClasses.root} .${pickersInputBaseClasses.root.replace('root', 'sectionsContainer')}`]: {
                                                padding: '10px 0px',
                                            },
                                        },
                                        InputProps: {
                                            startAdornment: <b className="pe-2">Au</b>,
                                            sx: {
                                                borderStartStartRadius: rangeType?.includes('d') && isOverMdViewport ? 0 : null,
                                                borderEndStartRadius: rangeType?.includes('d') && isOverMdViewport ? 0 : null,
                                            },
                                        },
                                    },
                                }}
                                openTo={openTo}
                                views={['day', 'month', 'year']}
                                format="DD/MM/YYYY"
                            />
                        </Grid>
                    )}
                </AppGridContainer>
                <input type="hidden" id={id} name={id} value={buildValue()} readOnly />
            </>
        </LocalizationProvider>
    );
}

interface IRangeDateField extends InputBaseType {
    format?: string;
    views?: DateView[];
    openTo?: DateView;
    onChange?: (value: string) => void;
}
