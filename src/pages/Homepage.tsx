import { JSX, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import ContentLayout from '~/components/layout/ContentLayout';
import { Link } from 'react-router-dom';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Homepage(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isReady, setIsReady] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const SessionService = useSessionService();
    const Navigation = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        SessionService.refreshSession()
            .then((res) => {
                if (res) {
                    Navigation.navigate('Scores');
                }
            })
            .catch(() => {})
            .finally(() => setIsReady(true));
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Container className="mt-3" maxWidth="lg">
            {isReady && (
                <ContentLayout title="Bienvenue sur Chordika !">
                    <Link to={'/register'}>S'inscrire</Link>
                </ContentLayout>
            )}
        </Container>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////
