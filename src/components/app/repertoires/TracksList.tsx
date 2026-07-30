// #region IMPORTS -> /////////////////////////////////////
import { Box, Button, Grid } from '@mui/material';
import { JSX, memo, useEffect, useState } from 'react';
import AppGridContainer from '~/components/common/AppGridContainer';
import AppIcon from '~/components/common/AppIcon';
import InputAutoComplete from '~/components/formMaker/elements/InputAutoComplete';
import InputBase from '~/components/formMaker/elements/InputBase';
import useScoreService from '~/hooks/services/useScoreService';
import { Repertoire, ScoreRepertoire } from '~/models/Repertoire';
import { Score } from '~/models/Score';
import { SelectOptionsType } from '~/types/FormMakerCoreTypes';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function TracksList({ data }: ITracksList): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [scores, setScores] = useState<Score[]>([]);
    const [options, setOptions] = useState<SelectOptionsType[]>([{ label: 'Salut', value: 12 }]);
    const [list, setList] = useState<ScoreRepertoire[]>(data.scores || []);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [resetCount, setResetCount] = useState<number>(0);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { getScoreLists } = useScoreService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const load = async (): Promise<void> => {
        await getScoreLists({ limit: '1000' })
            .then((res) => {
                if (res.totalRecords > 0) {
                    setScores(res.records);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const buildOptions = (): void => {
        setOptions(scores.filter((x) => !list.some((l) => l.scoreId === x.id)).map((x) => ({ label: [x.title, x.composer, x.version].filter((y) => (y ?? '') !== '').join(' - '), value: x.id })));
    };

    const resetAutocomplete = (): void => setResetCount((prev) => prev + 1);
    // #endregion METHODS --> //////////////////////////////////
    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        load();
    }, []);
    useEffect(() => {
        buildOptions();
    }, [scores]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            <AppGridContainer spacing={2}>
                <InputBase id="Hello" label="Rechercher un morceau" size={10}>
                    <InputAutoComplete id="Hello" options={options} resetSignal={resetCount} disabled={isLoading} />
                </InputBase>
                <Grid size={{ lg: 2, md: 2, xs: 12 }} className="mt-2 align-items-center">
                    <Button variant="outlined" startIcon={<AppIcon name="AddRounded" />} sx={{ bgcolor: 'background.default' }} onClick={() => resetAutocomplete()}>
                        Ajouter à la liste
                    </Button>
                </Grid>
            </AppGridContainer>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ITracksList {
    data: Repertoire;
}
// #enderegion IPROPS --> //////////////////////////////////

const ScoreSearcher = memo(
    function ScoreSearcher({ options }: { options: SelectOptionsType[] }): JSX.Element {
        return (
            <InputBase id="Hello" label="Rechercher un morceau" size={12}>
                <InputAutoComplete id="Hello" options={options} />
            </InputBase>
        );
    },
    (prev, next) => prev.options.length !== next.options.length
);
