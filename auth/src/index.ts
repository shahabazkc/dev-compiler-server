import express from "express";
import cors from 'cors';
import errorHandler from "./utils/error-handler/error-handler";
import ApiError from "./utils/error-handler/ApiError";
import httpStatus from "http-status";

const app = express();

app.disable("x-powered-by"); // For security
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);



export default app;
