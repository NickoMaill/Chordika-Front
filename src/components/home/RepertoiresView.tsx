// #region IMPORTS -> /////////////////////////////////////
import { JSX, useEffect, useState } from 'react';
import AppCard from '../common/AppCard';
import { Box, CircularProgress } from '@mui/material';
import { QueryResult } from '~/types/serverCoreType';
import { Repertoire } from '~/models/Repertoire';
import { Italic } from '../common/Text';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function RepertoiresView(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [repertoires, setRepertoires] = useState<QueryResult<Repertoire>>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const load = (): void => {};
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        load();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppCard title="Mes Repertoires" divider>
            {isLoading ? (
                <Box className="d-flex flex-column align-items-center justify-content-center p-3">
                    <CircularProgress size={50} />
                    <Italic className="fw-bold mt-3">Repertoires en cours de chargement...</Italic>
                </Box>
            ) : (
                <Box></Box>
            )}
        </AppCard>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// interface IRepertoiresView {}
// #enderegion IPROPS --> //////////////////////////////////
