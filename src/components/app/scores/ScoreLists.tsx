// #region IMPORTS -> /////////////////////////////////////
import Skeleton from '@mui/material/Skeleton';
import { JSX, memo, useState } from 'react';
import { Score } from '~/models/Score';
import AppIcon from '../../common/AppIcon';
import NavigationResource from '~/resources/navigationResources';
import { Bold, Italic, Regular } from '../../common/Text';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import useScoreService from '~/hooks/services/useScoreService';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import useToast from '~/hooks/useToast';
import NoData from '~/assets/svg/no-data.svg';
import { OverrideListPropsType } from '../../common/AppTable';
import AppButtonGroup, { ButtonGroupOptionsType } from '~/components/common/AppButtonGroup';
import AppCard from '~/components/common/AppCard';
import { useCenterQuery } from '~/hooks/useCenterActions';
import useCenterContext from '~/context/centerContext';
import appTool from '~/helpers/appTool';
import useModal from '~/hooks/useModal';
import AppProgressBar from '~/components/common/AppProgressBar';
import { TimeSignature } from '~/components/music';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function ScoreLists({ tableProps, baseProps }: OverrideListPropsType<Score>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { setFavScore, exportScore } = useScoreService();
    const { success, info } = useToast();
    const { tableQuery } = useCenterQuery({ props: { entity: baseProps.entity }, action: null, id: null });
    const { state } = useCenterContext<Score>();
    const { openModal, closeModal } = useModal();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleActions = async (target: string, id: number): Promise<void> => {
        switch (target) {
            case 'fav':
                await setFavScore(id).then((res) => {
                    if (res.success) {
                        if (res.additionalDatas.isFavorite) {
                            success('Grille ajoutée a vos favoris');
                        } else {
                            info('Grille retirée de vos favoris');
                        }
                        tableQuery(null, false);
                    }
                });
                break;
            case 'exp':
                {
                    let modalContent = {
                        title: `Export en cours`,
                        content: (
                            <Box>
                                <AppProgressBar percent={100} alwaysStripped animate />
                            </Box>
                        ),
                        modalActionOptions: {
                            modalActionLoading: false,
                            modalDismissLabel: 'Annuler',
                            modalAction: null,
                            modalActionLabel: null,
                        },
                    };
                    openModal(modalContent);
                    await exportScore(id).finally(closeModal);
                }
                break;
            default:
                throw new AppError(ErrorTypeEnum.Functional, 'card action not supported', 'not_supported');
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box className="mt-3">
            <Divider className="mb-3" />
            {tableProps.isTableLoading ? (
                <Grid container spacing={2}>
                    {[...Array(10).keys()].map((k) => (
                        <Grid
                            size={{ sm: 12, md: 12, lg: 4, xs: 12 }}
                            sx={{ position: 'relative', height: '120px' }}
                            component={Skeleton}
                            variant="rounded"
                            className="mb-3"
                            animation="pulse"
                            key={k}
                        />
                    ))}
                </Grid>
            ) : state.datas.totalRecords === 0 ? (
                <NoScoreAction />
            ) : (
                <Grid container spacing={2}>
                    {state.datas.records.map((d) => (
                        <ScoreCard onExportClick={() => handleActions('exp', d.id)} onFavClick={() => handleActions('fav', d.id)} data={d} key={d.id} />
                    ))}
                </Grid>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function NoScoreAction(): JSX.Element {
    return (
        <Box className="w-100">
            <Box className="text-center mb-4">
                <Bold variant="h5">Aucune grille trouvée...</Bold>
                <img src={NoData} className="mt-2" />
            </Box>
        </Box>
    );
}

const ScoreCard = memo(
    function ScoreCard({ data, onExportClick, onFavClick }: IScoreCard): JSX.Element {
        return (
            <Grid size={{ sm: 12, md: 12, lg: 4, xs: 12 }} sx={{ position: 'relative' }}>
                <AppCard
                    title={data.title}
                    sx={{ minHeight: '120px' }}
                    subheader={data.composer}
                    action={<CardAction data={data} onExportClick={onExportClick} onFavClick={onFavClick} />}
                    className="p-3 score-list-item mb-3"
                >
                    <Grid container sx={{ color: 'inherit' }} className="d-flex justify-content-between text-decoration-none text">
                        <Grid size={6}>
                            <Italic>Version : {data.version ? data.version : '-'}</Italic>
                            <Regular>
                                {data.tempo} BPM <AppIcon name="Circle" className="mx-1" sx={{ fontSize: '11px' }} /> {data.nume}/{data.denom}{' '}
                                <AppIcon name="Circle" sx={{ fontSize: '11px' }} className="mx-1" /> {data.key}
                            </Regular>
                        </Grid>
                        <Grid size={6} className="text-end">
                            {data.updatedAt && (
                                <Italic component="span" className="mt-2" sx={{ fontSize: '0.76rem' }}>
                                    Modifié <u title={dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm:ss')}>{appTool.formatFancyTime(dayjs(data.updatedAt))}</u>
                                </Italic>
                            )}
                        </Grid>
                    </Grid>
                </AppCard>
            </Grid>
        );
    },
    (old, next) => old.data.updatedAt === next.data.updatedAt
);

interface IScoreCard {
    data: Score;
    onExportClick: () => Promise<void>;
    onFavClick: () => Promise<void>;
}

const iconFontSize = 20;
function CardAction({ data, onExportClick, onFavClick }: ICardAction): JSX.Element {
    const [loaders, setLoaders] = useState<{ exp: boolean; fav: boolean }>({ exp: false, fav: false });
    const exp = async (): Promise<void> => {
        setLoaders((prev) => ({ ...prev, exp: true }));
        await onExportClick().finally(() => setLoaders((prev) => ({ ...prev, exp: false })));
    };
    const fav = async (): Promise<void> => {
        setLoaders((prev) => ({ ...prev, fav: true }));
        await onFavClick().finally(() => setLoaders((prev) => ({ ...prev, fav: false })));
    };
    const btn: ButtonGroupOptionsType[] = [
        { label: 'Vers la grille', icon: 'MusicScore', href: NavigationResource.buildPath('Editor', { scoreId: data.id }), iconFontSize },
        { label: 'Modifier', icon: 'EditRounded', href: NavigationResource.routesPath.center + '/scores/' + data.id + '/update', iconFontSize },
        { label: 'Marquer comme favoris', icon: 'Star', onClick: fav, iconFontSize, iconColor: data.isFavorite ? 'warning' : null, isLoading: loaders.fav },
        { label: 'Supprimer', icon: 'DeleteRounded', href: NavigationResource.routesPath.center + '/scores/' + data.id + '/delete', iconFontSize },
        { label: 'Exporter', icon: 'FilePdf', onClick: exp, isLoading: loaders.exp, iconFontSize },
    ];
    return <AppButtonGroup options={btn} labelAsTip size="small" />;
}
interface ICardAction {
    onExportClick: () => Promise<void>;
    onFavClick: () => Promise<void>;
    data: Score;
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
