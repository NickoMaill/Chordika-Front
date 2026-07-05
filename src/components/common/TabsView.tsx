// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import useNavigation from '~/hooks/useNavigation';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { IconNameType } from '~/components/common/AppIcon';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function TabsView({ width = 100, containerStyle, tabTitles, content }: ITab): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [currentIndex, setCurrentIndex] = useState<string>('0');
    const [visitedTabs, setVisitedTabs] = useState<string[]>(['0']);
    const nav = useNavigation();
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (_event: SyntheticEvent, newValue: string): void => {
        setCurrentIndex(newValue);
        setVisitedTabs((prev) => (prev.includes(newValue) ? prev : [...prev, newValue]));
    };

    const handleStartIndex = (): void => {
        if (nav.query && nav.query.tab) {
            if (parseInt(nav.query.tab as string) <= content.length - 1 && parseInt(nav.query.tab as string) >= 0) {
                const startIndex = nav.query.tab as string;
                setCurrentIndex(startIndex);
                setVisitedTabs((prev) => (prev.includes(startIndex) ? prev : [...prev, startIndex]));
            }
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        handleStartIndex();
        if (width > 100 || width < 0) {
            throw new AppError(ErrorTypeEnum.Functional, 'tabs view width cannot be bigger than 100 and shorter than 0');
        }
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box sx={{ width: `${width}%`, ...containerStyle }}>
            <TabContext value={currentIndex}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {tabTitles.map((title, i) => {
                            return <Tab key={i} label={title.label} icon={title.icon ? <AppIcon name={title.icon} /> : null} iconPosition="start" value={i.toString()} />;
                        })}
                    </TabList>
                </Box>
                {content.map((element, i) => {
                    return (
                        <AppTabPanel key={i} value={currentIndex} index={i.toString()} isVisited={visitedTabs.includes(i.toString())}>
                            {element}
                        </AppTabPanel>
                    );
                })}
            </TabContext>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function AppTabPanel({ children, value, index, isVisited }): JSX.Element {
    if (!isVisited) {
        return null;
    }

    return (
        <Box role="tabpanel" id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
            <Box className={`animate__animated animate__faster ${value === index ? 'animate__fadeIn' : ''}`} sx={{ p: 3, display: value === index ? 'block' : 'none' }}>
                {children}
            </Box>
        </Box>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface ITab {
    width?: number;
    containerStyle?: SxProps<Theme>;
    tabTitles: { label: string; icon?: IconNameType }[];
    content: ReactNode[];
}
// #endregion IPROPS --> //////////////////////////////////
