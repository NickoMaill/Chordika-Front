// #region IMPORTS -> /////////////////////////////////////
import { JSX, RefObject, useMemo } from 'react';
import FormMaker from '~/components/formMaker/FormMaker';
import { FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorTextForm({ formRef, value }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const struct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo(
        () => [
            {
                title: '',
                type: FormMakerPartEnum.SEARCH,
                content: [
                    {
                        id: 'text',
                        type: "textarea",
                        label: 'Texte',
                        required: true,
                        size: 12,
                        index: 1,
                        value,
                    },
                ],
            },
        ],
        [value]
    );
    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <FormMaker structure={struct} showBottom={false} formRef={formRef} />;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorTextForm {
    formRef: RefObject<HTMLFormElement>;
    value?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
