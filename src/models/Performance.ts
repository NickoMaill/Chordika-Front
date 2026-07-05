export type PerformanceType = {
    active: boolean;
    data: {
        total: number;
        details: {
            category: string;
            description: string;
            duration: number;
            durationFromStart: number;
        }[];
    };
};
