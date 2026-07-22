// #region IMPORTS -> /////////////////////////////////////
import useServiceBase from '../useServiceBase';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import useService from '../useService';
import { QueryResult } from '~/types/serverCoreType';
import { Score, ScorePage } from '~/models/Score';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useScoreService(): IUseScoreService {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { asServicePromise } = useServiceBase();
    const Service = useService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadAddForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => Service.get('scores/form/add'));
        return form;
    };

    const loadAddBarsForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => Service.get('scores/form/bars'));
        return form;
    };

    const loadSearchForm = async (): Promise<FormMakerContentType<FormMakerPartEnum>[]> => {
        const form = await asServicePromise<FormMakerContentType<FormMakerPartEnum>[]>(() => Service.get('scores/form/search'));
        return form;
    };

    const getScoreLists = async (query?: Record<string, string>): Promise<QueryResult<Score>> => {
        let q = new URLSearchParams();
        if (query) {
            for (const key in query) {
                q.append(key, query[key]);
            }
        }
        const lists = await asServicePromise<QueryResult<Score>>(() => Service.get(`scores${q.size > 0 ? '?' + q.toString() : ''}`));
        return lists;
    };

    const getScore = async (id: number): Promise<Score> => {
        const score = await asServicePromise<Score[]>(() => Service.get(`scores/${id}`));
        if (score.length > 0) return score[0];
        return null;
    };

    const addScore = async (form: FormData): Promise<Score> => {
        const added = await asServicePromise<{ success: boolean; inserted: Score }>(() => Service.post('scores', null, form));
        return added.inserted;
    };

    const saveScore = async (id: number, datas: ScorePage[]): Promise<{ success: boolean }> => {
        const payload = { datas };
        const saved = await asServicePromise<{ success: boolean }>(() => Service.put(`scores/${id}/content`, payload));
        return saved;
    };

    const deleteScore = async (id: number): Promise<void> => {
        await asServicePromise<{ success: boolean }>(() => Service.del(`scores/${id}`));
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
        saveScore,
        deleteScore,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseScoreService {
    loadAddForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    loadAddBarsForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    loadSearchForm: () => Promise<FormMakerContentType<FormMakerPartEnum>[]>;
    getScore: (id: number) => Promise<Score>;
    getScoreLists: (query?: Record<string, string>) => Promise<QueryResult<Score>>;
    addScore: (form: FormData) => Promise<Score>;
    saveScore: (id: number, datas: ScorePage[]) => Promise<{ success: boolean }>;
    deleteScore: (id: number) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
