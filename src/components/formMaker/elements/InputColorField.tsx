// #region IMPORTS -> /////////////////////////////////////
import { MuiColorInput } from 'mui-color-input';
import { useEffect, useState } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputColorField({ disabled, value = '', error, onChange, id, required }: IInputColorField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [color, setColor] = useState<string>((value as string) ?? '');
    // #endregion STATE --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (nextValue: string): void => {
        setColor(nextValue);
        if (onChange) {
            onChange(nextValue);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setColor((value as string) ?? '');
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <MuiColorInput disabled={disabled} required={required} value={color} sx={{ marginTop: '8px', marginBottom: '4px', borderRadius: 1 }} onChange={handleChange} error={error} format="hex" />
            <input id={id} name={id} disabled={disabled} type="hidden" value={color} readOnly />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputColorField extends InputBaseType {}
// #endregion IPROPS --> //////////////////////////////////
