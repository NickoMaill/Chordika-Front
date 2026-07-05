// #region IMPORTS -> /////////////////////////////////////
import { JSX, ReactNode, useContext, useEffect, useState } from 'react';
import AppContext from './appContext';
import appTool from '~/helpers/appTool';
import useStorage from '~/hooks/useStorage';
import SessionContext from './sessionContext';
import useSessionService from '~/hooks/services/useSessionService';
import { LangType } from '~/types/i18nTypes';
import useAnnonceService from '~/hooks/services/useAnnonceService';
import { AnnonceApiModel } from '~/models/Annonce';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { IconNameType } from '~/components/common/AppIcon';
import NavigationResource from '~/resources/navigationResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type AppBoxOptions = {
    title: string;
    text: string | ReactNode;
    icon: IconNameType;
    showHeader?: boolean;
    showBack?: boolean;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function AppProvider({ children }: IAppProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isNoAccess, setIsNoAccess] = useState<boolean>(false);
    const [noServer, setNoServer] = useState<boolean>(false);
    const [_annonce, setAnnonce] = useState<AnnonceApiModel>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [perfMode, setPerfMode] = useState<boolean>(false);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [currentSizeDownload, setCurrentSizeDownload] = useState<number>(null);
    const [boxOptions, setBoxOptions] = useState<AppBoxOptions>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Storage = useStorage();
    const Ses = useContext(SessionContext);
    const SessionService = useSessionService();
    const AnnonceServices = useAnnonceService();
    const { search, pathname } = useLocation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getUserInfo = async (): Promise<void> => {
        if (SessionService.gotSession()) {
            await SessionService.getUserProfile().then((res) => {
                if (res) {
                    Ses.setId(res.id);
                    Ses.setUsername(res.name);
                    Ses.setEmail(res.email);
                    Ses.setAccessLevel(res.levelAccess);
                    Ses.setFullName(res.name);
                    Ses.setPhone(res.mobile);
                    Ses.setGear(navigator.userAgent);
                    Ses.setIp(res.ip);
                    Ses.setNeedMfa(res.needMFA);
                    Ses.setProxyList(res.proxies);
                    Ses.setMaxRows(res.maxRows);
                    Ses.setIsPushActive(res.isPushActive);
                }
            });
        }
    };

    const setPref = async (): Promise<void> => {
        // ------- Retrieve the max rows preferences
        const gotMaxRows = Storage.isItemExist('maxRows');
        const lang = Storage.isItemExist('lang');
        if (gotMaxRows) {
            Ses.setMaxRows(Storage.getParsedItem('maxRows'));
        } else {
            Storage.setItem('maxRows', 50);
            Ses.setMaxRows(50);
        }

        if (lang) {
            Ses.setLang(Storage.getItem('lang') as LangType);
        } else {
            Ses.setLang('fr');
            Storage.setItem('lang', 'fr');
        }
    };

    const getAnnonce = async (): Promise<void> => {
        if (SessionService.gotSession()) {
            await AnnonceServices.show().then((res) => {
                setAnnonce(res);
            });
        }
    };

    const handleConnection = (connected: boolean): void => {
        setIsOnline(connected);
    };

    const initOnSession = async (): Promise<void> => {
        await appTool.runSequential(
            () => getUserInfo(),
            () => setPref(),
            () => getAnnonce()
        );
    };

    const isVisitorHeader = (): boolean => {
        return NavigationResource.noHeaderPath.includes(pathname) || !Ses.getToken() || (boxOptions && !boxOptions.showHeader);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (Ses.tokenExpire > dayjs()) {
            initOnSession();
        }
    }, [Ses.token]);

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

        return (): void => {
            window.removeEventListener('offline', () => handleConnection(false));
            window.removeEventListener('online', () => handleConnection(true));
        };
    }, []);

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
        isVisitorHeader,
    };
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
