// #region IMPORTS -> /////////////////////////////////////
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { lazy, ReactNode } from 'react';
import { Theme } from '@emotion/react';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import { SxProps } from '@mui/material/styles';
import { Divider } from '@mui/material';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCard({ children, title, icon, sx, id, className, divider = false, subheader, action }: IAppCard): JSX.Element {
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
        <Card className={(className ?? '') + (divider ? ' p-0' : '')} component={'article'} id={id} sx={{ overflow: 'auto', ...sx }}>
            <CardHeader
                className={divider ? 'p-3' : ''}
                title={title}
                subheader={subheader}
                action={action}
                style={{ paddingBottom: 10, width: '100%' }}
                slotProps={{
                    title: { 
                        sx:{
                            fontSize: 22,
                        },
                        variant: "h5"
                    },
                    action: {
                        className: 'd-flex align-items-center',
                        sx: { height: 'stretch' },
                    },
                }}
                avatar={icon && <AppIcon name={icon} sx={{ fontSize: 26 }} />}
            />
            {divider && <Divider />}
            <CardContent className={divider ? 'p-2' : ''}>{children}</CardContent>
        </Card>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCard {
    children: ReactNode;
    title: string;
    icon?: IconNameType;
    sx?: SxProps<Theme>;
    className?: string;
    id?: string;
    divider?: boolean;
    subheader?: ReactNode;
    action?: ReactNode;
}
// #endregion IPROPS --> //////////////////////////////////
