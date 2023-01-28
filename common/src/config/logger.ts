import logger from "pino";
import path from 'path';
import { format } from 'date-fns';

const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};

const logFilePath = path.resolve('../../logs');
const defaultOpts = {
    colorize: true,
    singleLine: true,
    mkdir: true,
    hideObject: false,
    ignore: 'hostname',
    prettyPrint: true,
};

const targets: any[] = [
    {
        level: 'info',
        target: 'pino/file',
        options: {
            ...defaultOpts,
            destination: path.resolve(logFilePath, 'info.log'),
        },
    },
    {
        level: 'debug',
        target: 'pino/file',
        options: {
            ...defaultOpts,
            destination: path.resolve(logFilePath, 'debug.log'),
        },
    },
    {
        level: 'error',
        target: 'pino/file',
        options: {
            ...defaultOpts,
            destination: path.resolve(logFilePath, 'error.log'),
        },
    },
];

if (process.env.ENABLE_CONSOLE_LOG === 'true') {
    targets.push({
        target: 'pino-pretty',
        customLevels: levels, // our defined levels
        options: {
            ...defaultOpts
        }
    });
}


const transport = logger.transport({
    targets,
});


export const log = logger({
    name: process.env.APP_NAME||"",
    customLevels: levels,
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: () => `,"time":"${format(Date.now(), 'dd-MMM-yyyy HH:mm:ss sss')}"`,
}, transport);
