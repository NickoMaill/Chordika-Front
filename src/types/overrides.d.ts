import '@mui/material/IconButton';
import type {} from '@mui/material/themeCssVarsAugmentation';

declare module '@mui/material/IconButton' {
    interface IconButtonOwnProps {
        outline?: string;
    }
}

declare module '@mui/material/styles' {
    interface PaletteColor {
        subtle?: string;
    }

    interface SimplePaletteColorOptions {
        subtle?: string;
    }
}
