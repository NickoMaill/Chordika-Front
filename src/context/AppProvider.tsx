// #region IMPORTS -> /////////////////////////////////////
import { JSX, ReactNode, useEffect, useState } from 'react';
import appTool from '~/helpers/appTool';
import useStorage from '~/hooks/useStorage';
import useSessionService from '~/hooks/services/useSessionService';
import { LangType } from '~/types/i18nTypes';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { IconNameType } from '~/components/common/AppIcon';
import useSessionContext from './sessionContext';
import { AppContext } from './appContext';
import { translate } from '~/resources/i18n/i18n';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type AppBoxOptions = {
    title: string;
    text: string | ReactNode;
    icon: IconNameType;
    showHeader?: boolean;
    showBack?: boolean;
};
const initLayoutLinks: { label: string; url?: string }[] = [{ label: translate('common.homepage'), url: '/' }];
// #endregion SINGLETON --> /////////////////////////////////

export default function AppProvider({ children }: IAppProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isNoAccess, setIsNoAccess] = useState<boolean>(false);
    const [noServer, setNoServer] = useState<boolean>(false);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [perfMode, setPerfMode] = useState<boolean>(false);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [currentSizeDownload, setCurrentSizeDownload] = useState<number>(null);
    const [boxOptions, setBoxOptions] = useState<AppBoxOptions>(null);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [layoutLinks, setLayoutLinks] = useState<{ label: string; url?: string }[]>(initLayoutLinks);

    const values = {
        isNoAccess,
        setIsNoAccess,
        noServer,
        setNoServer,
        notFound,
        setNotFound,
        perfMode,
        setPerfMode,
        currentSizeDownload,
        setCurrentSizeDownload,
        isOnline,
        setIsOnline,
        boxOptions,
        setBoxOptions,
        isSearchFocused,
        setIsSearchFocused,
        layoutLinks,
        setLayoutLinks,
    };
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Storage = useStorage();
    const { setSession, setLang, setMaxRows, token, tokenExpire } = useSessionContext();
    const SessionService = useSessionService();
    const { search, pathname } = useLocation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getUserInfo = async (): Promise<void> => {
        if (SessionService.gotSession()) {
            await SessionService.getUserProfile().then((res) => {
                if (res) {
                    setSession(res);
                }
            });
        }
    };

    const setPref = async (): Promise<void> => {
        // ------- Retrieve the max rows preferences
        const gotMaxRows = Storage.isItemExist('maxRows');
        const lang = Storage.isItemExist('lang');
        if (gotMaxRows) {
            setMaxRows(Storage.getParsedItem('maxRows'));
        } else {
            Storage.setItem('maxRows', 50);
            setMaxRows(50);
        }

        if (lang) {
            setLang(Storage.getItem('lang') as LangType);
        } else {
            setLang('fr');
            Storage.setItem('lang', 'fr');
        }
    };

    const handleConnection = (connected: boolean): void => {
        setIsOnline(connected);
    };

    const initOnSession = async (): Promise<void> => {
        await appTool.runSequential(
            () => getUserInfo(),
            () => setPref()
        );
    };
    // #endregion METHODS --> //////////////////////////////////
    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (setSession && tokenExpire > dayjs()) {
            initOnSession();
        }
    }, [token]);

    useEffect(() => {
        setBoxOptions(null);
        setNotFound(false);
        setNoServer(false);

        const query = new URLSearchParams(search);
        if (query.has('perf') && query.get('perf') === '1') {
            setPerfMode(true);
        }
    }, [search, pathname]);

    useEffect(() => {
        window.addEventListener('offline', () => handleConnection(false));
        window.addEventListener('online', () => handleConnection(true));

        if (!Storage.isItemExist('mui-mode')) Storage.setItem('mui-mode', 'dark');

        return (): void => {
            window.removeEventListener('offline', () => handleConnection(false));
            window.removeEventListener('online', () => handleConnection(true));
        };
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppProvider {
    children: ReactNode;
}
// #enderegion IPROPS --> //////////////////////////////////
