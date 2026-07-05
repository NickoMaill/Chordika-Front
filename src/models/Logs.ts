export type LogsApiModel = {
    id: number;
    userId: number;
    name: string;
    proxyId: number;
    proxy: string;
    ipAddress: string;
    action: string;
    info: string;
    call: string;
    error: string;
    stamp: string;
    targetId: number;
    target: string;
    addedAt: Date;
};
