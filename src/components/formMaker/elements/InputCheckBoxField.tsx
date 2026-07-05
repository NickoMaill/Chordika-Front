import { InputBaseType, CheckboxOptionType } from '~/types/FormMakerCoreTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import { JSX } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputCheckBoxField({ disabled, options, id, onChange, value = '', rowReverse }: IInputCheckBoxField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////``
    const [checkboxes, setCheckboxes] = useState<string>(value as string);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let newArr = checkboxes.trim().split(',');
        newArr = newArr.filter((x) => x !== '');

        if (e.target.checked) {
            if (!newArr.includes(e.target.value)) {
                newArr.push(e.target.value);
            }
        } else {
            if (newArr.includes(e.target.value)) {
                newArr = newArr.filter((x) => x !== e.target.value);
            }
        }
        const nextValue = newArr.join(',');
        setCheckboxes(nextValue);
        if (onChange) {
            onChange(nextValue);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setCheckboxes((value as string) ?? '');
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <FormGroup sx={{ flexGrow: 1 }} onChange={handleChange}>
                <Grid container wrap="wrap" flexWrap="wrap" spacing={2}>
                    {options.map((item, i) => {
                        return (
                            <Grid key={i} size={{ lg: 5, md: 5, xs: 12 }}>
                                <FormControlLabel
                                    key={i}
                                    sx={{ flexDirection: rowReverse ? 'row-reverse' : 'row' }}
                                    label={item.label}
                                    control={<Checkbox disabled={disabled} value={item.value} checked={checkboxes.includes(item.value as string)} onChange={(e) => e} />}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <input type="hidden" id={id} name={id} value={checkboxes} readOnly />
            </FormGroup>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputCheckBoxField extends InputBaseType {
    options: CheckboxOptionType[];
    rowReverse?: boolean;
}
// #endregion IPROPS --> //////////////////////////////////
