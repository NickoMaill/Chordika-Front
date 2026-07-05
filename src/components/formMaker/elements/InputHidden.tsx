// #region IMPORTS -> /////////////////////////////////////
import { useEffect, useState } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import Input from '@mui/material/Input';
// #endregion IMPORTS -> //////////////////////////////////

export default function InputHidden({ id, value }: IInputHidden): JSX.Element {
    const [currentVal, setCurrentVal] = useState<unknown>(value ?? '');

    useEffect(() => {
        setCurrentVal(value ?? '');
    }, [value]);

    return <Input type="hidden" id={id} name={id} value={currentVal ?? ''} readOnly />;
}

interface IInputHidden extends InputBaseType {}
