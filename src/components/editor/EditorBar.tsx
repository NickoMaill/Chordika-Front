// #region IMPORTS -> /////////////////////////////////////
import { JSX, ReactNode } from 'react';
import { BarTypeEnum, ScoreBar, ScoreBarGroup } from '~/models/Score';
import { Box } from '@mui/material';
import AppRightClickMenu from '../common/AppRightClickMenu';
import { MenuListOptionType } from '../common/AppMenuList';
import { grey } from '@mui/material/colors';
import { Bold } from '../common/Text';
import useEditorContext from '~/context/EditorContext';
import useEditorActions from '~/hooks/useEditorActions';
import { MusicGlyph } from '~/components/music';
import RepeatStart from '~/assets/svg/scoreSymbols/repeat-start.svg?react';
import RepeatEnd from '~/assets/svg/scoreSymbols/repeat-end.svg?react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBar({ group, bar, isFirstBar, onClickDelete, onClickUpdate }: IEditorBar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { state } = useEditorContext();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { handleClickOnPart } = useEditorActions();
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
                onClick={() => handleClickOnPart('bar', bar.id)}
                component={'div'}
                sx={(theme) => {
                    const isSelected = state.currentSelected?.id === bar.id;
                    const palette = (theme.vars || theme).palette;
                    const paperColor = palette.background.paper;
                    const selectedColor = palette.primary.main;

                    return {
                        width: group.title ? '160px' : '170px',
                        height: '85px',
                        boxSizing: 'border-box',

                        border: `3px solid`,

                        borderTop: bar.index + 1 > group.maxLength ? 'none' : undefined,
                        borderLeftWidth: isFirstBar(bar.index, group.maxLength, group.content.length) ? '3px' : '0px',

                        borderRadius: getRadius(),
                        padding: isSelected ? '3px' : 0,
                        backgroundColor: paperColor,
                        backgroundImage: isSelected
                            ? `
                                var(--Paper-overlay, linear-gradient(transparent, transparent)),
                                linear-gradient(${paperColor}, ${paperColor}),
                                linear-gradient(${selectedColor}, ${selectedColor})`
                            : 'var(--Paper-overlay)',

                        backgroundClip: isSelected ? 'content-box, content-box, padding-box' : undefined,

                        backgroundOrigin: isSelected ? 'content-box, content-box, padding-box' : undefined,
                    };
                }}
            >
                {bar.isRepeatStart && (
                    <Box className="position-absolute start-0" sx={{ zIndex: 3 }}>
                        <RepeatStart width={null} height={'85px'} />
                    </Box>
                )}
                {bar.isRepeatEnd && (
                    <Box className="position-absolute end-0" sx={{ zIndex: 3 }}>
                        <RepeatEnd width={null} height={'85px'} />
                    </Box>
                )}
                <BarContent bar={bar} />
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
}
// #enderegion IPROPS --> //////////////////////////////////

function BarContent({ bar }: IBarContent): JSX.Element {
    const { state } = useEditorContext();
    const { handleClickOnPart } = useEditorActions();

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
                let symbolsCoef = 5;

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
                        symbolsCoef = 20;
                        break;
                }
                const fontSize = state.data.fontSize + (x.symbols ? symbolsCoef : 0);

                return (
                    <BarContentPart
                        key={x.index}
                        index={x.index}
                        col={col}
                        row={row}
                        justify={justify}
                        align={align}
                        fontSize={state.data.fontSize}
                        isSelected={state.currentSelected?.id === x.id}
                        onClick={() => handleClickOnPart('chord', x.id)}
                        onFocus={null}
                    >
                        {x.symbols ? (
                            <Box
                                component="span"
                                sx={{
                                    display: 'block',
                                    position: 'relative',
                                    width: `${state.data.fontSize}px`,
                                    height: `${state.data.fontSize}px`,
                                    overflow: 'visible',
                                }}
                            >
                                <MusicGlyph
                                    symbol={x.symbols}
                                    fontSize={`${fontSize}px`}
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        whiteSpace: 'nowrap',
                                    }}
                                />
                            </Box>
                        ) : (
                            <Bold
                                component="span"
                                className="rounded text-center align-middle"
                                sx={{
                                    backgroundColor: !x.chordName ? grey[400] : null,
                                    display: 'block',
                                    minWidth: `${state.data.fontSize}px`,
                                    minHeight: `${state.data.fontSize}px`,
                                    fontSize: `${state.data.fontSize}px`,
                                    lineHeight: 1,
                                }}
                            >
                                {x.chordName}
                            </Bold>
                        )}
                    </BarContentPart>
                );
            })}
        </Box>
    );
}

function BarContentPart({ index, col, row, justify, align, children, onClick, onFocus, fontSize, isSelected }: IBarContentPart): JSX.Element {
    return (
        <Box
            className="rounded hover-el cursor-pointer position-relative"
            component="div"
            tabIndex={index + 1}
            onFocus={onFocus}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            sx={(theme) => ({
                zIndex: 3,
                minWidth: `${fontSize}px`,
                minHeight: `${fontSize}px`,
                padding: '2px',
                gridColumn: col,
                gridRow: row,
                alignSelf: align,
                justifySelf: justify,
                border: isSelected ? `solid 3px ${theme.palette.primary.main}` : null,
            })}
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
    onClick: () => void;
    onFocus: () => void;
    fontSize: number;
    isSelected: boolean;
}
interface IBarContent {
    bar: ScoreBar;
}
