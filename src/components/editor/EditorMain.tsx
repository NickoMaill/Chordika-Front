// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { JSX, lazy, useEffect, useMemo, useRef } from 'react';
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
import EditorFontSizeMenu from './EditorFontSizeMenu';
import EditorDrawer from './EditorDrawer';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorMain({ scoreId, isPrintMode }: { scoreId: number, isPrintMode: boolean }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const formRef = useRef<HTMLFormElement>(null);

    const menu: { id: string; title?: string; icon?: IconNameType; Component?: ({ key }: { key: number }) => JSX.Element }[] = useMemo(
        () => [
            {
                id: 'bars',
                title: 'Ajouter des Mesures',
                icon: 'MusicScore',
            },
            {
                id: 'text',
                title: 'Ajouter du texte',
                icon: 'EditNoteRounded',
            },
            {
                id: 'fontSize',
                Component: EditorFontSizeMenu,
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
                icon: 'FilePdf',
            },
        ],
        []
    );
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useEditorContext();
    const { loadScore, addBars, deleteGroup, saveContent, updateBar, updateGroup, addText, updateText, updateSizeText } = useEditorActions();
    const { openModal, closeModal } = useModal();
    const { exportScore } = useScoreService();

    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleDragStop = (type: string, index: number, groupId: number, position: { x: number; y: number }): void => {
        const page = state.data.content[0];
        let updatedPage = page;

        switch (type) {
            case 'bar':
                updatedPage = {
                    ...page,
                    content: page.content.map((group, groupIndex) => (groupIndex === index ? { ...group, position } : group)),
                };
                break;
            case 'text':
                updatedPage = {
                    ...page,
                    texts: page.texts.map((text, textIndex) => (textIndex === index ? { ...text, position } : text)),
                };
                break;
            default:
                return;
        }
        dispatch({
            type: 'SET_DATA',
            payload: {
                ...state.data,
                content: state.data.content.map((item, pageIndex) => (pageIndex === 0 ? updatedPage : item)),
            },
        });
    };

    const submitBars = (index?: number): void => {
        const formData = new FormData(formRef.current);
        const payload: BarsPayload = appTool.formToObj(formData) as BarsPayload;
        if (index !== undefined) {
            updateGroup(index, payload);
        } else {
            addBars(payload);
        }
        closeModal();
    };

    const submitText = (index?: number): void => {
        if (!formRef.current) return;
        const form = new FormData(formRef.current);
        const text = String(form.get('text'));
        if (index !== undefined) {
            updateText(text, index);
        } else {
            addText(text);
        }
        formRef.current = null;
        closeModal();
    };

    const handleMenuClick = (trigger: string, index?: number): void => {
        let modalContent: ModalOptions = null;
        const isEditing = index !== undefined;

        switch (trigger) {
            case 'bars':
                modalContent = {
                    title: `${isEditing ? 'Modifier' : 'Ajouter'} une section`,
                    content: <EditorGroupForm formRef={formRef} data={isEditing ? state.data.content[0].content.find((x) => x.index === index) : null} />,
                    modalActionOptions: {
                        modalActionLoading: false,
                        modalDismissLabel: 'Annuler',
                        modalAction: (): void => submitBars(index),
                        modalActionLabel: isEditing ? 'Modifier' : 'Ajouter',
                    },
                };
                openModal(modalContent);
                break;
            case 'text':
                modalContent = {
                    title: `${isEditing ? 'Modifier' : 'Ajouter'} du texte`,
                    content: <EditorTextForm formRef={formRef} value={isEditing ? (state.data.content[0].texts.find((x) => x.index === index)?.content ?? '') : ''} />,
                    size: 'lg',
                    modalActionOptions: {
                        modalActionLoading: false,
                        modalDismissLabel: 'Annuler',
                        modalAction: (): void => submitText(index),
                        modalActionLabel: isEditing ? 'Modifier' : 'Ajouter',
                    },
                };
                openModal(modalContent);
                break;
            case 'fontSize':
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
                exportScore(Number(scoreId)).finally(closeModal);
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
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'stretch',
            }}
        >
            <Helmet>
                <title>{state.data?.title ?? 'Chordika'}</title>
            </Helmet>
            <Container id="ChordEditorContainer">
                <ContentLayout isLoading={state.isDataLoading} title={null} showTitle={false}>
                    <Box component={'div'} id="toolbar" className="d-flex justify-content-between align-items-center">
                        <Box className="mb-2 d-flex">
                            {menu.map((m, i) => {
                                if (m.Component) {
                                    return <m.Component key={i} />;
                                }
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
                                <IconButton onClick={saveContent} loading={state.isDataSaving} className="me-2" outline="true">
                                    <AppIcon name={'Save'} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Divider />
                    <EditorDisplay
                        data={state.data}
                        onClickDeleteGroup={deleteGroup}
                        onClickEditGroup={(index) => handleMenuClick('bars', index)}
                        onClickEditText={(index) => handleMenuClick('text', index)}
                        onClickDeleteText={null}
                        onDragStop={handleDragStop}
                        onUpdateBar={updateBar}
                        onResizeText={(e, i) => updateSizeText(e, i)}
                    />
                </ContentLayout>
            </Container>
            {!isPrintMode && <EditorDrawer />}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
