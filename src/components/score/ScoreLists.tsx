// #region IMPORTS -> /////////////////////////////////////
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import { JSX, useState } from 'react';
import { Score } from '~/models/Score';
import { QueryResult } from '~/types/serverCoreType';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon';
import NavigationResource from '~/resources/navigationResources';
import Paper from '@mui/material/Paper';
import { Bold, Italic, Regular } from '../common/Text';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import AppGridContainer from '../common/AppGridContainer';
import Grid from '@mui/material/Grid';
import useScoreService from '~/hooks/services/useScoreService';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import useToast from '~/hooks/useToast';
import NoData from '~/assets/svg/no-data.svg';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function ScoreLists({ data, currentPage, isLoading, onRefresh }: IScoreLists): JSX.Element {
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
            .finally(onRefresh);
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
        <Container>
            {isLoading ? (
                <>
                    {[...Array(10).keys()].map((k) => (
                        <Skeleton sx={{ height: '120px' }} variant="rounded" className="mb-3" animation="pulse" key={k} />
                    ))}
                </>
            ) : data.totalRecords === 0 ? (
                <NoScoreAction />
            ) : (
                <AppGridContainer>
                    {data.records.map((d) => (
                        <ScoreCard onDeleteClick={() => handleActions('del', d.id)} onEditClick={() => handleActions('edit', d.id)} onExportClick={() => handleActions('exp', d.id)} data={d} key={d.id} />
                    ))}
                </AppGridContainer>
            )}
        </Container>
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
        <Grid size={{ sm: 12, md: 12, lg: 6, xs: 12 }} sx={{ position: 'relative' }}>
            <CardAction onDeleteClick={onDeleteClick} onEditClick={onEditClick} onExportClick={onExportClick} />
            <Paper sx={{ height: '120px' }} className="p-3 score-list-item mb-3">
                <Box component={Link} to={`/scores/${data.id}`} sx={{ color: 'inherit' }} className="d-flex align-items-end justify-content-between text-decoration-none text">
                    <Box>
                        <Bold variant="h4">{data.title}</Bold>
                        <Bold className="text-decoration-underline" variant="h6">
                            {data.composer}
                        </Bold>
                        <Regular>
                            {data.tempo} BPM <AppIcon name="Circle" className="mx-1" sx={{ fontSize: '11px' }} /> {data.nume}/{data.denom} <AppIcon name="Circle" sx={{ fontSize: '11px' }} className="mx-1" /> {data.key}
                        </Regular>
                    </Box>
                    <Box>{data.updatedAt && <Italic>Modifié le : {dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</Italic>}</Box>
                </Box>
            </Paper>
        </Grid>
    );
}

interface IScoreCard {
    data: Score;
    onEditClick: () => Promise<void>;
    onDeleteClick: () => Promise<void>;
    onExportClick: () => Promise<void>;
}

function CardAction({ onEditClick, onDeleteClick, onExportClick }: ICardAction): JSX.Element {
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
    return (
        <Stack className="position-absolute end-0 me-4 mt-3" direction={'row'} divider={<Divider orientation="vertical" flexItem />} spacing={1}>
            <Stack>
                <IconButton loading={loaders.edit} onClick={edit} size="small" outline="true">
                    <AppIcon name="EditRounded" />
                </IconButton>
            </Stack>
            <Stack>
                <IconButton loading={loaders.del} onClick={del} outline="true" size="small">
                    <AppIcon name="DeleteRounded" />
                </IconButton>
            </Stack>
            <Stack>
                <IconButton loading={loaders.exp} onClick={exp} outline="true" size="small">
                    <AppIcon name="PictureAsPdfRounded" />
                </IconButton>
            </Stack>
        </Stack>
    );
}
interface ICardAction {
    onEditClick: () => Promise<void>;
    onDeleteClick: () => Promise<void>;
    onExportClick: () => Promise<void>;
}

// #region IPROPS -->  /////////////////////////////////////
interface IScoreLists {
    data: QueryResult<Score>;
    currentPage: number;
    isLoading: boolean;
    onRefresh: () => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
