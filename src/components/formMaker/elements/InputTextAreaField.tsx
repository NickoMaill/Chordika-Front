import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { ChangeEvent, lazy, useEffect, useState, JSX } from 'react';
import { Regular } from '~/components/common/Text';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputTextAreaField({ disabled, id, onChange, value = '', error, rows = 10, limit, isLoading, icon, success, warning }: IInputTextAreaField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isOutOfLimit, setIsOutOfLimit] = useState<boolean>(false);
    const [textLength, setTextLength] = useState<number>(0);
    const [currentVal, setCurrentVal] = useState<string>((value as string) ?? '');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setTextLength(e.target.value.length);
        if (e.target.value.length > limit) {
            setIsOutOfLimit(true);
            error = true;
        } else {
            setCurrentVal(e.target.value);
            setIsOutOfLimit(false);
            error = false;
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setCurrentVal((value as string) ?? '');
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <TextField
                disabled={disabled}
                id={id}
                name={id}
                sx={{ marginTop: '8px', marginBottom: '4px' }}
                error={isOutOfLimit || error}
                color={success ? 'success' : warning ? 'warning' : null}
                type="text"
                value={currentVal}
                onChange={(e) => {
                    handleChange(e);
                    if (onChange) {
                        onChange(e);
                    }
                }}
                inputMode="text"
                multiline
                fullWidth
                rows={rows}
                variant="outlined"
                slotProps={{
                    input: {
                        sx: { backgroundColor: disabled ? '#e8e5e5' : null },
                        startAdornment: icon && (
                            <InputAdornment position="start">
                                <AppIcon name={icon} />
                            </InputAdornment>
                        ),
                        endAdornment: isLoading && (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress size={25} />
                            </Box>
                        ),
                    },
                }}
            />
            {limit && (
                <Regular color={isOutOfLimit ? 'red' : 'grey'}>
                    {textLength} / {limit}
                </Regular>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputTextAreaField extends InputBaseType {
    rows?: number;
    limit?: number;
}
// #endregion IPROPS --> //////////////////////////////////
