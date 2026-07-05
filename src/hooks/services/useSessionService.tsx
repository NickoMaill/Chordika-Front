// #region IMPORTS -> /////////////////////////////////////
import { useContext } from 'react';
import useService from '~/hooks/useService';
import SessionContext from '~/context/sessionContext';
import useServiceBase from '../useServiceBase';
import { ApiErrorType } from '~/models/Error';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import appTool from '~/helpers/appTool';
import AppContext from '~/context/appContext';
import { UserApiModel, UserSessionApiModel, UserSessionDb } from '~/models/Users';
import configManager from '~/managers/configManager';
import { db } from '~/core/db';
import { LevelAccessEnum } from '~/models/Session';
import dayjs from 'dayjs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useSessionService(): IUseSessionService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    const Ses = useContext(SessionContext);
    const AppCtx = useContext(AppContext);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const login = async (form: FormData): Promise<boolean> => {
        try {
            const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => Service.post('auth/login', null, form), false);
            const session = request as UserSessionApiModel;
            setSessionContext(session);
            // await db.session.add({
            //     id: 1,
            //     userId: session.id.toString(),
            //     email: session.email,
            //     firstName: session.firstName,
            //     ip: session.ip,
            //     lastName: session.lastName,
            //     levelAccess: session.levelAccess,
            //     mobile: session.mobile,
            //     name: session.name,
            //     needMFA: session.needMFA,
            //     preferences: session.preferences,
            //     isPushActive: session.isPushActive,
            //     maxRows: session.maxRows,
            //     userName: session.userName,
            //     isAuthenticated: true,
            //     proxies: session.proxies,
            // });
            return true;
        } catch (error) {
            if ((error as ApiErrorType).code) {
                switch ((error as ApiErrorType).code) {
                    case 'not_found':
                        throw new AppError(ErrorTypeEnum.Functional, 'email ou mot de passe invalide', 'invalid_credentials');
                    case 'wrong_credentials':
                        throw new AppError(ErrorTypeEnum.Functional, 'email ou mot de passe invalide', 'invalid_credentials');
                    case 'email_required':
                        throw new AppError(ErrorTypeEnum.Functional, "L'email est requis", 'email_required');
                    case 'password_required':
                        throw new AppError(ErrorTypeEnum.Functional, 'Le mot de passe requis', 'password_required');
                    default:
                        throw new AppError(ErrorTypeEnum.Technical, 'une erreur est survenue', 'error_happened');
                }
            }
        }
    };

    const registerTOTP = async (): Promise<string> => {
        const res = await asServicePromise<{ success: boolean; url: string } | ApiErrorType>(() => Service.get('auth/register2FA'));
        if ((res as ApiErrorType).code) {
            return null;
        } else {
            return (res as { success: boolean; url: string }).url as string;
        }
    };

    const loginOpt = async (form: FormData): Promise<{ success: boolean } | ApiErrorType> => {
        const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => Service.post('auth/check2FA', null, form));
        if ((request as ApiErrorType).code) {
            return request as ApiErrorType;
        } else {
            const session = request as UserSessionApiModel;
            if (!session.needMFA) {
                await refreshSession()
                    .then(() => setSessionContext(session))
                    .finally(() => {
                        return { success: true };
                    });
            }
            return { success: false };
        }
    };

    const logout = async (): Promise<boolean> => {
        const res = await asServicePromise<{ success: boolean }>(() => Service.post('auth/logout'));
        if (res.success) {
            setSessionContext();
            db.session.delete(1);
        }
        return res.success;
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            if (!gotSession()) {
                // if (navigator.onLine) {
                const request = await asServicePromise(() => Service.get<{ token: string; expires: string } | ApiErrorType>('auth/refresh'), false);
                const response = request as { token: string; expires: string };
                Ses.setToken(response.token);
                Ses.setTokenExpire(dayjs(response.expires));
                await setConnected();
                return true;
                // } else {
                //     const sess = await db.session.get(1);
                //     if (!sess.isAuthenticated) throw new AppError(ErrorTypeEnum.Functional, 'no session', 'no_session');
                //     setSessionContext(sess);
                //     return true;
                // }
            }
        } catch (error) {
            if ((error as AppError).code) {
                switch ((error as AppError).code) {
                    case 'no_session':
                    case 'no_access_granted':
                        await setDisconnected();
                        return false;
                    case 'session_expired':
                        await setDisconnected();
                        return false;
                    case 'need_mfa':
                        setSessionContext(error.data);
                        break;
                    case 'failed_request':
                        await setDisconnected();
                        throw new AppError(ErrorTypeEnum.Technical, error.message, 'failed_request');
                    default:
                        await setDisconnected();
                        throw new AppError(ErrorTypeEnum.Technical, error.message, 'error_happened');
                }
            } else {
                if (appTool.fetchDispatcher(error.message) === 'failed_request') {
                    AppCtx.setNoServer(true);
                    throw new AppError(ErrorTypeEnum.Technical, 'Serveur injoignable', appTool.fetchDispatcher(error.message));
                }
            }
        }
        return true;
    };

    const gotSession = (): boolean => {
        if (Ses.token && Ses.token !== '' && Ses.tokenExpire > dayjs()) {
            return true;
        }
        return false;
    };

    const getUserProfile = async (): Promise<UserSessionApiModel> => {
        // if (navigator.onLine) {
        const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => Service.get('users/me'));

        if ((request as ApiErrorType).code) return null;

        const data = request as UserSessionApiModel;
        return data;
        // } else {
        //     const session = await db.session.get(1);
        //     if (!session) return null;

        //     return {
        //         id: Number(session.userId),
        //         email: session.email,
        //         firstName: session.firstName,
        //         ip: session.ip,
        //         lastName: session.lastName,
        //         levelAccess: session.levelAccess,
        //         mobile: session.mobile,
        //         name: session.name,
        //         needMFA: session.needMFA,
        //         preferences: session.preferences,
        //         isPushActive: session.isPushActive,
        //         maxRows: session.maxRows,
        //         userName: session.userName,
        //         proxyList: session.proxyList,
        //     };
        // }
    };

    const requestOtp = async (): Promise<boolean> => {
        try {
            await asServicePromise<void | ApiErrorType>(() => Service.get('auth/getOtp'));
            return true;
        } catch (error) {
            if ((error as ApiErrorType).code) {
                switch ((error as ApiErrorType).code) {
                    case 'no_session':
                        return false;
                    case 'already_send':
                        throw new AppError(ErrorTypeEnum.Functional, 'otp déjà envoyé', 'already_send');
                    default:
                        throw new AppError(ErrorTypeEnum.Technical, 'an Error happened', 'error_happened');
                }
            }
        }
    };

    const setSessionContext = (session?: UserSessionApiModel | UserSessionDb): void => {
        if (session) {
            Ses.setId(session.id);
            Ses.setUsername(session.name);
            Ses.setEmail(session.email);
            Ses.setAccessLevel(session.levelAccess);
            Ses.setFullName(session.name);
            Ses.setPhone(session.mobile);
            Ses.setGear(navigator.userAgent);
            Ses.setNeedMfa(session.needMFA);
            Ses.setProxyList(session.proxies);
            Ses.setIsPushActive(session.isPushActive);
        } else {
            Ses.setId(null);
            Ses.setUsername(null);
            Ses.setEmail(null);
            Ses.setAccessLevel(LevelAccessEnum.VISITOR);
            Ses.setFullName(null);
            Ses.setPhone(null);
            Ses.setGear(null);
            Ses.setNeedMfa(true);
            Ses.setProxyList([]);
            Ses.setIsPushActive(false);
            Ses.setToken(null);
            Ses.setTokenExpire(dayjs().minute(-1));
        }
    };

    const getProxy = async (form: FormData): Promise<{ id: number; name: string }[]> => {
        const users = asServicePromise<{ id: number; name: string }[]>(() => Service.post('auth/proxy/get', null, form));
        return users;
    };

    const getProxyList = async (): Promise<UserApiModel[]> => {
        const users = asServicePromise<UserApiModel[]>(() => Service.get('auth/proxy/list'));
        return users;
    };

    const setProxy = async (id: number): Promise<void> => {
        await asServicePromise<{ success: boolean }>(() => Service.post(`auth/proxy/set/${id}`)).then((res) => {
            if (res.success) {
                window.location.href = configManager.getConfig.APP_BASEURL;
            }
        });
    };

    const proxyLogout = async (): Promise<void> => {
        await asServicePromise<{ success: boolean }>(() => Service.post(`auth/proxy/logout`)).then((res) => {
            if (res.success) {
                window.location.href = configManager.getConfig.APP_BASEURL;
            }
        });
    };

    const resetPassword = async (form: FormData): Promise<{ success: boolean }> => {
        const res = await Service.post<{ success: boolean }, null>('auth/forgotPassword', null, form);
        return res;
    };

    const checkReset = async (token: string): Promise<{ success: boolean }> => {
        const isValid = await Service.get<{ success: boolean }>(`auth/checkReset?token=${token}`);
        return isValid;
    };

    const changePassword = async (form: FormData, token: string): Promise<{ success: boolean }> => {
        const res = await Service.post<{ success: boolean }, null>('auth/submitNewPassword', null, form, { Authorization: `Bearer ${token}` });
        return res;
    };

    const setConnected = async (): Promise<void> => {
        await db.session.update(1, { isAuthenticated: true });
    };

    const setDisconnected = async (): Promise<void> => {
        await db.session.update(1, { isAuthenticated: false });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    const out: IUseSessionService = {
        login,
        loginOpt,
        refreshSession,
        getUserProfile,
        requestOtp,
        registerTOTP,
        logout,
        getProxy,
        getProxyList,
        proxyLogout,
        setProxy,
        gotSession,
        resetPassword,
        checkReset,
        changePassword,
    };

    return out;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseSessionService {
    login: (form: FormData) => Promise<boolean>;
    loginOpt: (form: FormData) => Promise<{ success: boolean } | ApiErrorType>;
    refreshSession: () => Promise<boolean>;
    getUserProfile: () => Promise<UserSessionApiModel>;
    requestOtp: () => Promise<boolean>;
    registerTOTP: () => Promise<string>;
    logout: () => Promise<boolean>;
    getProxy: (form: FormData) => Promise<{ id: number; name: string }[]>;
    getProxyList: () => Promise<UserApiModel[]>;
    proxyLogout: () => Promise<void>;
    setProxy: (id: number) => Promise<void>;
    gotSession: () => boolean;
    resetPassword: (form: FormData) => Promise<{ success: boolean }>;
    checkReset: (token: string) => Promise<{ success: boolean }>;
    changePassword: (form: FormData, token: string) => Promise<{ success: boolean }>;
}
// #endregion IPROPS --> //////////////////////////////////
