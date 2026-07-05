export interface IConfigEnv {
    NODE_ENV?;
    API_BASEURL?;
    APP_BASEURL?;
    EXTRA_BASEURL?;
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
    dotNetVersion: string;
    bigIPHTTPInsert: string;
    dbVersion: string;
    dbSize: string;
    userAccounts: number;
    isFilesFolderExists: boolean;
};
