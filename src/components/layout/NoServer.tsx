import { Helmet } from 'react-helmet';
import { JSX, lazy, useEffect, useState } from 'react';
import useNavigation from '~/hooks/useNavigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function NoServer(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [_errorKey, setErrorKey] = useState(0);
    const Nav = useNavigation();

    useEffect(() => {
        const handleBackNavigation = (): void => {
            setErrorKey((prevKey) => prevKey + 1); // Change la clé pour forcer le reset
        };

        window.addEventListener('popstate', handleBackNavigation);
        return (): void => {
            window.removeEventListener('popstate', handleBackNavigation);
        };
    }, []);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <Helmet>
                <title>Serveur injoignable</title>
            </Helmet>
            <Container
                maxWidth="sm"
                sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <AppIcon name="CloudOff" color="error" sx={{ fontSize: 80, marginBottom: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Serveur injoignable
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Il semble que nous ne puissions pas communiquer avec le serveur. Veuillez vérifier votre connexion réseau ou contacter l’administrateur système.
                </Typography>
                <Box sx={{ marginTop: 4 }}>
                    <Button variant="contained" color="primary" onClick={() => Nav.reload()}>
                        Réessayer
                    </Button>
                </Box>
            </Container>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
