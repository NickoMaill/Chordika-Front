// #region IMPORTS -> /////////////////////////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { JSX, ReactNode } from 'react';
import { Regular } from '~/components/common/Text';
import DashboardOptionMenu from './DashboardOptionMenu';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function DashboardAvatar({ sideBardExpanded, name = '', email = '' }: IDashboardAvatar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const stringAvatar = (): { children: ReactNode } => {
        const parts = name.split(' ');
        let formattedName = name.split(' ')[0][0];
        if (parts.length > 1) {
            formattedName += name.split(' ')[1][0];
        }
        return {
            children: <Regular variant="h6">{formattedName}</Regular>,
        };
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Stack id="avatar" direction="row" sx={{ p: 2, gap: 1, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', justifyContent: sideBardExpanded ? 'start' : 'center' }}>
            {sideBardExpanded ? (
                <>
                    <Avatar sizes="small" sx={{ padding: 1 }} alt={name} {...stringAvatar()} />
                    <Box sx={{ mr: 'auto' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                            {name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {email}
                        </Typography>
                    </Box>
                    <DashboardOptionMenu />
                </>
            ) : (
                <DashboardOptionMenu>
                    <Avatar sizes="small" sx={{ padding: 1 }} alt={name} {...stringAvatar()} />
                </DashboardOptionMenu>
            )}
        </Stack>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IDashboardAvatar {
    name?: string;
    email?: string;
    sideBardExpanded: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
