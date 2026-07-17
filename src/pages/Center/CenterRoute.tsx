// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import centerRouteHelper from '~/helpers/centerRouteHelper';
import NotFound from '~/pages/NotFound';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppCenter = lazy(() => import('../../components/center/AppCenter'));
// #endregion SINGLETON --> /////////////////////////////////

export default function CenterRoute(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { pathname } = useLocation();
    const centerRoute = useMemo(() => centerRouteHelper.parse(pathname), [pathname]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (!centerRoute) return <NotFound />;

    return <AppCenter key={centerRoute.currentPath} entity={centerRoute.entity} id={centerRoute.id} action={centerRoute.action} parents={centerRoute.parents} basePath={centerRoute.basePath} />;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
