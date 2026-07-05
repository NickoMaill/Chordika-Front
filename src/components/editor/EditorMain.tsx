// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { JSX, lazy, useEffect } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import EditorAddBars from '~/components/editor/EditorAddBars';
import useEditorContext from '~/context/EditorContext';
import EditorDisplay from './EditorDisplay';
import ContentLayout from '../layout/ContentLayout';
import useEditorActions from '~/hooks/useEditorActions';
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

export default function EditorMain({ id }: { id: number }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const EditorCtx = useEditorContext();
    const Actions = useEditorActions();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleMenuClick = (trigger: string): void => {
        switch (trigger) {
            case 'bars':
                EditorCtx.dispatch({ type: 'IS_FORM_BAR_OPEN', payload: true });
                break;
            default:
                return;
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        Actions.loadScore(id);
        return (): void => EditorCtx.dispatch({ type: 'RESET' });
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Container id="ChordEditorContainer">
            <ContentLayout isLoading={EditorCtx.state.isDataLoading} title="" showTitle={false}>
                <Box id="toolbar">
                    <Box className="mb-2 d-flex">
                        {menu.map((m, i) => {
                            if (m.id === 'divider') {
                                return <Divider key={i} flexItem className="me-2" orientation="vertical" />;
                            } else {
                                return (
                                    <Tooltip key={i} title={m.title}>
                                        <IconButton onClick={() => handleMenuClick(m.id)} className="me-2" outline="true">
                                            <AppIcon name={m.icon} />
                                        </IconButton>
                                    </Tooltip>
                                );
                            }
                        })}
                    </Box>
                    <Divider />
                </Box>
                <EditorDisplay data={EditorCtx.state.data} onClickDeleteGroup={Actions.deleteGroup} onClickEditBar={null} onClickEditGroup={null} />
                <EditorAddBars onSubmit={Actions.addBars} />
            </ContentLayout>
        </Container>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
