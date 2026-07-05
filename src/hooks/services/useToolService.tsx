// #region IMPORTS -> /////////////////////////////////////
import useService from '~/hooks/useService';
import useServiceBase from '~/hooks/useServiceBase';
import { SQLTestOutput } from '~/models/Common';
import { PerformanceType } from '~/models/Performance';
import { DataText } from '~/models/DataText';
import { MonitorInfoType } from '~/types/config';
import { QueryResult } from '~/types/serverCoreType';
import { useContext } from 'react';
import AppContext from '~/context/appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useToolService(): IUseToolService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
    const App = useContext(AppContext);
    const { asServicePromise } = useServiceBase();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const legalStatut = async (): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get('resources/legalStatus'));
        return data;
    };
    const departmentList = async (): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get('resources/getDepartmentList'));
        return data;
    };
    const getPerf = async (): Promise<PerformanceType> => {
        App.setPerfMode(false);

        const url = new URL(window.location.href);
        url.searchParams.delete('perf');
        window.history.replaceState({}, '', url);

        const data = await asServicePromise<PerformanceType>(() => Service.get('resources/getPerf'));
        return data;
    };
    const getUserList = async (): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get('resources/userList'));
        return data;
    };
    const getDataText = async (type: string): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get(`resources/getDataText?type=${type}`));
        return data;
    };
    const getLogAction = async (): Promise<QueryResult<DataText>> => {
        const data = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources/logsAction`));
        return data;
    };
    const getSqlTest = async (form: FormData): Promise<SQLTestOutput[]> => {
        const data = await asServicePromise<SQLTestOutput[]>(() => Service.post(`resources/sqlTest`, null, form));
        return data;
    };
    const getVAPID = async (): Promise<string> => {
        const data = await asServicePromise<{ key: string }>(() => Service.get('resources/vapid'));
        return data.key;
    };

    const getAppMonitor = async (): Promise<MonitorInfoType> => {
        const m = await asServicePromise<MonitorInfoType>(() => Service.get('resources/monitor'), false);
        return m;
    };

    const getUsersList = async (q: string, id?: string): Promise<QueryResult<DataText>> => {
        let query = '';

        if (id) query = `id=${id}`;
        else query = `q=${q}`;

        const data = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources/usersList?${query}`));
        return data;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { legalStatut, departmentList, getPerf, getUserList, getDataText, getLogAction, getSqlTest, getVAPID, getAppMonitor, getUsersList };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseToolService {
    legalStatut: () => Promise<DataText[]>;
    departmentList: () => Promise<DataText[]>;
    getPerf: () => Promise<PerformanceType>;
    getUserList: () => Promise<DataText[]>;
    getDataText: (type: string) => Promise<DataText[]>;
    getLogAction: () => Promise<QueryResult<DataText>>;
    getSqlTest: (form: FormData) => Promise<SQLTestOutput[]>;
    getVAPID: () => Promise<string>;
    getAppMonitor: () => Promise<MonitorInfoType>;
    getUsersList: (q: string, id?: string) => Promise<QueryResult<DataText>>;
}
// #endregion IPROPS --> //////////////////////////////////
