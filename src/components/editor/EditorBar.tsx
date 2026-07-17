// #region IMPORTS -> /////////////////////////////////////
import { JSX, ReactNode, useState } from 'react';
import { BarTypeEnum, ScoreBar, ScoreBarGroup } from '~/models/Score';
import { Box, Grid } from '@mui/material';
import AppRightClickMenu from '../common/AppRightClickMenu';
import { MenuListOptionType } from '../common/AppMenuList';
import { grey } from '@mui/material/colors';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBar({ group, bar, isFirstBar, isLastBar, onClickDelete, onClickUpdate }: IEditorBar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const menuItem: MenuListOptionType[] = [
        { label: 'Modifier la mesure', onClick: onClickUpdate, icon: 'EditRounded' },
        { label: 'Supprimer la mesure', onClick: onClickDelete, icon: 'DeleteRounded' },
    ];
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppRightClickMenu menuList={menuItem}>
            <Grid
                key={bar.index}
                size={12}
                className={`position-relative z-0 b${bar.type ? bar.type + ' bar-pattern' : ''}`}
                component={'div'}
                sx={(theme) => ({
                    width: group.title ? '148px' : '170px',
                    height: '100px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : null,
                    backgroundImage: 'var(--Paper-overlay)',
                    border: `3px solid`,
                    borderColor: 'text.primary',
                    borderLeftWidth: isFirstBar(bar.index, group.maxLength) ? '3px' : '0px',
                    borderRadius: isFirstBar(bar.index, group.maxLength) ? '5px 0px 0px 5px' : isLastBar(bar.index, group.maxLength) ? '0px 5px 5px 0px' : '0px',
                })}
            >
                <BarContent bar={bar} />
            </Grid>
        </AppRightClickMenu>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorBar {
    group: ScoreBarGroup;
    bar: ScoreBar;
    isFirstBar: (index: number, maxLength: number) => boolean;
    isLastBar: (index: number, maxLength: number) => boolean;
    onClickUpdate: () => void;
    onClickDelete: () => void;
}
// #enderegion IPROPS --> //////////////////////////////////

function BarContent({ bar }: IBarContent): JSX.Element {
    const [elementEditing, setElementEditing] = useState<number | null>(null);
    const [editedChord, setEditedChord] = useState('');

    const handleDoubleClick = (index: number, chordName: string): void => {
        setElementEditing(index);
        setEditedChord(chordName);
    };

    const handleValidate = (): void => {
        if (elementEditing === null) {
            return;
        }

        // Mettre ici la mise à jour réelle de l'accord.
        // Exemple :
        // updateChord(elementEditing, editedChord);

        setElementEditing(null);
    };

    const handleCancel = (): void => {
        setElementEditing(null);
        setEditedChord('');
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gridTemplateRows: '1fr auto 1fr',
                alignItems: 'center',
                px: 0.75,
                py: 0.25,
                fontSize: '0.7rem',
            }}
        >
            {bar.content.map((x, i) => {
                let col = 1;
                let row = 2;
                let position: 'start' | 'end' | 'center' = 'start';

                switch (bar.type) {
                    case BarTypeEnum.B1T_1T_1T_1T:
                        switch (x.index) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                position = 'start';
                                break;
                            case 2:
                                col = 2;
                                row = 3;
                                position = 'end';
                                break;
                            case 3:
                                col = 3;
                                row = 2;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_1T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 1;
                                position = 'center';
                                break;
                            case 2:
                                col = 3;
                                row = 3;
                                position = 'center';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_1T_2T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                position = 'start';
                                break;
                            case 2:
                                col = 3;
                                row = 3;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_2T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                position = 'start';
                                break;
                            case 2:
                                col = 3;
                                row = 2;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_3T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 2;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B2T_1T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 1;
                                position = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 3;
                                position = 'end';
                                break;
                            case 2:
                                col = 3;
                                row = 2;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B2T_2T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 1;
                                position = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 3;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B3T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                position = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 2;
                                position = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B4T:
                        col = 2;
                        row = 2;
                        position = 'center';
                        break;
                }

                const isEditing = elementEditing === x.index;

                return (
                    <BarContentPart key={x.index} col={col} row={row} position={position} onDoubleClick={() => handleDoubleClick(x.index, x.chordName)}>
                        <span style={{ visibility: isEditing ? 'hidden' : 'visible' }}>{x.chordName}</span>
                        {isEditing && (
                            <input
                                autoFocus
                                type="text"
                                value={editedChord}
                                style={{ width: '45px', position: 'absolute', inset: 0 }}
                                onChange={(event) => setEditedChord(event.target.value)}
                                onBlur={handleValidate}
                                onClick={(event) => event.stopPropagation()}
                                onDoubleClick={(event) => event.stopPropagation()}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.currentTarget.blur();
                                    }

                                    if (event.key === 'Escape') {
                                        handleCancel();
                                    }
                                }}
                            />
                        )}
                    </BarContentPart>
                );
            })}
        </Box>
    );
}

function BarContentPart({ col, row, position, children, onDoubleClick }: IBarContentPart): JSX.Element {
    return (
        <Box className="hover-el rounded cursor-pointer position-relative" component={"div"} onDoubleClick={onDoubleClick} sx={{ backgroundColor: !children ? grey[400] : null, minWidth: "20px", minHeight: "20px", padding: '2px', gridColumn: col, gridRow: row, alignSelf: position, justifySelf: position }}>
            {children}
        </Box>
    )
}
interface IBarContentPart {
    col: number;
    row: number;
    position: "start" | "end" | "center";
    children: ReactNode;
    onDoubleClick: () => void;
}
interface IBarContent {
    bar: ScoreBar;
}
