import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from './ApiError';
import httpErrors from 'http-errors';
import { log } from '../config/logger';

function handleCelebrateError(err: any) {
    let errorBody: any;

    // 'details' is a Map()
    if (err.details.has("body")) {
        errorBody = err.details.get("body");
        const {
            details: [errorDetails],
        } = errorBody;
        log.error(errorDetails.message);
        log.debug(errorDetails);
    } else if (err.details.has("params")) {
        errorBody = err.details.get("params");
        log.error(errorBody.message);
        log.debug(errorBody);
    } else if (err.details.has("query")) {
        errorBody = err.details.get("query");
        log.error(errorBody.message);
        log.debug(errorBody);
    } else {
        log.error("default validation error");
        log.debug("default validation error");
    }

    const httpErr = httpErrors(httpStatus.BAD_REQUEST, errorBody?.message || "Bad request parameters");

    return httpErr;
}

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        if (isCelebrateError(error)) {
            error = handleCelebrateError(error);
        } else {
            const statusCode =
                error.statusCode || error instanceof mongoose.Error
                    ? httpStatus.BAD_REQUEST
                    : httpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || httpStatus[statusCode];
            error = new ApiError(statusCode, message);
        }
    }

    next(error);
};