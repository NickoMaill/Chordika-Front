// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import EditorHeader from './EditorHeader';
import { Score, ScoreBar, ScoreBarPayload, ScoreOrientation } from '~/models/Score';
import { JSX, ReactNode, useRef, useState } from 'react';
import { Bold, Regular } from '../common/Text';
import Draggable from 'react-draggable';
import AppIcon from '../common/AppIcon';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import EditorBar from './EditorBar';
import useModal, { ModalOptions } from '~/hooks/useModal';
import EditorBarForm from './forms/EditorBarForm';
import appTool from '~/helpers/appTool';
import AppResizableElement from '../common/AppResizableElement';
import HTMLParser from '../common/HTMLParser';
import useEditorContext from '~/context/EditorContext';
import useEditorActions from '~/hooks/useEditorActions';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const isFirstBar = (i: number, perLines: number, total: number): boolean => {
    if (i === 0) return true;
    if (i % perLines === 0) return true;

    return false;
};

const isLastBar = (i: number, perLines: number, total: number): boolean => {
    // if (i === 0) return false;
    // if ((i + 1) % perLines === 0) return true;

    return i + 1 === total;
};

type IGroupDraggable = {
    dragger: string;
    parent: string;
    position: { x: number; y: number };
    onStop: (p: { x: number; y: number }) => void;
    children: ReactNode;
    axis: 'both' | 'none' | 'x' | 'y';
    className?: string;
};
// #endregion SINGLETON --> /////////////////////////////////

const GroupDraggable = ({ dragger, position, onStop, children, parent, axis, className }: IGroupDraggable): JSX.Element => {
    const nodeRef = useRef<HTMLDivElement>(null);
    return (
        <Draggable
            axis={axis}
            bounds={parent}
            nodeRef={nodeRef}
            handle={dragger}
            grid={[15, 15]}
            defaultClassName={className}
            scale={1}
            position={position}
            onStop={(_, data) => onStop({ x: data.x, y: data.y })}
        >
            <div ref={nodeRef}>{children}</div>
        </Draggable>
    );
};

