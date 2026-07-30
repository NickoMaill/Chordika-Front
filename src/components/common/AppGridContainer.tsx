// #region IMPORTS -> /////////////////////////////////////
import Grid from '@mui/material/Grid';
import { ReactNode } from 'react';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppGridContainer({ children, spacing = 5, width = '100%', align = 'center', ...rest }: IAppGrid): JSX.Element {
    return (
        <Grid container wrap="wrap" className={`flex-wrap align-item-${align}`} sx={{ width }} columnSpacing={{ md: spacing, xs: 0 }} {...rest}>
            {children}
        </Grid>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppGrid {
    children: ReactNode;
    spacing?: number;
    width?: string | number;
    align?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    [key: string]: unknown;
}
// #endregion IPROPS --> //////////////////////////////////
