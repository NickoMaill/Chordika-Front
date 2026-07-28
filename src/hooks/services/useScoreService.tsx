// #region IMPORTS -> /////////////////////////////////////
import useServiceBase from '../useServiceBase';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import useService from '../useService';
import { QueryResult, ServerResponse } from '~/types/serverCoreType';
import { Score, ScorePage } from '~/models/Score';
import { useSearchParams } from 'react-router-dom';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useScoreService(): IUseScoreService {
    // #region STATE --> ///////////////////////////////////////
    const [query] = useSearchParams();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { asServicePromise } = useServiceBase();
    const { get, post, put, downloadFile } = useService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadAddForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => get('scores/form/add'));
        return form;
    };

    const loadAddBarsForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => get('scores/form/bars'));
        return form;
    };

    const loadSearchForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => get('scores/form/search'));
        return form;
    };

    const getScoreLists = async (query?: Record<string, string>): Promise<QueryResult<Score>> => {
        let q = new URLSearchParams();
        if (query) {
            for (const key in query) {
                q.append(key, query[key]);
            }
        }
        const lists = await asServicePromise<QueryResult<Score>>(() => get(`scores${q.size > 0 ? '?' + q.toString() : ''}`));
        return lists;
    };

    const getScore = async (id: number, printMode: boolean = false): Promise<Score> => {
        const token = printMode && query.has("printToken") ? `?printToken=${query.get("printToken")}` : ""
        const score = await asServicePromise<Score[]>(() => get(`scores/${id}${token}`), !printMode);
        if (score.length > 0) return score[0];
        return null;
    };

    const exportScore = async (id: number): Promise<void> => {
        await asServicePromise(() => downloadFile(`scores/${id}/print`));
    }

    const setFavScore = async (id: number): Promise<ServerResponse<null, { isFavorite: boolean }>> => {
        const response = await asServicePromise<ServerResponse<null, { isFavorite: boolean }>>(() => put(`scores/${id}/setFav`));
        return response;
    };

    const addScore = async (form: FormData): Promise<Score> => {
        const added = await asServicePromise<{ success: boolean; inserted: Score }>(() => post('scores', null, form));
        return added.inserted; 
    };

    const saveScore = async (id: number, datas: ScorePage[]): Promise<{ success: boolean }> => {
        const payload = { datas };
        const saved = await asServicePromise<{ success: boolean }>(() => put(`scores/${id}/content`, payload));
        return saved;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        loadAddForm,
        loadAddBarsForm,
        loadSearchForm,
        getScoreLists,
        getScore,
        addScore,
        setFavScore,
        saveScore,
        exportScore
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseScoreService {
    loadAddForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    loadAddBarsForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    loadSearchForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    getScore: (id: number, printMode?: boolean) => Promise<Score>;
    getScoreLists: (query?: Record<string, string>) => Promise<QueryResult<Score>>;
    addScore: (form: FormData) => Promise<Score>;
    setFavScore: (id: number) => Promise<ServerResponse<null, { isFavorite: boolean }>>;
    saveScore: (id: number, datas: ScorePage[]) => Promise<{ success: boolean }>;
    exportScore: (id: number) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
