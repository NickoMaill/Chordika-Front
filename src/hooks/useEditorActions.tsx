// #region IMPORTS -> /////////////////////////////////////
import useEditorContext from '~/context/EditorContext';
import useScoreService from './services/useScoreService';
import { BarsPayload, BarTypeEnum, Score, ScoreBarGroup, ScoreBarPayload, ScorePage, ScorePageText } from '~/models/Score';
import useToast from './useToast';
import appTool from '~/helpers/appTool';
import useNavigation from './useNavigation';
import { MusicSymbol } from '~/types/musicSymbol';
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
    const replaceFirstPage = (page: ScorePage): Score => ({
        ...state.data,
        content: state.data.content.map((item, index) => (index === 0 ? page : item)),
    });

    const loadScore = async (id: number): Promise<void> => {
        dispatch({ type: 'SET_DATA_LOADING_ON' });
        await getScore(id, pathname.endsWith('/print'))
            .then((res) => {
                if (res) {
                    dispatch({ type: 'SET_DATA', payload: res });
                }
            })
            .finally(() => dispatch({ type: 'SET_DATA_LOADING_OFF' }));
    };

    const addBars = (obj: BarsPayload): void => {
        const page = state.data.content[0];
        const lastBar = page.content.last();
        const bars: ScoreBarGroup = {
            id: appTool.uuidv4(),
            title: obj.title,
            index: page.content.length,
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
                content: [{ chordName: null, id: appTool.uuidv4(), index: 0, symbols: null }],
                isTheEnd: false,
            })),
        };

        const updatedPage = {
            ...page,
            content: [...page.content, bars],
        };
        dispatch({
            type: 'SET_DATA',
            payload: replaceFirstPage(updatedPage),
        });
        dispatch({ type: 'IS_FORM_BAR_OPEN', payload: false });
    };

    const updateGroup = async (index: number, obj: BarsPayload): Promise<void> => {
        const page = state.data.content[0];
        const nb = Number(obj.nb);
        const perLines = Number(obj.perLines);
        const currentGroup = page.content[index];
        let content = currentGroup.content;

        if (nb !== currentGroup.content.length) {
            if (nb < currentGroup.content.length) {
                content = currentGroup.content.slice(0, nb);
            } else if (nb > currentGroup.content.length) {
                const diff = nb - currentGroup.content.length;
                const newBars = [...Array(diff).keys()].map((d, i) => {
                    return {
                        type: BarTypeEnum.B4T,
                        id: appTool.uuidv4(),
                        index: currentGroup.content.length + i,
                        timeBar: {
                            nume: Number(state.data.nume),
                            denom: Number(state.data.denom),
                        },
                        tempo: state.data.tempo,
                        key: state.data.key,
                        mesureNumber: null,
                        isRepeat: false,
                        content: [{ chordName: null, id: appTool.uuidv4(), index: 0, symbols: null }],
                        isTheEnd: false,
                    };
                });
                content = [...currentGroup.content, ...newBars].sort((a, b) => a.index - b.index);
            }
        }

        const updatedGroup = {
            ...currentGroup,
            title: obj.title,
            maxLength: perLines,
            content,
        };
        const updatedPage = {
            ...page,
            content: page.content.map((group, groupIndex) => (groupIndex === index ? updatedGroup : group)),
        };
        dispatch({
            type: 'SET_DATA',
            payload: replaceFirstPage(updatedPage),
        });
    };

    const deleteGroup = (index: number): void => {
        const page = state.data.content[0];
        const groups = page.content.filter((group) => group.index !== index).map((group, groupIndex) => ({ ...group, index: groupIndex }));
        const updatedPage = {
            ...page,
            content: groups,
        };
        dispatch({
            type: 'SET_DATA',
            payload: replaceFirstPage(updatedPage),
        });
    };

    const saveContentInfo = async (score: Score = state.data): Promise<{ success: boolean }> => {
        const form = new FormData();
        form.append('userId', String(score.userId));
        form.append('title', String(score.title));
        form.append('composer', String(score.composer));
        form.append('isFavorite', String(score.isFavorite));
        form.append('timeSig', `${score.nume}-${score.denom}`);
        form.append('key', String(score.key));
        form.append('keyType', String(score.keyType));
        form.append('tempo', String(score.tempo));
        form.append('comment', String(score.comment));
        form.append('fontSize', String(score.fontSize));
        form.append('orientation', String(score.orientation));
        form.append('version', String(score.version ?? ''));
        return await saveScoreInfo(score.id, form);
    };
    const saveContent = async (): Promise<void> => {
        dispatch({ type: 'SET_SAVING_ON' });
        const score = state.data;
        try {
            const [content, info] = await Promise.all([saveScore(score.id, score.content), saveContentInfo(score)]);
            if (content.success && info.success) {
                success('Grille sauvegardée avec succès !');
            }
        } finally {
            dispatch({ type: 'SET_SAVING_OFF' });
        }
    };

    const updateBar = ({ gi, bi, data }: { gi: number; bi: number; data: ScoreBarPayload }): void => {
        const page = state.data.content[0];
        const group = page.content[gi];
        const bar = group.content[bi];
        const nbToCreate = data.type.split('-').length;
        const nb = bar.type.split('-').length;
        let content = bar.content;

        if (nbToCreate > nb) {
            const newContent = [...Array(nbToCreate - nb).keys()].map((_, index) => ({
                chordName: null,
                id: appTool.uuidv4(),
                index: bar.content.length + index,
                symbols: null,
            }));
            content = [...bar.content, ...newContent].sort((a, b) => a.index - b.index);
        } else if (nbToCreate < nb) {
            content = bar.content.slice(0, nbToCreate);
        }

        const updatedBar = {
            ...bar,
            type: data.type,
            isRepeatStart: data.repeat === "start",
            isRepeatEnd: data.repeat === "end",
            content,
        };
        const updatedGroup = {
            ...group,
            content: group.content.map((item, index) => (index === bi ? updatedBar : item)),
        };
        const updatedPage = {
            ...page,
            content: page.content.map((item, index) => (index === gi ? updatedGroup : item)),
        };

        dispatch({ type: 'SET_DATA', payload: replaceFirstPage(updatedPage) });
    };

    const updateChord = async ({ gi, bi, ci, c }: { gi: number; bi: number; ci: number; c: { chord?: string; symbol?: keyof typeof MusicSymbol | "" } }): Promise<void> => {
        const page = state.data.content[0];
        const group = page.content[gi];
        const bar = group.content[bi];
        const chord = { ...bar.content[ci] };
        if (c.chord || c.chord === "") {
            chord.chordName = (c.chord ?? '').trim() === '' ? null : c.chord.trim();
            chord.symbols = null;
        }
        if (c.symbol || c.symbol === "") {
            chord.symbols = c.symbol === "" ? null : c.symbol;
            chord.chordName = null;
        }
        const updatedBar = {
            ...bar,
            content: bar.content.map((item, index) => (index === ci ? chord : item)),
        };
        const updatedGroup = {
            ...group,
            content: group.content.map((item, index) => (index === bi ? updatedBar : item)),
        };
        const updatedPage = {
            ...page,
            content: page.content.map((item, index) => (index === gi ? updatedGroup : item)),
        };
        dispatch({ type: 'SET_DATA', payload: replaceFirstPage(updatedPage) });
    };

    const setFontSize = (fs: number): void => {
        dispatch({ type: 'SET_DATA', payload: { ...state.data, fontSize: fs } });
    };

    const addText = (text: string): void => {
        const page = state.data.content[0];
        const lastBar = page.content.last();

        const t: ScorePageText = {
            content: text,
            index: page.texts.length,
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
        const updatedPage = {
            ...page,
            texts: [...page.texts, t],
        };
        dispatch({ type: 'SET_DATA', payload: replaceFirstPage(updatedPage) });
    };

    const updateText = (text: string, index: number): void => {
        const page = state.data.content[0];
        const updatedPage = {
            ...page,
            texts: page.texts.map((item, itemIndex) => (itemIndex === index ? { ...item, content: text } : item)),
        };
        dispatch({ type: 'SET_DATA', payload: replaceFirstPage(updatedPage) });
    };

    const updateSizeText = (size: { width: number; height: number }, index: number): void => {
        const page = state.data.content[0];
        const updatedPage = {
            ...page,
            texts: page.texts.map((item, itemIndex) => (itemIndex === index ? { ...item, size } : item)),
        };
        dispatch({ type: 'SET_DATA', payload: replaceFirstPage(updatedPage) });
    };

    const handleClickOnPart = (type: 'bars' | 'bar' | 'chord', id: string): void => {
        if (state.currentSelected?.id === id) {
            dispatch({ type: 'SET_SELECTED', payload: null });
        } else {
            dispatch({ type: 'SET_SELECTED', payload: { type, id } });
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        loadScore,
        addBars,
        saveContent,
        saveContentInfo,
        updateGroup,
        deleteGroup,
        updateBar,
        updateChord,
        setFontSize,
        addText,
        updateText,
        updateSizeText,
        handleClickOnPart,
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
    saveContentInfo: (score?: Score) => Promise<{ success: boolean }>;
    updateBar: (payload: { gi: number; bi: number; data: ScoreBarPayload }) => void;
    updateChord: ({ gi, bi, ci, c }: { gi: number; bi: number; ci: number; c: { chord?: string; symbol: keyof typeof MusicSymbol } }) => Promise<void>;
    setFontSize: (fs: number) => void;
    addText: (text: string) => void;
    updateText: (text: string, index: number) => void;
    updateSizeText: (size: { width: number; height: number }, index: number) => void;
    handleClickOnPart: (type: 'bars' | 'bar' | 'chord', id: string) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
