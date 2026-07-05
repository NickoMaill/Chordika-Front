// #region IMPORTS -> /////////////////////////////////////
import React, { JSX } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import CenterProvider from '~/context/CenterProvider';
import SearchProvider from '~/context/SearchProvider';
import AuthMiddleware from '~/router/AuthMiddleware';
import Box from '@mui/material/Box';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function CenterLayout(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { tableName } = useParams();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AuthMiddleware>
            <CenterProvider key={tableName}>
                <SearchProvider>
                    <Box className="container-fluid">
                        <Outlet />
                    </Box>
                </SearchProvider>
            </CenterProvider>
        </AuthMiddleware>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
