import { log } from "../config/logger";
import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = err;

    if (process.env.ENVIRONMENT !== "local") {
        log.error(err);
    }

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};