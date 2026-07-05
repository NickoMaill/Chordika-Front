// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import { JSX, ReactNode } from 'react';
import AppCard from './AppCard';
import { Regular } from './Text';
import { IconNameType } from './AppIcon';
import Button from '@mui/material/Button';
import useResources from '~/hooks/useResources';
import useNavigation from '~/hooks/useNavigation';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppBox({ title, text, icon, customBackUrl, showBack = true }: IAppBox): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { translate } = useResources();
    const { navigateByPath, goBack } = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <AppCard title={title as string} sx={{ width: '100%' }} icon={icon}>
                <Regular>{text}</Regular>
            </AppCard>
            {showBack && (
                <Button sx={{ width: 'fit-content' }} variant="contained" color="secondary" onClick={customBackUrl ? (): void => navigateByPath(customBackUrl) : (): void => goBack()}>
                    {translate('common.back')}
                </Button>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppBox {
    title: string;
    text: ReactNode;
    icon: IconNameType;
    showBack?: boolean;
    customBackUrl?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
