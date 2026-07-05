import { AlertColor } from '@mui/material/Alert';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
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
    isSearchFocused?: boolean;
    setIsSearchFocused?: Dispatch<SetStateAction<boolean>>;
    layoutLinks: { label: string; url?: string }[];
    setLayoutLinks?: Dispatch<SetStateAction<{ label: string; url?: string }[]>>;
}

const initialContext: IAppContext = {
    isNoAccess: false,
    noServer: false,
    notFound: false,
    perfMode: false,
    currentSizeDownload: null,
    isOnline: true,
    boxOptions: null,
    isSearchFocused: false,
    layoutLinks: []
};

export type AlertContextType = {
    severity: AlertColor;
    title: string;
    subtitle?: string;
};

export const AppContext = createContext<IAppContext>(initialContext);

export default function useAppContext(): IAppContext {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within a AppProvider');

    return context as IAppContext;
}
