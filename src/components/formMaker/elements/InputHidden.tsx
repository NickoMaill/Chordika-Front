// #region IMPORTS -> /////////////////////////////////////
import { useEffect, useState } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import Input from '@mui/material/Input';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputHidden({ onChange, id, value }: IInputHidden): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [currentVal, setCurrentVal] = useState<unknown>(value);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (value) {
            setCurrentVal(value);
        }
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        //<input type="hidden" id={id} name={id} onChange={onChange} defaultValue={value as string | number} />
        <Input type="hidden" id={id} name={id} onChange={onChange} value={currentVal ?? ''} />
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputHidden extends InputBaseType {}
// #enderegion IPROPS --> //////////////////////////////////
