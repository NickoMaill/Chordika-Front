// #region IMPORTS -> /////////////////////////////////////
import { JSX, useEffect, useState } from 'react';
import AppCard from '../common/AppCard';
import { Box, Button, Chip, CircularProgress, Grid } from '@mui/material';
import AppIcon from '../common/AppIcon';
import useScoreService from '~/hooks/services/useScoreService';
import { Score } from '~/models/Score';
import { Bold, Regular } from '../common/Text';
import { Link } from 'react-router-dom';
import NavigationResource from '~/resources/navigationResources';
import appTool from '~/helpers/appTool';
import dayjs from 'dayjs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function LastScoreUpdated(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scores, setScores] = useState<Score[]>([]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { getScoreLists } = useScoreService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadLastScore = async (): Promise<void> => {
        const query: Record<string, string> = {
            limit: '3',
            order: 'updatedAt+desc',
        };
        await getScoreLists(query)
            .then((res) => {
                setScores(res.records);
            })
            .finally(() => setIsLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        loadLastScore();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppCard
            title="Modifiées récemment"
            action={
                <Button sx={{ bgcolor: 'background.default' }} startIcon={<AppIcon name="MusicScore" />} variant="outlined">
                    Accéder à mes grilles
                </Button>
            }
            divider
        >
            {isLoading ? <Loader /> : scores.length === 0 ? <></> : scores.map((s) => <ScoreElement key={s.id} score={s} />)}
        </AppCard>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////

function Loader(): JSX.Element {
    return (
        <Box className="d-flex justify-content-center flex-column align-items-center">
            <CircularProgress size={35} />
            <Bold className="mt-3 fst-italic">Recherche de grilles en cours...</Bold>
        </Box>
    );
}

function ScoreElement({ score }: { score: Score }): JSX.Element {
    return (
        <Grid
            component={Link}
            sx={{ color: 'text.primary' }}
            alignItems={'center'}
            className="text-decoration-none p-2 px-3 m-1 hover-el rounded"
            to={NavigationResource.buildPath('Editor', { scoreId: score.id })}
            container
        >
            <Grid size={8}>
                <Bold>{score.title}</Bold>
                <Regular variant="caption" color="secondary">
                    {score.composer}
                </Regular>
            </Grid>
            <Grid size={1} alignItems={'end'}>
                <Chip color="primary" label={score.key} sx={{ minWidth: '50px' }} />
            </Grid>
            <Grid size={1} alignItems={'end'}>
                <Chip color="primary" label={`${score.nume}/${score.denom}`} sx={{ minWidth: '50px' }} />
            </Grid>
            <Grid size={2} justifyContent={'end'}>
                <Regular variant="caption" className="fst-italic text-end w-100 d-block">
                    Modifiée {appTool.formatFancyTime(dayjs(score.updatedAt ?? score.addedAt))}
                </Regular>
            </Grid>
        </Grid>
    );
}
