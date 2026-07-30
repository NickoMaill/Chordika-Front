// #region IMPORTS -> /////////////////////////////////////
import useStorage from './useStorage';
import useModal, { ModalOptions } from './useModal';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import StandardError from '~/components/common/StandardError';
import configManager from '~/managers/configManager';
import useSessionContext from '~/context/sessionContext';
import useAppContext from '~/context/appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const HTTP_TIMEOUT = 50000;
const currentUrl = window.location.href;
// #endregion SINGLETON --> /////////////////////////////////

export default function useService(): IUseServiceApi {
    const { getToken } = useSessionContext();
    const { getSessionItem } = useStorage();
    const { openModal } = useModal();
    const { perfMode, setCurrentSizeDownload } = useAppContext();

    const baseRequest = async <T,>(
        route: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        { body, formData, headersRequest }: { body?: unknown; formData?: FormData; headersRequest?: object } = {}
    ): Promise<T> => {
        const headers = new Headers();
        const token = getToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('X-Client-URL', currentUrl);
        headers.set('X-Client-Annonces', getSessionItem('annonces') ?? '');
        if (perfMode && !route.includes('/getPerf')) {
            headers.set('X-Perf-Active', '1');
        }
        if (headersRequest) {
            for (const key in headersRequest) {
                headers.set(key, headersRequest[key]);
            }
        }

        if (!formData) {
            headers.set('Content-Type', 'application/json');
        } else if (!formDataContainsFile(formData)) {
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
        }
        headers.set('Accept', '*/*');

        const options: RequestInit = {
            method,
            credentials: 'include',
            signal: AbortSignal.timeout(HTTP_TIMEOUT * (method === 'GET' ? 1 : 10)),
            headers,
            body: formData ? (formDataContainsFile(formData) ? formData : formDataToUrlEncoded(formData)) : body ? JSON.stringify(body) : undefined,
        };

        const url = `${configManager.getConfig.API_BASEURL}/${route}`;
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                code: errorBody?.code ?? 'error_happened',
                message: errorBody?.message ?? 'Erreur inconnue',
                detailedMessage: errorBody.detailedMessage,
                stack: errorBody.stack ?? '',
                targetUrl: errorBody.targetUrl ?? '',
                data: errorBody.data,
            };
        }
        const data = await response.json();

        if (data.code && data.stack) {
            throw {
                code: data?.code ?? 'error_happened',
                message: data?.message ?? 'Erreur inconnue',
                detailedMessage: data.detailedMessage ?? '',
                stack: data.stack ?? '',
                targetUrl: data.targetUrl ?? '',
                data: data.data,
            };
        }
        return data;
    };

    const get = <T,>(route: string, headersRequest?: HeadersInit): Promise<T> => baseRequest<T>(route, 'GET', { headersRequest });

    const getFile = async (route: string, headersRequest?: HeadersInit): Promise<Blob> => {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${getToken()}`);
        headers.set('X-Client-URL', currentUrl);
        headers.set('X-Client-Annonces', getSessionItem('annonces') ?? '');
        if (headersRequest) {
            for (const key in headersRequest) {
                headers.set(key, headersRequest[key]);
            }
        }

        const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
            headers,
        };

        const request = await fetch(route, options);
        return await request.blob();
    };

    const downloadFile = async (route: string, headersRequest?: HeadersInit): Promise<void> => {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${getToken()}`);
        headers.set('X-Client-URL', currentUrl);
        headers.set('X-Client-Annonces', getSessionItem('annonces') ?? '');
        if (headersRequest) {
            for (const key in headersRequest) {
                headers.set(key, headersRequest[key]);
            }
        }

        const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
            headers,
        };

        const response = await fetch(`${configManager.getConfig.API_BASEURL}/${route}`, options);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw {
                status: response.status,
                code: errorBody?.code ?? 'error_happened',
                message: errorBody?.message ?? 'Erreur inconnue',
                detailedMessage: errorBody.detailedMessage,
                stack: errorBody.stack ?? '',
                targetUrl: errorBody.targetUrl ?? '',
                data: errorBody.data,
            };
        }

        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const data = await response.json();
            if (data.code?.toLowerCase() === 'error_happened') {
                const modalOption: ModalOptions = {
                    title: 'Erreur',
                    content: <StandardError error={data} />,
                };
                openModal(modalOption);
                throw new AppError(ErrorTypeEnum.Functional, '', '');
            }
        }

        const contentLength = response.headers.get('Content-Length');
        const chunks = [];
        if (contentLength) {
            const total = parseInt(contentLength, 10);
            const reader = response.body?.getReader();
            let received = 0;

            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    received += value.length;
                    setCurrentSizeDownload((received / total) * 100);
                }
            }
        }

        let fileName = 'default-filename.txt';
        const content = response.headers.get('Content-Disposition');
        console.log([...response.headers.entries()]);
        if (content) {
            const parts = content.split(';');
            const founded = parts.find((p) => p.trim().startsWith('filename='));
            if (founded) {
                fileName = decodeURIComponent(
                    founded
                        .trim()
                        .replace('filename=', '')
                        .replace(/^["']|["']$/g, '')
                );
            }
        }

        const blob = chunks.length > 0 ? new Blob(chunks) : await response.blob();
        const a = document.createElement('a');
        const href = URL.createObjectURL(blob);
        a.href = href;
        a.download = fileName;
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
    };

    const post = <T, B>(route: string, body: B, formData?: FormData, headersRequest?: object): Promise<T> => baseRequest<T>(route, 'POST', { body, formData, headersRequest });

    const put = <T, B>(route: string, body: B, formData?: FormData, headersRequest?: object): Promise<T> => baseRequest<T>(route, 'PUT', { body, formData, headersRequest });

    const del = <T,>(route: string, headersRequest?: object): Promise<T> => baseRequest<T>(route, 'DELETE', { headersRequest });

    return { get, getFile, downloadFile, post, put, del };
}

const formDataContainsFile = (formData: FormData): boolean => {
    for (const [, value] of formData.entries()) {
        if (value instanceof File) return true;
    }
    return false;
};

const formDataToUrlEncoded = (formData: FormData): string => {
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
        params.append(key, value.toString());
    });
    return params.toString();
};

export interface IUseServiceApi {
    get: <T>(url: string, headers?: HeadersInit) => Promise<T>;
    getFile: (route: string, headersRequest?: HeadersInit) => Promise<Blob>;
    downloadFile: (route: string, headersRequest?: HeadersInit) => Promise<void>;
    post: <T, B>(url: string, body?: B, formData?: FormData, headers?: object) => Promise<T>;
    put: <T, B>(url: string, body?: B, formData?: FormData, headers?: object) => Promise<T>;
    del: <T>(url: string, headers?: object) => Promise<T>;
}
