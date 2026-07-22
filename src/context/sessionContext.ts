import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { LevelAccessEnum } from '~/models/Session';
import { UserPreferences, UserSessionApiModel } from '~/models/Users';

export interface ISessionContext {
    userId: number;
    setUserId?: Dispatch<SetStateAction<number>>;

    userFirstName: string;
    setUserFirstName?: Dispatch<SetStateAction<string>>;

    userLastName: string;
    setUserLastName?: Dispatch<SetStateAction<string>>;

    username: string;
    setUsername?: Dispatch<SetStateAction<string>>;

    fullName: string;
    setFullName?: Dispatch<SetStateAction<string>>;

    email: string;
    setEmail?: Dispatch<SetStateAction<string>>;

    phone?: string;
    setPhone?: Dispatch<SetStateAction<string>>;

    accessLevel: LevelAccessEnum;
    setAccessLevel?: Dispatch<SetStateAction<LevelAccessEnum>>;

    gear: string;
    setGear?: Dispatch<SetStateAction<string>>;

    ip: string;
    setIp?: Dispatch<SetStateAction<string>>;

    lang: 'fr' | 'en';
    setLang?: Dispatch<SetStateAction<'fr' | 'en'>>;

    token?: string;
    setToken?: (t: string | null) => void;

    getToken: () => string;

    tokenExpire: Dayjs;
    setTokenExpire?: Dispatch<SetStateAction<Dayjs>>;

    isPushActive: boolean;
    setIsPushActive?: Dispatch<SetStateAction<boolean>>;

    maxRows: number;
    setMaxRows?: Dispatch<SetStateAction<number>>;

    needMfa: boolean;
    setNeedMfa?: Dispatch<SetStateAction<boolean>>;

    proxyList: { id: number; name: string }[];
    setProxyList?: Dispatch<SetStateAction<{ id: number; name: string }[]>>;

    preferences: UserPreferences;
    setPreferences?: Dispatch<SetStateAction<UserPreferences>>;

    setSession: (user?: UserSessionApiModel) => void;
}

const initialContext: ISessionContext = {
    userId: null,
    userFirstName: null,
    userLastName: null,
    username: null,
    fullName: null,
    email: null,
    phone: null,
    accessLevel: LevelAccessEnum.VISITOR,
    gear: null,
    ip: null,
    lang: 'fr',
    token: null,
    tokenExpire: dayjs(),
    isPushActive: false,
    maxRows: 50,
    needMfa: null,
    proxyList: [],
    preferences: null,
    getToken: () => null,
    setSession: () => null,
};

export const SessionContext = createContext<ISessionContext>(initialContext);

export default function useSessionContext(): ISessionContext {
    const context = useContext(SessionContext);
    if (!context) throw new Error('useSessionContext must be used within a SessionProvider');

    return context as ISessionContext;
}
