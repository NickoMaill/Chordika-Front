// #region IMPORTS -> /////////////////////////////////////
import { QueryResult } from '~/types/serverCoreType';
import { DataText } from '~/models/DataText';
import useServiceBase from '../useServiceBase';
import useService from '../useService';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useDataTextService(): IUseDataTextService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { asServicePromise } = useServiceBase();
    const Service = useService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const search = async (q: string, urlExtension: string = ''): Promise<QueryResult<DataText>> => {
        const req = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources${urlExtension}?q=${q}`));
        return req;
    };

    const searchByCode = async (code: string, urlExtension: string = ''): Promise<QueryResult<DataText>> => {
        const req = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources${urlExtension}?code=${code}`));
        return req;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { search, searchByCode };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseDataTextService {
    search: (q: string, urlExtension?: string) => Promise<QueryResult<DataText>>;
    searchByCode: (q: string, urlExtension?: string) => Promise<QueryResult<DataText>>;
}
// #enderegion IPROPS --> //////////////////////////////////
