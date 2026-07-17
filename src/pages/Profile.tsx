// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, IconButton } from '@mui/material';
import ContentLayout from '~/components/layout/ContentLayout';
import AppCard from '~/components/common/AppCard';
import { Bold, Regular } from '~/components/common/Text';
import InputBase from '~/components/formMaker/elements/InputBase';
import { UserApiModel, UserSessionApiModel } from '~/models/Users';
import useResources from '~/hooks/useResources';
import useSessionService from '~/hooks/services/useSessionService';
import dayjs from 'dayjs';
import AppGridContainer from '~/components/common/AppGridContainer';
import useUserService from '~/hooks/services/useUserService';
import AppAccordion from '~/components/common/AppAccordion';
import useToast from '~/hooks/useToast';
import { LogActivities } from '~/components/app/users/LogActivities';
import useSessionContext from '~/context/sessionContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
const InputColorField = lazy(() => import('~/components/formMaker/elements/InputColorField'));
// #endregion SINGLETON --> /////////////////////////////////

export default function Profile(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [me, setMe] = useState<UserSessionApiModel>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentColor, setCurrentColor] = useState<string>(null);
    const [isColorLoading, setIsColorLoading] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Session = useSessionService();
    const User = useUserService();
    const { userId } = useSessionContext();
    const { translate } = useResources();
    const Toast = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const infoToDisplay: { label: string; field: string; valueFormatter?: (v: unknown) => string }[] = [
        { label: translate('profile.username') as string, field: 'name' },
        { label: translate('profile.lastCon') as string, field: 'lastConDate', valueFormatter: (v: string): string => dayjs(v).format('DD/MM/YYYY HH:mm:ss') },
        { label: translate('profile.addedAt') as string, field: 'addedAt', valueFormatter: (v: string): string => dayjs(v).format('DD/MM/YYYY HH:mm:ss') },
    ];

    const getMe = async (): Promise<void> => {
        if (userId) {
            await Session.getUserProfile()
                .then((res) => setMe(res))
                .finally(() => setIsLoading(false));
        }
    };
    const handleOnManageColor = async (action: 'add' | 'delete', value?: string): Promise<void> => {
        let colors = [...(me?.preferences.favColors || [])];
        const formData = new FormData();
        if (action === 'delete') {
            colors = colors.filter((c) => c !== (value ?? ''));
        } else {
            if ((currentColor ?? '').trim() === '') {
                Toast.warning(translate('profile.colors.needSelect') as string);
                return;
            }
            setIsColorLoading(true);
            colors.push(currentColor);
        }
        let v = colors.join(',');
        formData.append('Field', 'favColors');
        formData.append('Value', v);
        await User.updatePreferences(formData).then((isUpdated) => {
            if (isUpdated) {
                getMe();
            }
            setCurrentColor(null);
            if (action === 'add') {
                Toast.success(translate('profile.colors.saved') as string);
                setIsColorLoading(false);
            } else {
                Toast.info(translate('profile.colors.noSaved') as string);
            }
        });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        getMe();
    }, [userId]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout icon="Person" title={translate('profile.title') as string}>
            <AppCard sx={{ width: { sm: '90%', lg: '70%' } }} title={translate('profile.mainInfo') as string}>
                {isLoading ? (
                    <CircularProgress color="primary" size={70} />
                ) : (
                    infoToDisplay.map((info, i) => {
                        return (
                            <Box key={i} className="d-flex justify-content-start">
                                <Regular className="text-nowrap" sx={{ width: { xs: '50%', sm: '30%', lg: '30%' } }}>
                                    {info.label} :
                                </Regular>
                                <Regular>{info.valueFormatter ? info.valueFormatter(me[info.field]) : me[info.field]}</Regular>
                            </Box>
                        );
                    })
                )}
            </AppCard>
            <Box sx={{ width: { sm: '90%', lg: '70%' }, mt: 2 }} component={'section'}>
                <AppAccordion title="Couleurs favorites">
                    <AppGridContainer>
                        <InputBase size={10} id="color" label="Ajouter une couleur">
                            <InputColorField id="color" value={currentColor} onChange={(e) => setCurrentColor(e as string)} />
                        </InputBase>
                        <InputBase size={2} id="submitColor" className="d-flex align-items-end justify-content-end">
                            <Button onClick={() => handleOnManageColor('add')} variant="outlined" loading={isColorLoading} sx={{ bgcolor: 'background.default', marginTop: '30px' }}>
                                {translate('common.add')}
                            </Button>
                        </InputBase>
                    </AppGridContainer>
                    <Box component={'article'}>
                        <Bold>{translate('profile.colors.savedColor')}</Bold>
                        <Grid container spacing={3} component={'ul'} className="list-unstyled">
                            {me?.preferences.favColors.length > 0 ? (
                                me?.preferences.favColors.map((c, i) => <ColorElement key={i} color={c} onDelete={() => handleOnManageColor('delete', c)} />)
                            ) : (
                                <Regular>{translate('profile.colors.noSaved')}</Regular>
                            )}
                        </Grid>
                    </Box>
                </AppAccordion>
                <AppAccordion title={translate('profile.history') as string}>{me && <LogActivities data={me as unknown as UserApiModel} />}</AppAccordion>
            </Box>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function ColorElement({ color, onDelete }: { color: string; onDelete: () => void }): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleDelete = (): void => {
        setIsLoading(true);
        onDelete();
    };
    return (
        <Grid component={'li'} size={2} sx={{ boxShadow: 2, bgcolor: color, width: 60, height: 60 }} className="rounded position-relative" title={color}>
            <IconButton sx={{ backgroundColor: 'background.default' }} loading={isLoading} onClick={handleDelete} size="small" className="position-absolute top-0 start-100 translate-middle p-0">
                <AppIcon name="CloseRounded" size="small" />
            </IconButton>
        </Grid>
    );
}
