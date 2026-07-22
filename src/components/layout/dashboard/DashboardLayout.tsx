import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { JSX, useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import NavigationResource from '~/resources/navigationResources';
import Logo from '../Logo';
import LayoutFallback from '../LayoutFallback';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';
import useSessionContext from '~/context/sessionContext';
import useAppContext from '~/context/appContext';
import configManager from '~/managers/configManager';
// import SitemarkIcon from "./SitemarkIcon";

export default function DashboardLayout(): JSX.Element {
    const { breakpoints } = useTheme();
    const { getToken } = useSessionContext();
    const { boxOptions } = useAppContext();

    const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = useState<boolean>(true);
    const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = useState<boolean>(false);

    const { pathname } = useLocation();

    const isOverMdViewport = useMediaQuery(breakpoints.up('md'));

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
            {NavigationResource.noHeaderPath.includes(pathname) || !getToken() || (boxOptions && !boxOptions.showHeader) ? (
                <>
                    <ErrorBoundaryWrapper>
                        <LayoutFallback>
                            <Outlet />
                        </LayoutFallback>
                    </ErrorBoundaryWrapper>
                </>
            ) : (
                <>
                    <DashboardHeader logo={<Logo />} menuOpen={isNavigationExpanded} onToggleMenu={handleToggleHeaderMenu} />
                    <DashboardSidebar expanded={isNavigationExpanded} setExpanded={setIsNavigationExpanded} container={layoutRef?.current ?? undefined} />
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
                            <ErrorBoundaryWrapper>
                                <LayoutFallback>
                                    <Outlet />
                                </LayoutFallback>
                            </ErrorBoundaryWrapper>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}
