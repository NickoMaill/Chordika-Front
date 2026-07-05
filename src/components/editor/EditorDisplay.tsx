// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import EditorHeader from './EditorHeader';
import { Score, ScoreOrientation } from '~/models/Score';
import { JSX, ReactNode, useRef, useState } from 'react';
import { Bold, Regular } from '../common/Text';
import Draggable from 'react-draggable';
import AppIcon from '../common/AppIcon';
import IconButton from '@mui/material/IconButton';
import stylesResources from '~/resources/stylesResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const isFirstBar = (i: number, perLines: number): boolean => {
    if (i === 0) return true;
    if (i % perLines === 0) return true;

    return false;
};
// #endregion SINGLETON --> /////////////////////////////////

const GroupDraggable = ({ id, position, onStop, children, parent }: { id: number; parent: string; position: { x: number; y: number }; onStop: (p: { x: number; y: number }) => void; children: ReactNode }): JSX.Element => {
    const nodeRef = useRef<HTMLDivElement>(null);
    return (
        <Draggable axis="y" bounds={"parent"} nodeRef={nodeRef} handle="#dragger" grid={[1, 1]} scale={1} position={position} onStop={(e, data) => onStop({ x: data.x, y: data.y })}>
            <div ref={nodeRef}>{children}</div>
        </Draggable>
    );
};

export default function EditorDisplay({ data, onClickDeleteGroup, onClickEditBar, onClickEditGroup }: IEditor): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [editDisplayerIndex, setEditDisplayerIndex] = useState<{ i: number; groupId: number }>({ i: -1, groupId: -1 });
    const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleMouseEnter = (i: number, groupId: number): void => {
        setEditDisplayerIndex({ i, groupId });
    };

    const resetMouseEnter = (): void => {
        setEditDisplayerIndex({ i: -1, groupId: -1 });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box id="Editor" className="mt-3">
            {data && (
                <>
                    {/* Score Pages */}
                    {data.content.map((page) => (
                        <Paper key={page.index} className={`bg-transparent p-3 editor-page-${data.orientation === ScoreOrientation.LANDSCAPE ? 'landscape' : 'portrait'}`} elevation={3}>
                            <Box className="position-relative h-100">
                                {/* HEADER */}
                                {page.index === 0 && <EditorHeader data={data} />}
                                <Box id={`content-page-${page.index}`} className="p-1" sx={{ height: '100%' }}>
                                    {/* Score Bar Groups */}
                                    {page.content.map((g) => (
                                        <GroupDraggable key={g.index} parent={`content-page-${page.index}`} id={g.index} position={positions[g.index] || { x: 0, y: 0 }} onStop={(p) => setPositions((prev) => ({ ...prev, [g.index]: p }))}>
                                            <Box id={`score-groups-${g.index}`} className="d-flex position-relative justify-content-start align-items-center" sx={{ width: '97%' }}>
                                                {/* Score Bars */}
                                                {g.title && (
                                                    <Box sx={{ width: '90px' }}>
                                                        <Bold className="m">{g.title}</Bold>
                                                    </Box>
                                                )}
                                                <Box className="d-flex position-relative justify-content-center align-items-center flex-wrap">
                                                    {g.content.map((b) => (
                                                        <Box key={b.index} className={`position-relative border-3 z-0 border-dark ${isFirstBar(b.index, g.maxLength) ? 'border' : 'border border-start-0'}`} sx={{ width: g.title ? '150px' : '170px', height: '100px' }}>
                                                            <Box
                                                                onMouseEnter={() => handleMouseEnter(b.index, g.index)}
                                                                onMouseLeave={resetMouseEnter}
                                                                component={'div'}
                                                                sx={{ backgroundColor: stylesResources.theme.palette.grey[100] }}
                                                                className={`w-100 h-100 d-flex align-items-center justify-content-center z-2 bar-edit position-absolute animate__animated ${editDisplayerIndex.i === b.index && editDisplayerIndex.groupId === g.index ? 'animate__fadeIn' : 'animate__fadeOut'}`}
                                                            >
                                                                <IconButton onClick={() => onClickEditBar(b.index, g.index)}>
                                                                    <AppIcon name="EditRounded" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                                <Box id="groupActions" className="position-absolute top-50 translate-middle d-flex flex-column" sx={{ left: '103% !important' }}>
                                                    <IconButton id="dragger" size="small" outline="true" className="dragger p-1 w-auto h-auto">
                                                        <AppIcon name="ControlCameraRounded" />
                                                    </IconButton>
                                                    <IconButton onClick={() => onClickEditGroup(g.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                        <AppIcon size="small" name="EditRounded" />
                                                    </IconButton>
                                                    <IconButton onClick={() => onClickDeleteGroup(g.index)} size="small" outline="true" className="p-1 w-auto h-auto">
                                                        <AppIcon size="small" name="DeleteRounded" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </GroupDraggable>
                                    ))}
                                </Box>
                                <Box id="poweredBy" className="position-absolute bottom-0">
                                    <Regular variant="caption">Powered by Chordika</Regular>
                                </Box>
                                <Box className="page-footer">
                                    <Regular variant="caption">
                                        Powered by Chordika — Page {page.index + 1}/{data.content.length}
                                    </Regular>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditor {
    data: Score;
    onClickEditGroup: (index: number) => void;
    onClickDeleteGroup: (index: number) => void;
    onClickEditBar: (index: number, groupId: number) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
