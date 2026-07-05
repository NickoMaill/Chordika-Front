export type SQLTestOutput = {
    columns: string[];
    timeExec: number;
    sql: string;
    datas: unknown[];
    error?: string;
};

export type ImageType = 'movies' | 'actors' | 'directors' | 'collections' | 'companies';
