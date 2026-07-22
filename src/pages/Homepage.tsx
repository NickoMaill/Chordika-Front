import { JSX, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import useSessionService from '~/hooks/services/useSessionService';
import SplashBg from '~/components/layout/SplashBg';
import ContentLayout from '~/components/layout/ContentLayout';
import WelcomeCard from '~/components/home/WelcomeCard';
import useSessionContext from '~/context/sessionContext';
import HomeView from '~/components/home/HomeView';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Homepage(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const SessionService = useSessionService();
    const { userFirstName } = useSessionContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        SessionService.refreshSession()
            .then((res) => {
                if (res) {
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            })
            .catch(() => {})
            .finally(() => setIsPageLoading(false));
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout showTitle={isConnected} title={`Bienvenue ${userFirstName} !`} isLoading={isPageLoading} subtitle="Retrouvez rapidement vos morceaux ou reprenez là où vous vous êtes arrêté.">
            {isConnected ? (
                <HomeView />
            ) : (
                <>
                    <SplashBg />
                    <Container className="mt-3 position-relative">
                        <WelcomeCard />
                    </Container>
                </>
            )}
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////
