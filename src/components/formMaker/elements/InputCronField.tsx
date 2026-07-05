import { ChangeEvent, lazy, useEffect, useState, JSX } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import cronstrue from 'cronstrue/i18n';
import { Regular } from '~/components/common/Text';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import useSessionContext from '~/context/sessionContext';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

export default function InputCronField({ style, disabled, required, error, id, icon, value = '', placeholder, onChange }: IInputCronField): JSX.Element {
    const [monitor, setMonitor] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [val, setVal] = useState<string>((value as string) ?? '');

    const { lang } = useSessionContext();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setVal(e.target.value);
        checkCron(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    const checkCron = (v: string): void => {
        try {
            const str = cronstrue.toString(v, { locale: lang });
            setIsSuccess(true);
            setIsError(false);
            setMonitor(str);
        } catch {
            setMonitor('');
            setIsError(true);
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        checkCron((value as string) ?? '');
        setVal((value as string) ?? '');
    }, [value]);

    return (
        <Box className="position-relative">
            <OutlinedInput
                disabled={disabled}
                type="text"
                inputMode="text"
                placeholder={placeholder}
                name={id}
                id={id}
                className={isError ? 'text-field-danger' : isSuccess ? 'text-field-success' : null}
                required={required}
                margin="dense"
                fullWidth
                onChange={handleChange}
                error={error}
                value={val}
                style={style}
                startAdornment={
                    icon && (
                        <InputAdornment position="start">
                            <AppIcon name={icon} />
                        </InputAdornment>
                    )
                }
                endAdornment={
                    isError ? (
                        <Box sx={{ display: 'flex' }}>
                            <AppIcon name="Error" color="error" />
                        </Box>
                    ) : isSuccess ? (
                        <AppIcon name="CheckCircle" color="success" />
                    ) : null
                }
                slotProps={{
                    input: {
                        placeholder: placeholder,
                    },
                }}
            />
            <Regular sx={{ textAlign: { xs: 'right', lg: 'left' } }} className="position-absolute w-100">
                {monitor}
            </Regular>
        </Box>
    );
}

interface IInputCronField extends InputBaseType {}
