// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { JSX } from 'react';
import AppCard from '~/components/common/AppCard';
import InputBase from '~/components/formMaker/elements/InputBase';
import InputTextField from '~/components/formMaker/elements/InputTextField';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Register(): JSX.Element {
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
        <Container>
            <Container maxWidth="sm">
                <AppCard title="Inscription">
                    <Box component="form" method="POST" autoComplete="on">
                        <InputBase required id="firstName" size={12} label="Prénom">
                            <InputTextField required autoComplete="given-name" id="firstName" />
                        </InputBase>
                        <InputBase required id="lastName" size={12} label="Nom">
                            <InputTextField required autoComplete="family-name" id="lastName" />
                        </InputBase>
                        <InputBase required id="email" size={12} label="Email">
                            <InputTextField required autoComplete="email" type="email" id="email" />
                        </InputBase>
                        <InputBase required id="password" size={12} label="Mot de passe">
                            <InputTextField required type="password" autoComplete="new-password" id="password" />
                        </InputBase>
                        <InputBase required id="confirm_password" size={12} label="Confirmer le mot de passe">
                            <InputTextField required type="password" autoComplete="new-password" id="confirm_password" />
                        </InputBase>
                        <Box className="d-flex justify-content-center align-items-center w-100 mt-4">
                            <Button variant="contained" className="w-100" type="submit">
                                S'inscrire
                            </Button>
                        </Box>
                    </Box>
                </AppCard>
            </Container>
        </Container>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
