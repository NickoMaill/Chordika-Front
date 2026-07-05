// #region IMPORTS -> /////////////////////////////////////
import { UserApiModel } from '~/models/Users';
import { CenterHandlerConfigType, ICenterConfig } from '~/types/centerType';
import appTool from '~/helpers/appTool';
import { LevelAccessEnum } from '~/models/Session';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Users(): CenterHandlerConfigType<UserApiModel> {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleTableStruct = (config: ICenterConfig<UserApiModel>): void => {
        config.tableStructure.colStruct.forEach((col, i) => {
            if (col.headerField === 'levelAccess') {
                config.tableStructure.colStruct[i].valueFormatter = (e: LevelAccessEnum): string => appTool.LevelAccessTranslater(e);
            }
        });
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        handleTableStruct,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
