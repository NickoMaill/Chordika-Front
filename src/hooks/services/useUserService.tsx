// #region IMPORTS -> /////////////////////////////////////
import useServiceBase from '~/hooks/useServiceBase';
import useService from '~/hooks/useService';
import { UserApiModel, UserPreferencesPayload } from '~/models/Users';
import { QueryResult } from '~/types/serverCoreType';
import { ApiErrorType } from '~/models/Error';
import { useContext } from 'react';
import SessionContext from '~/context/sessionContext';
import { LogsApiModel } from '~/models/Logs';
import appTool from '~/helpers/appTool';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useUserService(): IUseUserService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    const Ses = useContext(SessionContext);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getUserList = async (limit: number = 20, offset: number = 0, sort: string = '', query: string = null): Promise<QueryResult<UserApiModel>> => {
        let url = `users/getList?limit=${limit}&offset=${offset}&sort=${sort}`;
        if (query) {
            url += '&' + query;
        }
        const users = await asServicePromise<QueryResult<UserApiModel>>(() => Service.get(url));
        return users;
    };

    const getUser = async (id: number): Promise<UserApiModel[]> => {
        const user = await asServicePromise<UserApiModel[] | ApiErrorType>(() => Service.get(`users/${id}`));
        return user as UserApiModel[];
    };

    const updateUser = async (form: FormData, id: string): Promise<boolean> => {
        const request = await asServicePromise<{ success: boolean } | ApiErrorType>(() => Service.put(`users/update/${id}`, null, form));
        if ((request as { success: boolean }).success) {
            return true;
        } else {
            return false;
        }
    };

    const subscribeToNotification = async (s: PushSubscription): Promise<boolean> => {
        const rawKey = s.getKey('p256dh');
        const rawAuth = s.getKey('auth');

        const obj = {
            endpoint: s.endpoint,
            auth: appTool.toBase64(rawAuth, true),
            p256dh: appTool.toBase64(rawKey, true),
        };
        const data = await asServicePromise<{ success: boolean }>(() => Service.post('push/subscribe', obj));
        return data.success;
    };
    const unsubscribeToNotification = async (e: { endpoint: string }): Promise<boolean> => {
        const data = await asServicePromise<{ success: boolean }>(() => Service.post(`users/${Ses.id}/unsubscribe`, e));
        return data.success;
    };
    const getLogActivities = async (id: number, limit: number = 25, offset: number = 0): Promise<QueryResult<LogsApiModel>> => {
        const data = await asServicePromise<QueryResult<LogsApiModel>>(() => Service.get(`logs?userId=${id}&limit=${limit}&offset=${offset}&sort=entrydate+desc`));
        return data as QueryResult<LogsApiModel>;
    };
    const savePreferences = async (payload: UserPreferencesPayload): Promise<{ success: boolean }> => {
        const res = await asServicePromise<{ success: boolean }>(() => Service.put(`users/${Ses.id}/savePreferences`, payload));
        return res;
    };
    const checkIfSubscribed = async (payload: PushSubscription): Promise<boolean> => {
        const obj = {
            endpoint: payload.endpoint,
            auth: appTool.toBase64(payload.getKey('auth'), true),
            p256dh: appTool.toBase64(payload.getKey('p256dh'), true),
        };
        const res = await asServicePromise<{ success: boolean }>(() => Service.post(`push/isSubscribed`, obj));
        return res.success;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { getUserList, getUser, updateUser, subscribeToNotification, unsubscribeToNotification, getLogActivities, savePreferences, checkIfSubscribed };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseUserService {
    getUserList: (limit?: number, offset?: number, sort?: string, query?: string) => Promise<QueryResult<UserApiModel>>;
    getUser: (id: number) => Promise<UserApiModel[]>;
    updateUser: (form: FormData, id: string) => Promise<boolean>;
    subscribeToNotification: (e: PushSubscription) => Promise<boolean>;
    unsubscribeToNotification: (e: { endpoint: string }) => Promise<boolean>;
    getLogActivities: (id: number, limit?: number, offset?: number) => Promise<QueryResult<LogsApiModel>>;
    savePreferences: (payload: UserPreferencesPayload) => Promise<{ success: boolean }>;
    checkIfSubscribed: (payload: PushSubscription) => Promise<boolean>;
}
// #endregion IPROPS --> //////////////////////////////////
