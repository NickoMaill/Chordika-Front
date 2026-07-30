// #region IMPORTS -> /////////////////////////////////////
import { Paper, Link as MuiLink } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { JSX, useMemo, useState } from 'react';
import { Regular } from '~/components/common/Text';
import FormMaker from '~/components/formMaker/FormMaker';
import SplashBg from '~/components/layout/SplashBg';
import { FormMakerFocusErrorType, FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import RawLogo from '~/assets/pictures/logo.png';
import { Link } from 'react-router-dom';
import NavigationResource from '~/resources/navigationResources';
import useSessionService from '~/hooks/services/useSessionService';
import { AppError } from '~/core/appError';
import useNavigation from '~/hooks/useNavigation';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Register(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [errors, setErrors] = useState<FormMakerFocusErrorType[]>([]);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { registerUser } = useSessionService();
    const { navigate } = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const formStruct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo(
        () => [
            {
                title: '',
                type: FormMakerPartEnum.SEARCH,
                content: [
                    {
                        id: 'lastName',
                        label: 'Nom',
                        type: 'text',
                        autoComplete: 'family-name',
                        required: true,
                        size: 6,
                        index: 1,
                    },
                    {
                        id: 'firstName',
                        label: 'Prénom',
                        type: 'text',
                        autoComplete: 'given-name',
                        required: true,
                        size: 6,
                        index: 2,
                    },
                    {
                        id: 'email',
                        label: 'Email',
                        type: 'email',
                        autoComplete: 'email',
                        required: true,
                        size: 12,
                        index: 1,
                    },
                    {
                        id: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        autoComplete: 'new-password',
                        required: true,
                        showPasswordMeasure: true,
                        passwordMeasureMsg: 'Utilisez au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
                        size: 12,
                        index: 1,
                    },
                    {
                        id: 'confirmPassword',
                        label: 'Confirmer le mot de passe',
                        type: 'password',
                        autoComplete: 'new-password',
                        required: true,
                        size: 12,
                        index: 1,
                    },
                    {
                        id: 'conditions',
                        type: 'checkbox',
                        showLabel: false,
                        spacing: 0,
                        checkboxOptions: [
                            { label: "J'accepte les conditions d'utilisation et la politique de confidentialité", value: 'acceptCondition', defaultChecked: false, size: 12 },
                            { label: 'Recevoir occasionnellement les actualités de Chordika', value: 'okMarketing', defaultChecked: false, size: 12 },
                        ],
                        size: 12,
                        index: 1,
                    },
                ],
            },
        ],
        []
    );

    const handleSubmit = async (e: FormData): Promise<void> => {
        setErrors([]);
        setIsFormLoading(true);
        await registerUser(e)
            .then((res) => {
                if (res.id) {
                    setTimeout(() => {
                        navigate('Home');
                    }, 50);
                }
            })
            .catch((err: AppError) => {
                if (err.code) {
                    if (err.data) {
                        setErrors(err.data as FormMakerFocusErrorType[]);
                    }
                }
            })
            .finally(() => setIsFormLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <SplashBg />
            <Container className="position-relative" maxWidth="md">
                <Paper elevation={20} className="px-5 py-4 m-auto mt-4">
                    <Box className="text-center">
                        <img src={RawLogo} width={50} height={50} className="mb-2" />
                        <Regular sx={{ fontSize: '2rem', fontWeight: 600 }} component={'h1'} variant="h2">
                            Créer un compte
                        </Regular>
                        <Regular className="mt-2 mb-4" color="secondary" sx={{ lineHeight: 1.6 }}>
                            Commencez à organiser vos grilles et votre répertoire musical.
                        </Regular>
                    </Box>
                    <FormMaker
                        isSubmitLoading={isFormLoading}
                        focusOnError={errors}
                        outputType="formData"
                        onSubmit={handleSubmit}
                        structure={formStruct}
                        showBackPress={false}
                        submitLabel="S'inscrire"
                        submitFullWidth
                    />
                    <Box className="mt-2 text-center">
                        <Regular>
                            Déjà un compte ?{' '}
                            <MuiLink component={Link} color="primary" to={NavigationResource.buildPath('Login')}>
                                Se connecter
                            </MuiLink>
                        </Regular>
                    </Box>
                </Paper>
            </Container>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
