// #region IMPORTS -> /////////////////////////////////////
import useService from '~/hooks/useService';
import useServiceBase from '~/hooks/useServiceBase';
import { SQLTestOutput } from '~/models/Common';
import { PerformanceType } from '~/models/Performance';
import { DataText } from '~/models/DataText';
import { MonitorInfoType } from '~/types/config';
import { QueryResult } from '~/types/serverCoreType';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useToolService(): IUseToolService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Service = useService();
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
        const data = await asServicePromise<PerformanceType>(() => Service.get('resources/getPerf'));
        return data;
    };
    const getUserList = async (): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get('resources/userList'));
        return data;
    };
    const getDataText = async (type: string): Promise<DataText[]> => {
        const data = await asServicePromise<QueryResult<DataText>>(() => Service.get(`dataText?type=${type}&limit=-1`));
        return data.records;
    };
    const getLogAction = async (): Promise<DataText[]> => {
        const data = await asServicePromise<DataText[]>(() => Service.get(`resources/getLogAction`));
        return data;
    };
    const getSqlTest = async (form: FormData): Promise<SQLTestOutput[]> => {
        const data = await asServicePromise<SQLTestOutput[]>(() => Service.post(`resources/sqlTest`, null, form));
        return data;
    };
    const getAppMonitor = async (): Promise<MonitorInfoType> => {
        const m = await asServicePromise<MonitorInfoType>(() => Service.get('resources/monitor'), false);
        return m;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { legalStatut, departmentList, getPerf, getUserList, getDataText, getLogAction, getSqlTest, getAppMonitor };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseToolService {
    legalStatut: () => Promise<DataText[]>;
    departmentList: () => Promise<DataText[]>;
    getPerf: () => Promise<PerformanceType>;
    getUserList: () => Promise<DataText[]>;
    getDataText: (type: string) => Promise<DataText[]>;
    getLogAction: () => Promise<DataText[]>;
    getSqlTest: (form: FormData) => Promise<SQLTestOutput[]>;
    getAppMonitor: () => Promise<MonitorInfoType>;
}
// #endregion IPROPS --> //////////////////////////////////
