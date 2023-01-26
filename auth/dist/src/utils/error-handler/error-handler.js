"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../config/logger");
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.ENVIRONMENT !== "DEVELOPMENT") {
        logger_1.log.error(err);
    }
    const response = {
        code: statusCode,
        message,
    };
    res.status(statusCode).send(response);
};
exports.default = errorHandler;
//# sourceMappingURL=error-handler.js.map