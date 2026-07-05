import { GroupedSelectOptionType, InputBaseType } from '~/types/FormMakerCoreTypes';
import { useEffect, useState, JSX, lazy } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputGroupedSelectField({ disabled, id, value, onChange, required, error, groups, icon, isLoading, success, warning, readOnly, isSearchForm }: IInputSelectField): JSX.Element {
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
            if (required && groups.length > 0) {
                setCurrentVal(groups[0].options[0].value);
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
                sx={{ marginTop: '3px', backgroundColor: disabled ? '#e8e5e5' : 'transparent' }}
                color={success ? 'success' : warning ? 'warning' : null}
                id={id}
                name={id}
                value={currentVal}
                onChange={handleChange}
                readOnly={readOnly}
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
                {!required && groups.length > 0 ? <MenuItem value={''}>aucun</MenuItem> : null}
                {groups.map((group, i) => [
                    <ListSubheader key={`header-${i}`}>{group.label}</ListSubheader>,
                    ...group.options.map((opt) => (
                        <MenuItem key={opt.value as string} value={isSearchForm ? `${opt.value}¤${opt.label}` : (opt.value ?? '').toString()}>
                            {opt.label}
                        </MenuItem>
                    )),
                ])}
            </Select>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputSelectField extends InputBaseType {
    groups: GroupedSelectOptionType[];
}
// #endregion IPROPS --> //////////////////////////////////
