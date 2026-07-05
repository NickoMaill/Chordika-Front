import { HeaderLinkType, RouterDescription } from '~/types/route';
import Homepage from '~/pages/Homepage';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile';
import { LevelAccessEnum } from '~/models/Session';
import { SQLTest, Monitor } from '~/pages/Support';
import Proxy from '~/pages/Proxy';
import Reset from '~/pages/Reset';
import { translate } from './i18n/i18n';
import Setup from '~/pages/Setup';
import Register from '~/pages/Register';
import Editor from '~/pages/Editor';
import Scores from '~/pages/Scores';
import { ScoreIcon } from '~/components/common/AppIcon';

class NavigationResource {
    public static get routesPath(): Record<string, string> {
        return {
            home: '/',
            users: '/users',
            import: '/import',
            login: '/login',
            register: '/register',
            center: '/center',
            profile: '/profile',
            sqlTest: '/sqlTest',
            monitor: '/monitor',
            proxy: '/proxy',
            reset: '/reset',
            setup: '/setup',
            scores: '/scores',
            scoreEditor: '/scores/:scoreId',
            scoreAdd: '/scores/add',
            scoreImport: '/scores/import',
        };
    }

    public static get routes(): RouterDescription[] {
        return [
            // #region COMMON ROUTES -> ///////////////////////////////////////////////////////
            { name: 'Login', element: Login, path: this.routesPath.login, isAuthRequired: false, title: translate('login.connect'), levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Monitor', element: Monitor, path: this.routesPath.monitor, isAuthRequired: false, title: 'Monitor', levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Reset', element: Reset, path: this.routesPath.reset, isAuthRequired: false, title: translate('login.reset'), levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Home', element: Homepage, path: this.routesPath.home, isAuthRequired: false, isIndex: true, title: 'Bienvenue sur Chordika', levelAccess: LevelAccessEnum.VISITOR },
            { name: 'Register', element: Register, path: this.routesPath.register, isAuthRequired: false, isIndex: false, title: "S'inscrire", levelAccess: LevelAccessEnum.VISITOR },
            // #endregion COMMON ROUTES -> ////////////////////////////////////////////////////

            // #region AUTH REQUIRED -> ///////////////////////////////////////////////////////
            { name: 'Profile', element: Profile, path: this.routesPath.profile, isAuthRequired: true, title: translate('profile.title'), levelAccess: LevelAccessEnum.USER },
            { name: 'Proxy', element: Proxy, path: this.routesPath.proxy, isAuthRequired: true, title: translate('nav.proxy'), levelAccess: LevelAccessEnum.ADMIN },
            { name: 'SQLTest', element: SQLTest, path: this.routesPath.sqlTest, isAuthRequired: true, title: 'Test SQL', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'Setup', element: Setup, path: this.routesPath.setup, isAuthRequired: true, title: 'Réglage du site', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'Editor', element: Editor, path: this.routesPath.scoreEditor, isAuthRequired: true, isIndex: false, title: 'Éditer grille', levelAccess: LevelAccessEnum.USER },
            { name: 'ScoreAdd', element: Editor, path: this.routesPath.scoreAdd, isAuthRequired: true, isIndex: false, title: 'Ajouter une grille', levelAccess: LevelAccessEnum.USER },
            { name: 'ScoreImport', element: Editor, path: this.routesPath.scoreImport, isAuthRequired: true, isIndex: false, title: 'Ajouter une grille', levelAccess: LevelAccessEnum.USER },
            { name: 'Scores', element: Scores, path: this.routesPath.scores, isAuthRequired: true, isIndex: false, title: 'Mes grilles', levelAccess: LevelAccessEnum.USER },
            // #endregion ROUTES -> ///////////////////////////////////////////////////////////
        ];
    }

    public static get navigationHeaderInfo(): HeaderLinkType[] {
        return [
            { name: 'nav.myScore', link: `${NavigationResource.routesPath.scores}`, Icon: ScoreIcon, redirect: true, levelAccess: LevelAccessEnum.USER },
            // { name: 'nav.scoreAdd', link: `${NavigationResource.routesPath.scoreAdd}`, Icon: AddCircleRoundedIcon, redirect: true, levelAccess: LevelAccessEnum.USER },
            // { name: 'nav.scoreImport', link: `${NavigationResource.routesPath.scoreImport}`, Icon: CloudUploadRoundedIcon, redirect: true, levelAccess: LevelAccessEnum.USER },
            { name: 'divider', levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.users', link: `${NavigationResource.routesPath.center}/users`, Icon: PersonIcon, redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.adverts', link: `${NavigationResource.routesPath.center}/annonces`, Icon: CampaignIcon, redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.activity', link: `${NavigationResource.routesPath.center}/logs`, Icon: ManageSearchIcon, redirect: true, levelAccess: LevelAccessEnum.ADMIN },
        ];
    }

    public static get userNavigationLinks(): HeaderLinkType[] {
        return [
            { name: 'nav.profile', link: NavigationResource.routesPath.profile, Icon: KeyIcon, redirect: true, levelAccess: LevelAccessEnum.USER },
            { name: 'divider', levelAccess: LevelAccessEnum.USER },
            { name: 'nav.proxy', link: NavigationResource.routesPath.proxy, Icon: PersonIcon, redirect: true, levelAccess: LevelAccessEnum.ADMIN },
            { name: 'nav.logout', Icon: LogoutIcon, redirect: false, method: 'logout', levelAccess: LevelAccessEnum.USER },
        ];
    }

    public static get noHeaderPath(): string[] {
        return ['/login', '/reset'];
    }
}

export default NavigationResource;
