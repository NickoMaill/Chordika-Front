// #region IMPORTS -> /////////////////////////////////////
import Skeleton from '@mui/material/Skeleton';
import { JSX, useState } from 'react';
import { Score } from '~/models/Score';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
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
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function ScoreLists({ tableProps }: OverrideListPropsType<Score>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const ScoreService = useScoreService();
    const Toast = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const deleteScore = async (id: number): Promise<void> => {
        await ScoreService.deleteScore(id)
            .then(() => Toast.success('Grille supprimé avec succès'))
            .catch(() => Toast.error('Une erreur est survenue lors de la suppression'))
            // .finally(onRefresh);
    };
    const handleActions = async (target: string, id: number): Promise<void> => {
        switch (target) {
            case 'del':
                await deleteScore(id);
                break;
            case 'edit':
                break;
            case 'exp':
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
            <Divider className="mb-3"/>
            {tableProps.isTableLoading ? (
                <>
                    {[...Array(10).keys()].map((k) => (
                        <Skeleton sx={{ height: '120px' }} variant="rounded" className="mb-3" animation="pulse" key={k} />
                    ))}
                </>
            ) : tableProps.rows.totalRecords === 0 ? (
                <NoScoreAction />
            ) : (
                <Grid container spacing={2}>
                    {tableProps.rows.records.map((d) => (
                        <ScoreCard
                            onDeleteClick={() => handleActions('del', d.id)}
                            onEditClick={() => handleActions('edit', d.id)}
                            onExportClick={() => handleActions('exp', d.id)}
                            data={d}
                            key={d.id}
                        />
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
                <Bold variant="h5">Vous ne possédez aucune grilles pour l'instant...</Bold>
                <img src={NoData} className="mt-2" />
            </Box>
            <Stack className="m-auto" direction="column" spacing={2} useFlexGap sx={{ justifyContent: 'center', alignItems: 'center', maxWidth: '400px' }}>
                <Button component={Link} className="w-100" to={NavigationResource.routesPath.scoreAdd} startIcon={<AppIcon name="AddRounded" />} variant="contained">
                    Créer une grille
                </Button>
                <Button component={Link} className="w-100" to={NavigationResource.routesPath.scoreImport} startIcon={<AppIcon name="CloudUploadRounded" />} variant="contained">
                    Importer un grille
                </Button>
            </Stack>
        </Box>
    );
}

function ScoreCard({ data, onEditClick, onDeleteClick, onExportClick }: IScoreCard): JSX.Element {
    return (
        <Grid size={{ sm: 12, md: 12, lg: 4, xs: 12 }} sx={{ position: 'relative' }}>
            <AppCard title={data.title} sx={{ minHeight: '120px' }} subheader={data.composer} action={<CardAction id={data.id} onDeleteClick={onDeleteClick} onEditClick={onEditClick} onExportClick={onExportClick} />} className="p-3 score-list-item mb-3">
                <Grid container sx={{ color: 'inherit' }} className="d-flex justify-content-between text-decoration-none text">
                    <Grid size={6}>
                        <Regular>
                            {data.tempo} BPM <AppIcon name="Circle" className="mx-1" sx={{ fontSize: '11px' }} /> {data.nume}/{data.denom}{' '}
                            <AppIcon name="Circle" sx={{ fontSize: '11px' }} className="mx-1" /> {data.key}
                        </Regular>
                    </Grid>
                    <Grid size={6} textAlign={"end"}>
                        {data.updatedAt && <Italic component="span" className="mt-2" fontSize="0.76rem">Modifié le : {dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</Italic>}
                    </Grid>
                </Grid>
            </AppCard>
        </Grid>
    );
}

interface IScoreCard {
    data: Score;
    onEditClick: () => Promise<void>;
    onDeleteClick: () => Promise<void>;
    onExportClick: () => Promise<void>;
}

const iconFontSize = 20;
function CardAction({ id, onEditClick, onDeleteClick, onExportClick }: ICardAction): JSX.Element {
    const [loaders, setLoaders] = useState<{ edit: boolean; del: boolean; exp: boolean }>({ edit: false, del: false, exp: false });
    const edit = async (): Promise<void> => {
        setLoaders((prev) => ({ ...prev, edit: true }));
        await onEditClick().finally(() => setLoaders((prev) => ({ ...prev, edit: false })));
    };
    const del = async (): Promise<void> => {
        setLoaders((prev) => ({ ...prev, del: true }));
        await onDeleteClick().finally(() => setLoaders((prev) => ({ ...prev, del: false })));
    };
    const exp = async (): Promise<void> => {
        setLoaders((prev) => ({ ...prev, exp: true }));
        await onExportClick().finally(() => setLoaders((prev) => ({ ...prev, exp: false })));
    };
    const btn: ButtonGroupOptionsType[] = [
        { label: "Vers la grille", icon: "MusicScore", href: NavigationResource.buildPath("Editor", { scoreId: id }), iconFontSize },
        { label: "Modifier", icon: "EditRounded", href: NavigationResource.routesPath.center + "/scores/" + id + "/update", iconFontSize },
        { label: "Supprimer", icon: "DeleteRounded", onClick: del , isLoading: loaders.del, iconFontSize },
        { label: "Exporter", icon: "FilePdf", onClick: exp, isLoading: loaders.exp, iconFontSize },
    ]
    return (
        <AppButtonGroup options={btn} labelAsTip size="small" />
    );
}
interface ICardAction {
    onEditClick: () => Promise<void>;
    onDeleteClick: () => Promise<void>;
    onExportClick: () => Promise<void>;
    id: number;
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
