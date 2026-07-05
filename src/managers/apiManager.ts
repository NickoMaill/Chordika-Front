import configManager from './configManager';

const apiHost = configManager.getConfig.API_BASEURL;

class ApiManager {
    private readonly baseUrl: string = apiHost;
    constructor(serverCall: boolean = true, customBaseUrl: string = '') {
        if (serverCall) {
            this.baseUrl = apiHost;
        } else {
            this.baseUrl = customBaseUrl;
        }
    }

    public async get<T>(route: string, headersRequest?: HeadersInit): Promise<T> {
        const headers = new Headers();

        for (const header in headersRequest) {
            headers.set(header, headersRequest[header]);
        }

        const controller = new AbortController();
        const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal,
            headers,
        };

        const url = `${this.baseUrl}/${route}`;
        const timeoutDuration = 8000;
        const timeout = setTimeout(() => controller.abort(), timeoutDuration);

        const request = await fetch(url, options);
        clearTimeout(timeout);

        const response = await request.json();

        return response;
    }

    public async getFile(route: string, headersRequest?: HeadersInit): Promise<Blob> {
        const headers = new Headers();

        for (const header in headersRequest) {
            headers.set(header, headersRequest[header]);
        }

        const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
            headers,
        };

        const url = `${this.baseUrl}/${route}`;

        const request = await fetch(url, options);

        const response = await request.blob();
        return response;
    }

    public async post<T>(route: string, body?: T, formData?: FormData, headersRequest?: HeadersInit): Promise<T> {
        const headers = new Headers();
        for (const header in headersRequest) {
            headers.set(header, headersRequest[header]);
        }

        body && headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        const options: RequestInit = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: formData ? formData : JSON.stringify(body),
        };

        const url = `${this.baseUrl}/${route}`;
        const request = await fetch(url, options);

        const response = await request.json();
        return response;
    }

    public async put<T>(route: string, body?: T, formData?: FormData, headersRequest?: HeadersInit): Promise<T> {
        const headers = new Headers();
        for (const header in headersRequest) {
            headers.set(header, headersRequest[header]);
        }

        body && headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        const options: RequestInit = {
            method: 'PUT',
            credentials: 'include',
            headers,
            body: formData ? formData : JSON.stringify(body),
        };

        const url = `${this.baseUrl}/${route}`;
        const request = await fetch(url, options);

        const response = await request.json();
        return response;
    }

    public async delete<T>(route: string, body?: T, headersRequest?: HeadersInit): Promise<T> {
        const headers = new Headers();
        for (const header in headersRequest) {
            headers.set(header, headersRequest[header]);
        }

        body && headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        const options: RequestInit = {
            method: 'DELETE',
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : null,
        };

        const url = `${this.baseUrl}/${route}`;
        const request = await fetch(url, options);

        const response = await request.json();
        return response;
    }
}

export default ApiManager;
