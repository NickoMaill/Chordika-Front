import Grid from '@mui/material/Grid';
import { ReactNode } from 'react';
import ToolTips from '~/components/common/AppTooltips';
import { Regular } from '~/components/common/Text';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputBase({ className, disabled, children, label, helpText, error, size = 3, id, required, showLabel = true, sx, errorMessage, success, warning }: IInputBase): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // const ChildWrapper = ({ child }) => {
    //     return cloneElement(child, { id, name: id });
    // };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Grid size={{ lg: size, md: size, xs: 12 }} sx={{ ...sx }} className={`divForm_${id as string} ${className}`}>
            <FormControl variant="outlined" disabled={disabled} margin="dense" fullWidth error={error} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {showLabel && (
                    <FormLabel required={required && label ? true : false} sx={{ display: 'flex', fontWeight: 'bold', '.MuiFormLabel-asterisk': { color: stylesResources.theme.palette.error.main } }} error={error} htmlFor={id as string} style={{ color: warning ? '#FEA726' : success ? '#43a047' : null }}>
                        {label}
                        {helpText && <ToolTips textContent={helpText} />}
                    </FormLabel>
                )}
                {children}
                {error && errorMessage ? (
                    <Regular component="span" color="red">
                        {errorMessage}
                    </Regular>
                ) : null}
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
