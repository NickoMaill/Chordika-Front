import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Location, matchPath, Path, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import navigationResources from '~/resources/navigationResources';
import { RecursiveKeyOf } from '~/types/custom';
import { RouteNameReference, RouterDescription } from '~/types/route';
import NotFound from '~/pages/NotFound';
import { LevelAccessEnum } from '~/models/Session';

// const urlRegex = /^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)|http:\/\/localhost:\d+)$/i;

export default function useNavigation(): IUseNavigation {
    const [currentRoute, setCurrentRoute] = useState<RouterDescription | null>(null);
    const [routes, setRoutes] = useState<RouterDescription[]>([]);
    const navigateTo = useNavigate();
    const [queryString] = useSearchParams();
    const location = useLocation();
    const query = useMemo(() => Object.fromEntries([...queryString]), [queryString]);

    useEffect(() => {
        const loadRoutes = (): void => {
            const loadedRoutes = navigationResources.routes;
            setRoutes(loadedRoutes);
            setCurrentRoute(getPathDescription(loadedRoutes));
        };
        loadRoutes();
    }, [location.pathname]);

    const navigate = useCallback(
        (name: RecursiveKeyOf<RouteNameReference>, pathParams?: Record<string, unknown>, params?: string, replace?: boolean): void => {
            const loadedRoutes = routes.length > 0 ? routes : navigationResources.routes;
            const indexRoute: number = loadedRoutes.findIndex((item) => item.name === name);
            if (indexRoute > -1) {
                const routesData = loadedRoutes[indexRoute];
                if (pathParams) {
                    for (const p in pathParams) {
                        routesData.path = routesData.path.replace(`:${p}`, String(pathParams[p]));
                    }
                }
                // const isParamsCompatible = routesData.path.includes(':');

                const route: Path = { pathname: routesData.path, search: params, hash: null };
                navigateTo(route, { replace: replace, relative: 'path' });
            } else {
                throw new AppError(ErrorTypeEnum.Functional, 'wrong routes', 'wrong_routes');
            }
        },
        [routes, navigateTo]
    );

    const navigateByPath = useCallback(
        (path: string, replace?: boolean, state?: unknown) => {
            navigateTo(path, { replace, relative: 'path', state });
        },
        [navigateTo]
    );

    const externalNavigate = useCallback((url: string, blank?: boolean) => {
        window.open(url, blank && '_blank');
    }, []);

    const goToHomePage = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    const goBack = useCallback(() => {
        navigateTo(-1);
    }, [navigate]);

    const reload = useCallback(() => {
        navigateTo(0);
    }, [navigate]);

    const getPathDescription = useCallback(
        (loadedRoutes: RouterDescription[], url: string = location.pathname): RouterDescription => {
            const route = findRoute(loadedRoutes, url);
            if (route) {
                return route;
            } else {
                return { name: 'NotFound', element: NotFound, path: '*', title: 'Aven', isAuthRequired: false, levelAccess: LevelAccessEnum.NOBODY } as RouterDescription;
            }
        },
        [location.pathname]
    );

    const findRoute = useCallback(
        (loadedRoutes: RouterDescription[], url: string): RouterDescription | undefined => {
            const routeDescription = loadedRoutes.find((item) => !!matchPath(item.path, url));
            if (query && routeDescription) {
                routeDescription.query = query;
            }
            return routeDescription;
        },
        [query]
    );

    const getCurrentRoute = (): RouterDescription => {
        const routes = navigationResources.routes;
        const route = findRoute(routes, location.pathname);
        return route;
    };

    const logCurrentRoute = useCallback(() => {
        console.group('%c--> route description', 'background: #1cb7ff; color: #000');
        console.log(currentRoute);
        console.groupEnd();
    }, [currentRoute]);

    return {
        navigate,
        navigateByPath,
        externalNavigate,
        goBack,
        goToHomePage,
        reload,
        pathname: location.pathname,
        getPathDescription: (url?: string) => getPathDescription(routes, url),
        currentRoute,
        logCurrentRoute,
        query,
        location,
        search: location.search,
        getCurrentRoute,
    };
}

export interface IUseNavigation {
    navigate: (name: RecursiveKeyOf<RouteNameReference>, pathParams?: Record<string, unknown>, params?: string, replace?: boolean) => void;
    externalNavigate: (url: string) => void;
    goBack: () => void;
    reload: () => void;
    goToHomePage: () => void;
    pathname: string;
    getPathDescription: (url?: string) => RouterDescription;
    currentRoute: RouterDescription | null;
    logCurrentRoute: () => void;
    query: ParsedUrlQuery;
    navigateByPath: (path: string, replace?: boolean, state?: unknown) => void;
    location: Location;
    search: string;
    getCurrentRoute: () => RouterDescription;
}
