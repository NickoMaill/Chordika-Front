// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import AppCard from '../common/AppCard';
import AppButtonGroup, { ButtonGroupOptionsType } from '../common/AppButtonGroup';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function HomeViewActions(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const options: ButtonGroupOptionsType[] = [
        { label: 'Créer une grille', icon: 'AddRounded', iconPosition: 'left', href: "/center/scores/new" },
        { label: 'Créer un repertoire', icon: 'FolderOpenRounded', iconPosition: 'left', href: '/center/repertoires/new' },
        { label: 'Afficher vos favoris', icon: 'StarRounded', iconPosition: 'left' },
        { label: 'Importer une grille', icon: 'DownloadRounded', iconPosition: 'left', disabled: true },
    ];
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppCard title="Action rapides" divider>
            <AppButtonGroup options={options} orientation="vertical" />
        </AppCard>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
