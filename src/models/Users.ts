export type UserApiModel = {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    levelAccess: number;
    email: string;
    mobile: string;
    added: Date;
    updated: Date;
};

export type UserSessionApiModel = {
    id: number;
    email: string;
    firstName: string;
    ip: string;
    lastName: string;
    levelAccess: number;
    mobile: string;
    name: string;
    needMFA: boolean;
    preferences: UserPreferences;
    isPushActive: boolean;
    maxRows: number;
    userName: string;
    proxies: UserApiModel[];
};

export interface UserSessionDb {
    id: number;
    userId: string;
    email: string;
    firstName: string;
    ip: string;
    lastName: string;
    levelAccess: number;
    mobile: string;
    name: string;
    needMFA: boolean;
    preferences: UserPreferences;
    isPushActive: boolean;
    maxRows: number;
    userName: string;
    isAuthenticated: boolean;
    proxies: UserApiModel[];
}

export type SearchUserForm = {
    id: string;
};

export type UserPreferencesPayload = {
    field: string;
    value: unknown;
};

export type UserPreferences = { maxRows: number; isPushActive: boolean };
