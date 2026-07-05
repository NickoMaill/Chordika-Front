// #region IMPORTS -> /////////////////////////////////////
// #endregion IMPORTS -> //////////////////////////////////

import { JSX, ReactNode } from 'react';
import AppIcon, { IconNameType } from '../common/AppIcon';
import Box from '@mui/material/Box';
import { Bold } from '../common/Text';
import { SxProps, Theme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import stylesResources from '~/resources/stylesResources';
import Paper from '@mui/material/Paper';

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function SectionLayout({ children, title, icon, sx, id, className }: ISectionLayout): JSX.Element {
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
        <Paper className={'mb-4 p-3 ' + className} id={id} sx={{ marginBlock: 2, overflow: 'auto', ...sx }}>
            <Box style={{ paddingBottom: 15, width: '100%' }}>
                <Box className="d-flex align-items-center">
                    {icon && <AppIcon name={icon} className="me-2" sx={{ fontSize: 26, color: stylesResources.theme.palette.text.secondary }} />}
                    <Bold color="textSecondary" fontSize={23}>
                        {title}
                    </Bold>
                </Box>
                <Divider />
            </Box>
            <Box className="p-1">{children}</Box>
        </Paper>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ISectionLayout {
    children: ReactNode;
    title: string;
    icon?: IconNameType;
    sx?: SxProps<Theme>;
    className?: string;
    id?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
