// #region IMPORTS -> /////////////////////////////////////
import useEditorContext from '~/context/EditorContext';
import useScoreService from './services/useScoreService';
import { BarsPayload, BarTypeEnum, ScoreBarGroup, ScoreBarPayload, ScorePageText } from '~/models/Score';
import useToast from './useToast';
import appTool from '~/helpers/appTool';
import useNavigation from './useNavigation';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useEditorActions(): IUseEditorActions {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useEditorContext();
    const { saveScore, getScore, saveScoreInfo } = useScoreService();
    const { success } = useToast();
    const { pathname } = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadScore = async (id: number): Promise<void> => {
        dispatch({ type: 'SET_DATA_LOADING_ON' });
        await getScore(id, pathname.endsWith('/print'))
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
        const perLines = Number(obj.perLines);
        datas.content[0].content[index].title = obj.title;
        datas.content[0].content[index].maxLength = perLines;
        const group = datas.content[0].content[index];
        if (nb !== group.content.length) {
            if (nb < group.content.length) {
                group.content = group.content.slice(0, nb);
            } else if (nb > group.content.length) {
                const diff = nb - group.content.length;
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
                group.content = [...group.content, ...newBars];
            }
        }
        datas.content[0].content[index] = group;
        dispatch({
            type: 'SET_DATA',
            payload: datas,
        });
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
        dispatch({ type: 'SET_SAVING_ON' });
        const datas = state.data;
        const form = new FormData();
        form.append('userId', String(state.data.userId));
        form.append('title', String(state.data.title));
        form.append('composer', String(state.data.composer));
        form.append('isFavorite', String(state.data.isFavorite));
        form.append('timeSig', `${state.data.nume}-${state.data.denom}`);
        form.append('key', String(state.data.key));
        form.append('tempo', String(state.data.tempo));
        form.append('comment', String(state.data.comment));
        form.append('fontSize', String(state.data.fontSize));
        form.append('orientation', String(state.data.orientation));
        form.append('version', String(state.data.version));
        try {
            const [content, info] = await Promise.all([saveScore(datas.id, datas.content), saveScoreInfo(datas.id, form)]);
            if (content.success && info.success) {
                success('Grille sauvegardée avec succès !');
            }
        } finally {
            dispatch({ type: 'SET_SAVING_OFF' });
        }
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
        // const res = await searchByCode(c, '?type=chord');
        // if (c.length < 1) {
        //     error('Accord non valide');
        //     return;
        // }
        const chord = datas.content[0].content[gi].content[bi].content[ci];
        chord.chordID = null;
        chord.chordName = (c ?? '').trim() === '' ? null : c.trim();
        datas.content[0].content[gi].content[bi].content[ci] = chord;
        dispatch({ type: 'SET_DATA', payload: datas });
    };

    const setFontSize = (fs: number): void => {
        const d = state.data;
        d.fontSize = fs;
        dispatch({ type: 'SET_DATA', payload: d });
    };

    const addText = (text: string): void => {
        const datas = state.data;
        const lastBar = datas.content[0].content.last();

        const t: ScorePageText = {
            content: text,
            index: datas.content[0].texts.length,
            position: {
                x: 0,
                y: lastBar ? lastBar.position.y + 15 : 15,
            },
            parentPage: 0,
            size: {
                width: 50,
                height: 150,
            },
        };
        datas.content[0].texts.push(t);
        dispatch({ type: 'SET_DATA', payload: datas });
    };

    const updateText = (text: string, index: number): void => {
        const datas = state.data;
        datas.content[0].texts[index].content = text;
        console.log(text, index);
        dispatch({ type: 'SET_DATA', payload: datas });
    };

    const updateSizeText = (size: { width: number; height: number }, index: number): void => {
        const datas = state.data;
        datas.content[0].texts[index].size = size;
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
        setFontSize,
        addText,
        updateText,
        updateSizeText,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseEditorActions {
    loadScore: (id: number) => Promise<void>;
    addBars: (obj: BarsPayload) => void;
    deleteGroup: (index: number) => void;
    updateGroup: (index: number, obj: BarsPayload) => Promise<void>;
    saveContent: () => Promise<void>;
    updateBar: (payload: { gi: number; bi: number; data: ScoreBarPayload }) => void;
    updateChord: ({ gi, bi, ci, c }: { gi: number; bi: number; ci: number; c: string }) => Promise<void>;
    setFontSize: (fs: number) => void;
    addText: (text: string) => void;
    updateText: (text: string, index: number) => void;
    updateSizeText: (size: { width: number; height: number }, index: number) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
