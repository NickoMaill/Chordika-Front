// #region IMPORTS -> /////////////////////////////////////
import { MuiColorInput } from 'mui-color-input';
import { useState } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputColorField({ disabled, value = '', error, onChange, id, required }: IInputColorField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [color, setColor] = useState<string>(value as string);
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
            <MuiColorInput disabled={disabled} required={required} value={color} sx={{ marginTop: '8px', marginBottom: '4px', backgroundColor: disabled ? '#e8e5e5' : 'transparent', borderRadius: 1 }} onChange={(v) => setColor(v)} error={error} format="hex" /*required={required}*/ />
            <input id={id} name={id} disabled={disabled} type="hidden" value={color} onChange={onChange} />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputColorField extends InputBaseType {}
// #endregion IPROPS --> //////////////////////////////////
