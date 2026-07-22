// #region IMPORTS -> /////////////////////////////////////
import { Box, Button, Paper } from '@mui/material';
import { JSX } from 'react';
import { Regular } from '../common/Text';
import { Link } from 'react-router-dom';
import RawLogo from '~/assets/pictures/logo.png';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function WelcomeCard(): JSX.Element {
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
        <Paper elevation={20} sx={{ bgcolor: 'background.default', maxWidth: '520px', width: '100%' }} className="p-5 text-center m-auto">
            <img src={RawLogo} width={84} height={84} className="mb-3" />
            <Regular fontSize={'2rem'} fontWeight={600} component={'h1'} variant="h2">
                Bienvenue sur Chordika
            </Regular>
            <Regular className="mt-2 mb-4" color="secondary" lineHeight={1.6}>
                Connectez vous pour retrouver votre bibliothèque de grilles, ou créez un compte pour commencer
            </Regular>
            <Box sx={{ display: 'grid', placeItems: 'center', gridTemplate: '1fr', width: '100%', gap: 2 }} className="mb-3">
                <Button className="w-100" component={Link} to="/login" variant="contained">
                    Se connecter
                </Button>
                <Button className="w-100" component={Link} to="/register" variant="outlined">
                    Créer un compte
                </Button>
            </Box>
            <Regular variant="caption" sx={{ color: '#9ca3af' }}>
                Conditions d'utilisation · Confidentialité
            </Regular>
        </Paper>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
