// #region IMPORTS -> /////////////////////////////////////
import { ReactElement, ReactNode, Ref, forwardRef, lazy } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { JSX } from 'react';
import Box from '@mui/material/Box';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
// #endregion SINGLETON --> /////////////////////////////////

export default function AppFullPageModal({ children, modalTitle, isOpen, onClose }: IAppFullPageModal): JSX.Element {
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
            <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
                <AppBar sx={{ justifyContent: 'center', minHeight: '56px', position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography sx={{ ml: 2, flex: 1, alignItems: 'center', mr: 1 }} variant="h6" component="h6">
                                {modalTitle}
                            </Typography>
                            <AppIcon name="Search" />
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box padding={2}>{children}</Box>
            </Dialog>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppFullPageModal {
    children: ReactNode;
    modalTitle: string;
    isOpen: boolean;
    onClose: () => void;
}
// #endregion IPROPS --> //////////////////////////////////
