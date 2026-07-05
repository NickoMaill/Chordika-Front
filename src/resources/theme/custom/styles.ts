import { SxProps, Theme } from '@mui/material';

export const hoverElStyle: SxProps<Theme> = {
    transition: 'background-color border-color 0.2s ease-in-out',
    '&:hover': {
        bgcolor: 'background.default',
    },
    '&:focus': {
        bgcolor: 'background.default',
    },
    '&:active': {
        bgcolor: 'background.paper',
        borderColor: "secondary.light"
    },
};
