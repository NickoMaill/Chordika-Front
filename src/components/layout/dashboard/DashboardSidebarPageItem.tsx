import { type Theme, SxProps } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type {} from '@mui/material/themeCssVarsAugmentation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardSidebarContext from '~/context/DashboardSidebarContext';
import { Fragment, JSX, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { MINI_DRAWER_WIDTH } from '~/constants';
import { Link, To } from 'react-router-dom';

export interface DashboardSidebarPageItemProps {
    id: string;
    title: string;
    icon?: ReactNode;
    href?: string;
    linkState?: unknown;
    action?: ReactNode;
    defaultExpanded?: boolean;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
    nestedNavigation?: ReactNode;
    onClick?: () => void;
}

export default function DashboardSidebarPageItem({
    id,
    title,
    icon,
    href,
    linkState,
    action,
    defaultExpanded = false,
    expanded = defaultExpanded,
    selected = false,
    disabled = false,
    nestedNavigation,
    onClick = null,
}: DashboardSidebarPageItemProps): JSX.Element {
    const sidebarContext = useContext(DashboardSidebarContext);
    if (!sidebarContext) {
        throw new Error('Sidebar context was used without a provider.');
    }
    const { onPageItemClick, mini = false, fullyExpanded = true, fullyCollapsed = false } = sidebarContext;

    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        if (onPageItemClick && !onClick) {
            onPageItemClick(id, !!nestedNavigation);
        }
    }, [onPageItemClick, id, nestedNavigation]);

    let nestedNavigationCollapseSx: SxProps<Theme> = { display: 'none' };
    if (mini && fullyCollapsed) {
        nestedNavigationCollapseSx = {
            fontSize: 18,
            position: 'absolute',
            top: '41.5%',
            right: '2px',
            transform: 'translateY(-50%) rotate(-90deg)',
        };
    } else if (!mini && fullyExpanded) {
        nestedNavigationCollapseSx = {
            ml: 0.5,
            fontSize: 20,
            transform: `rotate(${expanded ? 0 : -90}deg)`,
            transition: (theme: Theme): string =>
                theme.transitions.create('transform', {
                    easing: theme.transitions.easing.sharp,
                    duration: 100,
                }),
        };
    }

    const hasExternalHref = href ? href.startsWith('http://') || href.startsWith('https://') : false;

    const LinkComponent = hasExternalHref ? 'a' : Link;
    const internalTo = useMemo<To | undefined>(() => {
        if (!href || hasExternalHref) {
            return undefined;
        }

        const [pathname, search = ''] = href.split('?');

        return {
            pathname,
            search: search ? `?${search}` : '',
        };
    }, [href, hasExternalHref]);

    const miniNestedNavigationSidebarContextValue = useMemo(() => {
        return {
            onPageItemClick: onPageItemClick ?? ((): void => {}),
            mini: false,
            fullyExpanded: true,
            fullyCollapsed: false,
            hasDrawerTransitions: false,
        };
    }, [onPageItemClick]);

    return (
        <Fragment>
            <ListItem
                disablePadding
                {...(nestedNavigation && mini
                    ? {
                          onMouseEnter: (): void => {
                              setIsHovered(true);
                          },
                          onMouseLeave: (): void => {
                              setIsHovered(false);
                          },
                      }
                    : {})}
                sx={{
                    display: 'block',
                    py: 0,
                    px: 1,
                    overflowX: 'hidden',
                }}
            >
                <ListItemButton
                    selected={selected}
                    disabled={disabled}
                    title={title}
                    sx={{
                        height: mini ? 50 : 'auto',
                    }}
                    {...(nestedNavigation && !mini
                        ? {
                              onClick: onClick ? onClick : handleClick,
                          }
                        : {})}
                    {...(!nestedNavigation
                        ? {
                              LinkComponent,
                              ...(hasExternalHref
                                  ? {
                                        target: '_blank',
                                        rel: 'noopener noreferrer',
                                    }
                                  : {}),
                              to: onClick ? undefined : internalTo,
                              state: onClick || hasExternalHref ? undefined : linkState,
                              onClick: onClick ? onClick : handleClick,
                          }
                        : {})}
                >
                    {icon || mini ? (
                        <Box
                            sx={
                                mini
                                    ? {
                                          position: 'absolute',
                                          left: '50%',
                                          top: 'calc(50% - 6px)',
                                          transform: 'translate(-50%, -50%)',
                                      }
                                    : {}
                            }
                        >
                            <ListItemIcon
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: mini ? 'center' : 'auto',
                                }}
                            >
                                {icon ?? null}
                                {!icon && mini ? (
                                    <Avatar
                                        sx={{
                                            fontSize: 10,
                                            height: 16,
                                            width: 16,
                                        }}
                                    >
                                        {title
                                            .split(' ')
                                            .slice(0, 2)
                                            .map((titleWord) => titleWord.charAt(0).toUpperCase())}
                                    </Avatar>
                                ) : null}
                            </ListItemIcon>
                            {mini ? (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -18,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: 10,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: MINI_DRAWER_WIDTH - 28,
                                    }}
                                >
                                    {title}
                                </Typography>
                            ) : null}
                        </Box>
                    ) : null}
                    {!mini ? (
                        <ListItemText
                            primary={title}
                            sx={{
                                whiteSpace: 'nowrap',
                                zIndex: 1,
                            }}
                        />
                    ) : null}
                    {action && !mini && fullyExpanded ? action : null}
                    {nestedNavigation ? <ExpandMoreIcon sx={nestedNavigationCollapseSx} /> : null}
                </ListItemButton>
                {nestedNavigation && mini ? (
                    <Grow in={isHovered}>
                        <Box
                            sx={{
                                position: 'fixed',
                                left: MINI_DRAWER_WIDTH - 2,
                                pl: '6px',
                            }}
                        >
                            <Paper
                                elevation={8}
                                sx={{
                                    pt: 0.2,
                                    pb: 0.2,
                                    transform: 'translateY(-50px)',
                                }}
                            >
                                <DashboardSidebarContext.Provider value={miniNestedNavigationSidebarContextValue}>{nestedNavigation}</DashboardSidebarContext.Provider>
                            </Paper>
                        </Box>
                    </Grow>
                ) : null}
            </ListItem>
            {nestedNavigation && !mini ? (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {nestedNavigation}
                </Collapse>
            ) : null}
        </Fragment>
    );
}
