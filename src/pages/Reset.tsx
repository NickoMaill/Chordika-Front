import { ChangeEvent, FormEvent, JSX, lazy, ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppFullPageLoader from '~/components/common/AppFullPageLoader';
import { Bold, Italic, Regular } from '~/components/common/Text';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
import logo from '~/assets/pictures/logo.png';
import { Link } from 'react-router-dom';
import NavigationResource from '~/resources/navigationResources';
import AppAlert from '~/components/common/AppAlert';
import stylesResources from '~/resources/stylesResources';
import { ApiErrorType } from '~/models/Error';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
type PasswordOptionsCheck = {
    majAndMin: boolean;
    gotNumber: boolean;
    specialChar: boolean;
    minimalLength: boolean;
    level: string;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function Reset(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [accessGranted, setAccessGranted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [pwdOpt, setPwdOpt] = useState<PasswordOptionsCheck>({ majAndMin: false, minimalLength: false, gotNumber: false, specialChar: false, level: 'Mesurez la force de votre mot de passe' });
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const [params] = useSearchParams();
    const SessionService = useSessionService();
    const Navigation = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const grantAccessToPage = async (): Promise<void> => {
        if (!params.has('token') || params.get('token') === '') {
            Navigation.navigate('Login', null, true);
            return;
        }
        await SessionService.checkReset(params.get('token'))
            .then((res) => {
                if (res.success) {
                    setAccessGranted(true);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const onResetSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setIsSubmitLoading(true);
        await SessionService.changePassword(form, params.get('token'))
            .then((res) => {
                if (res.success) {
                    setIsSuccess(true);
                    setIsError(false);
                    setErrorMsg(null);
                    setTimeout(() => Navigation.navigate('Login'), 5_000);
                } else {
                    const err = res as unknown as ApiErrorType;
                    if (err.code === 'invalid_password') {
                        setErrorMsg("Votre mot de passe n'est pas assez resistant");
                        setIsError(true);
                    } else if (err.code === 'not_same') {
                        setErrorMsg('Vos mots de passe doivent être identiques');
                        setIsError(true);
                    }
                }
            })
            .finally(() => setIsSubmitLoading(false));
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            setPwdOpt((prev) => ({ ...prev, majAndMin: true }));
        } else {
            setPwdOpt((prev) => ({ ...prev, majAndMin: false }));
        }
        if (e.target.value.match(/([0-9])/)) {
            setPwdOpt((prev) => ({ ...prev, gotNumber: true }));
        } else {
            setPwdOpt((prev) => ({ ...prev, gotNumber: false }));
        }
        if (e.target.value.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
            setPwdOpt((prev) => ({ ...prev, specialChar: true }));
        } else {
            setPwdOpt((prev) => ({ ...prev, specialChar: false }));
        }
        if (e.target.value.length > 7) {
            setPwdOpt((prev) => ({ ...prev, minimalLength: true }));
        } else {
            setPwdOpt((prev) => ({ ...prev, minimalLength: false }));
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        grantAccessToPage();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <Container>{isLoading ? <AppFullPageLoader isLoading /> : accessGranted ? <ResetForm onSubmit={onResetSubmit} opt={pwdOpt} onChange={onChange} errorMsg={errorMsg} isSuccess={isSuccess} isLoading={isSubmitLoading} isError={isError} /> : <Expired />}</Container>;
    // #endregion RENDER --> ///////////////////////////////////
}

function ResetForm({ opt, onSubmit, onChange, errorMsg, isSuccess, isError, isLoading }: IResetForm): JSX.Element {
    const [width, setWidth] = useState<number>(0);
    const [monitorMsg, setMonitorMsg] = useState<string | ReactNode>('Mesurez la force de votre mot de passe');
    const [count, setCount] = useState<number>(5);
    const levelMonitor: { label: string; isOk: boolean }[] = [
        { label: 'Majuscule & minuscule', isOk: opt.majAndMin },
        { label: 'Nombre (0-9)', isOk: opt.gotNumber },
        { label: 'Caractère spécial (!@#$%^&*)', isOk: opt.specialChar },
        { label: '8 Caractères minium', isOk: opt.minimalLength },
    ];
    const updateWidth = (): void => {
        setWidth(
            Object.values(opt)
                .filter((o) => typeof o === 'boolean')
                .filter((o) => o === true).length
        );
    };
    useEffect(() => {
        updateWidth();
    }, [opt.gotNumber, opt.majAndMin, opt.minimalLength, opt.specialChar]);

    useEffect(() => {
        if (isSuccess) {
            const interval = setInterval(() => {
                if (count > 0) {
                    setCount((prev) => prev - 1);
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (width === 0) {
            setMonitorMsg('Mesurez la force de votre mot de passe');
        } else if (width === 1) {
            setMonitorMsg('Mot de passe faible');
        } else if (width === 2) {
            setMonitorMsg('Mot de passe moyen');
        } else if (width === 3) {
            setMonitorMsg('Mot de passe moyennement resistant');
        } else {
            setMonitorMsg(
                <Bold className="d-flex align-items-center text-center">
                    Mot de passe resistant
                    <AppIcon className="ms-2" name="CheckCircle" color="success" />
                </Bold>
            );
        }
    }, [width]);

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center' }} maxWidth={'lg'}>
            <Box maxWidth={'400px'} sx={{ marginTop: { xs: 1, md: 8, sm: 3 } }}>
                <Box className="d-flex align-items-center mb-4">
                    <Box component="img" sx={{ height: { xs: 60, sm: 80 }, width: { xs: 80, sm: 100 }, marginRight: 2 }} src={logo} />
                    <Bold component="h1" variant="h4" color="secondary">
                        Réinitialisation de mot passe
                    </Bold>
                </Box>
                <Italic>Un mot de passe correct fait au moins 8 caractères et contient au moins une lettre, un chiffre et un symbole.</Italic>
                <Box component="form" onSubmit={onSubmit} id="resetForm" className="d-flex flex-column align-items-center justify-content-center">
                    <Box className="d-flex flex-column w-100 mb-3">
                        <TextField
                            color={isSuccess ? 'success' : null}
                            focused={isSuccess}
                            slotProps={{ input: { startAdornment: <AppIcon name="Lock" color="secondary" sx={{ marginRight: 1 }} />, endAdornment: isSuccess ? <AppIcon name="CheckRounded" color="success" /> : null } }}
                            margin="normal"
                            fullWidth
                            label="Nouveau mot de passe"
                            type="password"
                            name="password"
                            required
                            error={isError}
                            onChange={onChange}
                            placeholder="********"
                        />
                        <TextField
                            error={isError}
                            color={isSuccess ? 'success' : null}
                            focused={isSuccess}
                            slotProps={{ input: { startAdornment: <AppIcon name="Lock" color="secondary" sx={{ marginRight: 1 }} />, endAdornment: isSuccess ? <AppIcon name="CheckRounded" color="success" /> : null } }}
                            margin="normal"
                            fullWidth
                            label="Confirmer mot de passe"
                            type="password"
                            name="confirm"
                            required
                            placeholder="********"
                        />
                        <AppAlert isVisible={isError || isSuccess} title={isError ? errorMsg : isSuccess ? 'Mot de passe modifié !' : null} severity={isSuccess ? 'success' : 'warning'} subtitle={isSuccess ? `Vous allez être redirigé vers la page de connexion dans ${count} sec` : ''} />
                    </Box>
                    <Box className="row mb-3 w-100" id="confirm">
                        <Box id="popover-password w-100">
                            <Box minWidth={'260px'}>
                                <Box className="progress">
                                    <LinearProgress variant="determinate" className="p-1 rounded" sx={{ width: '100%', backgroundColor: stylesResources.theme.palette.text.disabled }} color={width < 2 ? 'error' : width < 4 ? 'warning' : 'success'} value={width * 25} />
                                </Box>
                                <Box className="my-2 fst-italic fw-bold w-100 text-center d-flex justify-content-center">{monitorMsg}</Box>
                            </Box>
                            <ul className="list-unstyled">
                                {levelMonitor.map((m, i) => (
                                    <li key={i}>
                                        <span className="d-flex align-items-center mb-1">
                                            <AppIcon className="me-2" name={m.isOk ? 'CheckCircleRounded' : 'CancelRounded'} color={m.isOk ? 'success' : 'error'} />
                                            {m.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    </Box>
                    <Box className="d-flex justify-content-center my-1 flex-column align-items-center">
                        <Button className="btn btn-lg btn-primary d-flex align-items-center" loading={isLoading} variant="contained" type="submit" disabled={width < 3} id="reset">
                            Modifier Mot de passe
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

function Expired(): JSX.Element {
    return (
        <Container className="container">
            <Box className="d-flex align-items-center mb-4">
                <Box component="img" sx={{ height: { xs: 60, sm: 80 }, width: { xs: 80, sm: 100 }, marginRight: 2 }} src={logo} />
                <Bold component="h1" variant="h4" color="secondary">
                    Réinitialisation de mot passe
                </Bold>
            </Box>
            <Regular>Lorsque vous effectuez une demande de réinitialisation de mot de passe, le lien n'est valide que pendant 30 minutes.</Regular>
            <AppAlert
                closable={false}
                title={
                    <>
                        Impossible de réinitialiser le <AppIcon name="LockOpenRounded" /> mot de passe.
                    </>
                }
                subtitle="Le lien que vous avez utilisé n'est pas (ou plus) valide."
                isVisible
                severity="error"
            />
            <Regular>Veuillez effectuer une nouvelle demande de réinitialisation si vous souhaitez toujours changer de mot de passe.</Regular>
            <Box className="d-flex flex-column align-items-center mt-3">
                <Button variant="contained" startIcon={<AppIcon name="Email" />} className="mb-3 text-center" component={Link} to={NavigationResource.routesPath.login + '?mode=reset'}>
                    Faire une nouvelle demande
                </Button>
                <Button startIcon={<AppIcon name="LoginRounded" />} variant="contained" component={Link} to={NavigationResource.routesPath.login}>
                    Connexion
                </Button>
            </Box>
        </Container>
    );
}
// #region IPROPS -->  /////////////////////////////////////
interface IResetForm {
    opt: PasswordOptionsCheck;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errorMsg?: string;
    isSuccess?: boolean;
    isLoading?: boolean;
    isError?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
