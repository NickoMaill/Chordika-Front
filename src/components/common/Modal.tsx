import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { lazy, ReactNode } from 'react';
import { JSX } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { Breakpoint } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { Italic } from './Text';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Modal({
    children,
    modalTitle,
    isOpen,
    onClose,
    modalAction,
    closable,
    modalActionLabel,
    isModalActionLoading,
    isModalLoading,
    dismissLabel,
    maxWidth = 'md',
    persistant = false,
    scroll = 'paper',
    noLayout = false,
    fullWidth = true,
    fullscreen = false,
}: IModal): JSX.Element {
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
        <>
            <Dialog fullScreen={fullscreen} scroll={scroll} maxWidth={maxWidth} onClose={persistant ? null : onClose} fullWidth={fullWidth} aria-labelledby="customized-dialog-title" open={isOpen}>
                {noLayout ? (
                    children
                ) : (
                    <>
                        <Box className={`d-flex justify-content-${modalTitle ? 'between' : 'end'}`}>
                            {modalTitle && (
                                <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 1.3 }}>
                                    {modalTitle}
                                </DialogTitle>
                            )}
                            {closable && (
                                <IconButton
                                    aria-label="close"
                                    onClick={onClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <AppIcon name="Close" />
                                </IconButton>
                            )}
                        </Box>
                        <DialogContent dividers>
                            {isModalLoading ? (
                                <Box className="d-flex flex-column justify-content-center align-items-center">
                                    <CircularProgress size={50} className="mb-4" />
                                    <Italic className="fw-bold">Chargement en cours...</Italic>
                                </Box>
                            ) : (
                                children
                            )}
                        </DialogContent>
                        {modalAction && (
                            <DialogActions>
                                <Divider />
                                <Box sx={{ margin: 0.6 }}>
                                    <Button sx={{ marginRight: 2 }} autoFocus variant="contained" color="secondary" onClick={onClose}>
                                        {dismissLabel}
                                    </Button>
                                    <Button variant="contained" loading={isModalActionLoading} onClick={modalAction}>
                                        {modalActionLabel}
                                    </Button>
                                </Box>
                            </DialogActions>
                        )}
                    </>
                )}
            </Dialog>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IModal {
    children: ReactNode;
    modalTitle?: string;
    modalAction?: () => void;
    modalActionLabel?: string;
    isModalLoading?: boolean;
    isModalActionLoading?: boolean;
    dismissLabel?: string;
    closable?: boolean;
    onClose: () => void;
    isOpen: boolean;
    maxWidth?: Breakpoint;
    persistant?: boolean;
    scroll?: DialogProps['scroll'];
    noLayout?: boolean;
    fullWidth?: boolean;
    fullscreen?: boolean;
}
// #endregion IPROPS --> //////////////////////////////////
