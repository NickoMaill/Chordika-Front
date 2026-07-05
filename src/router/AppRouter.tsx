// #region IMPORTS -> /////////////////////////////////////
import { Route, Routes } from 'react-router-dom';
import navigationResources from '~/resources/navigationResources';
import AuthMiddleware from './AuthMiddleware';
import NotFound from '~/pages/NotFound';
import { JSX } from 'react';
import { RouterDescription } from '~/types/route';
import CenterLayout from '~/components/layout/CenterLayout';
import CenterTable from '~/pages/Center/CenterTable';
import CenterNew from '~/pages/Center/CenterNew';
import CenterUpdate from '~/pages/Center/CenterUpdate';
import CenterDelete from '~/pages/Center/CenterDelete';
import CenterView from '~/pages/Center/CenterView';
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
            const element = route.element ? <route.element /> : <></>;
            const wrappedElement = route.isAuthRequired ? <AuthMiddleware>{element}</AuthMiddleware> : element;
            if (route.isIndex) {
                return <Route key={i} index element={wrappedElement} />;
            } else if (route.children) {
                <Route key={i} path={route.path} element={wrappedElement}>
                    {route.children && renderRoutes(route.children)}
                </Route>;
            } else {
                return <Route key={i} path={route.path} element={wrappedElement} />;
            }
        });
    }
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                {renderRoutes(navigationResources.routes)}
                <Route path="/center/:tableName" element={<CenterLayout />}>
                    <Route index element={<CenterTable />} />
                    <Route path="new" element={<CenterNew />} />
                    <Route path=":id/update" element={<CenterUpdate />} />
                    <Route path=":id/delete" element={<CenterDelete />} />
                    <Route path=":id" element={<CenterView />} />
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
