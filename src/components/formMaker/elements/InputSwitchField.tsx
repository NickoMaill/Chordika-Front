import { ChangeEvent, useEffect, useState } from 'react';
import AppGridContainer from '~/components/common/AppGridContainer';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';

export default function InputSwitchField({ disabled, id, switchValue, value = '', onChange, isLoading }: IInputSwitchField): JSX.Element {
    const [v, setV] = useState<string>(String(value ?? ''));

    const handleOnChange = (_e: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
        const nextValue = checked ? String(switchValue) : '';
        if (onChange) {
            onChange(nextValue);
        }
        setV(nextValue);
    };

    useEffect(() => {
        setV(String(value ?? ''));
    }, [value]);

    return (
        <>
            <AppGridContainer>
                <Grid size={1}>
                    <Switch
                        sx={{ marginTop: '8px' }}
                        id={id}
                        name={id}
                        disabled={disabled || isLoading}
                        onChange={handleOnChange}
                        checked={v === String(switchValue)}
                        value={switchValue as string | number}
                    />
                </Grid>
                {isLoading && (
                    <Grid className="d-flex justify-content-end w-25" size={2}>
                        <CircularProgress size={25} />
                    </Grid>
                )}
            </AppGridContainer>
            {/* <input type="hidden" id={id} name={id} value={v} readOnly /> */}
        </>
    );
}

interface IInputSwitchField extends InputBaseType {
    switchValue: unknown;
}
