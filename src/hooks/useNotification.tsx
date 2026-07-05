// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import { Bold, Regular } from '~/components/common/Text';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useNotification(): IUseNotification {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { enqueueSnackbar } = useSnackbar();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const error = (message: string, subMessage?: string): void => {
        enqueueSnackbar(
            <Box>
                <Bold>{message}</Bold>
                {subMessage !== null && subMessage !== '' ? <Regular>{subMessage}</Regular> : null}
            </Box>,
            { variant: 'error' }
        );
    };

    const info = (message: string, subMessage?: string): void => {
        enqueueSnackbar(
            <Box>
                <Bold>{message}</Bold>
                {subMessage !== null && subMessage !== '' ? <Regular>{subMessage}</Regular> : null}
            </Box>,
            { variant: 'info' }
        );
    };

    const success = (message: string, subMessage?: string): void => {
        enqueueSnackbar(
            <Box>
                <Bold>{message}</Bold>
                {subMessage !== null && subMessage !== '' ? <Regular>{subMessage}</Regular> : null}
            </Box>,
            { variant: 'success' }
        );
    };

    const warning = (message: string, subMessage?: string): void => {
        enqueueSnackbar(
            <Box>
                <Bold>{message}</Bold>
                {subMessage !== null && subMessage !== '' ? <Regular>{subMessage}</Regular> : null}
            </Box>,
            { variant: 'warning' }
        );
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { error, info, success, warning };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseNotification {
    error: (message: string, subMessage?: string) => void;
    info: (message: string, subMessage?: string) => void;
    success: (message: string, subMessage?: string) => void;
    warning: (message: string, subMessage?: string) => void;
}
// #endregion IPROPS --> //////////////////////////////////
