export declare const log: import("pino").Logger<{
    name: string;
    customLevels: {
        http: number;
        debug: number;
        info: number;
        warn: number;
        error: number;
        fatal: number;
    };
    level: string;
    timestamp: () => string;
}>;
