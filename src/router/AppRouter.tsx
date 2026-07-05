// #region IMPORTS -> /////////////////////////////////////
import { Route, Routes } from 'react-router-dom';
import navigationResources from '~/resources/navigationResources';
import AuthMiddleware from './AuthMiddleware';
import NotFound from '~/pages/NotFound';
import { Fragment, JSX } from 'react';
import { RouterDescription } from '~/types/route';
import CenterLayout from '~/components/layout/CenterLayout';
import CenterRoute from '~/pages/Center/CenterRoute';
import DashboardLayout from '~/components/layout/dashboard/DashboardLayout';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppRouter(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    function renderRoutes(routes: RouterDescription[]): JSX.Element[] {
        return routes.map((route, i) => {
            const Element = route.element ? route.element : Fragment;
            const wrappedElement = route.isAuthRequired ? <AuthMiddleware key={i}>{<Element />}</AuthMiddleware> : <Element key={i} />;

            if (route.isIndex) {
                return <Route key={i} index element={wrappedElement} />;
            }

            if (route.children) {
                return (
                    <Route key={i} path={route.path} element={wrappedElement}>
                        {renderRoutes(route.children)}
                    </Route>
                );
            }

            return <Route key={i} path={route.path} element={wrappedElement} />;
        });
    }
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {renderRoutes(navigationResources.routes)}
                <Route path="/center" element={<CenterLayout />}>
                    <Route path="*" element={<CenterRoute />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// interface IAppRouter {}
// interface ICustomRouter {
//     path: string;
//     element: ReactNode;
//     index?: boolean;
// }
// #endregion IPROPS --> //////////////////////////////////
