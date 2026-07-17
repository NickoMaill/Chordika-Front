// #region IMPORTS -> /////////////////////////////////////
import { JSX, RefObject, useMemo } from 'react'
import FormMaker from '../formMaker/FormMaker';
import { FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import { BarTypeEnum, ScoreBarPayload } from '~/models/Score';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBarForm ({ data, ref }: IEditorBarForm): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const struct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo(() => ([
        {
            title: "",
            type: FormMakerPartEnum.SEARCH,
            content: [
                {
                    id: "type",
                    type: "select",
                    label: "Type de mesure",
                    required: true,
                    selectOptions: [
                        { label: "1-2-3-4", value: BarTypeEnum.B1T_1T_1T_1T },
                        { label: "1-2-3", value: BarTypeEnum.B1T_1T_1T },
                        { label: "1-2-3--", value: BarTypeEnum.B1T_1T_2T },
                        { label: "1-2--4", value: BarTypeEnum.B1T_2T_1T },
                        { label: "1-2--", value: BarTypeEnum.B1T_3T },
                        { label: "1--3-4", value: BarTypeEnum.B2T_1T_1T },
                        { label: "1--3-", value: BarTypeEnum.B2T_2T },
                        { label: "1---4", value: BarTypeEnum.B3T_1T },
                        { label: "1----", value: BarTypeEnum.B4T },
                    ],
                    size: 12,
                    index: 1,
                    value: data.type
                }
            ]
        }
    ]), [data]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <FormMaker structure={struct} showBottom={false} formRef={ref} />
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorBarForm {
    data: ScoreBarPayload
    ref: RefObject<HTMLFormElement>
}
// #enderegion IPROPS --> //////////////////////////////////