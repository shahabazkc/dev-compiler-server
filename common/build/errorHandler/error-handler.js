"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    if (process.env.ENVIRONMENT !== "local") {
        logger_1.log.error(err);
    }
    const response = {
        code: statusCode,
        message,
    };
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
