import { ChangeEvent, useEffect, useState } from 'react';
import AppGridContainer from '~/components/common/AppGridContainer';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputSwitchField({ disabled, id, switchValue, value = '', onChange, isLoading }: IInputSwitchField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [v, setV] = useState<string>(String(value ?? ''));
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
        if (onChange) {
            onChange(checked);
        }
        if (checked) {
            setV(String(switchValue));
        } else {
            setV('');
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setV(String(value));
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <AppGridContainer>
                <Grid size={1}>
                    <Switch sx={{ marginTop: '8px' }} id={id} name={id} disabled={disabled || isLoading} onChange={handleOnChange} checked={v === String(switchValue)} value={switchValue as string | number} />
                </Grid>
                {isLoading && (
                    <Grid className="d-flex justify-content-end w-25" size={2}>
                        <CircularProgress size={25} />
                    </Grid>
                )}
            </AppGridContainer>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputSwitchField extends InputBaseType {
    switchValue: unknown;
}
// #endregion IPROPS --> //////////////////////////////////
