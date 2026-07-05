import { JSX, useEffect } from 'react';
import AppCard from '~/components/common/AppCard';
import { Bold, Regular } from '~/components/common/Text';
import appTool from '~/helpers/appTool';
import useNavigation from '~/hooks/useNavigation';
import useResources from '~/hooks/useResources';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function NotFound(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Resources = useResources();
    const Nav = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        appTool.changeTitle(Resources.translate('error.notFound.title') as string);
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <AppCard title={Resources.translate('error.notFound.title') as string} sx={{ width: '100%' }} icon="SearchOffRounded">
                <Bold>{Resources.translate('error.notFound.intro')}</Bold>
                <br />
                <Regular>{Resources.translate('error.notFound.please')}</Regular>
                <br />
                <Regular>{Resources.translate('error.notFound.advise')}</Regular>
                <Regular>{Resources.translate('error.notFound.goBack')}</Regular>
            </AppCard>
            <Button sx={{ width: 'fit-content' }} variant="contained" color="secondary" onClick={() => Nav.goBack()}>
                {Resources.translate('common.back')}
            </Button>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
