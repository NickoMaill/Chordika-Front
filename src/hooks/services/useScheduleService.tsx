// #region IMPORTS -> /////////////////////////////////////
import { ScheduleApiModel, ScheduleTask } from '~/models/Schedule';
import useServiceBase from '../useServiceBase';
import useService from '../useService';
import { QueryResult } from '~/types/serverCoreType';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useScheduleService(): IUseScheduleService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { asServicePromise } = useServiceBase();
    const Service = useService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getScheduleMonitoring = async (id: number): Promise<ScheduleApiModel> => {
        const req = await asServicePromise<ScheduleApiModel>(() => Service.get(`schedules/${id}/monitor`));
        return req;
    };

    const getScheduleHistory = async (id: number, limit: number = 20, offset: number = 0): Promise<QueryResult<ScheduleTask>> => {
        const req = await asServicePromise<QueryResult<ScheduleTask>>(() => Service.get(`schedules/${id}/history?limit=${limit}&offset=${offset}`));
        return req;
    };

    const getTaskLogs = async (taskId: number): Promise<{ data: string[] }> => {
        const req = asServicePromise<{ data: string[] }>(() => Service.get(`schedules/task/${taskId}/logs`));
        return req;
    };

    const downloadTaskLogs = async (taskId: number): Promise<void> => {
        await asServicePromise<void>(() => Service.downloadFile(`schedules/task/${taskId}/downloadLogs`));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        getScheduleMonitoring,
        getScheduleHistory,
        getTaskLogs,
        downloadTaskLogs,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseScheduleService {
    getScheduleMonitoring: (id: number) => Promise<ScheduleApiModel>;
    getScheduleHistory: (id: number, limit?: number, offset?: number) => Promise<QueryResult<ScheduleTask>>;
    getTaskLogs: (taskId: number) => Promise<{ data: string[] }>;
    downloadTaskLogs: (taskId: number) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
