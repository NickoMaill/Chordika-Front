import { JSX, ReactNode, useEffect } from 'react';
import AppCard from '../common/AppCard';
import { Bold, Regular } from '../common/Text';
import { Link } from 'react-router-dom';
import useNavigation from '~/hooks/useNavigation';
import { Trans } from 'react-i18next';
import { doneProgress } from '~/helpers/progressHelper';
import NotFound from '~/pages/NotFound';
import useResources from '~/hooks/useResources';
import NoServer from './NoServer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBox from '../common/AppBox';
import Container from '@mui/material/Container';
import useAppContext from '~/context/appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function LayoutFallback({ children, backUrl }: ILayoutFallback): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { isNoAccess, setIsNoAccess, setNotFound, notFound, noServer, boxOptions } = useAppContext();
    const { navigateByPath, goBack } = useNavigation();
    const { translate } = useResources();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleNavigate = (): void => {
        if (backUrl && backUrl !== '') {
            navigateByPath(backUrl);
        } else {
            goBack();
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (isNoAccess) {
            setIsNoAccess(false);
        }
        if (notFound) {
            setNotFound(false);
        }
    }, [location]);
    useEffect(() => {
        if (isNoAccess || notFound) doneProgress();
    }, [isNoAccess]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {isNoAccess ? (
                <Box display="flex" alignItems="center" flexDirection="column">
                    <AppCard title="Accès Refusé" sx={{ width: '100%' }} icon="Lock">
                        <Bold>
                            <Trans i18nKey="error.noAccess.intro" />
                        </Bold>
                        <br />
                        <Regular>
                            <Trans i18nKey="error.noAccess.please" />
                        </Regular>
                        <br />
                        <Regular>
                            <Trans i18nKey="error.noAccess.expired" />
                        </Regular>
                        <Regular>
                            <Trans components={{ link: <Link to="/login" /> }} i18nKey="error.noAccess.login" />
                        </Regular>
                    </AppCard>
                    <Button onClick={handleNavigate} sx={{ width: 'fit-content' }} variant="contained" color="secondary">
                        {translate('common.back')}
                    </Button>
                </Box>
            ) : notFound ? (
                <NotFound />
            ) : noServer ? (
                <NoServer />
            ) : boxOptions ? (
                <Container>
                    <AppBox title={boxOptions.title} text={boxOptions.text} icon={boxOptions.icon} showBack={boxOptions.showBack} />
                </Container>
            ) : (
                children
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ILayoutFallback {
    children?: ReactNode;
    backUrl?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
