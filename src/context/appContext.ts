import { AlertColor } from '@mui/material/Alert';
import { Dispatch, SetStateAction, createContext } from 'react';
import { AppBoxOptions } from './AppProvider';

interface IAppContext {
    isNoAccess: boolean;
    setIsNoAccess?: Dispatch<SetStateAction<boolean>>;
    noServer: boolean;
    setNoServer?: Dispatch<SetStateAction<boolean>>;
    notFound: boolean;
    setNotFound?: Dispatch<SetStateAction<boolean>>;
    perfMode: boolean;
    setPerfMode?: Dispatch<SetStateAction<boolean>>;
    currentSizeDownload: number;
    setCurrentSizeDownload?: Dispatch<SetStateAction<number>>;
    isOnline: boolean;
    setIsOnline?: Dispatch<SetStateAction<boolean>>;
    boxOptions: AppBoxOptions;
    setBoxOptions?: Dispatch<SetStateAction<AppBoxOptions>>;
    isVisitorHeader: () => boolean;
}

const initialContext: IAppContext = {
    isNoAccess: false,
    noServer: false,
    notFound: false,
    perfMode: false,
    currentSizeDownload: null,
    isOnline: true,
    boxOptions: null,
    isVisitorHeader: () => true,
};

export type AlertContextType = {
    severity: AlertColor;
    title: string;
    subtitle?: string;
};

const AppContext = createContext<IAppContext>(initialContext);
export default AppContext;
