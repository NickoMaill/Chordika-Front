// #region IMPORTS -> /////////////////////////////////////
import { JSX, MouseEvent, ReactNode, useState } from 'react';
import AppIcon, { IconNameType } from './AppIcon';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuItemProps, PopoverPosition, SxProps, Theme } from '@mui/material';
import { Link } from 'react-router-dom';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type MenuListOptionType<T = unknown> = T & {
    label?: string;
    icon?: IconNameType;
    iconColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    onClick?: () => void;
    href?: string;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function AppMenuList({
    options,
    buttonIcon,
    buttonStyle,
    iconButtonStyle,
    buttonClassName,
    iconButtonClassName,
    outlined = 'true',
    anchorComponent,
    anchorPosition,
}: IAppMenuList): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl ?? anchorPosition);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleClick = (event: MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {anchorComponent ? (
                anchorComponent({ onClick: handleClick })
            ) : (
                <IconButton outline={outlined} onClick={handleClick} sx={buttonStyle} className={buttonClassName}>
                    <AppIcon name={buttonIcon ?? 'MoreVertRounded'} sx={iconButtonStyle} className={iconButtonClassName} />
                </IconButton>
            )}
            <Menu open={open} disableAutoFocusItem onClose={handleClose} anchorEl={anchorPosition ? null : anchorEl} anchorReference={anchorPosition ? 'anchorPosition' : "anchorEl"} anchorPosition={anchorPosition}>
                {options.map((a, i) => (
                    <MenuElement autoFocus tabIndex={i+1} key={i} handleClose={handleClose} onClick={a.onClick} href={a.href}>
                        {a.icon && (
                            <ListItemIcon>
                                <AppIcon sx={{ fontSize: '1.4rem!important' }} name={a.icon} color={a.iconColor} />
                            </ListItemIcon>
                        )}
                        {a.label && <ListItemText>{a.label}</ListItemText>}
                    </MenuElement>
                ))}
            </Menu>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppMenuList {
    options: MenuListOptionType[];
    buttonIcon?: IconNameType;
    buttonStyle?: SxProps<Theme>;
    buttonClassName?: string;
    iconButtonStyle?: SxProps<Theme>;
    iconButtonClassName?: string;
    outlined?: 'true' | 'false';
    anchorComponent?: (props: { onClick: (event: MouseEvent<HTMLElement>) => void }) => ReactNode;
    anchorPosition?: PopoverPosition;
}
// #enderegion IPROPS --> //////////////////////////////////

function MenuElement({ href, onClick, handleClose, ...baseProps }: MenuItemProps & { href?: string; onClick?: () => void; handleClose?: () => void }): JSX.Element {
    if (href) {
        return <MenuItem component={Link} to={href} {...baseProps} />;
    } else {
        return (
            <MenuItem
                onClick={() => {
                    handleClose();
                    onClick();
                }}
                {...baseProps}
            />
        );
    }
}
