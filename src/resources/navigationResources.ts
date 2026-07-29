import { HeaderLinkType, RouteNameReference, RouterDescription } from '~/types/route';
import Homepage from '~/pages/Homepage';
import Login from '~/pages/Login';
import Center from '~/pages/Center';
import Profile from '~/pages/Profile';
import { LevelAccessEnum } from '~/models/Session';
import SQLTest from '~/pages/SQLTest';
import Monitor from '~/pages/Monitor';
import Proxy from '~/pages/Proxy';
import { RecursiveKeyOf } from '~/types/custom';
import Notifications from '~/pages/Notifications';
import Reset from '~/pages/Reset';
import Register from '~/pages/Register';
import { translate } from './i18n/i18n';
import Editor from '~/pages/Editor';
import Symbols from '~/pages/Symbols';

class NavigationResource {
    public static get routesPath(): Record<string, string> {
        return {
            home: '/',
            users: '/users',
            login: '/login',
            center: '/center',
            profile: '/profile',
            sqlTest: '/sqlTest',
            monitor: '/monitor',
            proxy: '/proxy',
            scores: '/scores',
            reset: '/reset',
            register: '/register',
            scoreEditor: '/scores/:scoreId',
            scoreEditorPrint: '/scores/:scoreId/print',
            scoreAdd: '/scores/add',
            scoreImport: '/scores/import',
            notifications: '/notifications',
            symbols: '/symbols',
        };
    }

    public static get routes(): RouterDescription[] {
        return [
            // #region COMMON ROUTES -> ///////////////////////////////////////////////////////
            { name: 'Login', element: Login, path: this.routesPath.login, isAuthRequired: false, title: 'Connexion', levelAccess: LevelAccessEnum.NOBODY },
            { name: 'Monitor', element: Monitor, path: this.routesPath.monitor, isAuthRequired: false, title: 'Monitor', levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Reset', element: Reset, path: this.routesPath.reset, isAuthRequired: false, title: translate('login.reset'), levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Home', element: Homepage, path: this.routesPath.home, isAuthRequired: false, isIndex: true, title: 'Bienvenue sur Chordika', levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Register', element: Register, path: this.routesPath.register, isAuthRequired: false, isIndex: false, title: "S'inscrire", levelAccess: LevelAccessEnum.VISITOR },
            // #endregion COMMON ROUTES -> ////////////////////////////////////////////////////
 
            // #region AUTH REQUIRED -> ///////////////////////////////////////////////////////
            { name: 'Home', element: Homepage, path: this.routesPath.home, isAuthRequired: true, isIndex: true, title: 'NStream', levelAccess: LevelAccessEnum.USER },
            { name: 'Center', element: Center, path: this.routesPath.center, isAuthRequired: true, title: 'Modification', levelAccess: LevelAccessEnum.USER },
            { name: 'Profile', element: Profile, path: this.routesPath.profile, isAuthRequired: true, title: "Profile d'accès", levelAccess: LevelAccessEnum.USER },
            { name: 'SQLTest', element: SQLTest, path: this.routesPath.sqlTest, isAuthRequired: true, title: 'Test SQL', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'Proxy', element: Proxy, path: this.routesPath.proxy, isAuthRequired: true, title: 'Se Connecter en tant que', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'Editor', element: Editor, path: this.routesPath.scoreEditor, isAuthRequired: true, isIndex: false, title: 'Éditer grille', levelAccess: LevelAccessEnum.USER },
            { name: 'PrintEditor', element: Editor, path: this.routesPath.scoreEditorPrint, isAuthRequired: false, isIndex: false, title: 'Éditer grille', levelAccess: LevelAccessEnum.VISITOR },
            { name: 'ScoreAdd', element: Editor, path: this.routesPath.scoreAdd, isAuthRequired: true, isIndex: false, title: 'Ajouter une grille', levelAccess: LevelAccessEnum.USER },
            { name: 'ScoreImport', element: Editor, path: this.routesPath.scoreImport, isAuthRequired: true, isIndex: false, title: 'Ajouter une grille', levelAccess: LevelAccessEnum.USER },
            { name: 'Notifications', element: Notifications, path: this.routesPath.notifications, isAuthRequired: true, title: 'Notifications', levelAccess: LevelAccessEnum.USER },
            { name: "Symbols", element: Symbols, path: this.routesPath.symbols, isAuthRequired: true, title: 'Dictionnaire des Symboles', levelAccess: LevelAccessEnum.USER },
            // #endregion ROUTES -> ///////////////////////////////////////////////////////////
        ];
    }

    public static buildPath(name: RecursiveKeyOf<RouteNameReference>, pathParams?: Record<string, unknown>, params?: Record<string, string>, isCenter: boolean = false): string {
        const indexRoute: number = this.routes.findIndex((item) => item.name === name);
        let output = '';
        if (indexRoute > -1) {
            const routesData = this.routes[indexRoute];
            output = routesData.path;
            if (pathParams) {
                for (const p in pathParams) {
                    output = output.replace(`:${p}`, pathParams[p] as string);
                }
            }
            if (params) {
                const search = new URLSearchParams(params);
                output += '?' + search.toString();
            }
            // const isParamsCompatible = routesData.path.includes(':');
            if (isCenter) {
                output = `/center${output}`;
            }
            return output;
        }
        return null;
    }

    public static get navigationHeaderInfo(): HeaderLinkType[] {
        return [
            { name: 'nav.myScore', link: `${NavigationResource.routesPath.center}/scores`, icon: 'MusicScore', redirect: true, levelAccess: LevelAccessEnum.USER },
            { name: "repertoire.navLib", link: `${NavigationResource.routesPath.center}/repertoires`, icon: "FolderRounded", redirect: true, levelAccess: LevelAccessEnum.USER },
            { name: 'divider', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.users', link: `${NavigationResource.routesPath.center}/users`, icon: 'Person', redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.adverts', link: `${NavigationResource.routesPath.center}/annonces`, icon: 'Campaign', redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.activity', link: `${NavigationResource.routesPath.center}/logs`, icon: 'ManageSearch', redirect: true, levelAccess: LevelAccessEnum.ADMIN },
        ];
    }

    public static get userNavigationLinks(): HeaderLinkType[] {
        return [
            { name: 'nav.profile', link: NavigationResource.routesPath.profile, icon: 'Key', redirect: true, levelAccess: LevelAccessEnum.USER },
            { name: 'divider', levelAccess: LevelAccessEnum.USER },
            { name: 'nav.proxy', link: NavigationResource.routesPath.proxy, icon: 'Person', redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.logout', icon: 'Logout', redirect: false, method: 'logout', levelAccess: LevelAccessEnum.USER },
        ];
    }

    public static get noHeaderPath(): string[] {
        return ['/login', '/reset'];
    }
}

export default NavigationResource;
