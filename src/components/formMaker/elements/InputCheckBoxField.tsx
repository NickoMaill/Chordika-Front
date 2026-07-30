import { InputBaseType, CheckboxOptionType, FormMakerFocusErrorType } from '~/types/FormMakerCoreTypes';
import { ChangeEvent, useEffect, useState } from 'react';
import { JSX } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import { SxProps, Theme } from '@mui/material';
import stylesResources from '~/resources/stylesResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const errorStyle: SxProps<Theme> = {
    borderColor: stylesResources.theme.palette.error.main,
    borderWidth: '2px',
};
// #endregion SINGLETON --> /////////////////////////////////

export default function InputCheckBoxField({ disabled, options, id, onChange, value = '', rowReverse, spacing, checkboxError }: IInputCheckBoxField): JSX.Element {
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
                <Grid container wrap="wrap" className="flex-wrap" spacing={spacing ?? 2}>
                    {options.map((item, i) => {
                        let err = null;
                        if (checkboxError && item.value === checkboxError.name) {
                            err = checkboxError;
                        }
                        return (
                            <Grid key={i} size={{ lg: item.size ?? 5, md: item.size ?? 5, xs: 12 }}>
                                <FormControlLabel
                                    key={i}
                                    sx={{ flexDirection: rowReverse ? 'row-reverse' : 'row' }}
                                    label={item.label}
                                    control={<Checkbox disabled={disabled} sx={err ? errorStyle : null} value={item.value} checked={checkboxes.includes(item.value as string)} onChange={(e) => e} />}
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
    spacing?: number;
    options: CheckboxOptionType[];
    rowReverse?: boolean;
    checkboxError?: FormMakerFocusErrorType;
}
// #endregion IPROPS --> //////////////////////////////////
