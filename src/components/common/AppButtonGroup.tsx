// #region IMPORTS -> /////////////////////////////////////
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { JSX } from 'react';
import { MenuListOptionType } from './AppMenuList';
import AppIcon from './AppIcon';
import { Link } from 'react-router-dom';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type ButtonGroupOptionsType = MenuListOptionType<{ externalLink?: string; iconPosition?: 'right' | 'left'; iconFontSize?: string | number, isLoading?: boolean }>;
// #endregion SINGLETON --> /////////////////////////////////

export default function AppButtonGroup({ options, size = 'medium', color, labelAsTip = false }: IAppButtonGroup): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ButtonGroup size={size} color={color}>
            {options.map((o, i) => {
                const labelVisible = !!o.label && !labelAsTip;
                const isLabelAndIcon = !!o.icon && labelVisible;
                const props: Record<string, unknown> = { component: 'button' };
                if (o.onClick) {
                    props.onClick = o.onClick;
                } else if (o.href) {
                    props.component = Link;
                    props.to = o.href;
                } else if (o.externalLink) {
                    props.component = 'a';
                    props.href = o.href;
                    props.target = '_blank';
                }
                return (
                    <Tooltip title={labelAsTip ? o.label : null}>
                        <Button
                            key={i}
                            startIcon={isLabelAndIcon && o.iconPosition === 'left' ? <AppIcon name={o.icon} /> : null}
                            endIcon={isLabelAndIcon && o.iconPosition === 'right' ? <AppIcon name={o.icon} /> : null}
                            loading={o.isLoading}
                            {...props}
                        >
                            {isLabelAndIcon || labelVisible ? o.label : o.icon && !labelVisible ? <AppIcon name={o.icon} sx={{ fontSize: o.iconFontSize }} /> : null}
                        </Button>
                    </Tooltip>
                );
            })}
        </ButtonGroup>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppButtonGroup {
    options: ButtonGroupOptionsType[];
    size?: 'small' | 'medium' | 'large';
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    labelAsTip?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
