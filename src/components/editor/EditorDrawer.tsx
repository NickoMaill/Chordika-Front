// #region IMPORTS -> /////////////////////////////////////
import { Box, CircularProgress, Drawer, Toolbar } from '@mui/material';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEditorContext from '~/context/EditorContext';
import AppCard from '../common/AppCard';
import FormMaker, { FormMakerChange } from '../formMaker/FormMaker';
import { FormMakerPartEnum, FormMakerType, SelectOptionsType } from '~/types/FormMakerCoreTypes';
import { GenericActionEnum } from '~/types/centerType';
import { BarsPayload, BarTypeEnum, Score, ScoreBar, ScoreBarContent, ScoreBarGroup, ScoreBarPayload, ScorePayload } from '~/models/Score';
import useDataTextService from '~/hooks/services/useDataTextService';
import useEditorActions from '~/hooks/useEditorActions';
import useToast from '~/hooks/useToast';
import EditorBarForm from './forms/EditorBarForm';
import EditorGroupForm from './forms/EditorGroupForm';
import EditorChordForm from './forms/EditorChordForm';
import { MusicSymbol } from '~/types/musicSymbol';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const drawerWidth = 400;
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorDrawer(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [timesSigs, setTimesSigs] = useState<SelectOptionsType[]>([]);
    const [keys, setKeys] = useState<SelectOptionsType[]>([]);
    const [isDataTextLoading, setIsDataTextLoading] = useState<boolean>(true);
    const [isInfoSubmitting, setIsInfoSubmitting] = useState<boolean>(false);

    const timeout = useRef<ReturnType<typeof setTimeout>>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useEditorContext();
    const { search } = useDataTextService();
    const { saveContentInfo, updateBar, updateGroup, updateChord } = useEditorActions();
    const { success } = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadDataTexts = (): void => {
        search('', '?type=key,timeSig&limit=1000')
            .then((res) => {
                if (res) {
                    setTimesSigs(
                        res.records
                            .filter((r) => r.type === 'timeSig')
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((r) => ({ value: r.code, label: r.description }))
                    );
                    setKeys(
                        res.records
                            .filter((r) => r.type === 'key')
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((r) => ({ value: r.description, label: r.description }))
                    );
                }
            })
            .finally(() => setIsDataTextLoading(false));
    };
    const handleSubmitInfo = (payload: ScorePayload): void => {
        const timeSig = payload.timeSig.split('-');
        const data: Score = {
            ...state.data,
            title: payload.title,
            composer: payload.composer,
            version: payload?.version || null,
            nume: timeSig[0],
            denom: timeSig[1],
            key: payload.key,
            keyType: payload.keyType,
            tempo: payload.tempo,
        };

        saveContentInfo(data)
            .then((res) => {
                if (res.success) {
                    dispatch({ type: 'SET_DATA', payload: data });
                    success('Information sauvegardée avec succès');
                }
            })
            .finally(() => setIsInfoSubmitting(false));
    };
    const getCardLabel = (): string => {
        switch (state.currentSelected?.type) {
            case 'chord':
                return 'Accord sélectionné';
            case 'bar':
                return 'Mesure sélectionnée';
            case 'bars':
                return 'Groupe sélectionné';
        }
    };

    const getPart = (type: 'bar' | 'bars' | 'chord', id: string): { gi: number; bi: number; ci: number; data: ScoreBar | ScoreBarGroup | ScoreBarContent } => {
        let part: { gi: number; bi: number; ci: number; data: ScoreBar | ScoreBarGroup | ScoreBarContent } = { gi: null, bi: null, ci: null, data: null };
        // Search Groups
        const groups = state.data.content[0].content;
        for (let g = 0; g < groups.length; g++) {
            if (part.data) break;
            const group = groups[g];
            if (type === 'bars') {
                if (group.id === id) {
                    part.data = group;
                    part.gi = group.index;
                }
            } else {
                // Search Bar
                const bars = group.content;
                for (let b = 0; b < bars.length; b++) {
                    if (part.data) break;
                    const bar = bars[b];
                    if (type === 'bar') {
                        if (bar.id === id) {
                            part.data = bar;
                            part.gi = group.index;
                            part.bi = bar.index;
                        }
                    } else {
                        // Search Chord
                        const chords = bar.content;
                        for (let c = 0; c < chords.length; c++) {
                            if (part.data) break;
                            const chord = chords[c];
                            if (chord.id === id) {
                                part.data = chord;
                                part.bi = bar.index;
                                part.ci = chord.index;
                                part.gi = group.index;
                            }
                        }
                    }
                }
            }
        }
        return part;
    };

    const handleChangeBar = (e: FormMakerChange, gi: number, bi: number): void => {
        const bar = state.data.content[0].content[gi].content[bi];
        const payload: ScoreBarPayload = { type: bar.type, repeat: bar.isRepeatStart ? 'start' : bar.isRepeatEnd ? 'end' : null };
        updateBar({ gi, bi, data: { ...payload, [e.id]: e.value } });
    };
    const handleChangeGroup = (e: FormMakerChange, gi: number): void => {
        if (timeout.current) clearTimeout(timeout.current);
        const data = state.data.content[0].content[gi];
        const payload: BarsPayload = {
            title: data.title,
            nb: String(data.content.length),
            perLines: String(data.maxLength),
        };
        if (e.id === 'nb' && e.value === '') return;
        if (e.id === 'nb') {
            timeout.current = setTimeout(() => {
                updateGroup(gi, { ...payload, [e.id]: e.value });
            }, 350);
        } else {
            updateGroup(gi, { ...payload, [e.id]: e.value });
        }
    };

    const handleChangeChord = (e: FormMakerChange, gi: number, bi: number, ci: number): void => {
        const payload = { chord: null, symbol: null };
        if (e.id === 'chordName') {
            payload.chord = e.value;
            payload.symbol = null;
        }
        if (e.id === 'symbol') {
            payload.symbol = e.value as keyof typeof MusicSymbol;
            payload.chord = null;
        }
        updateChord({ gi, bi, ci, c: payload });
    };

    const forms = useCallback((): JSX.Element => {
        const founded = getPart(state.currentSelected?.type, state.currentSelected?.id);
        switch (state.currentSelected.type) {
            case 'bars':
                return <EditorGroupForm data={state.data.content[0].content[founded.gi]} onChange={(e) => handleChangeGroup(e, founded.gi)} />;
            case 'bar':
                return <EditorBarForm data={state.data.content[0].content[founded.gi].content[founded.bi]} onChange={(e) => handleChangeBar(e, founded.gi, founded.bi)} />;
            case 'chord':
                return (
                    <EditorChordForm
                        data={state.data.content[0].content[founded.gi].content[founded.bi].content[founded.ci]}
                        onChange={(e) => handleChangeChord(e, founded.gi, founded.bi, founded.ci)}
                    />
                );
        }
    }, [state.data, state.currentSelected]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        loadDataTexts();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Drawer
            component={'aside'}
            variant="permanent"
            anchor="right"
            id="EditorDrawer"
            sx={{
                flexShrink: 0,
                width: drawerWidth,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Box>
                {state.currentSelected && (
                    <AppCard title={getCardLabel()} className="m-3" sx={{ bgcolor: 'background.default' }} divider>
                        {forms()}
                    </AppCard>
                )}
                <AppCard title={'Info. Grille'} icon="InfoRounded" className="m-3" sx={{ bgcolor: 'background.default' }} divider>
                    {isDataTextLoading ? (
                        <Box className="d-flex justify-content-center m-3">
                            <CircularProgress size={50} />
                        </Box>
                    ) : (
                        <ScoreMiniForm values={state.data} timeSigs={timesSigs} keys={keys} onSubmit={handleSubmitInfo} isSubmitting={isInfoSubmitting} />
                    )}
                </AppCard>
            </Box>
        </Drawer>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function ScoreMiniForm({ values, timeSigs, keys, isSubmitting, onSubmit }: IScoreMiniForm): JSX.Element {
    const struct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo(
        () => [
            {
                title: null,
                type: FormMakerPartEnum.SEARCH,
                content: [
                    {
                        id: 'title',
                        label: 'Titre',
                        index: 1,
                        size: 12,
                        required: true,
                        type: 'text',
                        autoComplete: 'off',
                    },
                    {
                        id: 'composer',
                        label: 'Artiste',
                        index: 1,
                        size: 12,
                        type: 'text',
                        autoComplete: 'off',
                    },
                    {
                        id: 'version',
                        label: 'Version',
                        index: 1,
                        size: 12,
                        type: 'text',
                        autoComplete: 'off',
                    },
                    {
                        id: 'timeSig',
                        label: 'Métrique',
                        index: 1,
                        size: 6,
                        type: 'select',
                        required: true,
                        value: `${values?.nume}-${values?.denom}`,
                        selectOptions: timeSigs,
                    },
                    {
                        id: 'tempo',
                        label: 'Tempo (BPM)',
                        index: 2,
                        size: 6,
                        type: 'number',
                        required: true,
                    },
                    {
                        id: 'key',
                        label: 'Tonalité',
                        index: 1,
                        size: 6,
                        type: 'select',
                        required: true,
                        selectOptions: keys,
                    },
                    {
                        id: 'keyType',
                        label: 'Mode',
                        index: 2,
                        size: 6,
                        type: 'select',
                        required: true,
                        selectOptions: [
                            { value: 'Maj', label: 'Maj' },
                            { value: 'Min', label: 'Min' },
                        ],
                    },
                ],
            },
        ],
        [values, timeSigs, keys]
    );
    return (
        <Box>
            <FormMaker
                outputType="JSON"
                onSubmit={onSubmit}
                isSubmitLoading={isSubmitting}
                structure={struct}
                data={values}
                showBackPress={false}
                action={GenericActionEnum.UPDATE}
                grammar="Informations"
            />
        </Box>
    );
}
// #region IPROPS -->  /////////////////////////////////////
interface IScoreMiniForm {
    values: Score;
    timeSigs: SelectOptionsType[];
    keys: SelectOptionsType[];
    onSubmit: (p: ScorePayload) => void;
    isSubmitting: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
