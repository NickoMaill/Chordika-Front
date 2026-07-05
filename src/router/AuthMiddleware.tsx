import { JSX, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SessionContext from '~/context/sessionContext';
import { AppError } from '~/core/appError';
import useSessionService from '~/hooks/services/useSessionService';
import { doneProgress, isProgressStarted, startProgress } from '~/helpers/progressHelper';
import TOTP from '~/components/app/login/TOTP';
import useNavigation from '~/hooks/useNavigation';
import AppContext from '~/context/appContext';

export default function AuthMiddleware({ children }: IAuthMiddleware): JSX.Element {
    const [isReady, setIsReady] = useState(false); // Contrôle de l'affichage
    const checkingRef = useRef(false); // Empêche les doublons d'appel

    const Session = useContext(SessionContext);
    const SessionService = useSessionService();
    const Navigation = useNavigation();
    const App = useContext(AppContext);

    const navigate = useNavigate();
    const location = useLocation();

    const checkSession = async (): Promise<void> => {
        let isNetworkDown = false;
        if (checkingRef.current) return;
        checkingRef.current = true;
        if (!isProgressStarted()) {
            startProgress();
        }

        const currentPath = location.pathname + location.search;
        const isTokenValid = Session.token && Session.token !== '' && Session.tokenExpire && Session.tokenExpire.valueOf() > Date.now();

        if (isTokenValid) {
            setIsReady(true);
            if (!location.pathname.includes('/center')) doneProgress();
            checkingRef.current = false;
            return;
        }

        try {
            const refreshed = await SessionService.refreshSession();
            if (refreshed) {
                setIsReady(true);
                if (!location.pathname.includes('/center')) doneProgress();
                doneProgress();
                checkingRef.current = false;
                return;
            }
        } catch (error) {
            console.info('erreur détécté', 'Auth middleware', error);
            if (error instanceof AppError && error.code === 'need_mfa') {
                const url = `/login?target=${encodeURIComponent(currentPath)}`;
                navigate(url, { replace: true });
            } else if (error.code === 'failed_request') {
                doneProgress();
                setIsReady(true);
            }
        }

        // Session invalide ou échec de refresh : redirige vers login
        Session.setToken(null);
        if (isNetworkDown) return;
        const isLoginPage = location.pathname === '/login';
        const hasTargetToLogin = new URLSearchParams(location.search).get('target')?.includes('/login');

        if (!(isLoginPage && hasTargetToLogin)) {
            const targetUrl = currentPath !== '/' && currentPath !== '/login' ? `/login?target=${encodeURIComponent(currentPath)}` : '/login';
            navigate(targetUrl, { replace: true });
        }

        doneProgress();
        setIsReady(false);
        checkingRef.current = false;
    };
    useEffect(() => {
        checkSession();
    }, [location.pathname, location.search]);
    useEffect(() => {
        if (isReady && Session.id) {
            if (Navigation.getCurrentRoute()?.levelAccess > Session.accessLevel) {
                App.setIsNoAccess(true);
            }
        }
    }, [isReady, Session, Navigation.pathname]);
    if (!isReady) return null;
    if (!Session.id) return null; // <- sécurité : pas de session = pas d'accès
    if (Session.needMfa) return <TOTP />;
    return <>{children}</>;
}

interface IAuthMiddleware {
    children: ReactNode;
}
