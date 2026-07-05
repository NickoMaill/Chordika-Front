// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Bold, Regular } from '~/components/common/Text';
import useResources from './useResources';
import { JSX, lazy, useEffect, useState } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function useToast(): IUseToast {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { enqueueSnackbar } = useSnackbar();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const fireToast = (type: 'default' | 'error' | 'success' | 'warning' | 'info', message: string, subMessage?: string, autoHide?: boolean, autoHideDuration: number = 3000): void => {
        const key = Math.floor(Math.random() * 1000);
        enqueueSnackbar(<ToastContent message={message} subMessage={subMessage} autoHide={autoHide} autoHideDuration={autoHideDuration} snackbarKey={key} />, {
            variant: type,
            key,
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
            className: 'position-relative',
            autoHideDuration: autoHide ? autoHideDuration + 50 : null,
        });
    };
    const error = (message: string, subMessage?: string, autoHide: boolean = true, autoHideDuration: number = 3000): void => {
        fireToast('error', message, subMessage, autoHide, autoHideDuration);
    };

    const info = (message: string, subMessage?: string, autoHide: boolean = true, autoHideDuration: number = 3000): void => {
        fireToast('info', message, subMessage, autoHide, autoHideDuration);
    };

    const success = (message: string, subMessage?: string, autoHide: boolean = true, autoHideDuration: number = 3000): void => {
        fireToast('success', message, subMessage, autoHide, autoHideDuration);
    };

    const warning = (message: string, subMessage?: string, autoHide: boolean = true, autoHideDuration: number = 3000): void => {
        fireToast('warning', message, subMessage, autoHide, autoHideDuration);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { error, info, success, warning };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseToast {
    error: (message: string, subMessage?: string, autoHide?: boolean, autoHideDuration?: number) => void;
    info: (message: string, subMessage?: string, autoHide?: boolean, autoHideDuration?: number) => void;
    success: (message: string, subMessage?: string, autoHide?: boolean, autoHideDuration?: number) => void;
    warning: (message: string, subMessage?: string, autoHide?: boolean, autoHideDuration?: number) => void;
}
// #endregion IPROPS --> //////////////////////////////////

interface ToastContentProps {
    message: string;
    subMessage?: string;
    autoHide: boolean;
    autoHideDuration: number;
    snackbarKey: string | number;
}

function ToastContent({ message, subMessage, autoHide, autoHideDuration, snackbarKey }: ToastContentProps): JSX.Element {
    const Resources = useResources();
    const [width, setWidth] = useState(100);

    useEffect(() => {
        if (!autoHide) return;

        const totalSteps = 100;
        const stepTime = autoHideDuration / totalSteps;

        const interval = setInterval(() => {
            setWidth((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, stepTime);

        return (): void => clearInterval(interval);
    }, [autoHide, autoHideDuration]);

    return (
        <Box>
            <Box className="pe-4">
                <Bold>{message}</Bold>
                {subMessage && <Regular>{subMessage}</Regular>}
            </Box>

            <IconButton onClick={() => closeSnackbar(snackbarKey)} className="position-absolute top-50 end-0 translate-middle-y" title={Resources.translate('common.close') as string}>
                <AppIcon name="Close" sx={{ color: 'white' }} />
            </IconButton>

            {autoHide && (
                <Box
                    className="bg-white position-absolute bottom-0 start-0 rounded"
                    sx={{
                        height: '3px',
                        width: `${width}%`,
                        transition: 'width 0.1s linear',
                    }}
                />
            )}
        </Box>
    );
}
