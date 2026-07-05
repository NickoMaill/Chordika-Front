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
    token: string;
    userName: string;
    proxies: UserApiModel[];
};

export type SearchUserForm = {
    id: string;
};

export type UserPreferencesPayload = {
    field: string;
    value: unknown;
};

export type UserPreferences = {
    favColors: string[];
};

export type UserDeviceSessions = {
    id: number;
    token: string;
    type: 'SES' | 'RES';
    userId: number;
    userIp: string;
    userAgent: string;
    deviceId: string;
    expires: Date;
    isRevoked: boolean;
    revokedAt: Date;
    addedAt: Date;
    updatedAt: Date;
};

export type PlaySession = {
    id: number;
    userId: number;
    movieId: number;
    movieTitle: string;
    lastSeen: Date;
    revoked: boolean;
    addedAt: Date;
    updatedAt: Date;
};
