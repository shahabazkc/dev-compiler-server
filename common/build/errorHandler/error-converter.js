"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorConverter = void 0;
const celebrate_1 = require("celebrate");
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("./ApiError");
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = require("../config/logger");
function handleCelebrateError(err) {
    let errorBody;
    // 'details' is a Map()
    if (err.details.has("body")) {
        errorBody = err.details.get("body");
        const { details: [errorDetails], } = errorBody;
        logger_1.log.error(errorDetails.message);
        logger_1.log.debug(errorDetails);
    }
    else if (err.details.has("params")) {
        errorBody = err.details.get("params");
        logger_1.log.error(errorBody.message);
        logger_1.log.debug(errorBody);
    }
    else if (err.details.has("query")) {
        errorBody = err.details.get("query");
        logger_1.log.error(errorBody.message);
        logger_1.log.debug(errorBody);
    }
    else {
        logger_1.log.error("default validation error");
        logger_1.log.debug("default validation error");
    }
    const httpErr = (0, http_errors_1.default)(http_status_1.default.BAD_REQUEST, (errorBody === null || errorBody === void 0 ? void 0 : errorBody.message) || "Bad request parameters");
    return httpErr;
}
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        if ((0, celebrate_1.isCelebrateError)(error)) {
            error = handleCelebrateError(error);
        }
        else {
            const statusCode = error.statusCode || error instanceof mongoose_1.default.Error
                ? http_status_1.default.BAD_REQUEST
                : http_status_1.default.INTERNAL_SERVER_ERROR;
            const message = error.message || http_status_1.default[statusCode];
            error = new ApiError_1.ApiError(statusCode, message);
        }
    }
    next(error);
};
exports.errorConverter = errorConverter;
