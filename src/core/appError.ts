export enum ErrorTypeEnum {
    Undefined = 0,
    Functional = 1,
    NotAllowed = 2,
    Technical = 3,
    SessionRequired = 4,
    Maintenance = 5,
}

export class AppError<T = unknown> {
    public readonly type: ErrorTypeEnum;
    public readonly code?: string;
    public readonly message: string;
    public readonly detailedMessage?: string;
    public readonly stack?: string;
    public readonly data?: T;

    constructor(type: ErrorTypeEnum, message: string, code?: string, detailedMessage?: string, data?: T) {
        // super(message);
        // this.name = 'AppError';
        this.type = type;
        this.code = code;
        this.message = message;
        this.detailedMessage = detailedMessage;
        this.data = data;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    static fromAppError<T = unknown>(error: AppError<T>): AppError<T> {
        return new AppError(error.type, error.message, error.code, error.detailedMessage, error.data);
    }
}
