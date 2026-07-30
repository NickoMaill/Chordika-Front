// #region IMPORTS -> /////////////////////////////////////
import { ChangeEvent, CSSProperties, useEffect, useState } from 'react';
import { AutoCapitalizeType, AutoCompleteType, InputBaseType, InputModeType, InputType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import TextField from '@mui/material/TextField';
// #endregion IMPORTS -> //////////////////////////////////

export default function RangeInput({ style, inputStyle, disabled, required, onChange, error, id, value, success, warning, placeholder }: IRangeInput): JSX.Element {
    const [currentVal, setCurrentVal] = useState<unknown>(value ?? '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCurrentVal(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    useEffect(() => {
        setCurrentVal(value ?? '');
    }, [value]);

    return (
        <TextField
            disabled={disabled}
            variant="outlined"
            type="number"
            placeholder={placeholder}
            value={currentVal ?? ''}
            name={id}
            id={id}
            className={success ? 'text-field-success' : warning ? 'text-field-warning' : null}
            required={required}
            margin="dense"
            fullWidth
            onChange={handleChange}
            error={error}
            slotProps={{
                input: {
                    style: style,
                    inputProps: { style: inputStyle },
                    startAdornment: (
                        <select>
                            <option>=</option>
                            <option>{'>'}</option>
                            <option>{'<'}</option>
                        </select>
                    ),
                },
            }}
        />
    );
}

interface IRangeInput extends InputBaseType {
    type?: InputType;
    mode?: InputModeType;
    autoComplete?: AutoCompleteType;
    autoCapitalize?: AutoCapitalizeType;
    inputStyle?: CSSProperties;
}
