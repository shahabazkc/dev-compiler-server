"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("./utils/error-handler/error-handler"));
const ApiError_1 = __importDefault(require("./utils/error-handler/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.disable("x-powered-by"); // For security
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError_1.default(http_status_1.default.NOT_FOUND, "Not found"));
});
app.use(error_handler_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map