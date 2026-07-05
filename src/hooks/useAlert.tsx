import { AppError, ErrorTypeEnum } from '~/core/appError';
import AlertContext, { AlertProps } from '~/context/alertContext';
import { useContext } from 'react';
import { AlertColor } from '@mui/material/Alert';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useAlert(): IUseAlert {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Alert = useContext(AlertContext);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const showAlert = (props: AlertProps): void => {
        const targetElement = document.getElementById(props.anchorId);
        if (!targetElement) {
            throw new AppError(ErrorTypeEnum.Technical, 'alert anchor not found', 'no_anchor');
        }

        const sec = props.secToHide ?? 5;
        const sev = (props.severity as AlertColor) ?? 'info';
        const ah = props.autoHide ?? true;

        Alert.setAnchorId(props.anchorId);
        Alert.setSeverity(sev);
        Alert.setTitle(props.title ?? null);
        Alert.setSubtitle(props.subtitle ?? null);
        Alert.setAutoHide(ah);
        Alert.setSecToHide(sec);
        Alert.setIsVisible(true);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { showAlert };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseAlert {
    showAlert: (props: AlertProps) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
