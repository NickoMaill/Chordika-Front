// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { ScoreBar, ScoreBarGroup } from '~/models/Score';
import { Grid } from '@mui/material';
import stylesResources from '~/resources/stylesResources';
import AppRightClickMenu from '../common/AppRightClickMenu';
import { MenuListOptionType } from '../common/AppMenuList';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBar({ group, bar, isFirstBar, isLastBar }: IEditorBar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const menuItem: MenuListOptionType[] = [
        { label: 'Modifier la mesure', onClick: () => console.log('modifier'), icon: "EditRounded" },
        { label: 'Supprimer la mesure', onClick: () => console.log('supprimer'), icon: "DeleteRounded" },
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
                className={`position-relative z-0 b1t-1t-1t-1t cursor-pointer`}
                component={'div'}
                sx={{
                    width: group.title ? '145px' : '170px',
                    height: '95px',
                    backgroundColor: stylesResources.theme.palette.background.default,
                    border: `3px solid #000000`,
                    borderLeftWidth: isFirstBar(bar.index, group.maxLength) ? '3px' : '0px',
                    borderRadius: isFirstBar(bar.index, group.maxLength) ? '5px 0px 0px 5px' : isLastBar(bar.index, group.maxLength) ? '0px 5px 5px 0px' : '0px',
                }}
            >
                <></>
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
}
// #enderegion IPROPS --> //////////////////////////////////
