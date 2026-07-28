import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppError } from '~/core/appError';
import useSessionService from '~/hooks/services/useSessionService';
import { doneProgress, isProgressStarted, startProgress } from '~/helpers/progressHelper';
import useNavigation from '~/hooks/useNavigation';
import useSessionContext from '~/context/sessionContext';
import useAppContext from '~/context/appContext';

export default function AuthMiddleware({ children, printable }: IAuthMiddleware): JSX.Element {
    const [isReady, setIsReady] = useState(false); // Contrôle de l'affichage
    const checkingRef = useRef(false); // Empêche les doublons d'appel
    const [searchParams, setSearchParams] = useSearchParams();
    const { token, setToken, tokenExpire, userId, accessLevel } = useSessionContext();
    const { refreshSession } = useSessionService();
    const { getCurrentRoute, pathname } = useNavigation();
    const { setIsNoAccess } = useAppContext();


    const navigate = useNavigate();
    const location = useLocation();

    const checkSession = async (): Promise<void> => {
        if (checkingRef.current) return;
        checkingRef.current = true;

        if (!isProgressStarted()) {
            startProgress();
        }

        const currentPath = location.pathname + location.search;
        const isTokenValid = token && token !== '' && tokenExpire && tokenExpire.valueOf() > Date.now();

        if (isTokenValid) {
            setIsReady(true);
            if (!location.pathname.includes('/center')) doneProgress();
            checkingRef.current = false;
            return;
        }

        try {
            const refreshed = await refreshSession();
            if (refreshed) {
                setIsReady(true);
                if (!location.pathname.includes('/center')) doneProgress();
                doneProgress();
                checkingRef.current = false;
                return;
            }
        } catch (error) {
            if (error instanceof AppError && error.code === 'need_mfa') {
                const url = `/login?target=${encodeURIComponent(currentPath)}`;
                navigate(url, { replace: true });
                doneProgress();
                setIsReady(false);
                checkingRef.current = false;
                return;
            }

            if (error instanceof AppError && error.code === 'failed_request') {
                doneProgress();
                setIsReady(true);
                checkingRef.current = false;
                return;
            }
        }

        // Session invalide ou échec de refresh : redirige vers login
        setToken(null);
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
        if (isReady && userId) {
            const currentRoute = getCurrentRoute();
            if (currentRoute?.levelAccess > accessLevel) {
                setIsNoAccess(true);
            } else {
                setIsNoAccess(false);
            }
        }
    }, [isReady, userId, accessLevel, pathname]);
    if (!isReady) return null;
    if (!userId) return null; // <- sécurité : pas de session = pas d'accès
    // if (Session.needMfa) return <TOTP />;
    return <>{children}</>;
}

interface IAuthMiddleware {
    children: ReactNode;
    printable?: boolean;
}
