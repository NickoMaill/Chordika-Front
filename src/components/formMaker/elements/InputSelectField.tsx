import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { lazy, useEffect, useState, JSX } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));

export default function InputSelectField({
    disabled,
    id,
    value,
    onChange,
    required,
    error,
    options,
    icon,
    isLoading,
    success,
    warning,
    readOnly,
    isSearchForm,
    noValueLabel = 'aucun',
}: IInputSelectField): JSX.Element {
    const [currentVal, setCurrentVal] = useState<unknown>(value ?? '');

    const handleChange = (e: SelectChangeEvent): void => {
        setCurrentVal(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    useEffect(() => {
        if ((value ?? '') !== '') {
            setCurrentVal(value);
            return;
        }

        if (required && options.length > 0) {
            const nextValue = options[0].value;
            setCurrentVal(nextValue);
            // if (onChange) {
            //     onChange({ target: { value: nextValue } } as SelectChangeEvent);
            // }
            return;
        }

        setCurrentVal('');
    }, [value, isLoading]);

    return (
        <Select
            required={required}
            disabled={disabled}
            displayEmpty={!required}
            sx={{ marginTop: '3px' }}
            color={success ? 'success' : warning ? 'warning' : null}
            name={id}
            readOnly={readOnly}
            value={currentVal}
            onChange={handleChange}
            error={error}
            fullWidth
            slotProps={{
                root: { title: id },
                input: { id },
            }}
            startAdornment={
                isLoading ? (
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={25} />
                    </Box>
                ) : icon ? (
                    <InputAdornment position="start">
                        <AppIcon name={icon} />
                    </InputAdornment>
                ) : null
            }
        >
            {!required && options.length > 0 && options.findIndex((x) => x.value === '') ? <MenuItem value={''}>{noValueLabel}</MenuItem> : null}
            {options.map((option, i) => (
                <MenuItem disabled={disabled} key={i} value={isSearchForm ? `${option.value}¤${option.label}` : (option.value ?? '').toString()}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
}

interface IInputSelectField extends InputBaseType {
    options: { value: unknown; label: string }[];
    noValueLabel?: string;
}
