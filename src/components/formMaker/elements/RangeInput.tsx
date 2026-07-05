// #region IMPORTS -> /////////////////////////////////////
import { CSSProperties } from 'react';
import { AutoCapitalizeType, AutoCompleteType, InputBaseType, InputModeType, InputType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import TextField from '@mui/material/TextField';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function RangeInput({ style, inputStyle, disabled, required, onChange, error, id, value, success, warning, placeholder }: IRangeInput): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <TextField
                disabled={disabled}
                variant="outlined"
                type="number"
                placeholder={placeholder}
                defaultValue={value}
                name={id}
                id={id}
                className={success ? 'text-field-success' : warning ? 'text-field-warning' : null}
                required={required}
                margin="dense"
                fullWidth
                onChange={onChange}
                error={error}
                InputProps={{
                    style: style,
                    inputProps: { style: inputStyle },
                    startAdornment: (
                        <select>
                            <option>=</option>
                            <option>{'>'}</option>
                            <option>{'<'}</option>
                        </select>
                    ),
                    sx: { backgroundColor: disabled ? '#e8e5e5' : 'transparent' },
                }}
            />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IRangeInput extends InputBaseType {
    type?: InputType;
    mode?: InputModeType;
    autoComplete?: AutoCompleteType;
    autoCapitalize?: AutoCapitalizeType;
    inputStyle?: CSSProperties;
}
// #enderegion IPROPS --> //////////////////////////////////
