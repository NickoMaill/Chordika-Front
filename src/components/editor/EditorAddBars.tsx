// #region IMPORTS -> /////////////////////////////////////
import React, { JSX, useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Italic } from '../common/Text';
import FormMaker from '../formMaker/FormMaker';
import useScoreService from '~/hooks/services/useScoreService';
import useEditorContext from '~/context/EditorContext';
import { BarsPayload } from '~/models/Score';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorAddBars({ onSubmit }: IEditorAddBars): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
    const [formStruct, setFormStruct] = useState<FormMakerContentType<FormMakerPartEnum>[]>([]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const EditorCtx = useEditorContext();
    const ScoreService = useScoreService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleOpenClose = (): void => {
        EditorCtx.dispatch({ type: 'IS_FORM_BAR_OPEN', payload: !EditorCtx.state.isBarFormOpen });
    };

    const handleClick = async (): Promise<void> => {
        setIsFormLoading(true);
        await ScoreService.loadAddBarsForm()
            .then((res) => setFormStruct(res))
            .finally(() => {
                setIsFormLoading(false);
            });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (EditorCtx.state.isBarFormOpen) handleClick();

        return (): void => setIsFormLoading(true);
    }, [EditorCtx.state.isBarFormOpen]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Modal isOpen={EditorCtx.state.isBarFormOpen} onClose={handleOpenClose} modalTitle={isFormLoading ? 'Chargement' : formStruct ? (formStruct[0].title ?? '') : ''} closable>
            {isFormLoading ? (
                <Box className="d-flex justify-content-center m-5 flex-column align-items-center">
                    <CircularProgress size={50} />
                    <Italic className="mt-4">Formulaire en cours de chargement...</Italic>
                </Box>
            ) : (
                <FormMaker<BarsPayload> structure={formStruct} onSubmit={onSubmit} onBackPress={handleOpenClose} outputType="JSON" grammar="Grille" />
            )}
        </Modal>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorAddBars {
    onSubmit: (e: BarsPayload) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
