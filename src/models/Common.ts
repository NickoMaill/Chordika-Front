export type SQLTestOutput = {
    columns: string[];
    timeExec: number;
    sql: string;
    datas: unknown[];
    error?: string;
};
