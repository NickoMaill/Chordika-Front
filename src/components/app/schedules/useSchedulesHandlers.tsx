// #region IMPORTS -> /////////////////////////////////////
import { ScheduleApiModel } from '~/models/Schedule';
import { CenterHandlerConfigType, GenericActionEnum, ICenterConfig } from '~/types/centerType';
import { FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import ScheduleMonitor from './ScheduleMonitor';
import ScheduleHistory from './ScheduleHistory';
import { translate } from '~/resources/i18n/i18n';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function useSchedulesHandlers(): CenterHandlerConfigType<ScheduleApiModel> {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleForm = (conf: ICenterConfig<ScheduleApiModel>): void => {
        conf.formTemplate[1].hidden = (props): boolean => props.action !== GenericActionEnum.UPDATE;
        conf.formTemplate[2].hidden = (props): boolean => props.action !== GenericActionEnum.UPDATE;
        conf.formTemplate[1].content = [
            {
                title: translate('schedule.monitoring') as string,
                icon: 'Monitor',
                type: FormMakerPartEnum.PANEL,
                content: [
                    {
                        type: 'htmlContent',
                        index: 1,
                        id: 'ScheduleMonitor',
                        size: 12,
                        htmlContent: ScheduleMonitor,
                    },
                ],
            },
        ];
        conf.formTemplate[2].content = [
            {
                title: translate('schedule.monitoring') as string,
                icon: 'Monitor',
                type: FormMakerPartEnum.PANEL,
                content: [
                    {
                        type: 'htmlContent',
                        index: 1,
                        id: 'ScheduleHistory',
                        size: 12,
                        htmlContent: ScheduleHistory,
                    },
                ],
            },
        ];
    };

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        handleFormStruct: handleForm,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
