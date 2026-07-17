// #region IMPORTS -> /////////////////////////////////////
import useEditorContext from '~/context/EditorContext';
import useScoreService from './services/useScoreService';
import { BarsPayload, ScoreBarGroup } from '~/models/Score';
import useToast from './useToast';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useEditorActions(): IUseEditorActions {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const EditorCtx = useEditorContext();
    const ScoreService = useScoreService();
    const { success } = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadScore = async (id: number): Promise<void> => {
        EditorCtx.dispatch({ type: 'SET_DATA_LOADING_ON' });
        await ScoreService.getScore(id)
            .then((res) => {
                if (res) EditorCtx.dispatch({ type: 'SET_DATA', payload: res });
            })
            .finally(() => EditorCtx.dispatch({ type: 'SET_DATA_LOADING_OFF' }));
    };

    const addBars = (obj: BarsPayload): void => {
        const datas = EditorCtx.state.data;
        const bars: ScoreBarGroup = {
            title: obj.title,
            index: datas.content[0].content.length,
            maxLength: Number(obj.perLines),
            position: {
                x: 0,
                y: 0,
            },
            content: [...Array(Number(obj.nb)).keys()].map((o, i) => ({
                type: '1',
                index: i,
                timeBar: {
                    nume: Number(EditorCtx.state.data.nume),
                    denom: Number(EditorCtx.state.data.denom),
                },
                tempo: EditorCtx.state.data.tempo,
                key: EditorCtx.state.data.key,
                mesureNumber: null,
                isRepeat: false,
                content: [],
                isTheEnd: false,
            })),
        };

        datas.content[0].content.push(bars);

        EditorCtx.dispatch({
            type: 'SET_DATA',
            payload: datas,
        });
        EditorCtx.dispatch({ type: 'IS_FORM_BAR_OPEN', payload: false });
    };

    const updateGroup = async (index: number, obj: BarsPayload): Promise<void> => {
        const datas = EditorCtx.state.data;
        const nb = Number(obj.nb);
        datas.content[0].content[index].title = obj.title;
        datas.content[0].content[index].maxLength = Number(obj.perLines);
        if (nb !== datas.content[0].content.length) {
            if (nb < datas.content[0].content.length) {
                datas.content[0].content = datas.content[0].content.slice(0, nb - 1);
            } else if (nb > datas.content[0].content.length) {
                const diff = nb - datas.content[0].content.length;
                const newBars = [...Array(diff).keys()].map((d, i) => ({
                    type: '1',
                    index: i,
                    timeBar: {
                        nume: Number(datas.nume),
                        denom: Number(datas.denom),
                    },
                    tempo: datas.tempo,
                    key: datas.key,
                    mesureNumber: null,
                    isRepeat: false,
                    content: [],
                    isTheEnd: false,
                }));
                datas.content[0].content[index].content = [...datas.content[0].content[index].content, ...newBars];
                EditorCtx.dispatch({
                    type: 'SET_DATA',
                    payload: datas,
                });
            }
        }
    };

    const deleteGroup = (index: number): void => {
        const datas = EditorCtx.state.data;
        datas.content[0].content = datas.content[0].content.filter((c) => c.index !== index);
        datas.content[0].content.forEach((c, i) => {
            c.index = i;
        });
        EditorCtx.dispatch({
            type: 'SET_DATA',
            payload: datas,
        });
    };

    const saveContent = async (): Promise<void> => {
        const datas = EditorCtx.state.data;
        await ScoreService.saveScore(datas.id, datas.content)
            .then((res) => {
                if (res.success)  success("Grille sauvegardée avec succès !");
            })
            .finally(() => EditorCtx.dispatch({ type: 'SET_DATA_LOADING_OFF' }));
    }
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        loadScore,
        addBars,
        saveContent,
        updateGroup,
        deleteGroup,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseEditorActions {
    loadScore: (id: number) => Promise<void>;
    addBars: (obj: { nb: number; perLines: number }) => void;
    deleteGroup: (index: number) => void;
    updateGroup: (index: number, obj: BarsPayload) => Promise<void>;
    saveContent: () => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
