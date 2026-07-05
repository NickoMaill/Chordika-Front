import { ChangeEvent, lazy, useContext, useEffect, useState, JSX } from 'react';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import cronstrue from 'cronstrue/i18n';
import { Regular } from '~/components/common/Text';
import SessionContext from '~/context/sessionContext';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputCronField({ style, disabled, required, error, id, icon, value = '', placeholder }: IInputCronField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [monitor, setMonitor] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [val, setVal] = useState<string>((value as string) ?? '');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Ses = useContext(SessionContext);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setVal(e.target.value);
        checkCron(e.target.value);
    };

    const checkCron = (v: string): void => {
        try {
            const str = cronstrue.toString(v, { locale: Ses.lang });
            setIsSuccess(true);
            setIsError(false);
            setMonitor(str);
        } catch {
            setMonitor('');
            setIsError(true);
            setIsSuccess(false);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        checkCron((value as string) ?? '');
        setVal((value as string) ?? '');
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
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
                sx={{ backgroundColor: disabled ? '#e8e5e5' : 'transparent' }}
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
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputCronField extends InputBaseType {}
// #enderegion IPROPS --> //////////////////////////////////
