// #region IMPORTS -> /////////////////////////////////////
import { JSX, useState } from 'react';
import { ScoreBar, ScoreBarGroup } from '~/models/Score';
import { Box, Grid } from '@mui/material';
import AppRightClickMenu from '../common/AppRightClickMenu';
import { MenuListOptionType } from '../common/AppMenuList';
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
                    className={`position-relative z-0 b${bar.type ? bar.type + " bar-pattern" : ""}`}
                    component={'div'}
                    sx={(theme) => ({
                        width: group.title ? '148px' : '170px',
                        height: '90px',
                        backgroundColor: theme.palette.mode === "dark" ? "background.paper" : null,
                        backgroundImage: "var(--Paper-overlay)",
                        border: `3px solid`,
                        borderColor: "text.primary",
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

function BarContent({ bar }): JSX.Element {
    const [elementEditing, setElementEditing] = useState<number>(null);
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
                fontSize: "0.7rem"
            }}
        >
            {/* <Box className="hover-el rounded cursor-pointer" sx={{ padding: "2px", gridColumn: 2, gridRow: 1, alignSelf: 'start', justifySelf: 'center' }}>Em</Box>
            <Box className="hover-el rounded cursor-pointer" sx={{ padding: "2px", gridColumn: 1, gridRow: 2, justifySelf: 'start' }}>Em7/D</Box>
            <Box className="hover-el rounded cursor-pointer" sx={{ padding: "2px", gridColumn: 3, gridRow: 2, justifySelf: 'end' }}>Esus7/D</Box>
            <Box className="hover-el rounded cursor-pointer" sx={{ padding: "2px", gridColumn: 2, gridRow: 3, alignSelf: 'end', justifySelf: 'center' }}>Em</Box> */}
        </Box>
    );
}

interface IBarContent {
    bar: ScoreBar;
}