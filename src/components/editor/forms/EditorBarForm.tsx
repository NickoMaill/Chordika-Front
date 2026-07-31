// #region IMPORTS -> /////////////////////////////////////
import { JSX, RefObject, useMemo } from 'react';
import FormMaker, { FormMakerChange } from '../../formMaker/FormMaker';
import { FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import { BarTypeEnum, ScoreBar, ScoreBarPayload } from '~/models/Score';
import { Button } from '@mui/material';
import AppIcon from '~/components/common/AppIcon';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorBarForm({ data, ref, onChange }: IEditorBarForm): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const struct: FormMakerType<FormMakerPartEnum.SEARCH> = useMemo<FormMakerType<FormMakerPartEnum.SEARCH>>(
        () => [
            {
                title: '',
                type: FormMakerPartEnum.SEARCH,
                content: [
                    {
                        id: 'type',
                        type: 'select',
                        label: 'Type de mesure',
                        required: true,
                        selectOptions: [
                            { label: '1-2-3-4', value: BarTypeEnum.B1T_1T_1T_1T },
                            { label: '1-2-3', value: BarTypeEnum.B1T_1T_1T },
                            { label: '1-2-3--', value: BarTypeEnum.B1T_1T_2T },
                            { label: '1-2--4', value: BarTypeEnum.B1T_2T_1T },
                            { label: '1-2--', value: BarTypeEnum.B1T_3T },
                            { label: '1--3-4', value: BarTypeEnum.B2T_1T_1T },
                            { label: '1--3-', value: BarTypeEnum.B2T_2T },
                            { label: '1---4', value: BarTypeEnum.B3T_1T },
                            { label: '1----', value: BarTypeEnum.B4T },
                        ],
                        size: 12,
                        index: 1,
                        value: data.type,
                    }, 
                    {
                        id: "repeat",
                        label: "Répétition",
                        type: "select",
                        selectOptions: [
                            { label: "Début", value: "start" },
                            { label: "Fin", value: "end" },
                        ],
                        index: 1,
                        size: 12,
                        value: data?.isRepeatStart ? "start" : data?.isRepeatEnd ? "end" : null
                    }
                ],
            },
        ],
        [data]
    );
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <FormMaker structure={struct} showBottom={false} formRef={ref} onChange={onChange} />;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorBarForm {
    data: ScoreBar;
    ref?: RefObject<HTMLFormElement>;
    onChange?: (e: FormMakerChange) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
