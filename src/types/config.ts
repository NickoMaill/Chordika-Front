export interface IConfigEnv {
    NODE_ENV?;
    API_BASEURL?;
    APP_BASEURL?;
    API_PUBLIC_URL?;
    WS_BASEURL?;
    EXTRA_BASEURL?;
    AUTH_MFA_ENABLED?;
    BASE_PATH?;
    [key: string]: unknown;
}

export type MonitorInfoType = {
    date: Date;
    datasource: string;
    sapServer: string;
    smtpServer: string;
    rootURL: string;
    rootPath: string;
    sessionTimeout: number;
    encryptedConfig: boolean;
    machineName: string;
    hostName: string;
    dnsName: string;
    ipAddress: string;
    fqdn: string;
    osVersion: string;
    uptime: string;
    processors: number;
    processMemory: string;
    user: string;
    expVersion: string;
    bigIPHTTPInsert: string;
    dbVersion: string;
    dbSize: string;
    userAccounts: number;
    isFilesFolderExists: boolean;
    diskUsage: DiskUsageType[];
    nodeVersion?: string;
};

export type DiskUsageType = {
    name: string;
    total: number; // go
    free: number; // Go
    available: number; // Go
    usedPercent: number; // %
};
