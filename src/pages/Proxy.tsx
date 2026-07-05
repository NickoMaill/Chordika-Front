// #region IMPORTS -> /////////////////////////////////////
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import { FormEvent, JSX, lazy, useState } from 'react';
import ContentLayout from '~/components/layout/ContentLayout';
import Modal from '~/components/common/Modal';
import { Regular } from '~/components/common/Text';
import useSessionService from '~/hooks/services/useSessionService';
import useResources from '~/hooks/useResources';
import InputBase from '~/components/formMaker/elements/InputBase';
import { Button, Grid } from '@mui/material';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const InputTextField = lazy(() => import('../components/formMaker/elements/InputTextField'));
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
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
    const { translate } = useResources();
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
        <ContentLayout icon="Person" title={translate("nav.proxy") as string + "..."}>
            <Box className="mt-2">
                <Regular>{translate('proxy.message')}</Regular>
                <Box onSubmit={getProxy} component="form" className="mt-3">
                    <Grid container className="d-flex align-items-end" spacing={2}>
                        <InputBase size={6} id="search" label={translate('proxy.search') as string}>
                            <InputTextField className="mb-2" required id="search" placeholder="Nom ou adresse" icon="Person" />
                        </InputBase>
                        <InputBase showLabel={false} id="submit" size={3}>
                            <Button loading={isLoading} type="submit" startIcon={<AppIcon name="Search" />} fullWidth variant="contained">
                                {translate('common.search')}
                            </Button>
                        </InputBase>
                    </Grid>
                </Box>
            </Box>
            <Modal closable modalTitle={translate('proxy.choose') as string} onClose={openCloseModal} isOpen={isVisible}>
                <Box minWidth="500px" className="d-flex flex-column justify-content-center align-items-center">
                    {proxies && proxies.length > 0 ? (
                        proxies.map((u, i) => (
                            <LoadingButton loading={loadingButtons[i]} key={i} onClick={() => setProxy(u.id, i)} variant="contained" sx={{ my: 1, width: '100%' }}>
                                {u.name}
                            </LoadingButton>
                        ))
                    ) : (
                        <Regular>{translate('proxy.noProxy')}</Regular>
                    )}
                </Box>
            </Modal>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
