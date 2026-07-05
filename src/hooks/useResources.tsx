import Box from '@mui/material/Box';
import { lazy, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import HTMLParser from '~/components/common/HTMLParser';
import { Regular } from '~/components/common/Text';
import useSearchContext from '~/context/searchContext';
import { SearchField } from '~/context/searchContext';
import appTool from '~/helpers/appTool';
import { ScheduleStatusEnum } from '~/models/Schedule';
import { TranslateType } from '~/types/i18nTypes';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));

export default function useResources(): IUseResources {
    const { t } = useTranslation();
    const { filters, setFilters } = useSearchContext();

    const translate = (key: TranslateType, args?: Record<string, string>): string | ReactNode => {
        const translated = t(key as string, args).toString();
        if (appTool.containsHTML(translated)) {
            return <HTMLParser>{translated}</HTMLParser>;
        }
        return t(key as string, args).toString();
    };

    const parseTranslate = (str: string): ReactNode | string => {
        if (str.startsWith('$')) {
            return translate(str.replace('$', '') as TranslateType);
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
        if (filters && filters.length > 0) {
            index = filters.findIndex((f) => f.field === field);
        }

        if (index < 0) {
            const filterToAppend: SearchField = {
                field,
                fieldName,
                values: value,
            };
            setFilters([filterToAppend]);
        } else if (value === '' || !value) {
            setTimeout(() => {
                setFilters((prevState) => {
                    return prevState.filter((p) => p.field !== field);
                });
            }, 700);
        } else {
            setTimeout(() => {
                setFilters((prevState) => {
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

    const stringAvatar = (name: string): { children: ReactNode } => {
        const cleanedName = name.replaceAll(/\b(?:l|d|j|m|t|s|n|c|qu)['’]|(?:le|la|les|un|une|des|du|de|au|aux|ce|cet|cette|ces)\b/gi, '');
        const parts = cleanedName.split(' ').filter((x) => x && x !== '');
        let formattedName = cleanedName.split(' ')[0][0];
        if (parts.length > 1) {
            formattedName += cleanedName.split(' ').filter((x) => x && x !== '')[1][0];
        }
        return {
            children: <Regular variant="h6">{formattedName?.toUpperCase()}</Regular>,
        };
    };

    return { translate, setSearchContent, parseTranslate, translateScheduleStatus, translateScheduleStatusNode, stringAvatar };
}

export interface IUseResources {
    translate: (key: TranslateType, args?: Record<string, string>) => string | ReactNode;
    setSearchContent: (field: string, fieldName: string, value: string) => void;
    parseTranslate: (str: string) => ReactNode | string;
    translateScheduleStatus: (s: ScheduleStatusEnum) => string;
    translateScheduleStatusNode: (s: ScheduleStatusEnum) => ReactNode;
    stringAvatar: (name: string) => { children: ReactNode };
    // importComponent: <T>(path: string, props: T) => Promise<JSX.Element>;
}
