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
// #endregion IMPORTS -> //////////////////////////////////
// pattern => date1,date2$opt
// #region SINGLETON --> ////////////////////////////////////
const opt = [
    { label: 'Égale à (=)', value: '' },
    { label: 'supérieur à (>)', value: '|' },
    { label: 'inférieur à (<)', value: '$' },
    { label: 'Du xxx Au xxx', value: 'd' },
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
// #endregion SINGLETON --> /////////////////////////////////

export default function RangeDateField({ id, required, value = '', openTo = 'day', onChange }: IRangeDateField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [date1, setDate1] = useState<Dayjs | null>(value && (value as string).split(',').length > 0 ? dayjs((value as string).split(',')[0]) : null);
    const [date2, setDate2] = useState<Dayjs | null>(value && (value as string).split(',').length > 1 ? dayjs((value as string).split(',')[1]) : null);
    const [rangeType, setRangeType] = useState<string>('');

    const theme = useTheme();
    const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));
    // #endregion STATE --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (v: string): void => {
        if (opt.findIndex((o) => o.value === v) > -1) {
            setRangeType(v);
            if (v === '') {
                setDate2(null);
            }
        } else {
            if (v === 'del') {
                setDate1(null);
                setDate2(null);
            } else {
                setPreset(v);
            }
        }
    };
    const handleDateChange = (e: Dayjs | null, last: boolean): void => {
        if (last) {
            if (rangeType === 'd') {
                setDate2(e);
            }
        } else {
            setDate1(e);
        }
    };
    const setPreset = (p: string): void => {
        switch (p) {
            case 'now':
                setDate1(dayjs());
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
    const renderValue = (v: string): JSX.Element => {
        switch (v) {
            case 'd': {
                return <b className="text-center">Du</b>;
            }
            case '|': {
                return <b className="text-center">{'>'}</b>;
            }
            case '$': {
                return <b className="text-center">{'<'}</b>;
            }
            default: {
                return <b className="text-center">=</b>;
            }
        }
    };
    const buildValue = (): string => {
        const range = [date1, date2].filter((d) => d);
        const v = rangeType + range.map((d) => d.format('YYYY-MM-DD')).join(',');
        if (onChange) {
            onChange(v);
        }
        return v;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (rangeType !== 'd') {
            setDate2(null);
        }
    }, [rangeType]);

    useEffect(() => {
        if (value && value !== '') {
            // setRangeType(/^[0-9]/.test(value as string) ? '' : (value as string).charAt(0));
            // setDates(
            //     (value as string)
            //         .replace('|', '')
            //         .replace('$', '')
            //         .replace('d', '')
            //         .split(',')
            //         .map((s) => (s ? new DateTime(s) : null))
            //         .filter((d): d is DateTime => d !== null)
            // );
        }
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <LocalizationProvider localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs}>
            <>
                <AppGridContainer spacing={0}>
                    <Grid size={{ xs: 12, sm: 12, md: rangeType === 'd' ? 6 : 12 }} className="ps-0">
                        <DatePicker
                            sx={{ ...styles }}
                            value={date1}
                            onChange={(e) => handleDateChange(e, false)}
                            slotProps={{
                                textField: {
                                    required,
                                    // placeholder: 'JJ/MM/AAAA',
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
                                        <Select renderValue={renderValue} displayEmpty className="d-flex m-0 border-0 border-end" slotProps={{ input: { className: 'd-flex justify-content-center' } }} value={rangeType} onChange={(e) => handleChange(e.target.value)} sx={{ borderEndEndRadius: 0, borderTopRightRadius: 0 }}>
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
                                            <MenuItem value={'del'}>Effacer</MenuItem>
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
                                onChange={(e) => handleDateChange(e, true)}
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
                <input type="hidden" id={id} name={id} value={buildValue()} />
            </>
        </LocalizationProvider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IRangeDateField extends InputBaseType {
    format?: string;
    views?: DateView[];
    openTo?: DateView;
    onChange?: (value: string) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
