// #region IMPORTS -> /////////////////////////////////////
import { Notification } from '~/models/Notification';
import useService from '../useService';
import useServiceBase from '../useServiceBase';
import { QueryResult, ServiceResponse } from '~/types/serverCoreType';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useNotificationService(): IUseNotificationService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { post, get } = useService();
    const { asServicePromise } = useServiceBase();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getNotifications = async (seen: boolean = true, offset: number = 0, limit: number = 10): Promise<QueryResult<Notification>> => {
        const response = await asServicePromise(() => get<QueryResult<Notification>>(`notifications?offset=${offset}&limit=${limit}${!seen ? '&seen=false' : ''}&sort=addedAt+DESC`));
        return response;
    }

    const seen = async (id: number): Promise<ServiceResponse> => {
        const response = await asServicePromise(() => post<ServiceResponse, never>(`notifications/${id}/seen`));
        return response;
    }

    const seenAll = async (): Promise<ServiceResponse> => {
        const response = await asServicePromise(() => post<ServiceResponse, never>(`notifications/seenAll`));
        return response;
    }
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        getNotifications,
        seen,
        seenAll
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseNotificationService {
    getNotifications: (seen?: boolean, offset?: number, limit?: number) => Promise<QueryResult<Notification>>;
    seen: (id: number) => Promise<ServiceResponse>;
    seenAll: () => Promise<ServiceResponse>
}
// #enderegion IPROPS --> //////////////////////////////////