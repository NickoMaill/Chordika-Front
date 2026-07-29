// #region IMPORTS -> /////////////////////////////////////
import { FocusEvent, JSX, ReactNode, useEffect, useState } from 'react';
import { BarTypeEnum, ScoreBar, ScoreBarGroup } from '~/models/Score';
import { Box, IconButton } from '@mui/material';
import AppRightClickMenu from '../common/AppRightClickMenu';
import { MenuListOptionType } from '../common/AppMenuList';
import { grey } from '@mui/material/colors';
import { Bold } from '../common/Text';
import AppIcon from '../common/AppIcon';
import useEditorContext from '~/context/EditorContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const fontSize = 17;
const btnIconSize = 17;
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBar({ group, bar, isFirstBar, isLastBar, onClickDelete, onClickUpdate, onUpdateCord }: IEditorBar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const menuItem: MenuListOptionType[] = [
        { label: 'Modifier la mesure', onClick: onClickUpdate, icon: 'EditRounded' },
        { label: 'Supprimer la mesure', onClick: onClickDelete, icon: 'DeleteRounded' },
    ];
    // top-left | top-right | bottom-right | bottom-left
    const getRadius = (): string => {
        const total = group.content.length;
        const perLine = group.maxLength;
        const index = bar.index;

        const row = Math.floor(index / perLine);
        const column = index % perLine;
        const lastRowIndex = Math.ceil(total / perLine) - 1;

        const isFirstRow = row === 0;
        const isLastRow = row === lastRowIndex;
        const isFirstColumn = column === 0;
        const isLastColumn = column === perLine - 1 || index === total - 1;

        const topLeft = isFirstRow && isFirstColumn ? '5px' : '0px';
        const topRight = isFirstRow && isLastColumn ? '5px' : '0px';
        const bottomRight = isLastRow && isLastColumn ? '5px' : '0px';
        const bottomLeft = isLastRow && isFirstColumn ? '5px' : '0px';

        return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppRightClickMenu menuList={menuItem}>
            <Box
                key={bar.index}
                className={`position-relative z-0 b${bar.type ? bar.type + ' bar-pattern' : ''}`}
                component={'div'}
                sx={(theme) => ({
                    width: group.title ? '148px' : '170px',
                    height: '85px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : null,
                    backgroundImage: 'var(--Paper-overlay)',
                    border: `3px solid`,
                    borderColor: 'text.primary',
                    borderTop: bar.index + 1 > group.maxLength ? 'none' : null,
                    borderLeftWidth: isFirstBar(bar.index, group.maxLength, group.content.length) ? '3px' : '0px',
                    borderRadius: getRadius(),
                })}
            >
                <BarContent bar={bar} onUpdateChord={onUpdateCord} />
            </Box>
        </AppRightClickMenu>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorBar {
    group: ScoreBarGroup;
    bar: ScoreBar;
    isFirstBar: (index: number, maxLength: number, total: number) => boolean;
    isLastBar: (index: number, maxLength: number, total: number) => boolean;
    onClickUpdate: () => void;
    onClickDelete: () => void;
    onUpdateCord: (ci: number, chord: string) => void;
}
// #enderegion IPROPS --> //////////////////////////////////

function BarContent({ bar, onUpdateChord }: IBarContent): JSX.Element {
    const [elementEditing, setElementEditing] = useState<number | null>(null);
    const [chordValue, setChordValue] = useState<{ ci: number; chord: string }>(null);
    const { state } = useEditorContext();

    const handleDoubleClick = (index: number): void => {
        setElementEditing(index);
    };

    const handleChordChange = (ci: number, c: string): void => {
        setChordValue({ ci, chord: c });
    };

    const handleValidate = (e: FocusEvent<HTMLInputElement, Element>): void => {
        console.log(e.relatedTarget);
        if (e.relatedTarget?.id === 'symbols' || e.relatedTarget?.id === 'chordField') return;
        if (elementEditing === null) {
            return;
        }
        setElementEditing(null);
    };
    const handleCancel = (): void => {
        setElementEditing(null);
    };

    useEffect(() => {
        if (chordValue) {
            onUpdateChord(chordValue.ci, (chordValue.chord ?? '')?.trim());
            setChordValue(null);
            handleCancel();
        }
    }, [chordValue]);

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
                py: 0,
            }}
        >
            {bar.content.map((x, i) => {
                let col = 1;
                let row = 2;
                let justify: 'start' | 'end' | 'center' = 'start';
                let align: 'start' | 'end' | 'center' = 'start';

                switch (bar.type) {
                    case BarTypeEnum.B1T_1T_1T_1T:
                        switch (x.index) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                justify = 'center';
                                align = 'start';
                                break;
                            case 2:
                                col = 2;
                                row = 3;
                                justify = 'center';
                                align = 'end';
                                break;
                            case 3:
                                col = 3;
                                row = 2;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_1T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 1;
                                justify = 'center';
                                align = 'center';
                                break;
                            case 2:
                                col = 3;
                                row = 3;
                                justify = 'center';
                                align = 'center';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_1T_2T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 2:
                                col = 3;
                                row = 3;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_2T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 1;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 2:
                                col = 3;
                                row = 2;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B1T_3T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 2;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B2T_1T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 1;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 2;
                                row = 3;
                                justify = 'end';
                                align = 'end';
                                break;
                            case 2:
                                col = 3;
                                row = 2;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B2T_2T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 1;
                                justify = 'start';
                                align = 'center';
                                break;
                            case 1:
                                col = 3;
                                row = 3;
                                justify = 'end';
                                align = 'center';
                                break;
                        }
                        break;

                    case BarTypeEnum.B3T_1T:
                        switch (i) {
                            case 0:
                                col = 1;
                                row = 2;
                                justify = 'start';
                                align = 'start';
                                break;
                            case 1:
                                col = 3;
                                row = 2;
                                justify = 'end';
                                align = 'end';
                                break;
                        }
                        break;

                    case BarTypeEnum.B4T:
                        col = 2;
                        row = 2;
                        justify = 'center';
                        align = 'center';
                        break;
                }

                const isEditing = elementEditing === x.index;

                return (
                    <BarContentPart
                        key={x.index}
                        index={x.index}
                        col={col}
                        row={row}
                        justify={justify}
                        align={align}
                        fontSize={state.data.fontSize}
                        onSpaceBarPress={() => handleDoubleClick(x.index)}
                        onDoubleClick={() => handleDoubleClick(x.index)}
                    >
                        <Bold
                            component="span"
                            className={`rounded ${isEditing ? 'd-flex justify-content-end' : ''} text-center align-middle bar-content`}
                            fontSize={`${state.data.fontSize}px`}
                            lineHeight={1}
                            sx={{
                                backgroundColor: !x.chordName && !x.symbols ? grey[400] : null,
                                display: 'block',
                                minWidth: isEditing ? '50px' : `${state.data.fontSize}px`,
                                minHeight: `${state.data.fontSize}px`,
                                visibility: isEditing ? 'hidden' : 'visible',
                            }}
                        >
                            {x.symbols ? <></> : x.chordName}
                        </Bold>
                        {isEditing && (
                            <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '50px' }}>
                                <AppRightClickMenu menuList={[]}>
                                    <input
                                        autoFocus
                                        type="text"
                                        id="chordField"
                                        style={{ width: '100%' }}
                                        onBlur={handleValidate}
                                        onClick={(e) => e.stopPropagation()}
                                        defaultValue={x.chordName}
                                        onDoubleClick={(e) => e.stopPropagation()}
                                        maxLength={20}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                handleCancel();
                                            }
                                            if (e.code === 'Enter') {
                                                handleChordChange(x.index, (e.target as HTMLInputElement)?.value);
                                            }
                                        }}
                                    />
                                </AppRightClickMenu>
                            </div>
                        )}
                    </BarContentPart>
                );
            })}
        </Box>
    );
}

function BarContentPart({ index, col, row, justify, align, children, onDoubleClick, onSpaceBarPress, fontSize }: IBarContentPart): JSX.Element {
    return (
        <Box
            className="hover-el rounded cursor-pointer position-relative"
            component="div"
            tabIndex={index}
            onKeyDown={(e) => {
                if (e.code === 'Space') {
                    e.stopPropagation();
                    onSpaceBarPress();
                }
            }}
            onDoubleClick={onDoubleClick}
            sx={{ minWidth: `${fontSize}px`, minHeight: `${fontSize}px`, padding: '2px', gridColumn: col, gridRow: row, alignSelf: align, justifySelf: justify }}
        >
            {children}
        </Box>
    );
}
interface IBarContentPart {
    index: number;
    col: number;
    row: number;
    justify: 'start' | 'end' | 'center';
    align: 'start' | 'end' | 'center';
    children: ReactNode;
    onDoubleClick: () => void;
    onSpaceBarPress: () => void;
    fontSize: number;
}
interface IBarContent {
    bar: ScoreBar;
    onUpdateChord: (ci: number, c: string) => void;
}
