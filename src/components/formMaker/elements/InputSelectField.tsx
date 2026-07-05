import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { lazy, useEffect, useState, JSX } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputSelectField({ disabled, id, value, onChange, required, error, options, icon, isLoading, success, warning, readOnly, isSearchForm }: IInputSelectField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [currentVal, setCurrentVal] = useState<unknown>(value ?? '');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: SelectChangeEvent): void => {
        setCurrentVal(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if ((value ?? '') !== '') {
            setCurrentVal(value);
        } else {
            if (required && options.length > 0) {
                setCurrentVal(options[0].value);
            } else {
                setCurrentVal('');
            }
        }
    }, [value, isLoading]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <Select
                required={required}
                disabled={disabled}
                displayEmpty={!required}
                sx={{ marginTop: '3px' /*backgroundColor: disabled ? '#e8e5e5' : 'transparent'*/ }}
                color={success ? 'success' : warning ? 'warning' : null}
                id={id}
                name={id}
                readOnly={readOnly}
                value={currentVal}
                onChange={handleChange}
                error={error}
                fullWidth
                slotProps={{
                    root: { title: id },
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
                {!required && options.length > 0 && options.findIndex((x) => x.value === '') ? <MenuItem value={''}>{isSearchForm ? 'indifférent' : 'aucun'}</MenuItem> : null}
                {options.map((option, i) => (
                    <MenuItem disabled={disabled} key={i} value={isSearchForm ? `${option.value}¤${option.label}` : (option.value ?? '').toString()}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputSelectField extends InputBaseType {
    options: { value: unknown; label: string }[];
}
// #endregion IPROPS --> //////////////////////////////////
