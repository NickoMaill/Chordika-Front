// #region IMPORTS -> /////////////////////////////////////
import { UserApiModel } from '~/models/Users';
import { FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import { CenterHandlerConfigType, GenericActionEnum, ICenterConfig } from '~/types/centerType';
import { LogActivities } from './LogActivities';
import appTool from '~/helpers/appTool';
import { LevelAccessEnum } from '~/models/Session';
import { translate } from '~/resources/i18n/i18n';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useUsersHandlers(): CenterHandlerConfigType<UserApiModel> {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleForm = (config: ICenterConfig<UserApiModel>): void => {
        config.formTemplate.push({
            title: translate('user.logHistory') as string,
            icon: 'ManageSearch',
            type: FormMakerPartEnum.PANEL,
            content: [
                {
                    type: 'htmlContent',
                    index: 1,
                    id: 'LogActivities',
                    showLabel: false,
                    size: 12,
                    htmlContent: LogActivities,
                },
            ],
        });
        config.formTemplate[config.formTemplate.length - 1].hidden = (props): boolean => props.action !== GenericActionEnum.UPDATE;
    };
    const handleTable = (config: ICenterConfig<UserApiModel>): void => {
        config.tableStructure.colStruct.forEach((c) => {
            if (c.headerField === 'levelAccess') {
                c.valueFormatter = (e): string => appTool.LevelAccessTranslater(e as LevelAccessEnum);
            }
        });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        handleFormStruct: handleForm,
        handleTableStruct: handleTable,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
