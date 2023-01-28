export declare class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
