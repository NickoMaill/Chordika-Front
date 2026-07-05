// #region IMPORTS -> /////////////////////////////////////
import useServiceBase from '~/hooks/useServiceBase';
import useService from '~/hooks/useService';
import { PlaySession, UserApiModel } from '~/models/Users';
import { QueryResult, ServiceResponse } from '~/types/serverCoreType';
import { ApiErrorType } from '~/models/Error';
import { LogsApiModel } from '~/models/Logs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useUserService(): IUseUserService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const { asServicePromise } = useServiceBase();
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

    const getUser = async (id: number): Promise<QueryResult<UserApiModel>> => {
        const user = await asServicePromise<QueryResult<UserApiModel> | ApiErrorType>(() => Service.get(`users/${id}`));
        return user as QueryResult<UserApiModel>;
    };

    const updateUser = async (form: FormData, id: string): Promise<boolean> => {
        const request = await asServicePromise<ServiceResponse | ApiErrorType>(() => Service.put(`users/update/${id}`, null, form));
        if ((request as ServiceResponse).success) {
            return true;
        } else {
            return false;
        }
    };

    const getLogActivities = async (id: number, limit: number = 25, offset: number = 0): Promise<QueryResult<LogsApiModel>> => {
        const data = await asServicePromise<QueryResult<LogsApiModel>>(() => Service.get(`logs?userId=${id}&limit=${limit}&offset=${offset}&sort=addedAt+desc`));
        return data as QueryResult<LogsApiModel>;
    };

    const getUserHistory = async (userId: number, offset: number = 0, limit: number = 10): Promise<QueryResult<PlaySession>> => {
        const user = await asServicePromise<QueryResult<PlaySession>>(() => Service.get(`users/playSessions?userId=${userId}&offset=${offset}&limit=${limit}sort=addedAt+desc`));
        return user as QueryResult<PlaySession>;
    };

    const updatePreferences = async (data: FormData): Promise<boolean> => {
        await asServicePromise<ServiceResponse>(() => Service.put('users/preferences/update', null, data));
        return true;
    };

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { getUserList, getUser, updateUser, getUserHistory, updatePreferences, getLogActivities };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseUserService {
    getUserList: (limit?: number, offset?: number, sort?: string, query?: string) => Promise<QueryResult<UserApiModel>>;
    getUser: (id: number) => Promise<QueryResult<UserApiModel>>;
    updateUser: (form: FormData, id: string) => Promise<boolean>;
    getUserHistory: (userId: number, offset?: number, limit?: number) => Promise<QueryResult<PlaySession>>;
    getLogActivities: (id: number, limit?: number, offset?: number) => Promise<QueryResult<LogsApiModel>>;
    updatePreferences: (data: FormData) => Promise<boolean>;
}
// #endregion IPROPS --> //////////////////////////////////
