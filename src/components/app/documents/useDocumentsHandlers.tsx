// #region IMPORTS -> /////////////////////////////////////
import useDocumentsService from '~/hooks/services/useDocumentsService';
import { ScheduleApiModel } from '~/models/Schedule';
import { CenterHandlerConfigType, ICenterConfig } from '~/types/centerType';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useDocumentsHandlers(): CenterHandlerConfigType<ScheduleApiModel> {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Documents = useDocumentsService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleTableStruct = (config: ICenterConfig<ScheduleApiModel>): void => {
        config.tableStructure.actions.push({
            title: 'Télécharger',
            onClick: (e) => Documents.downloadFile(e.row.id),
            icon: 'DownloadRounded',
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
