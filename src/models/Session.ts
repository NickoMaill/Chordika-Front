export interface IAdminUserDto {
    id?: number;
    email: string;
    password: string;
}

export interface AdminResponseLogin {
    token: string;
    id: number;
    email: string;
}

export interface IAdminDataLogin {
    email: string;
    password: string;
    rememberSession: boolean;
}

export interface IEmailContactDetail {
    subject?: string;
    textContent?: string;
    from?: string;
    to?: string;
}

export enum LevelAccessEnum {
    NOBODY = -1, // to block access for everybody
    VISITOR = 0,
    USER = 1,
    ADMIN = 10,
}
