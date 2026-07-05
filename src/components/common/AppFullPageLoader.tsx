// #region IMPORTS -> /////////////////////////////////////
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import useStorage from '~/hooks/useStorage';
import { Bold } from './Text';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppFullPageLoader({ isLoading, handleClose, counting = false, count = 1000, message }: IAppFullPageLoader): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [show, setShow] = useState<boolean>(!counting);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Storage = useStorage();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (counting) {
            setTimeout(() => {
                setShow(true);
            }, count);
        }
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {show && (
                <Backdrop sx={{ backgroundColor: Storage.getItem('darkMode') === 'true' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)', zIndex: (theme) => theme.zIndex.drawer + 1 }} className="d-flex flex-column" open={isLoading} onClick={handleClose}>
                    <CircularProgress color="primary" size={70} />
                    {message && (
                        <Bold variant="h5" className="mt-3">
                            {message}
                        </Bold>
                    )}
                </Backdrop>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppFullPageLoader {
    isLoading: boolean;
    message?: string;
    handleClose?: () => void;
    counting?: boolean;
    count?: number;
}
// #endregion IPROPS --> //////////////////////////////////
