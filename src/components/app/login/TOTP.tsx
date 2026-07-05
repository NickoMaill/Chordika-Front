import { JSX, useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import AppAlert from '~/components/common/AppAlert';
import { Bold, Regular } from '~/components/common/Text';
import InputOTPField from '~/components/formMaker/elements/InputOTPField';
import SessionContext from '~/context/sessionContext';
import useResources from '~/hooks/useResources';
import logo from '~/assets/pictures/logo.png';
import useSessionService from '~/hooks/services/useSessionService';
import AppFullPageLoader from '~/components/common/AppFullPageLoader';
import { QRCode } from 'react-qrcode-logo';
import { ApiErrorType } from '~/models/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function TOTP(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [mode, setMode] = useState<'register' | 'login'>('login');
    const [url, setUrl] = useState<string>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Resources = useResources();
    const SessionService = useSessionService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleCloseAlert = (): void => {
        setShowAlert(!showAlert);
    };

    const onSubmit = async (v: string): Promise<void> => {
        setIsSubmitLoading(true);
        setIsDisabled(true);
        setIsError(false);
        setMessageError(null);
        setShowAlert(false);
        const form = new FormData();
        form.append('code', v);
        await SessionService.loginOpt(form)
            .then((res: { success: boolean } | ApiErrorType) => {
                if ((res as ApiErrorType).code) {
                    const err = res as ApiErrorType;
                    if (err.code === 'invalid_code') {
                        setIsError(true);
                        setShowAlert(true);
                        setMessageError('Code invalide');
                    }
                } else {
                    setIsError(false);
                    setMessageError(null);
                    setShowAlert(false);
                }
            })
            .finally(() => {
                setIsSubmitLoading(false);
                setIsDisabled(false);
            });
    };

    const init = async (): Promise<void> => {
        await SessionService.registerTOTP()
            .then((res) => {
                if (res && res !== '') {
                    setUrl(res);
                    setMode('register');
                } else {
                    setMode('login');
                }
            })
            .finally(() => setIsLoading(false));
    };

    const handleChangeMode = (): void => {
        setMode('login');
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        init();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Container className="d-flex justify-content-center flex-column align-items-center" sx={{ height: mode === 'register' ? '95vh' : '70vh' }} maxWidth={'lg'}>
            <Box maxWidth={'400px'} sx={{ marginTop: { xs: 1, md: 8, sm: 3 } }} className="mx-3">
                <Box display="flex" alignItems="end" justifyContent="start" marginBottom={2}>
                    <Box component="img" sx={{ height: { xs: 60, sm: 80 }, width: { xs: 80, sm: 100 }, marginRight: 2 }} src={logo} />
                    <Bold component="h1" variant="h4" color="secondary">
                        {Resources.translate('login.MfaTitle')}
                    </Bold>
                </Box>
                {isLoading ? <AppFullPageLoader isLoading /> : <Box>{mode === 'register' ? <RegisterTOTP url={url} onClick={handleChangeMode} /> : <TOTPForm onSubmit={onSubmit} isError={isError} disabled={isDisabled} />}</Box>}
                <AppAlert severity="error" isVisible={showAlert} onClose={handleCloseAlert} title={messageError} />
                <Box className="d-flex justify-content-center mt-4">{isSubmitLoading ? <CircularProgress size={50} /> : null}</Box>
            </Box>
        </Container>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function TOTPForm({ isError, onSubmit, disabled }: ITOTPForm): JSX.Element {
    const Resources = useResources();
    const Ses = useContext(SessionContext);
    return (
        <>
            <Bold sx={{ mb: 1 }} variant="h6">
                {Resources.translate('login.MfaSubtitle')}
            </Bold>
            <Regular sx={{ mb: 1 }} variant="body2">
                <Trans i18nKey="login.MfaDetails" values={{ username: Ses.fullName, phoneNumber: Ses.phone }} />
            </Regular>
            <InputOTPField id="otp" error={isError} onComplete={onSubmit} disabled={disabled} />
        </>
    );
}

function RegisterTOTP({ url, onClick }: IRegisterTOTP): JSX.Element {
    const Resources = useResources();
    const Ses = useContext(SessionContext);

    return (
        <Box className="w-100 d-flex justify-content-center flex-column">
            <Bold sx={{ mb: 1 }} variant="h6">
                {Resources.translate('login.MfaSubtitle')}
            </Bold>
            <Regular sx={{ mb: 3 }} variant="body2">
                <Trans i18nKey="login.MfaRegister" values={{ username: Ses.username, phoneNumber: Ses.phone }} />
            </Regular>
            <List sx={{ listStyle: 'decimal', pl: 4 }}>
                <ListItem sx={{ display: 'list-item' }}>
                    <Regular variant="body2">
                        Sur votre téléphone, <b>téléchargez une application d’authentification</b>. Nous vous recommandons les suivantes :
                        <Link className="fw-bold" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=fr" component="a" rel="noreferrer" target="_blank">
                            Google Authenticator
                        </Link>
                        ,{' '}
                        <Link className="fw-bold" href="https://www.microsoft.com/fr-fr/security/mobile-authenticator-app" component="a" rel="noreferrer" target="_blank">
                            Microsoft Authenticator
                        </Link>
                        .
                    </Regular>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <Regular variant="body2">
                        <b>Scannez le QR Code</b> avec votre application d’authentification (si vous avez choisi l’une de nos recommandations, appuyez sur le bouton « + »).
                    </Regular>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <Regular variant="body2">
                        Une fois le code scanné, un nouvel enregistrement apparaîtra avec l’intitulé{' '}
                        <b>
                            Chordika: <i>utilisateur</i>
                        </b>
                        .
                    </Regular>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <Regular variant="body2">Cliquez sur « Me connecter » pour saisir le code fourni par votre application.</Regular>
                </ListItem>
            </List>

            <Box className="d-flex justify-content-center flex-column align-items-center">
                <Paper sx={{ width: 'fit-content' }} elevation={3}>
                    <QRCode value={url} logoImage={logo} logoPadding={5} size={250} qrStyle="squares" />
                </Paper>
                <Button variant="outlined" className="mt-3" onClick={onClick}>
                    Me connecter
                </Button>
            </Box>
        </Box>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface ITOTPForm {
    isError: boolean;
    onSubmit: (v: string) => void;
    disabled: boolean;
}

interface IRegisterTOTP {
    url: string;
    onClick: () => void;
}
// #enderegion IPROPS --> //////////////////////////////////
