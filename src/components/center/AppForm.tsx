// #region IMPORTS -> /////////////////////////////////////
import CenterBase from './CenterBase';
import { CenterSpecifierType, GenericActionEnum, ICenterBase } from '~/types/centerType';
import FormMaker from '../formMaker/FormMaker';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppForm<T>({ baseProps, data, formMakerBaseProps, specifiers, actionName, onBackPress, onSubmit, isView = false }: IAppForm<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {baseProps.isSubCenter ? (
                <FormMaker<T> {...formMakerBaseProps} data={data} onBackPress={onBackPress} isView={isView} onSubmit={onSubmit} />
            ) : (
                <CenterBase {...baseProps} prefix={actionName} article={specifiers.singular}>
                    <FormMaker<T> {...formMakerBaseProps} data={data} onBackPress={onBackPress} isView={isView} onSubmit={onSubmit} />
                </CenterBase>
            )}
        </>
    );

    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppForm<T> {
    baseProps: ICenterBase;
    data: T;
    specifiers: CenterSpecifierType;
    formMakerBaseProps: {
        focusOnError: string[];
        isSubmitLoading: boolean;
        structure: FormMakerContentType<FormMakerPartEnum>[];
        action: GenericActionEnum;
        grammar: string;
    };
    onBackPress: () => void;
    onSubmit?: (f: FormData | T) => void;
    actionName: string;
    isView?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
