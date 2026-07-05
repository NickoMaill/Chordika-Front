import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { matchPath, useLocation } from 'react-router';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '../../../constants';
import DashboardSidebarPageItem from './DashboardSidebarPageItem';
import DashboardSidebarDividerItem from './DashboardSidebarDividerItem';
import { getDrawerSxTransitionMixin, getDrawerWidthTransitionMixin } from '../../../mixins';
import { Fragment, JSX, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import DashboardSidebarContext from '~/context/DashboardSidebarContext';
import NavigationResource from '~/resources/navigationResources';
import useResources from '~/hooks/useResources';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
import DashboardAvatar from './DashboardAvatar';
import useSessionContext from '~/context/sessionContext';
import AppIcon from '~/components/common/AppIcon';

export interface DashboardSidebarProps {
    expanded?: boolean;
    setExpanded: (expanded: boolean) => void;
    disableCollapsibleSidebar?: boolean;
    container?: Element;
}

export default function DashboardSidebar({ expanded = true, setExpanded, disableCollapsibleSidebar = false, container }: DashboardSidebarProps): JSX.Element {
    const theme = useTheme();

    const { pathname } = useLocation();
    const { translate } = useResources();
    const { accessLevel, email, fullName, proxyList } = useSessionContext();
    const SessionService = useSessionService();
    const Navigation = useNavigation();

    const [expandedItemIds, setExpandedItemIds] = useState<string[]>([]);

    const isOverSmViewport = useMediaQuery(theme.breakpoints.up('sm'));
    const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

    const [isFullyExpanded, setIsFullyExpanded] = useState<boolean>(expanded);
    const [isFullyCollapsed, setIsFullyCollapsed] = useState<boolean>(!expanded);
    const [child, _setChild] = useState<Record<string, ReactNode>>({});

    useEffect(() => {
        if (expanded) {
            const drawerWidthTransitionTimeout = setTimeout(() => {
                setIsFullyExpanded(true);
            }, theme.transitions.duration.enteringScreen);

            return (): void => clearTimeout(drawerWidthTransitionTimeout);
        }

        setIsFullyExpanded(false);

        return (): void => {};
    }, [expanded, theme.transitions.duration.enteringScreen]);

    useEffect(() => {
        if (!expanded) {
            const drawerWidthTransitionTimeout = setTimeout(() => {
                setIsFullyCollapsed(true);
            }, theme.transitions.duration.leavingScreen);

            return (): void => clearTimeout(drawerWidthTransitionTimeout);
        }

        setIsFullyCollapsed(false);

        return (): void => {};
    }, [expanded, theme.transitions.duration.leavingScreen]);

    const mini = !disableCollapsibleSidebar && !expanded;

    const handleSetSidebarExpanded = useCallback(
        (newExpanded: boolean) => (): void => {
            setExpanded(newExpanded);
        },
        [setExpanded]
    );

    const handlePageItemClick = useCallback(
        (itemId: string, hasNestedNavigation: boolean) => {
            if (hasNestedNavigation && !mini) {
                setExpandedItemIds((previousValue) => (previousValue.includes(itemId) ? previousValue.filter((previousValueItemId) => previousValueItemId !== itemId) : [...previousValue, itemId]));
            } else if (!isOverSmViewport && !hasNestedNavigation) {
                setExpanded(false);
            }
        },
        [mini, setExpanded, isOverSmViewport]
    );

    const headerMethod = {
        logout: async (): Promise<void> => {
            await SessionService.logout().then((_res) => {
                Navigation.navigateByPath(NavigationResource.routesPath.login);
            });
        },
        // proxyLogout: async (): Promise<void> => {
        //     await SessionService.proxyLogout();
        // },
    };

    const renderLink = (): JSX.Element[] => {
        return NavigationResource.navigationHeaderInfo
            .filter((x) => ('levelAccess' in x ? x.levelAccess <= accessLevel : null))
            .map((navEl, i) => {
                if (navEl.name === 'divider') {
                    return <DashboardSidebarDividerItem key={i} />;
                } else if (navEl.link) {
                    return (
                        <DashboardSidebarPageItem
                            key={i}
                            id={'_' + i}
                            title={translate(navEl.name) as string}
                            icon={<AppIcon name={navEl.icon} />}
                            href={navEl.link}
                            linkState={{
                                sidebarNavigationToken: Date.now(),
                                ...(navEl.link === NavigationResource.routesPath.movies ? { resetMovieSearch: Date.now() } : {}),
                            }}
                            selected={!!matchPath(`${navEl.link}/*`, pathname)}
                        />
                    );
                } else if (navEl.method) {
                    return (
                        <DashboardSidebarPageItem
                            key={i}
                            id={'_' + navEl.method}
                            title={translate(navEl.name) as string}
                            href={null}
                            icon={<AppIcon name={navEl.icon} />}
                            onClick={!navEl.isFolder ? (): void => headerMethod[navEl.method as string]() : null}
                            selected={false}
                            nestedNavigation={
                                navEl.isFolder ? (
                                    <List
                                        dense
                                        sx={{
                                            padding: 0,
                                            my: 1,
                                            pl: mini ? 0 : 1,
                                            minWidth: 240,
                                        }}
                                    >
                                        {child[navEl.method + 'Child']}
                                    </List>
                                ) : null
                            }
                            defaultExpanded={false}
                            expanded={expandedItemIds.includes('_' + navEl.method)}
                        />
                    );
                }
            })
            .flat();
    };

    const hasDrawerTransitions = isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

    const getDrawerContent = useCallback(
        (viewport: 'phone' | 'tablet' | 'desktop') => (
            <Fragment>
                <Toolbar />
                <Box
                    component="nav"
                    aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'auto',
                        scrollbarGutter: mini ? 'stable' : 'auto',
                        overflowX: 'hidden',
                        pt: !mini ? 0 : 2,
                        ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, 'padding') : {}),
                    }}
                >
                    <List
                        dense
                        sx={{
                            padding: mini ? 0 : 0.5,
                            mb: 4,
                            width: mini ? MINI_DRAWER_WIDTH : 'auto',
                        }}
                    >
                        {renderLink()}
                    </List>
                </Box>
                <DashboardAvatar sideBardExpanded={expanded} name={fullName ?? ''} email={email ?? ''} />
            </Fragment>
        ),
        [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname, renderLink]
    );

    const getDrawerSharedSx = useCallback(
        (isTemporary: boolean) => {
            const drawerWidth = mini ? MINI_DRAWER_WIDTH : (proxyList ?? []).length > 0 ? 350 : DRAWER_WIDTH;

            return {
                displayPrint: 'none',
                width: drawerWidth,
                flexShrink: 0,
                ...getDrawerWidthTransitionMixin(expanded),
                ...(isTemporary ? { position: 'absolute' } : {}),
                [`& .MuiDrawer-paper`]: {
                    position: 'absolute',
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundImage: 'none',
                    ...getDrawerWidthTransitionMixin(expanded),
                },
            };
        },
        [expanded, mini]
    );

    const sidebarContextValue = useMemo(() => {
        return {
            onPageItemClick: handlePageItemClick,
            mini,
            fullyExpanded: isFullyExpanded,
            fullyCollapsed: isFullyCollapsed,
            hasDrawerTransitions,
        };
    }, [handlePageItemClick, mini, isFullyExpanded, isFullyCollapsed, hasDrawerTransitions]);

    return (
        <DashboardSidebarContext.Provider value={sidebarContextValue}>
            <Drawer
                container={container}
                variant="temporary"
                open={expanded}
                onClose={handleSetSidebarExpanded(false)}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: {
                        xs: 'block',
                        sm: disableCollapsibleSidebar ? 'block' : 'none',
                        md: 'none',
                    },
                    ...getDrawerSharedSx(true),
                }}
            >
                {getDrawerContent('phone')}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: {
                        xs: 'none',
                        sm: disableCollapsibleSidebar ? 'none' : 'block',
                        md: 'none',
                    },
                    ...getDrawerSharedSx(false),
                }}
            >
                {getDrawerContent('tablet')}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    ...getDrawerSharedSx(false),
                }}
            >
                {getDrawerContent('desktop')}
            </Drawer>
        </DashboardSidebarContext.Provider>
    );
}
