// #region IMPORTS -> /////////////////////////////////////
import React, { JSX, RefObject, useMemo } from 'react';

import { FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import FormMaker from '../../formMaker/FormMaker';

import { BarsPayload, ScoreBarGroup } from '~/models/Score';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorGroupForm({ formRef, data }: IEditorAddBars): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const formStruct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo(() => [
        {
            title: '',
            type: FormMakerPartEnum.SEARCH,
            content: [
                {
                    id: 'title',
                    label: 'titre de la section',
                    index: 1,
                    size: 12,
                    type: "text",
                    value: data?.title
                },
                {
                    id: 'nb',
                    label: 'Nombre de mesures',
                    index: 1,
                    size: 12,
                    required: true,
                    type: "number",
                    value: data?.content.length
                },
                {
                    id: 'perLines',
                    label: 'Mesures par ligne',
                    index: 1,
                    size: 12,
                    type: "number",
                    value: data?.maxLength
                },
            ],
        },
    ], [data]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <FormMaker<BarsPayload> structure={formStruct} formRef={formRef} showBottom={false} grammar="Grille" />;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorAddBars {
    formRef: RefObject<HTMLFormElement>;
    data?: ScoreBarGroup
}
// #enderegion IPROPS --> //////////////////////////////////
