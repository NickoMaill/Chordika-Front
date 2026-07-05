import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, createContext } from 'react';
import { LevelAccessEnum } from '~/models/Session';
import { UserApiModel } from '~/models/Users';

export interface ISessionContext {
    id: number;
    setId?: Dispatch<SetStateAction<number>>;

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

    proxyList: UserApiModel[];
    setProxyList?: Dispatch<SetStateAction<UserApiModel[]>>;
}

const initialContext: ISessionContext = {
    id: null,
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
    getToken: () => null,
};

const SessionContext = createContext<ISessionContext>(initialContext);

export default SessionContext;
