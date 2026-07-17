// #region IMPORTS -> /////////////////////////////////////
import useService from '~/hooks/useService';
import useServiceBase from '../useServiceBase';
import { ApiErrorType } from '~/models/Error';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { UserApiModel, UserDeviceSessions, UserSessionApiModel } from '~/models/Users';
import appTool from '~/helpers/appTool';
import dayjs from 'dayjs';
import { QueryResult, ServiceResponse } from '~/types/serverCoreType';
import useSessionContext from '~/context/sessionContext';
import useAppContext from '~/context/appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

function useSessionService(): IUseSessionService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { get, post } = useService();
    const { asServicePromise } = useServiceBase();
    const { setToken, setNeedMfa, setSession, setTokenExpire, token, tokenExpire } = useSessionContext();
    const { setIsNoAccess, setNotFound, setNoServer, setBoxOptions } = useAppContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const login = async (form: FormData): Promise<UserSessionApiModel> => {
        try {
            const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => post('auth/login', null, form), false);
            const session = request as UserSessionApiModel;
            setToken(session.token);
            setNeedMfa(false);
            setSession(session);
            setIsNoAccess(false);
            setNotFound(false);
            setNoServer(false);
            setBoxOptions(null);
            return session;
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
            } else if ((error as { errors: object }).errors) {
                const errors = (error as { errors: { Password: string; UserName: string } }).errors;
                if (errors.Password) {
                    throw new AppError(ErrorTypeEnum.Functional, 'Le mot de passe requis', 'email_required');
                }
                if (errors.UserName) {
                    throw new AppError(ErrorTypeEnum.Functional, "L'email est requis", 'email_required');
                }
            }
        }
    };

    const loginOpt = async (form: FormData): Promise<boolean> => {
        try {
            const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => post('auth/loginOtp', null, form));
            const session = request as UserSessionApiModel;
            setSession(session);
            setIsNoAccess(false);
            setNotFound(false);
            setNoServer(false);
            setBoxOptions(null);
            return true;
        } catch (error) {
            if ((error as AppError).code) {
                switch ((error as AppError).code) {
                    case 'no_otp':
                    case 'invalid_otp':
                        return false;
                    case 'no_session':
                    case 'session_expired':
                        throw new AppError(ErrorTypeEnum.Functional, 'Session expirée', 'session_expired');
                    case 'expired_otp':
                        throw new AppError(ErrorTypeEnum.Functional, 'Session expirée', 'expired_otp');
                }
            }
        }
    };

    const logout = async (): Promise<void> => {
        await asServicePromise<ServiceResponse>(() => post('auth/logout')).then((res) => {
            if (res.success) {
                setSession();
                setIsNoAccess(false);
                setNotFound(false);
                setNoServer(false);
                setBoxOptions(null);
                // Navigation.navigate('Login');
            }
        });
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            if (!gotSession()) {
                const request = await asServicePromise(() => get<{ token: string; expires: string } | ApiErrorType>('auth/refresh'), false);
                const response = request as { token: string; expires: string };
                setToken(response.token);
                setTokenExpire(dayjs(response.expires));
                setNeedMfa(false);
                return true;
            }
        } catch (error) {
            if ((error as AppError).code) {
                switch ((error as AppError).code) {
                    case 'no_session':
                    case 'no_access_granted':
                        return false;
                    case 'session_expired':
                        return false;
                    case 'need_mfa':
                        throw new AppError(ErrorTypeEnum.Functional, 'Double authentification requise', 'need_mfa');
                    default:
                        throw new AppError(ErrorTypeEnum.Technical, error.message, 'error_happened');
                }
            } else {
                if (appTool.fetchDispatcher(error.message) === 'failed_request') {
                    setNoServer(true);
                    throw new AppError(ErrorTypeEnum.Technical, 'Serveur injoignable', appTool.fetchDispatcher(error.message));
                }
            }
        }
        return true;
    };

    const gotSession = (): boolean => {
        if (token && token !== '' && tokenExpire > dayjs()) {
            return true;
        }
        return false;
    };

    const getUserProfile = async (): Promise<UserSessionApiModel> => {
        const request = await asServicePromise<UserSessionApiModel | ApiErrorType>(() => get('users/me'));
        const data = request as UserSessionApiModel;
        return data;
    };

    const requestOtp = async (): Promise<boolean> => {
        try {
            await asServicePromise<void | ApiErrorType>(() => get('auth/getOtp'));
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
    const getSessions = async (userId: number, limit: number = 20, offset: number = 0, showAll: boolean = false): Promise<QueryResult<UserDeviceSessions>> => {
        const res = await asServicePromise<QueryResult<UserDeviceSessions>>(() => get(`users/${userId}/sessions?limit=${limit}&offset=${offset}&showAll=${showAll}`));
        return res;
    };

    const revokeSession = async (sesId: number): Promise<boolean> => {
        await asServicePromise<QueryResult<UserDeviceSessions>>(() => get(`users/sessions/revoke/${sesId}`));
        return true;
    };

    const getProxy = async (form: FormData): Promise<{ id: number; name: string }[]> => {
        const users = asServicePromise<{ id: number; name: string }[]>(() => post('auth/proxy/get', null, form));
        return users;
    };

    const getProxyList = async (): Promise<UserApiModel[]> => {
        const users = asServicePromise<UserApiModel[]>(() => get('auth/proxy/list'));
        return users;
    };

    const setProxy = async (id: number): Promise<void> => {
        await asServicePromise<ServiceResponse>(() => post(`auth/proxy/set/${id}`)).then((res) => {
            if (res.success) {
                window.location.href = '/';
            }
        });
    };

    const proxyLogout = async (): Promise<void> => {
        await asServicePromise<ServiceResponse>(() => post(`auth/proxy/logout`)).then((res) => {
            if (res.success) {
                window.location.href = '/';
            }
        });
    };
    const resetPassword = async (form: FormData): Promise<{ success: boolean }> => {
        const res = await post<{ success: boolean }, null>('auth/forgotPassword', null, form);
        return res;
    };

    const checkReset = async (token: string): Promise<{ success: boolean }> => {
        const isValid = await get<{ success: boolean }>(`auth/checkReset?token=${token}`);
        return isValid;
    };

    const changePassword = async (form: FormData, token: string): Promise<{ success: boolean }> => {
        const res = await post<{ success: boolean }, null>('auth/submitNewPassword', null, form, { Authorization: `Bearer ${token}` });
        return res;
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
        logout,
        getProxy,
        getProxyList,
        proxyLogout,
        setProxy,
        gotSession,
        getSessions,
        revokeSession,
        changePassword,
        resetPassword,
        checkReset,
    };

    return out;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseSessionService {
    login: (form: FormData) => Promise<UserSessionApiModel>;
    loginOpt: (form: FormData) => Promise<boolean>;
    refreshSession: () => Promise<boolean>;
    getUserProfile: () => Promise<UserSessionApiModel>;
    requestOtp: () => Promise<boolean>;
    logout: () => Promise<void>;
    getProxy: (form: FormData) => Promise<{ id: number; name: string }[]>;
    getProxyList: () => Promise<UserApiModel[]>;
    proxyLogout: () => Promise<void>;
    setProxy: (id: number) => Promise<void>;
    gotSession: () => boolean;
    getSessions: (userId: number, limit?: number, offset?: number, showAll?: boolean) => Promise<QueryResult<UserDeviceSessions>>;
    revokeSession: (sesId: number) => Promise<boolean>;
    resetPassword: (form: FormData) => Promise<{ success: boolean }>;
    checkReset: (token: string) => Promise<{ success: boolean }>;
    changePassword: (form: FormData, token: string) => Promise<{ success: boolean }>;
}
// #endregion IPROPS --> //////////////////////////////////

export default useSessionService;
