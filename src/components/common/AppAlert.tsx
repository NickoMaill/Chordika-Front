// #region IMPORTS -> /////////////////////////////////////
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Regular } from '../common/Text';
import HTMLParser from '../common/HTMLParser';
import { lazy, ReactNode } from 'react';
import { JSX } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function AppAlert({ severity, title, subtitle, isVisible = true, onClose, closable = true }: IAppAlert): JSX.Element {
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
        <Collapse in={isVisible}>
            <Alert
                className="d-flex align-items-center"
                sx={{ marginBlock: 2 }}
                role="alert"
                action={
                    closable ? (
                        <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
                            <AppIcon name="Close" />
                        </IconButton>
                    ) : null
                }
                severity={severity}
            >
                <AlertTitle className="m-0 fw-bold">{title}</AlertTitle>
                {subtitle && (
                    <Regular sx={{ marginTop: '0.35rem' }}>
                        <HTMLParser>{subtitle}</HTMLParser>
                    </Regular>
                )}
            </Alert>
        </Collapse>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppAlert {
    severity: AlertColor;
    isVisible?: boolean;
    title: string | ReactNode;
    subtitle?: string;
    onClose?: () => void;
    anchorId?: string;
    closable?: boolean;
}
// #endregion IPROPS --> //////////////////////////////////
