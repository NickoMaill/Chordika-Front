// #region IMPORTS -> /////////////////////////////////////
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { JSX, useEffect, useState } from 'react';
import AppIcon from '~/components/common/AppIcon';
import FormMaker from '~/components/formMaker/FormMaker';
import ContentLayout from '~/components/layout/ContentLayout';
import ScoreLists from '~/components/score/ScoreLists';
import useScoreService from '~/hooks/services/useScoreService';
import { Score } from '~/models/Score';
import { GenericActionEnum } from '~/types/centerType';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import { QueryResult } from '~/types/serverCoreType';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Scores(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [data, setData] = useState<QueryResult<Score>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchForm, setSearchForm] = useState<FormMakerContentType<FormMakerPartEnum>[]>(null);
    const [isSearchFormOpen, setIsSearchFormOpen] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const ScoreService = useScoreService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadScores = async (): Promise<void> => {
        await ScoreService.getScoreLists()
            .then((res) => setData(res))
            .finally(() => setIsLoading(false));
    };

    const loadSearchForm = async (): Promise<void> => {
        await ScoreService.loadSearchForm().then((res) => setSearchForm(res));
    };

    const handlePageChange = (): void => {
        setCurrentPage((prevState) => prevState++);
    };

    const handleOpenForm = (): void => {
        setIsSearchFormOpen(!isSearchFormOpen);
    };

    const renderSearchBtn = (): JSX.Element => {
        return (
            <IconButton outline="true" size="small" onClick={handleOpenForm}>
                <AppIcon name="SearchRounded" />
            </IconButton>
        );
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        loadScores();
        loadSearchForm();
    }, [currentPage]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="Mes Grilles" icon="MusicScore" actions={renderSearchBtn()}>
            <ScoreLists onRefresh={loadScores} isLoading={isLoading} data={data} currentPage={currentPage} />
            <Drawer sx={{ zIndex: 1300 }} slotProps={{ paper: { className: 'p-4 w-50' } }} anchor="right" open={isSearchFormOpen} onClose={handleOpenForm}>
                <IconButton onClick={handleOpenForm} className="position-absolute top-0 start-0 mt-1 ms-1">
                    <AppIcon name="CloseRounded" />
                </IconButton>
                <ScoreListForm structure={searchForm} onSubmit={(e) => console.log(e)} />
            </Drawer>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////

function ScoreListForm({ onSubmit, structure }): JSX.Element {
    return <FormMaker structure={structure} showBackPress={false} onSubmit={onSubmit} grammar="grilles" isSearchForm action={GenericActionEnum.TABLE} />;
}
