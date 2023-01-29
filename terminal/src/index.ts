import express from "express";
import cors from 'cors';
import httpStatus from "http-status";
//import authRouter from "./modules/auth/Router";
import cookieParser from 'cookie-parser';

import { ApiError, errorConverter, errorHandler, log, } from "@dev-compiler/common";
import terminalRouter from "./modules/Router";
import fileUpload from 'express-fileupload';
import { reqIdGenFn } from "./utils/reqIdGen";


const app = express();

app.disable("x-powered-by"); // For security
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || "SECRET"));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(fileUpload());
app.use(reqIdGenFn);

app.use('/api/terminal', terminalRouter);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    log.info(`Path not Exist: ${req.path}`);
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);



export default app;
