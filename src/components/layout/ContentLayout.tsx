// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy, ReactNode } from 'react';
import { Bold } from '../common/Text';
import AppFullPageLoader from '../common/AppFullPageLoader';
import { IconNameType } from '~/components/common/AppIcon';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function ContentLayout({ children, title, icon, isLoading = false, loaderMessage = null, actions = null, showTitle = true }: IContentLayout): JSX.Element {
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
        <Box>
            {showTitle && (
                <>
                    <Box className="d-flex justify-content-between">
                        <Box className="d-flex align-items-center">
                            {icon && <AppIcon size="large" name={icon} color="primary" className="me-2" />}
                            <Bold color="primary" component="h2" variant="h4">
                                {title}
                            </Bold>
                        </Box>
                        {actions ? <Box className="mb-2">{actions}</Box> : null}
                    </Box>
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
    title: string;
    icon?: IconNameType;
    isLoading?: boolean;
    loaderMessage?: string;
    actions?: ReactNode;
    showTitle?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
