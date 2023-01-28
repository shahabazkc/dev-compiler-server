"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const pino_1 = __importDefault(require("pino"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};
const logFilePath = path_1.default.resolve(__dirname, '../../logs');
const defaultOpts = {
    colorize: true,
    singleLine: true,
    mkdir: true,
    hideObject: false,
    ignore: 'hostname',
    prettyPrint: true,
};
const targets = [
    {
        level: 'info',
        target: 'pino/file',
        options: Object.assign(Object.assign({}, defaultOpts), { destination: path_1.default.resolve(logFilePath, 'info.log') }),
    },
    {
        level: 'debug',
        target: 'pino/file',
        options: Object.assign(Object.assign({}, defaultOpts), { destination: path_1.default.resolve(logFilePath, 'debug.log') }),
    },
    {
        level: 'error',
        target: 'pino/file',
        options: Object.assign(Object.assign({}, defaultOpts), { destination: path_1.default.resolve(logFilePath, 'error.log') }),
    },
];
if (process.env.ENABLE_CONSOLE_LOG === 'true') {
    targets.push({
        target: 'pino-pretty',
        customLevels: levels,
        options: Object.assign({}, defaultOpts)
    });
}
const transport = pino_1.default.transport({
    targets,
});
exports.log = (0, pino_1.default)({
    name: process.env.APP_NAME || "",
    customLevels: levels,
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: () => `,"time":"${(0, date_fns_1.format)(Date.now(), 'dd-MMM-yyyy HH:mm:ss sss')}"`,
}, transport);
