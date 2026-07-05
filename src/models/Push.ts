export type PushApiModel = {
    id: number;
    userId: number;
    title: string;
    content: string;
    link: string;
    severity: PushSeverity;
    seen?: boolean;
    addedAt: Date;
    updatedAt?: Date;
};

export enum PushSeverity {
    INFO = 0,
    SUCCESS = 1,
    WARNING = 2,
    ERROR = 3,
}
