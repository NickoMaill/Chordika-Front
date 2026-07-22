// #region IMPORTS -> /////////////////////////////////////
import { JSX, ReactNode, useRef, useState } from 'react';
import { LevelAccessEnum } from '~/models/Session';
import { LangType } from '~/types/i18nTypes';
import { UserApiModel, UserPreferences, UserSessionApiModel } from '~/models/Users';
import dayjs, { Dayjs } from 'dayjs';
import { SessionContext } from './sessionContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function SessionProvider({ children }: ISessionProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [username, setUsername] = useState<string>(null);
    const [userFirstName, setUserFirstName] = useState<string>(null);
    const [userLastName, setUserLastName] = useState<string>(null);
    const [fullName, setFullName] = useState<string>(null);
    const [userId, setUserId] = useState<number>(null);
    const [email, setEmail] = useState<string>(null);
    const [accessLevel, setAccessLevel] = useState<LevelAccessEnum>(LevelAccessEnum.NOBODY);
    const [phone, setPhone] = useState<string>(null);
    const [ip, setIp] = useState<string>(null);
    const [gear, setGear] = useState<string>(null);
    const [lang, setLang] = useState<LangType>('fr');
    const [token, setTokenState] = useState<string>(null);
    const [tokenExpire, setTokenExpire] = useState<Dayjs>(dayjs());
    const [isPushActive, setIsPushActive] = useState<boolean>(false);
    const [maxRows, setMaxRows] = useState<number>(50);
    const [needMfa, setNeedMfa] = useState<boolean>(null);
    const [proxyList, setProxyList] = useState<UserApiModel[]>([]);
    const [preferences, setPreferences] = useState<UserPreferences>(null);
    const tokenRef = useRef<string>(null);
    const setToken = (t: string | null): void => {
        setTokenState(t);
        tokenRef.current = t;
    };

    const getToken = (): string => tokenRef.current;
    const setSession = (user?: UserSessionApiModel): void => {
        if (user) {
            setUserId(user.id);
            setUsername(user.name);
            setUserFirstName(user.firstName);
            setUserLastName(user.lastName);
            setEmail(user.email);
            setAccessLevel(user.levelAccess);
            setFullName(user.firstName + ' ' + user.lastName);
            setPhone(user.mobile);
            setIp(user.ip);
            setNeedMfa(user.needMFA);
            setIsPushActive(user.isPushActive);
            setMaxRows(user.maxRows);
            setProxyList(user.proxies);
            setPreferences(user.preferences);
        } else {
            setUserId(null);
            setUsername(null);
            setUserFirstName(null);
            setUserLastName(null);
            setEmail(null);
            setAccessLevel(0);
            setToken(null);
            setTokenExpire(null);
            setIp(null);
            setFullName(null);
            setPhone(null);
            setNeedMfa(null);
            setIsPushActive(false);
            setProxyList([]);
            setPreferences(null);
        }
    };

    const sessionValue = {
        username,
        setUsername,
        userFirstName,
        setUserFirstName,
        userLastName,
        setUserLastName,
        fullName,
        setFullName,
        userId,
        setUserId,
        email,
        setEmail,
        phone,
        setPhone,
        accessLevel,
        setAccessLevel,
        ip,
        setIp,
        gear,
        setGear,
        lang,
        setLang,
        token,
        setToken,
        tokenExpire,
        setTokenExpire,
        isPushActive,
        setIsPushActive,
        maxRows,
        setMaxRows,
        needMfa,
        setNeedMfa,
        proxyList,
        setProxyList,
        preferences,
        setPreferences,
        getToken,
        setSession,
    };
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <SessionContext.Provider value={sessionValue}>{children}</SessionContext.Provider>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ISessionProvider {
    children: ReactNode;
}
// #enderegion IPROPS --> //////////////////////////////////
