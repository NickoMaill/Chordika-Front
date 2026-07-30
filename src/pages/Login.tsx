// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
import { AppError } from '~/core/appError';
import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Grid, LinearProgress, Link, TextField } from '@mui/material';
import AppAlert from '~/components/common/AppAlert';
import InputOTPField from '~/components/formMaker/elements/InputOTPField';
import useResources from '~/hooks/useResources';
import { Bold, Regular } from '~/components/common/Text';
import { useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import configManager from '~/managers/configManager';
import { LevelAccessEnum } from '~/models/Session';
import useSessionContext from '~/context/sessionContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Login(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string>(null);
    const [mfaMode, setMfaMode] = useState<boolean>(false);
    const [resetMode, setResetMode] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [resendCount, setResendCount] = useState<number>(11);
    const [title, setTitle] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const SessionService = useSessionService();
    const Navigation = useNavigation();
    const { userId, accessLevel, phone } = useSessionContext();
    const { translate } = useResources();
    const [params] = useSearchParams();
    const isMfaEnabled = configManager.isMfaEnabled;
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const hideAlert = (): void => {
        setShowAlert(false);
    };

    const getPostLoginTarget = (): string => {
        if (params.has('target')) {
            return decodeURIComponent(params.get('target'));
        }

        return '/';
    };

    const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setIsLoading(true);
        await SessionService.login(data)
            .then((session) => {
                setIsError(false);
                setMessageError(null);
                setShowAlert(false);

                const shouldRequireMfa = isMfaEnabled && session.needMFA;
                if (shouldRequireMfa) {
                    setMfaMode(true);
                    return;
                }

                setPendingRedirect(getPostLoginTarget());
            })
            .catch((err: AppError) => {
                switch (err.code) {
                    case 'invalid_credentials':
                        setMessageError(translate('login.wrongCredentials') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    case 'email_required':
                        setMessageError(translate('login.requiredEmail') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    case 'password_required':
                        setMessageError(translate('login.requiredPassword') as string);
                        setShowAlert(true);
                        setIsError(true);
                        break;
                    default:
                        setMessageError(translate('error.common.error') as string);
                        setShowAlert(true);
                        setIsError(true);
                        throw new Error('Erreur');
                    // throw new AppError(ErrorTypeEnum.Technical, err.message, err.code);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const handleSubmitOtp = async (value: string): Promise<void> => {
        const form = new FormData();
        form.append('otp', value);
        setIsLoading(true);
        await SessionService.loginOpt(form)
            .then((res) => {
                if (res) {
                    setIsError(false);
                    setMessageError(null);
                    setPendingRedirect(getPostLoginTarget());
                } else {
                    setIsError(true);
                    setShowAlert(true);
                    setMessageError('code invalide');
                }
            })
            .catch((err: AppError) => {
                setIsError(true);
                switch (err.code) {
                    case 'session_expired':
                        setMfaMode(false);
                        setIsError(false);
                        setShowAlert(true);
                        setMessageError(translate('login.expiredSession') as string);
                        break;
                    case 'expired_otp':
                        setShowAlert(true);
                        setMessageError(translate('login.expiredMfa') as string);
                        break;
                }
            })
            .finally(() => setIsLoading(false));
    };

    const onResendMfa = async (): Promise<void> => {
        SessionService.requestOtp();
        let i = 0;
        setResendCount(i);
        const timer = setInterval(() => {
            if (i === 11) {
                clearInterval(timer);
            } else {
                i++;
                setResendCount(i);
            }
        }, 1000);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (params.get('mode') === 'reset') {
            setResetMode(true);
            setIsPageLoading(false);
        } else {
            SessionService.refreshSession()
                .then((res) => {
                    if (res) {
                        Navigation.navigate('Home');
                    } else {
                        setIsPageLoading(false);
                    }
                })
                .catch((err: AppError) => {
                    if (err.code && err.code === 'need_mfa') {
                        if (isMfaEnabled) {
                            setMfaMode(true);
                            SessionService.requestOtp();
                        } else {
                            setIsPageLoading(false);
                            setIsError(true);
                            setShowAlert(true);
                            setMessageError("La configuration du front désactive MFA, mais l'API l'exige encore.");
                        }
                    } else {
                        throw err;
                    }
                });
        }
    }, [params, isMfaEnabled]);

    useEffect(() => {
        if (mfaMode) {
            setTitle(translate('login.MfaTitle') as string);
        } else if (resetMode) {
            setTitle(translate('login.resetTitle') as string);
        } else {
            setTitle('');
        }
    }, [mfaMode, resetMode]);

    useEffect(() => {
        if (!pendingRedirect) return;
        if (!userId) return;
        if (accessLevel < LevelAccessEnum.USER) return;

        setTimeout(() => {
            Navigation.navigateByPath(pendingRedirect, true);
            setPendingRedirect(null);
        }, 50);
    }, [pendingRedirect, userId, accessLevel, Navigation]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {isPageLoading ? (
                <></>
            ) : (
                <Container sx={{ display: 'flex', justifyContent: 'center' }} maxWidth={'lg'}>
                    <Box sx={{ marginTop: { xs: 1, md: 8, sm: 3 }, maxWidth: '400px' }}>
                        <Box className="d-flex align-items-center justify-content-start" sx={{ marginBottom: 2 }}>
                            <Bold component="h1" variant="h4" color="primary">
                                {title}
                            </Bold>
                            {mfaMode && isLoading && <CircularProgress sx={{ marginLeft: 2 }} />}
                        </Box>
                        {mfaMode ? (
                            <OtpForm
                                showError={showAlert}
                                onCloseAlert={hideAlert}
                                onResend={onResendMfa}
                                messageError={messageError}
                                isError={isError}
                                resendWaitCount={resendCount}
                                phoneNumber={phone.slice(-4)}
                                onComplete={handleSubmitOtp}
                            />
                        ) : resetMode ? (
                            <ResetForm />
                        ) : (
                            <LoginForm isError={isError} showError={showAlert} onCloseAlert={hideAlert} messageError={messageError} onSubmit={handleSubmitLogin} isLoading={isLoading} />
                        )}
                    </Box>
                </Container>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////

function LoginForm({ isError, onSubmit, isLoading, messageError, showError, onCloseAlert }: ILoginForm): JSX.Element {
    const { translate } = useResources();
    return (
        <>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    required={true}
                    slotProps={{
                        input: { startAdornment: <EmailIcon color="primary" sx={{ marginRight: 1 }} /> },
                    }}
                    error={isError}
                    margin="normal"
                    fullWidth
                    id="Username"
                    label={"Nom d'utilisateur"}
                    type="email"
                    name="Username"
                    autoComplete="email"
                    autoFocus
                    placeholder="exemple@xyz.com"
                />
                <TextField
                    required
                    slotProps={{
                        input: { startAdornment: <LockIcon color="primary" sx={{ marginRight: 1 }} /> },
                    }}

                    error={isError}
                    margin="normal"
                    fullWidth
                    name="Password"
                    label={'Mot de passe'}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="*******"
                />
                <FormControlLabel control={<Checkbox value="true" name="RememberMe" color="primary" />} label={translate('login.rememberMe')} />
                <AppAlert isVisible={showError} onClose={onCloseAlert} severity="error" title={messageError} />
                <Button loading={isLoading} type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }}>
                    {translate('login.connect')}
                </Button>
                <Grid container>
                    <Grid>
                        <Link href="login?mode=reset" variant="body2" className="text-center">
                            {translate('login.forgotPassword')}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
interface ILoginForm {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isError: boolean;
    isLoading: boolean;
    messageError: string;
    showError: boolean;
    onCloseAlert: () => void;
}

function OtpForm({ onComplete, onResend, resendWaitCount = 10, isError, messageError, showError, onCloseAlert }: IOtpForm): JSX.Element {
    const { translate } = useResources();
    const Ses = useSessionContext();

    return (
        <Box>
            <Bold sx={{ mb: 1 }} variant="h6">
                {translate('login.MfaSubtitle')}
            </Bold>
            <Regular sx={{ mb: 1 }} variant="body2">
                <Trans i18nKey="login.MfaDetails" values={{ username: Ses.fullName, phoneNumber: Ses.phone }} />
            </Regular>
            <InputOTPField id="otp" error={isError} onComplete={onComplete} />
            <Box className="d-flex" sx={{ mt: 1 }}>
                <Box>
                    <Regular sx={{ mb: 1 }} variant="body2">
                        {translate('login.resendMfa')}{' '}
                    </Regular>
                </Box>
                {resendWaitCount < 11 ? (
                    <Box sx={{ width: '40%' }}>
                        <LinearProgress sx={{ mb: 1, ml: 1, height: 5, borderRadius: 50 }} variant="determinate" value={resendWaitCount * 10} />
                    </Box>
                ) : (
                    <Link sx={{ mb: 1, ml: 0.5 }} component="button" variant="body2" onClick={onResend}>
                        {translate('common.resend')}
                    </Link>
                )}
            </Box>
            <AppAlert severity="error" isVisible={showError} onClose={onCloseAlert} title={messageError} />
        </Box>
    );
}
interface IOtpForm {
    onComplete: (v: string) => void;
    phoneNumber: string;
    onResend: () => void;
    resendWaitCount: number;
    isError?: boolean;
    messageError?: string;
    showError: boolean;
    onCloseAlert: () => void;
}
function ResetForm(): JSX.Element {
    const { translate } = useResources();

    return (
        <>
            <Regular sx={{ marginBottom: 1 }}>{translate('login.resetMessage')}</Regular>
            <Bold sx={{ marginBottom: 1 }} className="text-left" variant="body2">
                {translate('login.resetDetails')}
            </Bold>
            <Box component="form" onSubmit={null}>
                <TextField
                    slotProps={{
                        input: { startAdornment: <EmailIcon color="primary" sx={{ marginRight: 1 }} /> },
                    }}
                    margin="normal"
                    required
                    fullWidth
                    id="Username"
                    label={translate('common.emailAddress')}
                    type="email"
                    name="Email"
                    autoComplete="email"
                    autoFocus
                    placeholder="exemple@xyz.com"
                />
                <Button loading={false} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
                    {translate('login.resetLabel')}
                </Button>
            </Box>
        </>
    );
}

// interface IResetForm {}
