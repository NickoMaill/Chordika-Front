// #region IMPORTS -> /////////////////////////////////////
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { lazy, ReactNode } from 'react';
import { Theme } from '@emotion/react';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import { SxProps } from '@mui/material/styles';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCard({ children, title, icon, sx, id, className }: IAppCard): JSX.Element {
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
        <Card className={className} id={id} sx={{ marginBlock: 2, overflow: 'auto', ...sx }}>
            {title && <CardHeader title={title} style={{ paddingBottom: 10, width: '100%' }} slotProps={{ title: { fontSize: 22 } }} avatar={icon && <AppIcon name={icon} sx={{ fontSize: 26 }} />} />}
            <CardContent>{children}</CardContent>
        </Card>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCard {
    children: ReactNode;
    title?: string;
    icon?: IconNameType;
    sx?: SxProps<Theme>;
    className?: string;
    id?: string;
}
// #endregion IPROPS --> //////////////////////////////////
