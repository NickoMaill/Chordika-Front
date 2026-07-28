export interface ServerResponse<T, O = null> {
    status: number;
    result: T;
    success?: boolean;
    additionalDatas: O
}

export enum ResultStatusEnum {
    Undefined = 0,
    Ok = 200,
    BadRequest = 400,
    UnAuthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    NotAcceptable = 406,
    Fatal = 500,
}

export type ServiceResponse<T = null> = {
    success: boolean;
    message?: string;
    data?: T | T[];
};

export type QueryResult<T> = {
    records: T[];
    totalRecords: number;
    totalAllRecords: number;
    offset: number;
    limit: number;
};

export enum TimeZoneEnum {
    UTC = 'UTC',
    Europe_Paris = 'Europe/Paris',
    Europe_London = 'Europe/London',
    Europe_Berlin = 'Europe/Berlin',
    Europe_Madrid = 'Europe/Madrid',
    America_New_York = 'America/New_York',
    America_Los_Angeles = 'America/Los_Angeles',
    America_Chicago = 'America/Chicago',
    America_Toronto = 'America/Toronto',
    America_Mexico_City = 'America/Mexico_City',
    America_Sao_Paulo = 'America/Sao_Paulo',
    Asia_Tokyo = 'Asia/Tokyo',
    Asia_Shanghai = 'Asia/Shanghai',
    Asia_Hong_Kong = 'Asia/Hong_Kong',
    Asia_Bangkok = 'Asia/Bangkok',
    Asia_Singapore = 'Asia/Singapore',
    Asia_Seoul = 'Asia/Seoul',
    Australia_Sydney = 'Australia/Sydney',
    Australia_Melbourne = 'Australia/Melbourne',
    Australia_Perth = 'Australia/Perth',
    Africa_Johannesburg = 'Africa/Johannesburg',
    Africa_Cairo = 'Africa/Cairo',
    Africa_Lagos = 'Africa/Lagos',
    Indian_Reunion = 'Indian/Reunion',
    Pacific_Honolulu = 'Pacific/Honolulu',
    Pacific_Auckland = 'Pacific/Auckland',
}
