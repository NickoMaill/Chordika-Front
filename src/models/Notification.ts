export type Notification = {
    id: number;
    userID: number;
    seen: boolean;
    type: NotificationTypeEnum;
    status: NotificationStatusEnum;
    content: string;
    url: string;
    addedAt: string;
};

export enum NotificationTypeEnum {
    INFO = 'INFO',
    PDF = 'PDF',
    EXCEL = 'EXCEL',
    ALERT = 'ALERT',
}

export enum NotificationStatusEnum {
    OK = 1,
    ERROR = 2,
    WARNING = 3,
}
