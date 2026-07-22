// #region IMPORTS -> /////////////////////////////////////
import { Grid } from '@mui/material';
import { JSX } from 'react';
import LastScoreUpdated from './LastScoreUpdated';
import HomeViewActions from './HomeViewActions';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function HomeView(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Grid container spacing={3}>
            <Grid size={{ lg: 9, xs: 12, md: 12 }}>
                <LastScoreUpdated />
            </Grid>
            <Grid size={{ lg: 3, xs: 12, md: 12 }}>
                <HomeViewActions />
            </Grid>
        </Grid>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
