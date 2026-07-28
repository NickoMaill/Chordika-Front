// #region IMPORTS -> /////////////////////////////////////
import { JSX, useEffect, useState } from 'react';
import FormMaker from '../../formMaker/FormMaker';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Italic } from '../../common/Text';
import useScoreService from '~/hooks/services/useScoreService';
import useNavigation from '~/hooks/useNavigation';
import ContentLayout from '../../layout/ContentLayout';
import AppCard from '../../common/AppCard';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorAddForm(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [formStruct, setFormStruct] = useState<FormMakerContentType<FormMakerPartEnum>[]>([]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const ScoreService = useScoreService();
    const Navigation = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleFormStruct = async (): Promise<void> => {
        setIsFormLoading(true);
        await ScoreService.loadAddForm()
            .then((res) => setFormStruct(res))
            .finally(() => {
                setIsFormLoading(false);
            });
    };

    const handleFormAddSubmit = async (e: FormData): Promise<void> => {
        setIsSubmitLoading(true);
        const form = new FormData();
        const timSig = e.get('timeSig').toString().split('-');
        form.append('title', e.get('title').toString());
        form.append('composer', e.get('composer').toString());
        form.append('nume', timSig[0]);
        form.append('denom', timSig[1]);
        form.append('key', e.get('key').toString() + e.get('keyType').toString());
        form.append('tempo', e.get('tempo').toString());
        form.append('comment', e.has('comment') ? e.get('comment').toString() : '');
        form.append('orientation', e.get('orientation'));
        await ScoreService.addScore(form)
            .then((res) => Navigation.navigate('Editor', { scoreId: res.id }))
            .finally(() => setIsSubmitLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        handleFormStruct();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="Ajouter une grille" icon="MusicScore">
            {isFormLoading ? (
                <Box className="d-flex justify-content-center m-5 flex-column align-items-center">
                    <CircularProgress size={50} />
                    <Italic className="mt-4">Formulaire en cours de chargement...</Italic>
                </Box>
            ) : (
                <AppCard title={'Informations de la grille'} icon="InfoRounded">
                    <FormMaker structure={formStruct} isSubmitLoading={isSubmitLoading} onSubmit={handleFormAddSubmit} onBackPress={Navigation.goBack} grammar="Grille" />
                </AppCard>
            )}
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
