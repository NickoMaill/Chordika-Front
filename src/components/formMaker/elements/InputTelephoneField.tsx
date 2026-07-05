// #region IMPORTS -> /////////////////////////////////////
import { MuiTelInput } from 'mui-tel-input';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { useEffect, useState } from 'react';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputTelephoneField({ disabled, required, onChange, error, id, value = '' }: IInputTelephoneField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [tel, setTel] = useState<string>((value as string) || '');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (v: string): void => {
        setTel(v);
    };
    // #endregion METHODS --> //////////////////////////////////
    // #region USEEFFECT --> ///////////////////////////////////

    // #endregion USEEFFECT --> ////////////////////////////////
    useEffect(() => {
        setTel((value as string) ?? '');
    }, [value]);
    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <MuiTelInput
                FlagIconButtonProps={{ sx: { backgroundColor: 'transparent!important', border: 'none!important', paddingLeft: 0, paddingRight: 0 } }}
                slotProps={{ input: { required, disabled, className: 'bg-none' } }}
                disabled={disabled}
                value={tel}
                onChange={handleChange}
                error={error}
                className="input-tel-reset"
                required={required}
                sx={{ marginTop: '3px', backgroundColor: disabled ? '#e8e5e5' : 'transparent', borderRadius: 1 }}
                defaultCountry="FR"
                aria-required={required}
                aria-disabled={disabled}
            />
            <input type="hidden" value={tel} onChange={onChange} id={id} name={id} />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputTelephoneField extends InputBaseType {}
// #endregion IPROPS --> //////////////////////////////////
