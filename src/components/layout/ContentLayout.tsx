// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy, ReactNode } from 'react';
import { Bold, Regular } from '../common/Text';
import AppFullPageLoader from '../common/AppFullPageLoader';
import { IconNameType } from '~/components/common/AppIcon';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Breadcrumbs, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import useAppContext from '~/context/appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function ContentLayout({ children, title, subtitle = null, icon, isLoading = false, loaderMessage = null, actions, showTitle = true }: IContentLayout): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const AppCtx = useAppContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            {showTitle && (
                <>
                    <Grid direction={'row'} className="mb-3" alignItems={'center'} container>
                        <Grid size={actions ? { sm: 7, xs: 12 } : 12}>
                            {AppCtx.layoutLinks.length > 0 && (
                                <Breadcrumbs className="mb-2">
                                    {AppCtx.layoutLinks.map((b, i) => {
                                        if (b.url) {
                                            return (
                                                <MuiLink key={i} component={Link} color="inherit" to={b.url}>
                                                    {b.label || '...'}
                                                </MuiLink>
                                            );
                                        } else {
                                            return (
                                                <Regular key={i} color="primary">
                                                    {b.label || '...'}
                                                </Regular>
                                            );
                                        }
                                    })}
                                </Breadcrumbs>
                            )}
                            <Box className="d-flex align-items-center">
                                {icon && <AppIcon sx={{ fontSize: '3rem' }} name={icon} color="primary" className="me-2" />}
                                <Bold color="primary" component="h1" sx={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }} variant="h1">
                                    {title}
                                </Bold>
                            </Box>
                            {subtitle && (
                                <Regular component={'span'} variant="body1" color="secondary">
                                    {subtitle}
                                </Regular>
                            )}
                        </Grid>
                        {actions && (
                            <Grid size={{ sm: 5, xs: 12 }} sx={{ marginTop: { xs: 1, sm: 0 } }} display={'flex'} justifyContent={{ sm: 'end', xs: 'start' }}>
                                {actions}
                            </Grid>
                        )}
                    </Grid>
                    <Divider />
                </>
            )}
            <Box className="p-3">{isLoading ? <AppFullPageLoader isLoading message={loaderMessage} /> : children}</Box>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IContentLayout {
    children: ReactNode;
    title: ReactNode;
    subtitle?: string;
    icon?: IconNameType;
    isLoading?: boolean;
    loaderMessage?: string;
    actions?: ReactNode;
    breadcrumbs?: { label: string; url?: string }[];
    showTitle?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
