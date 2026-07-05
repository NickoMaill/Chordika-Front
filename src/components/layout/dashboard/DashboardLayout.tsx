import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { JSX, useCallback, useContext, useRef, useState } from 'react';
import Logo from '../Logo';
import LayoutFallback from '../LayoutFallback';
import AppContext from '~/context/appContext';
// import SitemarkIcon from "./SitemarkIcon";

export default function DashboardLayout(): JSX.Element {
    const theme = useTheme();
    const App = useContext(AppContext);

    const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = useState<boolean>(true);
    const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = useState<boolean>(false);

    const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

    const isNavigationExpanded = isOverMdViewport ? isDesktopNavigationExpanded : isMobileNavigationExpanded;

    const setIsNavigationExpanded = useCallback(
        (newExpanded: boolean) => {
            if (isOverMdViewport) {
                setIsDesktopNavigationExpanded(newExpanded);
            } else {
                setIsMobileNavigationExpanded(newExpanded);
            }
        },
        [isOverMdViewport, setIsDesktopNavigationExpanded, setIsMobileNavigationExpanded]
    );

    const handleToggleHeaderMenu = useCallback(
        (isExpanded: boolean) => {
            setIsNavigationExpanded(isExpanded);
        },
        [setIsNavigationExpanded]
    );

    const layoutRef = useRef<HTMLDivElement>(null);

    return (
        <Box
            ref={layoutRef}
            sx={{
                position: 'relative',
                display: 'flex',
                overflow: 'hidden',
                height: '100vh',
                width: '100%',
            }}
        >
            <DashboardHeader logo={<Logo />} title="Chordika" menuOpen={isNavigationExpanded} onToggleMenu={handleToggleHeaderMenu} />
            {App.isVisitorHeader() ? <></> : <DashboardSidebar expanded={isNavigationExpanded} setExpanded={setIsNavigationExpanded} container={layoutRef?.current ?? undefined} />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Toolbar sx={{ displayPrint: 'none' }} />
                <Box
                    component="main"
                    className="p-3"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflow: 'auto',
                        height: '100vh',
                    }}
                >
                    <LayoutFallback>
                        <Outlet />
                    </LayoutFallback>
                </Box>
            </Box>
        </Box>
    );
}
