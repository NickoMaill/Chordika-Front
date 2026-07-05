// #region IMPORTS -> /////////////////////////////////////
import { useContext } from 'react';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { ApiErrorType } from '~/models/Error';
import { ResultStatusEnum } from '~/types/serverCoreType';
import SessionContext from '~/context/sessionContext';
import useService from './useService';
import appTool from '~/helpers/appTool';
import AppContext from '~/context/appContext';
import useNavigation from './useNavigation';
import useModal, { ModalOptions } from './useModal';
import StandardError from '~/components/common/StandardError';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import { Bold, Regular } from '~/components/common/Text';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// let isRefreshing = false; // Évite les appels parallèles au rafraîchissement
// let failedQueue: Array<(token?: string) => void> = []; // File d'attente pour les requêtes en attente de nouveau token
// #endregion SINGLETON --> /////////////////////////////////

export default function useServiceBase(): IUseServiceBase {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Ses = useContext(SessionContext);
    const AppCtx = useContext(AppContext);
    const Service = useService();
    const Navigation = useNavigation();
    const Modal = useModal();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    /**
     * @description hooks that handle error and dispatch an AppError
     * @param request
     * @returns
     */
    const asServicePromise = async <T,>(requestFn: () => Promise<T>, checkAuth: boolean = true): Promise<T> => {
        try {
            return await requestFn();
        } catch (error) {
            if (checkAuth) {
                if (error.code === 'no_access_granted' || error.code === 'no_session' || error.code === 'token_expired' || error.code === 'token_invalid' || error.code === 'session_expired') {
                    const refreshed = await refreshSession();
                    if (refreshed) {
                        return await requestFn(); // ✅ relance propre avec le nouveau token
                    } else {
                        const target = Navigation.pathname + Navigation.search;
                        const url = target !== '/' && location.pathname !== 'login' ? `/login?target=${encodeURIComponent(target)}` : `/login`;
                        Navigation.navigateByPath(url);
                        return reject<T>(error);
                    }
                }
            }

            if (error.code === 'need_mfa') {
                Ses.setNeedMfa(true);
                console.info(error);
                return reject<T>(error);
            }

            // gestion standard des erreurs
            if (error.code && error.message) {
                switch (error.code) {
                    case 'error_happened':
                    case 'sql_error': {
                        const modalOption: ModalOptions = {
                            title: 'Erreur',
                            content: <StandardError error={error} />,
                            size: 'lg',
                        };
                        Modal.openModal(modalOption);
                        return Promise.reject<T>(error);
                    }
                    case 'xss_attack': {
                        const target = error.detailedMessage.includes('form') || error.detailedMessage.includes('body') ? 'le formulaire' : "l'url";
                        AppCtx.setBoxOptions({
                            title: "Suspicion d'attaque XSS",
                            text: (
                                <Box>
                                    <Bold>Une donnée potentiellement dangereuse a été détectée dans {target}.</Bold>
                                    <br />
                                    <Regular>La session a été invalidée.</Regular>
                                </Box>
                            ),
                            icon: 'BlockRounded',
                            showHeader: false,
                            showBack: false,
                        });
                        return Promise.reject<T>(error);
                    }
                    case 'no_access_granted':
                        AppCtx.setIsNoAccess(true);
                        break;
                    default:
                        return Promise.reject<T>(error);
                }
            }
            return reject<T>(error);
        }
    };
    /**
     * @description hooks that reject a promise fetch call
     * @param error
     * @returns
     */
    const reject = <TResult,>(error): Promise<TResult> => {
        if (error && error.type) return Promise.reject(error);
        if (appTool.fetchDispatcher(error.message) === 'failed_request') {
            AppCtx.setNoServer(true);
            return Promise.reject(new AppError(ErrorTypeEnum.Technical, error.message, appTool.fetchDispatcher(error.message)));
        }
        if (!error.status) return Promise.reject(new AppError(ErrorTypeEnum.Technical, error.message, appTool.fetchDispatcher(error.message)));

        let type = ErrorTypeEnum.Undefined;

        switch (error.status) {
            case ResultStatusEnum.Forbidden:
                type = ErrorTypeEnum.NotAllowed;
                break;
            case ResultStatusEnum.UnAuthorized:
                type = ErrorTypeEnum.SessionRequired;
                break;
            case ResultStatusEnum.NotAcceptable:
                type = ErrorTypeEnum.Maintenance;
                break;
            case ResultStatusEnum.BadRequest || ResultStatusEnum.Fatal || ResultStatusEnum.NotFound:
                type = ErrorTypeEnum.Technical;
                break;
            default:
                type = ErrorTypeEnum.Undefined;
                break;
        }
        const apiError = error as ApiErrorType;
        return Promise.reject(new AppError(type, apiError.message, apiError.code, apiError.detailedMessage, apiError.data));
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            const request = await Service.get<{ token: string; expires: string } | ApiErrorType>('auth/refresh');
            const response = request as { token: string; expires: string };
            Ses.setToken(response.token);
            Ses.setTokenExpire(dayjs(response.expires));
            return true;
        } catch (error) {
            if ((error as AppError).code) {
                switch ((error as AppError).code) {
                    case 'no_session':
                    case 'session_expired':
                    case 'no_access_granted':
                        Ses.setToken(null);
                        Ses.setTokenExpire(null);
                        return false;
                    case 'need_mfa':
                        Ses.setToken(null);
                        Ses.setTokenExpire(null);
                        Ses.setNeedMfa(true);
                        break;
                    default:
                        throw new AppError(ErrorTypeEnum.Technical, 'an Error happened', 'error_happened');
                }
            }
        }
        // }
        // return true;
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { asServicePromise };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseServiceBase {
    asServicePromise: <T>(request: () => Promise<T>, checkAuth?: boolean) => Promise<T>;
}
// #endregion IPROPS --> //////////////////////////////////
