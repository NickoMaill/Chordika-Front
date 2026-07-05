// #region IMPORTS -> /////////////////////////////////////
import CenterBase from './CenterBase';
import { CenterSpecifierType, GenericActionEnum, ICenterBase } from '~/types/centerType';
import FormMaker from '../formMaker/FormMaker';
import { FormMakerType, FormMakerFocusErrorType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCenterForm<T>({ baseProps, data, formMakerBaseProps, specifiers, actionName, onBackPress, onSubmit, isView = false, recordId }: IAppCenterForm<T>): JSX.Element {
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
                <FormMaker<T> {...formMakerBaseProps} data={data} recordId={recordId} onBackPress={onBackPress} isView={isView} onSubmit={onSubmit} />
            ) : (
                <CenterBase {...baseProps} prefix={actionName} article={specifiers.singular}>
                    <FormMaker<T> {...formMakerBaseProps} data={data} recordId={recordId} onBackPress={onBackPress} isView={isView} onSubmit={onSubmit} />
                </CenterBase>
            )}
        </>
    );

    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCenterForm<T> {
    baseProps: ICenterBase;
    data: T;
    specifiers: CenterSpecifierType;
    formMakerBaseProps: {
        focusOnError: FormMakerFocusErrorType[];
        isSubmitLoading: boolean;
        structure: FormMakerType<FormMakerPartEnum>;
        action: GenericActionEnum;
        grammar: string;
    };
    onBackPress: () => void;
    onSubmit?: (f: FormData | T) => void;
    actionName: string;
    isView?: boolean;
    recordId?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
