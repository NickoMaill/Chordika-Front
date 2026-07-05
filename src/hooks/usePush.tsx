// #region IMPORTS -> /////////////////////////////////////
import useToast from './useToast';
import useServiceBase from './useServiceBase';
import useService from './useService';
import configManager from '~/managers/configManager';
import useToolService from './services/useToolService';
import useUserService from './services/useUserService';
import { AppError } from '~/core/appError';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function usePush(): IUsePush {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Toast = useToast();
    const ToolsServices = useToolService();
    const UserServices = useUserService();
    const { asServicePromise } = useServiceBase();
    const Service = useService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const urlBase64ToUint8Array = (base64String: string): Uint8Array<ArrayBuffer> => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    };

    const checkIfSupported = async (): Promise<boolean> => {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker non supporté.');
            return false;
        }

        if (!('PushManager' in window)) {
            console.warn('Push API non supportée.');
            return false;
        }

        try {
            let registration = await navigator.serviceWorker.getRegistration();

            if (!registration) {
                // Service Worker non enregistré, on l'enregistre maintenant
                registration = await navigator.serviceWorker.register(`${configManager.getConfig.APP_BASEURL}/service-worker.js`);
                console.log('Service Worker enregistré :', registration);
            } else {
                console.log('Service Worker déjà en place :', registration);
            }

            // Attendre que le SW soit actif et prêt
            const readyReg = await navigator.serviceWorker.ready;
            console.log('Service Worker prêt :', readyReg);

            return true;
        } catch (error) {
            console.error('Erreur lors du check/enregistrement du Service Worker :', error);
            return false;
        }
    };

    const subscribe = async (): Promise<boolean> => {
        const isSupported = checkIfSupported();
        if (!isSupported) {
            Toast.error('Notifications non supportées...', 'Les notifications ne sont pas supportées par votre navigateur ou vos paramètres, veuillez les mettre à jour, ou changer de navigateur');
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.register(`${configManager.getConfig.APP_BASEURL}/service-worker.js`);
            const existing = await registration.pushManager.getSubscription();

            if (existing) {
                Toast.error('Notifications déjà activées', 'Vous avez déjà activé les notifications, si vous ne voyez pas le changements effectif, veuillez rafraîchir la page...');
                return false;
            }

            const vapid = await ToolsServices.getVAPID();
            const subs = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapid),
            });

            const isSubscribe = await UserServices.subscribeToNotification(subs);
            if (isSubscribe) {
                Toast.success('Notification activées avec succès');
                return true;
            } else {
                Toast.error("Erreur lors de l'activation des notifications");
                return false;
            }
        } catch (err: unknown) {
            if (err instanceof AppError) {
                Toast.error(err.message, err.detailedMessage);
            }
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    Toast.error('Activation refusée', 'Activation refusée par le navigateur');
                } else {
                    Toast.error(err.name, err.message);
                }
            }
            return false;
        }
    };

    const unsubscribe = async (): Promise<boolean> => {
        const isSupported = checkIfSupported();
        if (!isSupported) {
            Toast.error('Notifications non supportées...', 'Les notifications ne sont pas supportées par votre navigateur ou vos paramètres, veuillez les mettre à jour, ou changer de navigateur');
            return false;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            const wasUnsubscribed = await subscription.unsubscribe();
            // await UserServices.unsubscribeToNotification({ endpoint: subscription.endpoint });
            if (wasUnsubscribed) {
                Toast.success('Notification désactivées avec succès');
                return true;
            } else {
                Toast.error('Échec de la désactivation', "Vous ne pouvez pas désactiver les notifications pour l'instant, veuillez réessayer plus tard");
                return false;
            }
        } else {
            return false;
        }
    };

    const isSubscribed = async (): Promise<boolean> => {
        const isSupported = checkIfSupported();
        if (!isSupported) {
            return false;
        }

        const subscription = await getSubscription();

        if (subscription) {
            const isOk = UserServices.checkIfSubscribed(subscription);
            return isOk;
        } else {
            return false;
        }
    };

    const getSubscription = async (): Promise<PushSubscription> => {
        const req = await navigator.serviceWorker.ready;
        const sub = await req.pushManager.getSubscription();
        return sub;
    };

    const seen = async (id: number): Promise<void> => {
        await asServicePromise(() => Service.post(`push/seen/${id}`));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { getSubscription, subscribe, unsubscribe, isSubscribed, seen };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUsePush {
    getSubscription: () => Promise<PushSubscription>;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
    isSubscribed: () => Promise<boolean>;
    seen: (id: number) => Promise<void>;
}
// #enderegion IPROPS --> //////////////////////////////////
