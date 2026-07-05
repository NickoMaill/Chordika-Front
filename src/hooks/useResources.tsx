import Box from '@mui/material/Box';
import { lazy, ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import HTMLParser from '~/components/common/HTMLParser';
import SearchContext, { SearchField } from '~/context/searchContext';
import appTool from '~/helpers/appTool';
import { ScheduleStatusEnum } from '~/models/Schedule';
import { RecursiveKeyOf } from '~/types/custom';
import { TranslationResourcesType } from '~/types/i18nTypes';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));

export default function useResources(): IUseResources {
    const { t } = useTranslation();
    const Search = useContext(SearchContext);

    const translate = (key: RecursiveKeyOf<TranslationResourcesType>, args?: Record<string, string>): ReactNode | string => {
        const translated = t(key, args).toString();
        if (appTool.containsHTML(translated)) {
            return <HTMLParser>{translated}</HTMLParser>;
        }
        return t(key, args).toString();
    };

    const parseTranslate = (str: string): ReactNode | string => {
        if (str.startsWith('$')) {
            return translate(str.replace('$', '') as RecursiveKeyOf<TranslationResourcesType>);
        } else {
            return str;
        }
    };

    const translateScheduleStatus = (s: ScheduleStatusEnum): string => {
        switch (s) {
            case ScheduleStatusEnum.ONGOING:
                return translate('schedule.ongoing') as string;
            case ScheduleStatusEnum.OK:
                return translate('schedule.ended') as string;
            case ScheduleStatusEnum.ERROR:
                return translate('schedule.error') as string;
            case ScheduleStatusEnum.TIMEOUT:
                return translate('schedule.timeout') as string;
            case ScheduleStatusEnum.STANDBY:
            default:
                return translate('schedule.standby') as string;
        }
    };

    const translateScheduleStatusNode = (s: ScheduleStatusEnum): ReactNode => {
        switch (s) {
            case ScheduleStatusEnum.ONGOING:
                return (
                    <Box className="d-flex align-items-center">
                        <AppIcon name="HourglassTopRounded" color="primary" className="me-1" />
                        {translateScheduleStatus(s)}
                    </Box>
                );
            case ScheduleStatusEnum.OK:
                return (
                    <Box className="d-flex align-items-center">
                        <AppIcon name="CheckCircleRounded" color="success" className="me-1" />
                        {translateScheduleStatus(s)}
                    </Box>
                );
            case ScheduleStatusEnum.ERROR:
                return (
                    <Box className="d-flex align-items-center">
                        <AppIcon name="ErrorRounded" color="error" className="me-1" />
                        {translateScheduleStatus(s)}
                    </Box>
                );
            case ScheduleStatusEnum.TIMEOUT:
                return (
                    <Box className="d-flex align-items-center">
                        <AppIcon name="TimerOffRounded" color="error" className="me-1" />
                        {translateScheduleStatus(s)}
                    </Box>
                );
            case ScheduleStatusEnum.STANDBY:
            default:
                return (
                    <Box className="d-flex align-items-center">
                        <AppIcon name="HourglassDisabledRounded" color="warning" className="me-1" />
                        {translateScheduleStatus(s)}
                    </Box>
                );
        }
    };
    // const importComponent = async <T,>(path: string, props?: T) => {
    //     try {
    //         const module = await import(path);
    //         const DynamicComponent = module.default || module;
    //         return <DynamicComponent {...props} />;
    //     } catch (error) {
    //         throw new AppError(ErrorTypeEnum.Functional, 'error while loading main component, error :' + error, 'loading_error');
    //     }
    // };

    const setSearchContent = (field: string, fieldName: string, value: string): void => {
        let index = -1;
        if (Search.filters && Search.filters.length > 0) {
            index = Search.filters.findIndex((f) => f.field === field);
        }

        if (index < 0) {
            const filterToAppend: SearchField = {
                field,
                fieldName,
                values: value,
            };
            Search.setFilters([filterToAppend]);
        } else if (value === '' || !value) {
            setTimeout(() => {
                Search.setFilters((prevState) => {
                    return prevState.filter((p) => p.field !== field);
                });
            }, 700);
        } else {
            setTimeout(() => {
                Search.setFilters((prevState) => {
                    return prevState.map((obj, i) => {
                        if (i === index) {
                            return { ...obj, ['values']: value };
                        } else {
                            return obj;
                        }
                    });
                });
            }, 700);
        }
    };

    return { translate, setSearchContent, parseTranslate, translateScheduleStatus, translateScheduleStatusNode };
}

export interface IUseResources {
    translate: (key: RecursiveKeyOf<TranslationResourcesType>, args?: Record<string, string>) => ReactNode | string;
    setSearchContent: (field: string, fieldName: string, value: string) => void;
    parseTranslate: (str: string) => ReactNode | string;
    translateScheduleStatus: (s: ScheduleStatusEnum) => string;
    translateScheduleStatusNode: (s: ScheduleStatusEnum) => ReactNode;
    // importComponent: <T>(path: string, props: T) => Promise<JSX.Element>;
}
