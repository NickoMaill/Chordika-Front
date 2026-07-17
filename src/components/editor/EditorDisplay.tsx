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
import EditorBarForm from './EditorBarForm';
import appTool from '~/helpers/appTool';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const isFirstBar = (i: number, perLines: number): boolean => {
    if (i === 0) return true;
    if (i % perLines === 0) return true;

    return false;
};

const isLastBar = (i: number, perLines: number): boolean => {
    if (i === 0) return false;
    if ((i + 1) % perLines === 0) return true;

    return false;
};

type IGroupDraggable = {
    dragger: string;
    parent: string;
    position: { x: number; y: number };
    onStop: (p: { x: number; y: number }) => void;
    children: ReactNode;
};
// #endregion SINGLETON --> /////////////////////////////////

const GroupDraggable = ({ dragger, position, onStop, children, parent }: IGroupDraggable): JSX.Element => {
    const nodeRef = useRef<HTMLDivElement>(null);
    return (
        <Draggable axis="y" bounds={parent} nodeRef={nodeRef} handle={dragger} grid={[15, 15]} scale={1} position={position} onStop={(_, data) => onStop({ x: data.x, y: data.y })}>
            <div ref={nodeRef}>{children}</div>
        </Draggable>
    );
};

export default function EditorDisplay({ data, onClickDeleteGroup, onClickEditGroup, onDragStop, onUpdateBar }: IEditor): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});
    const [isModalSubmitLoading, setisModalSubmitLoading] = useState<boolean>(false);
    const barRef = useRef<HTMLFormElement>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { openModal, closeModal,  } = useModal();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    const handleDragStop = (index: number, groupId: number, position: { x: number; y: number }): void => {
        setPositions((prev) => ({ ...prev, [groupId]: position }));
        onDragStop(index, groupId, position);
    };

    const handleUpdateBar = (gi: number, bi: number, data?: ScoreBar): void => {
        const options: ModalOptions = {
            title: `Modifier mesure n°${gi}.${bi}`,
            content: <EditorBarForm data={data} ref={barRef} />,
            isLoading: false,
            modalActionOptions: {
                modalActionLabel: "Modifier",
                modalAction: () => initUpdateBar(gi, bi),
                modalDismissLabel: "Annuler",
                modalActionLoading: isModalSubmitLoading
            } 
        }
        openModal(options)
    }

    const initUpdateBar = (gi: number, bi: number): void => {
        if (!barRef.current) return;
        const formData = new FormData(barRef.current)
        const obj = appTool.formToObj(formData);
        onUpdateBar(gi, bi, obj as unknown as ScoreBarPayload);
        closeModal();
    }

    const handleDeleteBar = (gi: number, bi: number): void => {
        
    }
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box id="Editor" className="mt-3">
            {data &&
                /* Score Pages */
                data.content.map((page) => (
                    <Paper key={page.index} className={`p-3 bg-transparent editor-page-${data.orientation === ScoreOrientation.LANDSCAPE ? 'landscape' : 'portrait'}`} elevation={3}>
                        <Box className="position-relative h-100">
                            {/* HEADER */}
                            {page.index === 0 && <EditorHeader data={data} />}
                            <Box id={`content-page-${page.index}`} className="p-1" sx={{ height: '100%' }}>
                                {/* Score Bar Groups */}
                                {page.content.map((g) => (
                                    <GroupDraggable
                                        key={g.index}
                                        parent={`#content-page-${page.index}`}
                                        dragger={`#dragger-${g.index}`}
                                        position={{ x: g.position?.x || 0, y: g.position?.y || 0 }}
                                        onStop={(p) => handleDragStop(g.index, g.index, p)}
                                    >
                                        <Grid container id={`score-groups-${g.index}`} direction={'row'} spacing={2} alignItems={'center'} className="position-relative" sx={{ width: '100%' }}>
                                            {/* Score Bars */}
                                            {g.title && (
                                                <Grid sx={{ width: '70px' }} size={2}>
                                                    <Bold className="text-end">{g.title}</Bold>
                                                </Grid>
                                            )}
                                            <Grid size={g.title ? 10 : 12}>
                                                <Grid container className="position-relative">
                                                    {g.content.map((b) => (
                                                        <EditorBar 
                                                            key={b.index} 
                                                            bar={b} 
                                                            group={g} 
                                                            isFirstBar={isFirstBar} 
                                                            isLastBar={isLastBar} 
                                                            onClickUpdate={() => handleUpdateBar(g.index, b.index, b)} 
                                                            onClickDelete={() => handleDeleteBar(g.index, b.index)} 
                                                        />
                                                    ))}
                                                </Grid>
                                            </Grid>
                                            <Box id="groupActions" className="position-absolute top-50 translate-middle d-flex flex-column" sx={{ left: '100% !important' }}>
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
                            </Box>
                            <Box className="position-absolute bottom-0">
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
    onDragStop: (index: number, groupId: number, position: { x: number; y: number }) => void;
    onUpdateBar: (gi: number, bi: number, data: ScoreBarPayload) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
