// #region IMPORTS -> /////////////////////////////////////
import { MuiTelInput } from 'mui-tel-input';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { useEffect, useState } from 'react';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

export default function InputTelephoneField({ disabled, required, onChange, error, id, value = '' }: IInputTelephoneField): JSX.Element {
    const [tel, setTel] = useState<string>((value as string) || '');

    const handleChange = (nextValue: string): void => {
        setTel(nextValue);
        if (onChange) {
            onChange(nextValue);
        }
    };

    useEffect(() => {
        setTel((value as string) ?? '');
    }, [value]);

    return (
        <>
            <MuiTelInput
                FlagIconButtonProps={{ sx: { paddingLeft: 0, paddingRight: 0 } }}
                slotProps={{ input: { required, disabled, sx: { marginTop: '0!important' } } }}
                disabled={disabled}
                value={tel}
                onChange={handleChange}
                error={error}
                className="input-tel-reset"
                required={required}
                sx={{ bgcolor: 'background.default', marginTop: '4px!important', borderRadius: '8px' }}
                defaultCountry="FR"
                aria-required={required}
                aria-disabled={disabled}
            />
            <input type="hidden" value={tel} id={id} name={id} readOnly />
        </>
    );
}

interface IInputTelephoneField extends InputBaseType {}
