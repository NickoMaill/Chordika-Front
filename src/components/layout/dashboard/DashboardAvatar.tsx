// #region IMPORTS -> /////////////////////////////////////
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { JSX } from 'react';
import DashboardOptionMenu from './DashboardOptionMenu';
import useResources from '~/hooks/useResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function DashboardAvatar({ sideBardExpanded, name = '' }: IDashboardAvatar): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { stringAvatar } = useResources();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Stack direction="row" sx={{ p: 2, gap: 1, alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', justifyContent: sideBardExpanded ? 'start' : 'center' }}>
            {sideBardExpanded ? (
                <>
                    <Avatar sizes="small" sx={{ padding: 1 }} alt={name} {...stringAvatar(name)} />
                    <Box sx={{ mr: 'auto' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                            {name}
                        </Typography>
                        {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {email}
                        </Typography> */}
                    </Box>
                    <DashboardOptionMenu />
                </>
            ) : (
                <DashboardOptionMenu>
                    <Avatar sizes="small" sx={{ padding: 1 }} alt={name} {...stringAvatar(name)} />
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
