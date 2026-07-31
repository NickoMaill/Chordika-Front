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
        const query = new URLSearchParams();
        if (q !== "") query.append('q', q);
        if (urlExtension.includes('?')) {
            const p = urlExtension.split('?')[1].split('&');
            p.forEach((x) => query.append(x.split('=')[0], x.split('=')[1]));
        }
        const cleanedUrlExt = urlExtension.split('?')[0];
        const req = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources${cleanedUrlExt}?${query.toString()}`));
        return req;
    };

    const searchByCode = async (code: string, urlExtension: string = ''): Promise<QueryResult<DataText>> => {
        const query = new URLSearchParams();
        query.append('code', code);
        if (urlExtension.includes('?')) {
            const p = urlExtension.split('?')[1].split('&');
            p.forEach((x) => query.append(x.split('=')[0], x.split('=')[1]));
        }
        const cleanedUrlExt = urlExtension.split('?')[0];
        const req = await asServicePromise<QueryResult<DataText>>(() => Service.get(`resources${cleanedUrlExt}?${query.toString()}`));
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
