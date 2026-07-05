export type ApiErrorType = {
    key: string;
    status: number;
    stack: string;
    code: string;
    message: string;
    detailedMessage?: string;
    targetUrl: string;
    data?: unknown | unknown[];
};
