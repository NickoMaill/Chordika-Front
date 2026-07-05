// #region IMPORTS -> /////////////////////////////////////
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import { FormEvent, JSX, lazy, useState } from 'react';
import ContentLayout from '~/components/layout/ContentLayout';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
import Modal from '~/components/common/Modal';
import { Regular } from '~/components/common/Text';
import useSessionService from '~/hooks/services/useSessionService';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const InputTextField = lazy(() => import('../components/formMaker/elements/InputTextField'));
// #endregion SINGLETON --> /////////////////////////////////

export default function Proxy(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [proxies, setProxies] = useState<{ id: number; name: string }[]>([]);
    const [loadingButtons, setLoadingButtons] = useState<boolean[]>(new Array(proxies.length).fill(false));
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const SessionService = useSessionService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getProxy = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        const form: FormData = new FormData(e.currentTarget);
        await SessionService.getProxy(form)
            .then((res) => {
                setProxies(res);
                openCloseModal();
                setLoadingButtons(new Array(res.length).fill(false));
            })
            .finally(() => setIsLoading(false));
    };

    const setProxy = async (id: number, i: number): Promise<void> => {
        makeLoading(i, true);
        await SessionService.setProxy(id).finally(() => makeLoading(i, false));
    };

    const makeLoading = (i: number, loading: boolean): void => {
        const updateLoadingButtons = [...loadingButtons];
        updateLoadingButtons[i] = loading;
        setLoadingButtons(updateLoadingButtons);
    };

    const openCloseModal = (): void => {
        setIsVisible(!isVisible);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout icon="Person" title="Se connecter en tant que...">
            <Box className="mt-2" width="40%">
                <Regular>Connectez-vous en tant qu'un autre utilisateur afin de tester ou préparer l'accès de cette personne.</Regular>
                <Regular fontSize={16} className="my-1 d-flex align-items-center">
                    Recherche par <AppIcon size="large" name="PersonOutlined" /> nom ou par adresse
                </Regular>
                <Box onSubmit={getProxy} component="form">
                    <InputTextField required id="search" placeholder="Nom ou adresse" icon="Person" />
                    <LoadingButton loading={isLoading} type="submit" startIcon={<AppIcon name="Search" />} fullWidth variant="contained">
                        Rechercher
                    </LoadingButton>
                </Box>
            </Box>
            <Modal closable modalTitle="Choisissez le profile a utiliser" onClose={openCloseModal} isOpen={isVisible}>
                <Box minWidth="500px" className="d-flex flex-column justify-content-center align-items-center">
                    {proxies && proxies.length > 0 ? (
                        proxies.map((u, i) => (
                            <LoadingButton loading={loadingButtons[i]} key={i} onClick={() => setProxy(u.id, i)} variant="contained" sx={{ my: 1, width: '100%' }}>
                                {u.name}
                            </LoadingButton>
                        ))
                    ) : (
                        <Regular>Aucun proxy trouvé...</Regular>
                    )}
                </Box>
            </Modal>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
