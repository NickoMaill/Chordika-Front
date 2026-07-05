import { IConfigEnv } from '~/types/config';

class ConfigManager {
    private readonly __env: IConfigEnv;

    constructor() {
        this.__env = {
            NODE_ENV: import.meta.env.MODE,
            API_BASEURL: import.meta.env.VITE_API_BASEURL,
            APP_BASEURL: import.meta.env.VITE_APP_BASEURL,
            EXTRA_BASEURL: import.meta.env.VITE_APP_EXTRA_BASEURL,
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
