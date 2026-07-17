import { IConfigEnv } from '~/types/config';

class ConfigManager {
    private readonly __env: IConfigEnv;

    constructor() {
        this.__env = {
            NODE_ENV: import.meta.env.MODE,
            API_BASEURL: import.meta.env.VITE_API_BASEURL,
            APP_BASEURL: import.meta.env.VITE_APP_BASEURL,
            WS_BASEURL: import.meta.env.VITE_WS_BASEURL,
            APP_FILEURL: import.meta.env.VITE_APP_FILEURL,
            API_PUBLIC_URL: import.meta.env.VITE_API_PUBLIC_URL,
            AUTH_MFA_ENABLED: import.meta.env.VITE_AUTH_MFA_ENABLED,
            BASE_PATH: import.meta.env.VITE_BASE_PATH,
            APP_ENABLE_NOTIFS: import.meta.env.VITE_APP_ENABLE_NOTIFS === 'true',
            APP_NAME: import.meta.env.VITE_APP_NAME,
        };
    }

    public sslConfig(): boolean | { rejectUnauthorized: boolean } {
        if (process.env.NODE_ENV === 'development') {
            return false;
        } else {
            return { rejectUnauthorized: false };
        }
    }

    public get getConfig(): IConfigEnv {
        return this.__env;
    }

    public get isDevMode(): boolean {
        return this.__env.NODE_ENV === 'development';
    }

    public get isMfaEnabled(): boolean {
        const value = this.__env.AUTH_MFA_ENABLED;

        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }

        return false;
    }

    public get configAsNumber(): IConfigEnv {
        const res: IConfigEnv = null;
        for (const key in this.__env) {
            const parsed = parseInt(this.__env[key] as string, 10);
            res[key] = isNaN(parsed) ? this.__env[key] : parsed;
        }
        return res;
    }
}

// module.exports = new Hello();
export default new ConfigManager();
