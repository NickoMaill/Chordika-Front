export type PerformanceType = {
    active: boolean;
    data: {
        total: number;
        details: {
            category: string;
            description: string;
            duration: string;
            durationMs: number;
            durationFromStart: string;
            durationFromStartMs: number;
        }[];
    };
};