export default function EditorDisplay({ data, onClickDeleteGroup, onClickEditGroup, onDragStop, onUpdateBar, onClickEditText, onClickDeleteText, onResizeText }: IEditor): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [focusedText, setFocusedText] = useState<number>(null);
    const barRef = useRef<HTMLFormElement>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { openModal, closeModal } = useModal();
    const { state, dispatch } = useEditorContext();
    const { handleClickOnPart } = useEditorActions();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    const handleDragStop = (type: string, index: number, groupId: number, position: { x: number; y: number }): void => {
        onDragStop(type, index, groupId, position);
    };

    const handleUpdateBar = (gi: number, bi: number, data?: ScoreBar): void => {
        const options: ModalOptions = {
            title: `Modifier mesure n°${gi}.${bi}`,
            content: <EditorBarForm data={data} ref={barRef} />,
            isLoading: false,
            modalActionOptions: {
                modalActionLabel: 'Modifier',
                modalAction: () => initUpdateBar(gi, bi),
                modalDismissLabel: 'Annuler',
                modalActionLoading: false,
            },
        };
        openModal(options);
    };

    const initUpdateBar = (gi: number, bi: number): void => {
        if (!barRef.current) return;
        const formData = new FormData(barRef.current);
        const obj = appTool.formToObj(formData);
        onUpdateBar({ gi, bi, data: obj as unknown as ScoreBarPayload });
        closeModal();
    };
    const handleDeleteBar = (gi: number, bi: number): void => {};
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box id="Editor" className="mt-3">
            {data &&
                /* Score Pages */
                data.content.map((page) => (
                    <Paper key={page.index} className={`editor-page position-relative editor-page-${data.orientation === ScoreOrientation.LANDSCAPE ? 'landscape' : 'portrait'}`} elevation={3}>
                        <Box className="position-relative h-100">
                            {/* HEADER */}
                            {page.index === 0 && <EditorHeader data={data} />}
                            <Box id={`content-page-${page.index}`} className="editor-page-content" sx={{ height: '100%' }}>
                                {/* Score Bar Groups */}
                                {page.content.map((g) => (
                                    <GroupDraggable
                                        key={g.id}
                                        parent={`#content-page-${page.index}`}
                                        dragger={`#dragger-${g.index}`}
                                        position={{ x: g.position?.x || 0, y: g.position?.y || 0 }}
                                        onStop={(p) => handleDragStop('bar', g.index, g.index, p)}
                                        axis="y"
                                    >
                                        <Grid container id={`score-groups-${g.index}`} direction={'row'} spacing={2} className="position-relative align-items-center" sx={{ width: '100%' }}>
                                            {/* Score Bars */}
                                            {g.title && (
                                                <Grid
                                                    size={1.3}
                                                    component={'div'}
                                                    className="cursor-pointer hover-el rounded d-flex align-items-center justify-content-center border"
                                                    sx={{ height: 'stretch' }}
                                                    onClick={() => handleClickOnPart('bars', g.id)}
                                                >
                                                    <Bold className="text-center">
                                                        <HTMLParser>{g.title.replaceAll(' ', '<br/>')}</HTMLParser>
                                                    </Bold>
                                                </Grid>
                                            )}
                                            <Grid size={g.title ? 10 : 12}>
                                                <Box
                                                    sx={{
                                                        display: 'grid',
                                                        width: 'fit-content',
                                                        gridTemplateColumns: [...new Array(g.maxLength).keys()].map((_) => '1fr').join(' '),
                                                        gap: 0,
                                                        border: state.currentSelected?.id === g.id ? '3px solid var(--mui-palette-primary-main)' : null,
                                                    }}
                                                    className="position-relative rounded"
                                                >
                                                    {g.content.map((b) => (
                                                        <EditorBar
                                                            key={b.id}
                                                            bar={b}
                                                            group={g}
                                                            isFirstBar={isFirstBar}
                                                            isLastBar={isLastBar}
                                                            onClickUpdate={() => handleUpdateBar(g.index, b.index, b)}
                                                            onClickDelete={() => handleDeleteBar(g.index, b.index)}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: 'calc(100% + 5mm)',
                                                    zIndex: 1000,
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                                className="group-actions d-flex flex-column"
                                            >
                                                <IconButton id={`dragger-${g.index}`} size="small" outline="true" className="dragger p-1 w-auto h-auto">
                                                    <AppIcon name="ControlCameraRounded" />
                                                </IconButton>
                                                <IconButton onClick={() => onClickEditGroup(g.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                    <AppIcon size="small" name="EditRounded" />
                                                </IconButton>
                                                <IconButton onClick={() => onClickDeleteGroup(g.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                    <AppIcon size="small" name="DeleteRounded" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </GroupDraggable>
                                ))}
                                {page.texts.map((t) => (
                                    <GroupDraggable
                                        key={`text-${t.index}`}
                                        parent={`#content-page-${page.index}`}
                                        dragger={`#dragger-text-${t.index}`}
                                        position={{ x: t.position?.x || 0, y: t.position?.y || 0 }}
                                        axis="both"
                                        className="w-fit-content"
                                        onStop={(p) => handleDragStop('text', t.index, 0, p)}
                                    >
                                        <AppResizableElement
                                            width={t.size?.width}
                                            height={t.size?.height}
                                            onResize={(w, h) => onResizeText({ width: w, height: h }, t.index)}
                                            onMouseOver={(e) => setFocusedText(e ? t.index : null)}
                                            className="position-relative p-2 rounded border-secondary border-2"
                                        >
                                            <Box component={'div'} rich-text-container="true">
                                                <HTMLParser>{decodeURIComponent(t.content)}</HTMLParser>
                                            </Box>
                                            <Box
                                                className={`group-actions position-absolute top-50 translate-middle d-flex flex-column end-0 ${focusedText === t.index ? '' : 'd-none'}`}
                                                sx={{ zIndex: 3 }}
                                            >
                                                <IconButton id={`dragger-text-${t.index}`} size="small" outline="true" className="dragger p-1 w-auto h-auto">
                                                    <AppIcon name="ControlCameraRounded" />
                                                </IconButton>
                                                <IconButton onClick={() => onClickEditText(t.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                    <AppIcon size="small" name="EditRounded" />
                                                </IconButton>
                                                <IconButton onClick={() => onClickDeleteText(t.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                    <AppIcon size="small" name="DeleteRounded" />
                                                </IconButton>
                                            </Box>
                                        </AppResizableElement>
                                    </GroupDraggable>
                                ))}
                            </Box>
                            <Box className="position-absolute bottom-0 start-0">
                                <Regular variant="caption">
                                    Powered by Chordika — Page {page.index + 1}/{data.content.length}
                                </Regular>
                            </Box>
                        </Box>
                    </Paper>
                ))}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditor {
    data: Score;
    onClickEditGroup: (index: number) => void;
    onClickDeleteGroup: (index: number) => void;
    onClickEditText: (index: number) => void;
    onClickDeleteText: (index: number) => void;
    onDragStop: (type: string, index: number, groupId: number, position: { x: number; y: number }) => void;
    onUpdateBar: (payload: { gi: number; bi: number; data: ScoreBarPayload }) => void;
    onResizeText: (e: { width: number; height: number }, index: number) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
