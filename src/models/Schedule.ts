export type ScheduleApiModel = {
    id: number;
    lastTaskId: number;
    name: string;
    description: string;
    method: string;
    frequence: string;
    isActive: boolean;
    lastExec: string;
    nextExec: string;
    addedAt: string;
    addedBy: string;
    updatedAt: Date;
    updatedBy: string;
    lastTask: ScheduleTask;
    logs: string[];
};

export type ScheduleTask = {
    id: number;
    scheduleId: number;
    userId: number;
    current: number;
    total: number;
    status: ScheduleStatusEnum;
    nStep: number;
    stepName: string;
    totalStep: number;
    duration: string;
    startedAt: string;
    endedAt: string;
};

export enum ScheduleStatusEnum {
    STANDBY = 0,
    ONGOING = 1,
    OK = 2,
    TIMEOUT = 3,
    ERROR = 4,
}
