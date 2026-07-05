// #region IMPORTS -> /////////////////////////////////////
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { FormEvent, JSX, useEffect, useState } from 'react';
import AppAlert from '~/components/common/AppAlert';
import useResources from '~/hooks/useResources';
import { Bold, Regular } from '~/components/common/Text';
import { useSearchParams } from 'react-router-dom';
import Logo from '../assets/pictures/logo.png';
import { Link } from 'react-router-dom';
import { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Login(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isError, setIsError] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resetMode, setResetMode] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertLevel, setAlerLevel] = useState<AlertColor>('error');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const SessionService = useSessionService();
    const Navigation = useNavigation();
    const Resources = useResources();
    const [params] = useSearchParams();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const hideAlert = (): void => {
        setShowAlert(false);
    };
    const handleSubmitLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setIsLoading(true);
        await SessionService.login(data)
            .then((isLoginOk) => {
                if (isLoginOk) {
                    setIsError(false);
                    setMessageError(null);
                    setShowAlert(false);
                    if (params.has('target')) {
                        Navigation.navigateByPath(decodeURIComponent(params.get('target')), true);
                    } else {
                        Navigation.navigate('Home', null, true);
                    }
                }
            })
            .catch((err: AppError) => {
                switch (err.code) {
                    case 'invalid_credentials':
                        setMessageError(Resources.translate('login.wrongCredentials') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    case 'email_required':
                        setMessageError(Resources.translate('login.requiredEmail') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    case 'password_required':
                        setMessageError(Resources.translate('login.requiredPassword') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    default:
                        setMessageError(Resources.translate('error.common.error') as string);
                        setShowAlert(true);
                        setIsError(true);
                        throw new AppError(ErrorTypeEnum.Technical, err.message, err.code);
                }
                setAlerLevel('error');
            })
            .finally(() => setIsLoading(false));
    };

    const onResetSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setIsLoading(true);
        await SessionService.resetPassword(form)
            .then((res) => {
                if (res.success) {
                    Navigation.navigate('Login');
                    setResetMode(false);
                    setShowAlert(true);
                    setMessageError('Demande envoyée vérifiez vos emails');
                    setAlerLevel('info');
                }
            })
            .finally(() => setIsLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (params.get('mode') === 'reset') {
            setResetMode(true);
            setIsPageLoading(false);
        } else {
            setResetMode(false);
            SessionService.refreshSession()
                .then((res) => {
                    if (res) {
                        Navigation.navigateByPath('/');
                    } else {
                        setIsPageLoading(false);
                    }
                })
                .catch((err: AppError) => {
                    throw err;
                });
        }
    }, [Navigation.search]);

    useEffect(() => {
        if (resetMode) {
            setTitle(Resources.translate('login.resetTitle') as string);
        } else {
            setTitle('Connexion');
        }
    }, [resetMode]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {isPageLoading ? (
                <></>
            ) : (
                <Container sx={{ display: 'flex', justifyContent: 'center' }} maxWidth={'lg'}>
                    <Box maxWidth={'400px'} sx={{ marginTop: { xs: 1, md: 8, sm: 3 } }}>
                        <Box display="flex" alignItems="end" justifyContent="start" marginBottom={2}>
                            <Box component="img" sx={{ height: { xs: 60, sm: 80 }, width: { xs: 80, sm: 100 }, marginRight: 2 }} src={Logo} />
                            <Bold component="h1" variant="h4" color="textPrimary">
                                {title}
                            </Bold>
                        </Box>
                        {resetMode ? <ResetForm onSubmit={onResetSubmit} isLoading={isLoading} /> : <LoginForm isError={isError} showError={showAlert} onCloseAlert={hideAlert} messageError={messageError} onSubmit={handleSubmitLogin} isLoading={isLoading} severity={alertLevel} />}
                    </Box>
                </Container>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////

function LoginForm({ isError, onSubmit, isLoading, messageError, showError, onCloseAlert, severity }: ILoginForm): JSX.Element {
    const Resources = useResources();
    return (
        <>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <TextField required={true} InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }} error={isError} margin="normal" fullWidth id="Username" label={'username'} type="email" name="Username" autoComplete="email" autoFocus placeholder="exemple@xyz.com" />
                <TextField required InputProps={{ startAdornment: <LockIcon sx={{ marginRight: 1 }} /> }} error={isError} margin="normal" fullWidth name="Password" label={'password'} type="password" id="password" autoComplete="current-password" placeholder="*******" />
                <FormControlLabel control={<Checkbox value="true" name="RememberMe" color="primary" />} label={Resources.translate('login.rememberMe')} />
                <AppAlert isVisible={showError} onClose={onCloseAlert} severity={severity} title={messageError} />
                <Button loading={isLoading} type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }}>
                    {Resources.translate('login.connect')}
                </Button>
                <Grid container>
                    <Grid>
                        <MuiLink component={Link} to="/login?mode=reset" variant="body1" className="fw-bold">
                            {Resources.translate('login.forgotPassword')}
                        </MuiLink>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
interface ILoginForm {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isError: boolean;
    isLoading: boolean;
    messageError: string;
    showError: boolean;
    onCloseAlert: () => void;
    severity: AlertColor;
}

function ResetForm({ isLoading, onSubmit }: IResetForm): JSX.Element {
    const Resources = useResources();

    return (
        <>
            <Regular marginBottom={1}>{Resources.translate('login.resetMessage')}</Regular>
            <Bold marginBottom={1} textAlign="left" variant="body2">
                {Resources.translate('login.resetDetails')}
            </Bold>
            <Box component="form" onSubmit={onSubmit}>
                <TextField slotProps={{ input: { startAdornment: <EmailIcon color="secondary" sx={{ marginRight: 1 }} /> } }} margin="normal" required fullWidth id="Username" label={Resources.translate('common.emailAddress')} type="email" name="email" autoComplete="email" autoFocus placeholder="exemple@xyz.com" />
                <Button loading={isLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
                    {Resources.translate('login.resetLabel')}
                </Button>
                <Grid container>
                    <Grid>
                        <MuiLink component={Link} to="/login" variant="body1" className="fw-bold">
                            {Resources.translate('login.connect')}
                        </MuiLink>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

interface IResetForm {
    isLoading: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
