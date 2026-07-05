// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SelectChangeEvent } from '@mui/material/Select';
import { JSX, lazy, ReactNode, useContext, useEffect, useState } from 'react';
import ContentLayout from '~/components/layout/ContentLayout';
import AppCard from '~/components/common/AppCard';
import AppGridContainer from '~/components/common/AppGridContainer';
import { Regular } from '~/components/common/Text';
import InputBase from '~/components/formMaker/elements/InputBase';
import SessionContext from '~/context/sessionContext';
import { UserApiModel, UserPreferencesPayload, UserSessionApiModel } from '~/models/Users';
import appTool from '~/helpers/appTool';
import useUserService from '~/hooks/services/useUserService';
import usePush from '~/hooks/usePush';
import useResources from '~/hooks/useResources';
import useStorage from '~/hooks/useStorage';
import useToast from '~/hooks/useToast';
import NotifDeniedTuto from '~/assets/videos/notif_denied.mov';
import useModal from '~/hooks/useModal';
import useSessionService from '~/hooks/services/useSessionService';
import { LogActivities } from '~/components/app/users/LogActivities';
import SectionLayout from '~/components/layout/SectionLayout';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
type Loaders = {
    isPageLoading: boolean;
    isNotifLoading: boolean;
};
const initLoaders: Loaders = { isPageLoading: true, isNotifLoading: false };
const InputSelectField = lazy(() => import('~/components/formMaker/elements/InputSelectField'));
const InputSwitchField = lazy(() => import('~/components/formMaker/elements/InputSwitchField'));
// #endregion SINGLETON --> /////////////////////////////////

export default function Profile(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [me, setMe] = useState<UserSessionApiModel>(null);
    const [loaders, setLoaders] = useState<Loaders>(initLoaders);
    const [blocked, setBlocked] = useState<{ isBlocked: boolean; message: ReactNode }>({ isBlocked: false, message: null });
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const UserService = useUserService();
    const SessionService = useSessionService();
    const Ses = useContext(SessionContext);
    const Resources = useResources();
    const Push = usePush();
    const Storage = useStorage();
    const Toast = useToast();
    const Modal = useModal();

    const infoToDisplay = [
        { label: Resources.translate('user.fullName'), field: 'name' },
        { label: Resources.translate('user.firstName'), field: 'firstName' },
        { label: Resources.translate('user.lastName'), field: 'lastName' },
        { label: Resources.translate('user.email'), field: 'email' },
        { label: Resources.translate('user.levelAccess'), field: 'levelAccess' },
    ];

    const maxRowsOptions = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
    ];
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getMe = async (): Promise<void> => {
        if (Ses.id) {
            await SessionService.getUserProfile()
                .then((res) => setMe(res))
                .finally(() => setLoaders((prev) => ({ ...prev, isPageLoading: false })));
        }
    };

    const handleNotifChange = async (checked: boolean): Promise<void> => {
        setLoaders((prev) => ({ ...prev, isNotifLoading: true }));
        try {
            if (checked && !Ses.isPushActive) {
                const isSubs = await Push.subscribe();
                if (isSubs) {
                    setBlocked((prev) => ({ ...prev, isBlocked: false, message: null }));
                    Ses.setIsPushActive(true);
                } else {
                    setBlocked((prev) => ({ ...prev, isBlocked: true, message: <BlockedMessage onClick={openModal} /> }));
                }
            } else if (!checked && Ses.isPushActive) {
                const isUnSubs = await Push.unsubscribe();
                if (isUnSubs) Ses.setIsPushActive(false);
            }
        } catch {
            Toast.error("Une erreur est survenue pendant l'activation", null, true);
        } finally {
            setLoaders((prev) => ({ ...prev, isNotifLoading: false }));
        }
    };

    const handleMaxRowsChange = async (e: SelectChangeEvent): Promise<void> => {
        Storage.setItem('maxRows', e.target.value);
        Ses.setMaxRows(Number(e.target.value));
        const pref: UserPreferencesPayload = { field: 'MaxRows', value: Number(e.target.value) };
        await UserService.savePreferences(pref).then((res) => {
            if (res.success) {
                Toast.success('Préférences sauvegardées avec succès', null, true);
            }
        });
    };

    const openModal = (): void => {
        const content = (): JSX.Element => (
            <Box className="d-flex justify-content-center">
                <video autoPlay loop width={800}>
                    <source src={NotifDeniedTuto} />
                </video>
            </Box>
        );
        Modal.openModal({ title: 'Activer les notifications', content: content(), size: 'lg' });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        getMe();
    }, [Ses.id]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout icon="Key" title={Resources.translate('profile.title') as string}>
            <SectionLayout sx={{ width: { sm: '90%', lg: '70%' } }} title={Resources.translate('common.mainInfo') as string} icon="AccountBox">
                {loaders.isPageLoading ? (
                    <CircularProgress color="primary" size={70} />
                ) : (
                    infoToDisplay.map((info, i) => {
                        return (
                            <Box key={i} className="d-flex justify-content-start">
                                <Regular className="text-nowrap" sx={{ width: { xs: '50%', sm: '30%', lg: '30%' } }}>
                                    {info.label} :
                                </Regular>
                                <Regular>{info.field === 'levelAccess' ? appTool.LevelAccessTranslater(me[info.field]) : me[info.field]}</Regular>
                            </Box>
                        );
                    })
                )}
            </SectionLayout>
            <SectionLayout sx={{ width: { sm: '90%', lg: '70%' } }} title="Réglages du profil" icon="Settings">
                <AppGridContainer>
                    <InputBase label="Nombre maximum de ligne" id="maxRows" size={3}>
                        <InputSelectField id="maxRows" options={maxRowsOptions} required onChange={handleMaxRowsChange} value={Ses.maxRows} />
                    </InputBase>
                    {/* {!Ses.isPushActive && (
                        <InputBase label="Activer les notifications externes ?" id="subs" size={4} error={blocked.isBlocked} errorMessage={blocked.message}>
                            <InputSwitchField value={Ses.isPushActive} disabled={Ses.isPushActive} switchValue={true} onChange={handleNotifChange} id="subs" isLoading={loaders.isNotifLoading} />
                        </InputBase>
                    )} */}
                </AppGridContainer>
            </SectionLayout>
            {me && (
                <SectionLayout sx={{ width: { sm: '90%', lg: '70%' } }} title="Historique d'activités" icon="ManageSearch">
                    <LogActivities data={me as unknown as UserApiModel} />
                </SectionLayout>
            )}
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function BlockedMessage({ onClick }: { onClick: () => void }): JSX.Element {
    return (
        <Box component={'a'} onClick={onClick} className="text-danger cursor-pointer text-decoration-underline">
            Voir le tutoriel
        </Box>
    );
}
