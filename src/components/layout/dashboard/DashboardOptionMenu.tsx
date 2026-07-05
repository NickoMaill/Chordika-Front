// #region IMPORTS -> /////////////////////////////////////
import Badge, { badgeClasses } from '@mui/material/Badge';
import Divider, { dividerClasses } from '@mui/material/Divider';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { listClasses } from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import React, { JSX, lazy, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { matchPath, useLocation } from 'react-router-dom';
import useSessionContext from '~/context/sessionContext';
import useSessionService from '~/hooks/services/useSessionService';
import useNavigation from '~/hooks/useNavigation';
import useResources from '~/hooks/useResources';
import NavigationResource from '~/resources/navigationResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function DashboardOptionMenu({ children }: { children?: ReactNode }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { pathname } = useLocation();
    const { userId, accessLevel, proxyList } = useSessionContext();
    const { translate } = useResources();
    const { logout, proxyLogout } = useSessionService();
    const { navigateByPath } = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const headerMethod = {
        logout: async (): Promise<void> => {
            await logout().then(() => {
                navigateByPath(NavigationResource.routesPath.login);
            });
        },
        proxyLogout: async (): Promise<void> => {
            await proxyLogout();
        },
    };

    const renderLink = (): JSX.Element[] => {
        const menu = NavigationResource.userNavigationLinks
            .filter((x) => ('levelAccess' in x ? x.levelAccess <= accessLevel : null))
            .map((navEl, i) => {
                if (navEl.name === 'divider') {
                    return <Divider key={i} />;
                } else if ('redirect' in navEl && !navEl.redirect) {
                    return (
                        <MenuItem key={i} id="employees" onClick={() => headerMethod[navEl.method as string]()} selected={false}>
                            <ListItemIcon>
                                <AppIcon name={navEl.icon} size="small" />
                            </ListItemIcon>
                            <ListItemText>{translate(navEl.name) as string}</ListItemText>
                        </MenuItem>
                    );
                } else if ('link' in navEl) {
                    return (
                        <MenuItem component={Link} to={navEl.link} key={i} id="employees" title={translate(navEl.name) as string} selected={!!matchPath(`${navEl.link}/*`, pathname)}>
                            <ListItemIcon>
                                <AppIcon name={navEl.icon} size="small" />
                            </ListItemIcon>
                            <ListItemText>{translate(navEl.name) as string}</ListItemText>
                        </MenuItem>
                    );
                }
            })
            .flat();
        if (proxyList && proxyList.length > 0) {
            const iProxy = proxyList.findIndex((x) => x.id === userId);
            if (iProxy > -1) {
                menu.splice(
                    menu.length - 1,
                    0,
                    <MenuItem key={1000} id="employees" onClick={() => headerMethod.proxyLogout()}>
                        Se déconnecter du compte "{proxyList[iProxy].name}"
                    </MenuItem>
                );
            } else {
                proxyList.forEach((p, i2) => {
                    menu.splice(
                        menu.length - 1,
                        0,
                        <MenuItem key={i2 + 1000} id="employees" onClick={() => headerMethod.proxyLogout()}>
                            Se reconnecter au compte "{p.name}"
                        </MenuItem>
                    );
                });
            }
        }
        return menu.flat();
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <MenuButton outline={children ? null : 'true'} aria-label="Open menu" onClick={handleClick}>
                {children ? children : <AppIcon name="MoreVertRounded" />}
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '4px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                        // top: "590px!important"
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },
                }}
            >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Add another account</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <Divider /> */}
                {renderLink()}
                {/* <MenuItem
                    onClick={handleClose}
                    sx={{
                        [`& .${listItemIconClasroot}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText>Logout</ListItemText>
                    <ListItemIcon>
                        <AppIcon name="LogoutRounded" />
                    </ListItemIcon>
                </MenuItem> */}
            </Menu>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////

function MenuButton({ showBadge = false, ...props }: MenuButtonProps): JSX.Element {
    return (
        <Badge color="error" variant="dot" invisible={!showBadge} sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}>
            <IconButton size="small" {...props} />
        </Badge>
    );
}

interface MenuButtonProps extends IconButtonProps {
    showBadge?: boolean;
}
