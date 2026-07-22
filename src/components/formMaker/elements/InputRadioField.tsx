import { InputBaseType, RadioOptionsType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputRadioField({ disabled, id, onChange, value, options }: IInputRadioField): JSX.Element {
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
            <RadioGroup id={id} name={id} value={String(value) || String(options[0]?.value)} onChange={onChange}>
                {options.map((option, i) => {
                    return <FormControlLabel disabled={disabled} key={i} value={String(option.value)} control={<Radio disabled={disabled} />} label={option.label} />;
                })}
            </RadioGroup>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputRadioField extends InputBaseType {
    options: RadioOptionsType[];
}
// #endregion IPROPS --> //////////////////////////////////
