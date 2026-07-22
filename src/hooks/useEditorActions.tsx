// #region IMPORTS -> /////////////////////////////////////
import useEditorContext from '~/context/EditorContext';
import useScoreService from './services/useScoreService';
import { BarsPayload, BarTypeEnum, ScoreBarGroup, ScoreBarPayload } from '~/models/Score';
import useToast from './useToast';
import useDataTextService from './services/useDataTextService';
import appTool from '~/helpers/appTool';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useEditorActions(): IUseEditorActions {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useEditorContext();
    const ScoreService = useScoreService();
    const { success, error } = useToast();
    const { searchByCode } = useDataTextService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadScore = async (id: number): Promise<void> => {
        dispatch({ type: 'SET_DATA_LOADING_ON' });
        await ScoreService.getScore(id)
            .then((res) => {
                if (res) dispatch({ type: 'SET_DATA', payload: res });
            })
            .finally(() => dispatch({ type: 'SET_DATA_LOADING_OFF' }));
    };

    const addBars = (obj: BarsPayload): void => {
        const datas = state.data;
        const lastBar = datas.content[0].content.last();
        const bars: ScoreBarGroup = {
            id: appTool.uuidv4(),
            title: obj.title,
            index: datas.content[0].content.length,
            maxLength: obj.perLines === '' ? Number(obj.nb) : Number(obj.perLines),
            position: {
                x: 0,
                y: lastBar ? lastBar.position.y + 15 : 15,
            },
            content: [...Array(Number(obj.nb)).keys()].map((o, i) => ({
                id: appTool.uuidv4(),
                type: BarTypeEnum.B4T,
                index: i,
                timeBar: {
                    nume: Number(state.data.nume),
                    denom: Number(state.data.denom),
                },
                tempo: state.data.tempo,
                key: state.data.key,
                mesureNumber: null,
                isRepeat: false,
                content: [{ chordName: null, chordID: null, index: 0, symbols: null }],
                isTheEnd: false,
            })),
        };

        datas.content[0].content.push(bars);
        dispatch({
            type: 'SET_DATA',
            payload: datas,
        });
        dispatch({ type: 'IS_FORM_BAR_OPEN', payload: false });
    };

    const updateGroup = async (index: number, obj: BarsPayload): Promise<void> => {
        const datas = state.data;
        const nb = Number(obj.nb);
        datas.content[0].content[index].title = obj.title;
        datas.content[0].content[index].maxLength = Number(obj.perLines);
        if (nb !== datas.content[0].content.length) {
            if (nb < datas.content[0].content.length) {
                datas.content[0].content = datas.content[0].content.slice(0, nb - 1);
            } else if (nb > datas.content[0].content.length) {
                const diff = nb - datas.content[0].content.length;
                const newBars = [...Array(diff).keys()].map((d, i) => ({
                    type: BarTypeEnum.B4T,
                    id: appTool.uuidv4(),
                    index: i,
                    timeBar: {
                        nume: Number(datas.nume),
                        denom: Number(datas.denom),
                    },
                    tempo: datas.tempo,
                    key: datas.key,
                    mesureNumber: null,
                    isRepeat: false,
                    content: [{ chordName: null, chordID: null, index: 0, symbols: null }],
                    isTheEnd: false,
                }));
                datas.content[0].content[index].content = [...datas.content[0].content[index].content, ...newBars];
                dispatch({
                    type: 'SET_DATA',
                    payload: datas,
                });
            }
        }
    };

    const deleteGroup = (index: number): void => {
        const datas = state.data;
        datas.content[0].content = datas.content[0].content.filter((c) => c.index !== index);
        datas.content[0].content.forEach((c, i) => {
            c.index = i;
        });
        dispatch({
            type: 'SET_DATA',
            payload: datas,
        });
    };

    const saveContent = async (): Promise<void> => {
        const datas = state.data;
        await ScoreService.saveScore(datas.id, datas.content)
            .then((res) => {
                if (res.success) success('Grille sauvegardée avec succès !');
            })
            .finally(() => dispatch({ type: 'SET_DATA_LOADING_OFF' }));
    };

    const updateBar = ({ gi, bi, data }: { gi: number; bi: number; data: ScoreBarPayload }): void => {
        const datas = state.data;
        const nbToCreate = data.type.split('-').length;
        const nb = datas.content[0].content[gi].content[bi].type.split('-').length;
        if (nbToCreate !== nb) {
            const bar = datas.content[0].content[gi].content[bi];
            if (nbToCreate > nb) {
                const newContent = new Set(bar.content);
                let i = newContent.size;
                while (i < nbToCreate) {
                    newContent.add({ chordName: null, chordID: null, index: i, symbols: null });
                    i++;
                }
                bar.content = [...newContent];
            } else {
                bar.content = bar.content.slice(0, nbToCreate);
            }
            bar.content.sort((a, b) => a.index - b.index);
            datas.content[0].content[gi].content[bi] = bar;
        }
        datas.content[0].content[gi].content[bi].type = data.type;
        dispatch({ type: 'SET_DATA', payload: datas });
    };

    const updateChord = async ({ gi, bi, ci, c }: { gi: number; bi: number; ci: number; c: string }): Promise<void> => {
        const datas = state.data;
        const res = await searchByCode(c, '?type=chord');
        if (res.records.length !== 1) {
            error('Accord non valide');
            return;
        }
        const chord = datas.content[0].content[gi].content[bi].content[ci];
        chord.chordID = res.records[0].code;
        chord.chordName = res.records[0].description;
        datas.content[0].content[gi].content[bi].content[ci] = chord;
        dispatch({ type: 'SET_DATA', payload: datas });
    };
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
        updateBar,
        updateChord,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseEditorActions {
    loadScore: (id: number) => Promise<void>;
    addBars: (obj: { nb: string; perLines: string }) => void;
    deleteGroup: (index: number) => void;
    updateGroup: (index: number, obj: BarsPayload) => Promise<void>;
    saveContent: () => Promise<void>;
    updateBar: (payload: { gi: number; bi: number; data: ScoreBarPayload }) => void;
    updateChord: ({ gi, bi, ci, c }: { gi: number; bi: number; ci: number; c: string }) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
