// #region IMPORTS -> /////////////////////////////////////
import { useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputOTPField({ disabled, required, onComplete, error, id }: IInputOTPField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [otp, setOtp] = useState('');
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
            <MuiOtpInput
                TextFieldsProps={{ placeholder: '0', required: required, disabled: disabled, error: error }}
                sx={{
                    '.MuiOutlinedInput-notchedOutline': { borderColor: error ? stylesResources.theme.palette.error.main : null },
                }}
                validateChar={(c) => !isNaN(c as unknown as number)}
                length={6}
                id={id}
                value={otp}
                onChange={(v) => setOtp(v)}
                onComplete={onComplete}
                aria-disabled={disabled}
                inputMode="numeric"
                autoFocus
            />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputOTPField extends InputBaseType {
    onComplete: (v: string) => void;
}
// #endregion IPROPS --> //////////////////////////////////
