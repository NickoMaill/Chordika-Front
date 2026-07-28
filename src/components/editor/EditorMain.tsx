// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { JSX, lazy, useEffect, useRef, useState } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import useEditorContext from '~/context/EditorContext';
import EditorDisplay from './EditorDisplay';
import ContentLayout from '../layout/ContentLayout';
import useEditorActions from '~/hooks/useEditorActions';
import useModal, { ModalOptions } from '~/hooks/useModal';
import { BarsPayload } from '~/models/Score';
import appTool from '~/helpers/appTool';
import EditorGroupForm from '~/components/editor/forms/EditorGroupForm';
import EditorTextForm from './forms/EditorTextForm';
import useScoreService from '~/hooks/services/useScoreService';
import { Helmet } from 'react-helmet';
import AppProgressBar from '../common/AppProgressBar';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const menu: { id: string; title?: string; icon?: IconNameType }[] = [
    {
        id: 'bars',
        title: 'Ajouter des Mesures',
        icon: 'Staves',
    },
    {
        id: 'text',
        title: 'Ajouter du texte',
        icon: 'TextFieldsRounded',
    },
    {
        id: 'symbols',
        title: 'Ajouter un symbole',
        icon: 'Segno',
    },
    { id: 'divider' },
    {
        id: 'lyrics',
        title: 'Ajouter des paroles',
        icon: 'Microphone',
    },
    {
        id: 'export',
        title: 'Exporter',
        icon: 'IosShareRounded',
    },
];
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorMain({ scoreId }: { scoreId: number }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const formRef = useRef<HTMLFormElement>(null);
    const [isFormSubmitLoading, setIsFormSubmitLoading] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useEditorContext();
    const { loadScore, addBars, deleteGroup, saveContent, updateBar, updateChord, updateGroup } = useEditorActions();
    const { openModal, closeModal } = useModal();
    const { exportScore } = useScoreService();

    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleDragStop = (index: number, groupId: number, position: { x: number; y: number }): void => {
        const datas = state.data;
        datas.content[0].content[index].position = position;
        dispatch({ type: 'SET_DATA', payload: datas });
    };

    const submitBars = (index: string): void => {
        const formData = new FormData(formRef.current);
        const payload: BarsPayload = appTool.formToObj(formData) as BarsPayload;
        if (index) {
            updateGroup(Number(index), payload);
        } else {
            addBars(payload);
        }
        closeModal();
    };

    const handleMenuClick = (trigger: string, id?: string): void => {
        let modalContent: ModalOptions = null;
        console.log(trigger, id);
        switch (trigger) {
            case 'bars':
                modalContent = {
                    title: `${id ? 'Modifier' : 'Ajouter'} une section`,
                    content: <EditorGroupForm formRef={formRef} data={id ? state.data.content[0].content.find((x) => x.index === Number(id)) : null} />,
                    modalActionOptions: {
                        modalActionLoading: false,
                        modalDismissLabel: 'Annuler',
                        modalAction: (): void => submitBars(id),
                        modalActionLabel: id ? 'Modifier' : 'Ajouter',
                    },
                };
                openModal(modalContent);
                break;
            case 'text':
                modalContent = {
                    title: `${id ? 'Modifier' : 'Ajouter'} du texte`,
                    content: <EditorTextForm formRef={formRef} value={''} />,
                    modalActionOptions: {
                        modalActionLoading: false,
                        modalDismissLabel: 'Annuler',
                        modalAction: (): void => submitBars(id),
                        modalActionLabel: id ? 'Modifier' : 'Ajouter',
                    },
                };
                openModal(modalContent);
                break;
            case 'export':
                modalContent = {
                    title: `Export en cours`,
                    content: (
                        <Box>
                            <AppProgressBar percent={100} alwaysStripped animate />
                        </Box>
                    ),
                    modalActionOptions: {
                        modalActionLoading: false,
                        modalDismissLabel: 'Annuler',
                        modalAction: null,
                        modalActionLabel: null,
                    },
                };
                openModal(modalContent);
                exportScore(Number(scoreId))
                .finally(closeModal);
                break;
            default:
                return;
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        loadScore(scoreId);
        return (): void => dispatch({ type: 'RESET' });
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <Helmet>
                <title>{state.data?.title ?? 'Chordika'}</title>
            </Helmet>
            <Container id="ChordEditorContainer">
                <ContentLayout isLoading={state.isDataLoading} title="" showTitle={false}>
                    <Box component={'div'} id="toolbar" className="d-flex justify-content-between align-items-center">
                        <Box className="mb-2 d-flex">
                            {menu.map((m, i) => {
                                if (m.id === 'divider') {
                                    return <Divider key={i} flexItem className="me-2" orientation="vertical" />;
                                } else {
                                    return (
                                        <Tooltip key={i} title={m.title}>
                                            <IconButton onClick={() => handleMenuClick(m.id)} id={m.id} className="me-2" outline="true">
                                                <AppIcon name={m.icon} />
                                            </IconButton>
                                        </Tooltip>
                                    );
                                }
                            })}
                        </Box>
                        <Box>
                            <Tooltip title={'Sauvegarder les modifications'}>
                                <IconButton onClick={saveContent} className="me-2" outline="true">
                                    <AppIcon name={'Save'} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Divider />
                    <EditorDisplay
                        data={state.data}
                        onClickDeleteGroup={deleteGroup}
                        onClickEditGroup={(id) => handleMenuClick('bars', id.toString())}
                        onDragStop={handleDragStop}
                        onUpdateBar={updateBar}
                        onUpdateChord={updateChord}
                    />
                </ContentLayout>
            </Container>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
