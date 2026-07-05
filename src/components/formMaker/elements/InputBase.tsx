import Grid from '@mui/material/Grid';
import { FocusEvent, ReactNode, useRef, useState } from 'react';
import ToolTips from '~/components/common/AppTooltips';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormHelperText } from '@mui/material';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputBase({ className, disabled, children, label, helpText, error, size = { lg: 3, md: 3, xs: 12 }, id, required, showLabel = true, sx, errorMessage, success, warning, showErrorContainer = true }: IInputBase): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [focused, setFocused] = useState(false);
    const elRef = useRef<HTMLDivElement>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleFocus = (): void => setFocused(true);

    const handleBlur = (e: FocusEvent<HTMLElement>): void => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setFocused(false);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // useEffect(() => {
    //     if (error && elRef.current) {
    //         elRef.current.scrollIntoView();
    //     }
    // }, [error])
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Grid size={typeof size === "number" ? { lg: size, md: size, xs: 12 } : size} sx={{ ...sx }} ref={elRef} className={`divForm_${id as string} ${className}`} onFocus={handleFocus} onBlur={handleBlur}>
            <FormControl variant="outlined" disabled={disabled} margin="none" fullWidth error={error} focused={focused} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {showLabel && (
                    <FormLabel
                        required={required && !!label}
                        sx={{ display: 'flex', fontWeight: 'bold', '.MuiFormLabel-asterisk': { color: stylesResources.theme.palette.error.main } }}
                        error={error}
                        htmlFor={id as string}
                        style={{ color: warning ? '#FEA726' : success ? '#43a047' : null }}
                    >
                        {label}
                        {helpText && <ToolTips textContent={helpText} />}
                    </FormLabel>
                )}
                {children}
                {showErrorContainer && (
                    <FormHelperText error={error} sx={{ minHeight: 20 }}>
                        {errorMessage || ''}
                    </FormHelperText>
                )}
            </FormControl>
        </Grid>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputBase extends InputBaseType {
    children: ReactNode;
}
// #endregion IPROPS --> //////////////////////////////////
